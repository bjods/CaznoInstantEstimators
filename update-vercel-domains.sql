-- Update allowed domains for test widgets to include Vercel domain
-- This fixes the 403 Forbidden errors when testing on Vercel

UPDATE widgets 
SET allowed_domains = ARRAY['cazno-instant-estimators.vercel.app', 'localhost', '*.vercel.app']
WHERE embed_key IN ('test-bin-rental-key', 'test-widget-key', 'test-landscaping-key', 'test-hardscape-widget');

-- Verify the update
SELECT 
    embed_key,
    name,
    allowed_domains,
    security_enabled
FROM widgets 
WHERE embed_key IN ('test-bin-rental-key', 'test-widget-key', 'test-landscaping-key', 'test-hardscape-widget');