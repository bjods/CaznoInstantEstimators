-- Instant Estimate System - Complete Database Schema
-- Run this entire file in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Businesses table (your clients)
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL, -- URL-friendly identifier
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subscription_tier TEXT DEFAULT 'starter', -- starter, professional, enterprise
    subscription_status TEXT DEFAULT 'trial', -- trial, active, cancelled, past_due
    subscription_id TEXT, -- Stripe subscription ID
    trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
    
    -- Business settings (flexible)
    settings JSONB DEFAULT '{
        "notifications": {
            "email": true,
            "sms": false,
            "webhook": null
        },
        "business_hours": {
            "timezone": "America/New_York",
            "schedule": {
                "monday": {"open": "08:00", "close": "18:00"},
                "tuesday": {"open": "08:00", "close": "18:00"},
                "wednesday": {"open": "08:00", "close": "18:00"},
                "thursday": {"open": "08:00", "close": "18:00"},
                "friday": {"open": "08:00", "close": "18:00"},
                "saturday": {"open": "09:00", "close": "15:00"},
                "sunday": null
            }
        },
        "branding": {
            "logo_url": null,
            "primary_color": "#000000",
            "company_info": {}
        }
    }',
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_tier CHECK (subscription_tier IN ('starter', 'professional', 'enterprise')),
    CONSTRAINT valid_status CHECK (subscription_status IN ('trial', 'active', 'cancelled', 'past_due'))
);

-- Widgets table (embeddable forms)
CREATE TABLE widgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., "Main Website Widget", "Landing Page Widget"
    embed_key TEXT UNIQUE DEFAULT gen_random_uuid()::TEXT,
    is_active BOOLEAN DEFAULT true,
    
    -- Widget appearance
    theme JSONB DEFAULT '{
        "primaryColor": "#3B82F6",
        "secondaryColor": "#10B981",
        "fontFamily": "Inter, system-ui, sans-serif",
        "borderRadius": "8px",
        "buttonStyle": "rounded",
        "containerWidth": "100%",
        "containerMaxWidth": "600px",
        "logoUrl": null,
        "customCss": null
    }',
    
    -- Widget behavior
    config JSONB DEFAULT '{
        "steps": [],
        "showProgressBar": true,
        "showInstantQuote": true,
        "priceDisplay": "range",
        "requirePhone": false,
        "thankYouMessage": "Thank you! We will contact you within 24 hours.",
        "redirectUrl": null,
        "gtmId": null,
        "facebookPixelId": null
    }',
    
    -- Form fields configuration
    fields JSONB DEFAULT '{
        "standard": {
            "name": {"required": true, "label": "Your Name"},
            "email": {"required": true, "label": "Email Address"},
            "phone": {"required": false, "label": "Phone Number"},
            "address": {"required": false, "label": "Service Address"}
        },
        "custom": []
    }',
    
    -- Service-specific configuration
    service_config JSONB DEFAULT '{}',
    
    -- Usage tracking
    view_count INTEGER DEFAULT 0,
    submission_count INTEGER DEFAULT 0,
    last_submission_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Estimates table (form submissions/leads)
CREATE TABLE estimates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    widget_id UUID REFERENCES widgets(id) ON DELETE SET NULL,
    
    -- Customer information (flexible schema)
    customer JSONB NOT NULL, -- {name, email, phone, address, ...custom fields}
    
    -- Service details (completely flexible)
    service JSONB NOT NULL, -- {type: "fencing", material: "wood", ...}
    
    -- Measurements (varies by service type)
    measurements JSONB NOT NULL, -- {linearFeet: 150, area: null, ...}
    
    -- Pricing information (from AI/n8n)
    pricing JSONB, -- {
                  --   lineItems: [{description, quantity, unit, price, total}],
                  --   subtotal: 5000,
                  --   adjustments: [{description, amount}],
                  --   tax: 400,
                  --   total: 5400,
                  --   range: {min: 5000, max: 6000},
                  --   validUntil: "2024-12-31"
                  -- }
    
    -- Status tracking
    status TEXT DEFAULT 'new', -- new, contacted, quoted, scheduled, won, lost
    status_history JSONB DEFAULT '[]', -- [{from, to, timestamp, user, notes}]
    
    -- Internal notes
    internal_notes TEXT,
    tags TEXT[] DEFAULT '{}',
    
    -- Lead quality scoring
    lead_score INTEGER DEFAULT 0, -- 0-100
    lead_score_factors JSONB DEFAULT '{}',
    
    -- Source tracking
    metadata JSONB DEFAULT '{}', -- {
                                --   source: "website",
                                --   referrer: "google.com",
                                --   device: "mobile",
                                --   ip: "192.168.1.1",
                                --   userAgent: "...",
                                --   utmSource: "google",
                                --   utmMedium: "cpc",
                                --   utmCampaign: "summer-sale"
                                -- }
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    contacted_at TIMESTAMPTZ,
    won_at TIMESTAMPTZ,
    lost_at TIMESTAMPTZ,
    lost_reason TEXT
);

