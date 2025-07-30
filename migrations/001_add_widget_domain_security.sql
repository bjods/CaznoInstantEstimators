-- Migration: Add Widget Domain Security Features
-- Created: 2025-01-30
-- Purpose: Implement domain validation and security tracking for widget embeds

-- Add domain security columns to widgets table
ALTER TABLE widgets 
ADD COLUMN IF NOT EXISTS allowed_domains TEXT[] DEFAULT NULL,
ADD COLUMN IF NOT EXISTS security_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS embed_restrictions JSONB DEFAULT '{
    "require_https": true,
    "block_iframes": false,
    "max_embeds_per_domain": 10,
    "rate_limit_per_hour": 1000
}';

-- Add domain usage tracking table
CREATE TABLE IF NOT EXISTS widget_domain_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    widget_id UUID REFERENCES widgets(id) ON DELETE CASCADE,
    domain TEXT NOT NULL,
    first_seen_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    total_requests INTEGER DEFAULT 1,
    blocked_requests INTEGER DEFAULT 0,
    is_authorized BOOLEAN DEFAULT false,
    
    -- Security tracking
    suspicious_activity JSONB DEFAULT '{}',
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(widget_id, domain)
);

-- Add security events logging table
CREATE TABLE IF NOT EXISTS security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL, -- 'unauthorized_domain', 'rate_limit_exceeded', 'suspicious_activity'
    widget_id UUID REFERENCES widgets(id) ON DELETE CASCADE,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    
    -- Event details
    source_domain TEXT,
    source_ip INET,
    user_agent TEXT,
    request_details JSONB DEFAULT '{}',
    
    -- Event metadata
    severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'ignored')),
    resolved_at TIMESTAMPTZ,
    resolved_by UUID,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_widget_domain_usage_widget_id ON widget_domain_usage(widget_id);
CREATE INDEX IF NOT EXISTS idx_widget_domain_usage_domain ON widget_domain_usage(domain);
CREATE INDEX IF NOT EXISTS idx_widget_domain_usage_last_seen ON widget_domain_usage(last_seen_at);

CREATE INDEX IF NOT EXISTS idx_security_events_widget_id ON security_events(widget_id);
CREATE INDEX IF NOT EXISTS idx_security_events_business_id ON security_events(business_id);
CREATE INDEX IF NOT EXISTS idx_security_events_type ON security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);

-- Add RLS policies for new tables