-- Pricing rules table (for AI context)
CREATE TABLE pricing_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    
    -- Service this rule applies to
    service_type TEXT NOT NULL, -- 'fencing', 'concrete', 'hardscaping', 'all'
    
    -- Base pricing structure
    base_prices JSONB NOT NULL, -- {
                                --   "wood_privacy": 35,
                                --   "chain_link": 15,
                                --   "vinyl": 45,
                                --   ...
                                -- }
    
    -- Pricing modifiers
    modifiers JSONB NOT NULL, -- {
                             --   "rush_job": {"type": "percentage", "value": 25},
                             --   "corner_lot": {"type": "percentage", "value": 10},
                             --   "difficult_access": {"type": "fixed", "value": 500},
                             --   ...
                             -- }
    
    -- Special pricing logic
    special_instructions TEXT, -- "Round to nearest $50. Add 10% for jobs over 500ft."
    
    -- Example calculations for AI training
    example_calculations JSONB DEFAULT '[]',
    
    -- Date-based rules
    seasonal_adjustments JSONB DEFAULT '{}', -- {"summer": 1.15, "winter": 0.95}
    valid_from DATE,
    valid_to DATE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    widget_id UUID REFERENCES widgets(id) ON DELETE CASCADE,
    estimate_id UUID REFERENCES estimates(id) ON DELETE CASCADE,
    
    -- Event information
    event_type TEXT NOT NULL, -- widget_loaded, step_completed, estimate_submitted, etc.
    event_category TEXT, -- interaction, conversion, error
    event_data JSONB DEFAULT '{}',
    
    -- Session tracking
    session_id TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User accounts table (for authentication)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'owner', -- owner, admin, viewer
    
    -- Profile
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    
    -- Permissions
    permissions JSONB DEFAULT '{
        "estimates": ["view", "edit", "delete"],
        "widgets": ["view", "edit", "delete"],
        "settings": ["view", "edit"],
        "billing": ["view", "edit"]
    }',
    
    -- Auth tracking
    last_login_at TIMESTAMPTZ,
    email_verified BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Business indexes
CREATE INDEX idx_businesses_slug ON businesses(slug);
CREATE INDEX idx_businesses_subscription_status ON businesses(subscription_status);

-- Widget indexes
CREATE INDEX idx_widgets_business_id ON widgets(business_id);
CREATE INDEX idx_widgets_embed_key ON widgets(embed_key);
CREATE INDEX idx_widgets_is_active ON widgets(is_active);

-- Estimate indexes
CREATE INDEX idx_estimates_business_id ON estimates(business_id);
CREATE INDEX idx_estimates_widget_id ON estimates(widget_id);
CREATE INDEX idx_estimates_status ON estimates(status);
CREATE INDEX idx_estimates_created_at ON estimates(created_at DESC);
CREATE INDEX idx_estimates_customer_email ON estimates((customer->>'email'));

-- Event indexes
CREATE INDEX idx_events_business_id ON events(business_id);
CREATE INDEX idx_events_widget_id ON events(widget_id);
CREATE INDEX idx_events_estimate_id ON events(estimate_id);
CREATE INDEX idx_events_created_at ON events(created_at DESC);
CREATE INDEX idx_events_session_id ON events(session_id);

-- Pricing rule indexes
CREATE INDEX idx_pricing_rules_business_id ON pricing_rules(business_id);
CREATE INDEX idx_pricing_rules_service_type ON pricing_rules(service_type);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Public access for widget loading (no auth required)
CREATE POLICY "Public can view active widgets" ON widgets
    FOR SELECT USING (is_active = true);

-- Public can submit estimates
CREATE POLICY "Public can create estimates" ON estimates
    FOR INSERT WITH CHECK (true);

-- Public can create events (for analytics)
CREATE POLICY "Public can create events" ON events
    FOR INSERT WITH CHECK (true);

-- Authenticated user policies (to be expanded when auth is added)
CREATE POLICY "Users can view own business" ON businesses
    FOR ALL USING (id IN (
        SELECT business_id FROM users WHERE id = auth.uid()
    ));

CREATE POLICY "Users can manage own widgets" ON widgets
    FOR ALL USING (business_id IN (
        SELECT business_id FROM users WHERE id = auth.uid()
    ));

CREATE POLICY "Users can view own estimates" ON estimates
    FOR ALL USING (business_id IN (
        SELECT business_id FROM users WHERE id = auth.uid()
    ));

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to tables
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_widgets_updated_at BEFORE UPDATE ON widgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_estimates_updated_at BEFORE UPDATE ON estimates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_pricing_rules_updated_at BEFORE UPDATE ON pricing_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Increment widget counters
CREATE OR REPLACE FUNCTION increment_widget_view_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE widgets 
    SET view_count = view_count + 1 
    WHERE id = NEW.widget_id 
    AND NEW.event_type = 'widget_loaded';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_views_on_event AFTER INSERT ON events
    FOR EACH ROW EXECUTE FUNCTION increment_widget_view_count();

-- =====================================================
-- INITIAL TEST DATA
-- =====================================================