-- Widget domain usage policies
ALTER TABLE widget_domain_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view domain usage for their widgets" ON widget_domain_usage
    FOR SELECT USING (
        widget_id IN (
            SELECT id FROM widgets WHERE business_id IN (
                SELECT business_id FROM user_profiles WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "System can manage domain usage" ON widget_domain_usage
    FOR ALL USING (true);

-- Security events policies  
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view security events for their business" ON security_events
    FOR SELECT USING (
        business_id IN (
            SELECT business_id FROM user_profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "System can manage security events" ON security_events
    FOR ALL USING (true);

-- Add function to update domain usage tracking
CREATE OR REPLACE FUNCTION update_widget_domain_usage(
    p_widget_id UUID,
    p_domain TEXT,
    p_is_authorized BOOLEAN DEFAULT false,
    p_was_blocked BOOLEAN DEFAULT false
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO widget_domain_usage (
        widget_id, 
        domain, 
        is_authorized,
        total_requests,
        blocked_requests
    ) VALUES (
        p_widget_id, 
        p_domain, 
        p_is_authorized,
        1,
        CASE WHEN p_was_blocked THEN 1 ELSE 0 END
    )
    ON CONFLICT (widget_id, domain) 
    DO UPDATE SET
        last_seen_at = NOW(),
        total_requests = widget_domain_usage.total_requests + 1,
        blocked_requests = widget_domain_usage.blocked_requests + CASE WHEN p_was_blocked THEN 1 ELSE 0 END,
        is_authorized = GREATEST(widget_domain_usage.is_authorized, p_is_authorized),
        updated_at = NOW();
END;
$$;

-- Add function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
    p_event_type TEXT,
    p_widget_id UUID,
    p_business_id UUID,
    p_source_domain TEXT DEFAULT NULL,
    p_source_ip INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_request_details JSONB DEFAULT '{}',
    p_severity TEXT DEFAULT 'medium'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    event_id UUID;
BEGIN
    INSERT INTO security_events (
        event_type,
        widget_id,
        business_id,
        source_domain,
        source_ip,
        user_agent,
        request_details,
        severity
    ) VALUES (
        p_event_type,
        p_widget_id,
        p_business_id,
        p_source_domain,
        p_source_ip,
        p_user_agent,
        p_request_details,
        p_severity
    ) RETURNING id INTO event_id;
    
    RETURN event_id;
END;
$$;

-- Add function to validate domain against widget's allowed domains
CREATE OR REPLACE FUNCTION is_domain_allowed(
    p_widget_id UUID,
    p_domain TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    allowed_domains TEXT[];
    domain_pattern TEXT;
BEGIN
    -- Get allowed domains for the widget
    SELECT allowed_domains INTO allowed_domains
    FROM widgets 
    WHERE id = p_widget_id AND is_active = true;
    
    -- If no restrictions (NULL), allow all domains
    IF allowed_domains IS NULL THEN
        RETURN true;
    END IF;
    
    -- If empty array, block all domains
    IF array_length(allowed_domains, 1) = 0 THEN
        RETURN false;
    END IF;
    
    -- Check if domain matches any allowed patterns
    FOREACH domain_pattern IN ARRAY allowed_domains
    LOOP
        -- Support wildcard subdomains (*.example.com)
        IF domain_pattern LIKE '*.%' THEN
            IF p_domain LIKE '%' || substring(domain_pattern from 2) THEN
                RETURN true;
            END IF;
        -- Exact domain match
        ELSIF p_domain = domain_pattern THEN
            RETURN true;
        END IF;
    END LOOP;
    
    RETURN false;
END;
$$;

-- Update existing widgets to have security enabled by default
UPDATE widgets 
SET security_enabled = true,
    embed_restrictions = '{
        "require_https": true,
        "block_iframes": false,
        "max_embeds_per_domain": 10,
        "rate_limit_per_hour": 1000
    }'
WHERE security_enabled IS NULL;

-- Add helpful views for security monitoring

-- View for domain usage summary
CREATE OR REPLACE VIEW widget_domain_summary AS
SELECT 
    w.id as widget_id,
    w.name as widget_name,
    w.business_id,
    b.name as business_name,
    wdu.domain,
    wdu.is_authorized,
    wdu.total_requests,
    wdu.blocked_requests,
    wdu.first_seen_at,
    wdu.last_seen_at,
    CASE 
        WHEN wdu.blocked_requests > 0 THEN 'suspicious'
        WHEN wdu.is_authorized THEN 'authorized'
        ELSE 'unknown'
    END as domain_status
FROM widgets w
LEFT JOIN widget_domain_usage wdu ON w.id = wdu.widget_id
LEFT JOIN businesses b ON w.business_id = b.id
WHERE w.is_active = true;

-- View for security events summary
CREATE OR REPLACE VIEW security_events_summary AS
SELECT 
    se.id,
    se.event_type,
    se.severity,
    se.source_domain,
    se.source_ip,
    se.created_at,
    w.name as widget_name,
    b.name as business_name,
    se.status
FROM security_events se
LEFT JOIN widgets w ON se.widget_id = w.id
LEFT JOIN businesses b ON se.business_id = b.id
ORDER BY se.created_at DESC;

-- Add comments for documentation
COMMENT ON TABLE widget_domain_usage IS 'Tracks which domains are embedding each widget for security monitoring';
COMMENT ON TABLE security_events IS 'Logs security-related events for monitoring and alerting';
COMMENT ON COLUMN widgets.allowed_domains IS 'Array of domains authorized to embed this widget. NULL = allow all, empty array = block all';
COMMENT ON COLUMN widgets.security_enabled IS 'Whether domain validation and security checks are enabled for this widget';
COMMENT ON COLUMN widgets.embed_restrictions IS 'Additional security restrictions for widget embedding';

-- Grant necessary permissions
GRANT SELECT ON widget_domain_usage TO authenticated;
GRANT SELECT ON security_events TO authenticated;
GRANT SELECT ON widget_domain_summary TO authenticated;  
GRANT SELECT ON security_events_summary TO authenticated;

-- Migration completed successfully
-- Next steps: 
-- 1. Update widget API endpoints to use domain validation
-- 2. Implement middleware for domain checking
-- 3. Add security monitoring dashboard
-- 4. Update widget configuration UI to manage allowed domains