-- Insert test business
INSERT INTO businesses (slug, name, email, subscription_tier, subscription_status) 
VALUES (
    'test-fence-co', 
    'Test Fence Company', 
    'test@example.com',
    'professional',
    'active'
);

-- Insert test widget with complete configuration
INSERT INTO widgets (business_id, name, embed_key, config)
VALUES (
    (SELECT id FROM businesses WHERE slug = 'test-fence-co'),
    'Main Website Widget',
    'test-widget-key',
    '{
        "steps": [
            {
                "id": "service",
                "title": "What type of fence do you need?",
                "components": [
                    {
                        "type": "radio_group",
                        "props": {
                            "name": "fenceType",
                            "label": "Select Fence Type",
                            "options": [
                                {
                                    "value": "wood_privacy",
                                    "label": "Wood Privacy Fence",
                                    "description": "6ft tall cedar privacy fence"
                                },
                                {
                                    "value": "chain_link",
                                    "label": "Chain Link Fence",
                                    "description": "Galvanized steel, various heights"
                                },
                                {
                                    "value": "vinyl",
                                    "label": "Vinyl Fence",
                                    "description": "Low maintenance, 25 year warranty"
                                }
                            ]
                        }
                    }
                ]
            },
            {
                "id": "measurement",
                "title": "How much fencing do you need?",
                "components": [
                    {
                        "type": "linear_feet_input",
                        "props": {
                            "name": "linearFeet",
                            "label": "Total Linear Feet",
                            "placeholder": "Enter the total feet",
                            "helpText": "Measure around the perimeter where the fence will be installed",
                            "min": 10,
                            "max": 5000
                        }
                    },
                    {
                        "type": "number_input",
                        "props": {
                            "name": "gateCount",
                            "label": "Number of Gates",
                            "placeholder": "0",
                            "helpText": "Standard 4ft walk gates",
                            "min": 0,
                            "max": 10
                        }
                    }
                ]
            },
            {
                "id": "contact",
                "title": "Get Your Instant Quote",
                "components": [
                    {
                        "type": "text_input",
                        "props": {
                            "name": "name",
                            "label": "Your Name",
                            "placeholder": "John Smith",
                            "required": true
                        }
                    },
                    {
                        "type": "text_input",
                        "props": {
                            "name": "email",
                            "label": "Email Address",
                            "placeholder": "john@example.com",
                            "type": "email",
                            "required": true
                        }
                    },
                    {
                        "type": "text_input",
                        "props": {
                            "name": "phone",
                            "label": "Phone Number",
                            "placeholder": "(555) 123-4567",
                            "type": "tel",
                            "required": false
                        }
                    }
                ]
            }
        ],
        "showInstantQuote": true,
        "priceDisplay": "range",
        "thankYouMessage": "Thank you! Your estimate is $3,500 - $4,200. We will call you within 24 hours to schedule a free consultation."
    }'
);

-- Insert test pricing rules
INSERT INTO pricing_rules (business_id, service_type, name, base_prices, modifiers)
VALUES (
    (SELECT id FROM businesses WHERE slug = 'test-fence-co'),
    'fencing',
    'Standard Fence Pricing',
    '{
        "wood_privacy": 35,
        "chain_link": 15,
        "vinyl": 45,
        "aluminum": 55
    }',
    '{
        "rush_job": {"type": "percentage", "value": 25},
        "corner_lot": {"type": "percentage", "value": 10},
        "difficult_access": {"type": "fixed", "value": 500},
        "gate_4ft": {"type": "fixed", "value": 350},
        "gate_double": {"type": "fixed", "value": 750}
    }'
);

-- =====================================================
-- HELPFUL QUERIES FOR DEVELOPMENT
-- =====================================================

/*
-- Get widget with full business details
SELECT 
    w.*,
    b.name as business_name,
    b.email as business_email,
    b.settings as business_settings
FROM widgets w
JOIN businesses b ON w.business_id = b.id
WHERE w.embed_key = 'test-widget-key';

-- Get recent estimates with customer info
SELECT 
    id,
    customer->>'name' as customer_name,
    customer->>'email' as customer_email,
    service->>'type' as service_type,
    measurements->>'linearFeet' as linear_feet,
    pricing->>'total' as total_price,
    status,
    created_at
FROM estimates
WHERE business_id = (SELECT id FROM businesses WHERE slug = 'test-fence-co')
ORDER BY created_at DESC
LIMIT 20;

-- Get conversion funnel stats
SELECT 
    COUNT(*) FILTER (WHERE event_type = 'widget_loaded') as views,
    COUNT(*) FILTER (WHERE event_type = 'step_completed' AND event_data->>'step' = '1') as step_1,
    COUNT(*) FILTER (WHERE event_type = 'step_completed' AND event_data->>'step' = '2') as step_2,
    COUNT(*) FILTER (WHERE event_type = 'estimate_submitted') as submissions
FROM events
WHERE widget_id = (SELECT id FROM widgets WHERE embed_key = 'test-widget-key')
AND created_at >= NOW() - INTERVAL '30 days';
*/