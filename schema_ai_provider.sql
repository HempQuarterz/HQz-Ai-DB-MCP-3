-- AI Provider Configuration Schema
-- These tables manage AI image generation providers and cost tracking

-- Create AI provider configuration table
CREATE TABLE IF NOT EXISTS ai_provider_config (
    id SERIAL PRIMARY KEY,
    provider_name TEXT NOT NULL UNIQUE,
    provider_type TEXT NOT NULL CHECK (provider_type IN ('image', 'text', 'embedding')),
    api_key_name TEXT, -- Name of the environment variable storing the API key
    base_url TEXT,
    is_active BOOLEAN DEFAULT false,
    priority INTEGER DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),
    cost_per_image DECIMAL(10, 6) DEFAULT 0.0,
    rate_limit_per_minute INTEGER DEFAULT 60,
    rate_limit_per_day INTEGER DEFAULT 1000,
    config JSONB DEFAULT '{}', -- Provider-specific configuration
    capabilities JSONB DEFAULT '{}', -- What the provider can do
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI generation costs tracking table
CREATE TABLE IF NOT EXISTS ai_generation_costs (
    id SERIAL PRIMARY KEY,
    provider_name TEXT NOT NULL REFERENCES ai_provider_config(provider_name),
    product_id BIGINT REFERENCES uses_products(id),
    queue_id UUID REFERENCES image_generation_queue(id),
    generation_type TEXT DEFAULT 'image',
    prompt_tokens INTEGER DEFAULT 0,
    completion_tokens INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    cost DECIMAL(10, 6) NOT NULL,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project dashboard metrics table
CREATE TABLE IF NOT EXISTS project_dashboard_metrics (
    id SERIAL PRIMARY KEY,
    metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
    metric_type TEXT NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(20, 6),
    metric_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(metric_date, metric_type, metric_name)
);

-- Insert default AI providers
INSERT INTO ai_provider_config (provider_name, provider_type, api_key_name, base_url, cost_per_image, capabilities) VALUES
('placeholder', 'image', NULL, NULL, 0.0, '{"max_resolution": "800x600", "formats": ["placeholder"], "styles": ["basic"]}'),
('stable_diffusion', 'image', 'STABILITY_API_KEY', 'https://api.stability.ai', 0.002, '{"max_resolution": "1024x1024", "formats": ["png", "jpg"], "styles": ["photorealistic", "artistic", "3d"]}'),
('dall_e_2', 'image', 'OPENAI_API_KEY', 'https://api.openai.com/v1', 0.016, '{"max_resolution": "1024x1024", "formats": ["png"], "styles": ["natural", "vivid"]}'),
('dall_e_3', 'image', 'OPENAI_API_KEY', 'https://api.openai.com/v1', 0.040, '{"max_resolution": "1024x1024", "formats": ["png"], "styles": ["natural", "vivid"], "quality": ["standard", "hd"]}'),
('midjourney', 'image', 'MIDJOURNEY_API_KEY', 'https://api.midjourney.com', 0.010, '{"max_resolution": "1024x1024", "formats": ["png", "jpg"], "styles": ["v5", "niji", "testp"]}'),
('leonardo_ai', 'image', 'LEONARDO_API_KEY', 'https://cloud.leonardo.ai/api', 0.005, '{"max_resolution": "1024x1024", "formats": ["png", "jpg"], "models": ["leonardo-diffusion", "photoreal"]}'),
('replicate', 'image', 'REPLICATE_API_TOKEN', 'https://api.replicate.com', 0.003, '{"max_resolution": "1024x1024", "formats": ["png", "jpg"], "models": ["sdxl", "kandinsky"]}')
ON CONFLICT (provider_name) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_generation_costs_provider ON ai_generation_costs(provider_name);
CREATE INDEX IF NOT EXISTS idx_ai_generation_costs_created_at ON ai_generation_costs(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_generation_costs_product_id ON ai_generation_costs(product_id);
CREATE INDEX IF NOT EXISTS idx_project_metrics_date ON project_dashboard_metrics(metric_date);
CREATE INDEX IF NOT EXISTS idx_project_metrics_type ON project_dashboard_metrics(metric_type);

-- Create function to track generation costs
CREATE OR REPLACE FUNCTION track_generation_cost(
    p_provider_name TEXT,
    p_product_id BIGINT,
    p_queue_id UUID,
    p_cost DECIMAL,
    p_success BOOLEAN DEFAULT true,
    p_error_message TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_cost_id UUID;
BEGIN
    INSERT INTO ai_generation_costs (
        provider_name,
        product_id,
        queue_id,
        cost,
        success,
        error_message
    ) VALUES (
        p_provider_name,
        p_product_id,
        p_queue_id,
        p_cost,
        p_success,
        p_error_message
    ) RETURNING id INTO v_cost_id;
    
    -- Update daily metrics
    INSERT INTO project_dashboard_metrics (
        metric_date,
        metric_type,
        metric_name,
        metric_value,
        metric_count
    ) VALUES (
        CURRENT_DATE,
        'generation_cost',
        p_provider_name,
        p_cost,
        1
    ) ON CONFLICT (metric_date, metric_type, metric_name) DO UPDATE
    SET metric_value = project_dashboard_metrics.metric_value + EXCLUDED.metric_value,
        metric_count = project_dashboard_metrics.metric_count + 1;
    
    RETURN v_cost_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to get provider by priority
CREATE OR REPLACE FUNCTION get_active_provider(p_provider_type TEXT DEFAULT 'image')
RETURNS TABLE (
    provider_name TEXT,
    api_key_name TEXT,
    base_url TEXT,
    cost_per_image DECIMAL,
    config JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        apc.provider_name,
        apc.api_key_name,
        apc.base_url,
        apc.cost_per_image,
        apc.config
    FROM ai_provider_config apc
    WHERE apc.provider_type = p_provider_type
    AND apc.is_active = true
    ORDER BY apc.priority DESC, apc.cost_per_image ASC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Create view for provider dashboard
CREATE OR REPLACE VIEW ai_provider_dashboard AS
WITH provider_stats AS (
    SELECT 
        apc.provider_name,
        apc.provider_type,
        apc.is_active,
        apc.cost_per_image,
        apc.priority,
        COUNT(agc.id) as total_generations,
        SUM(agc.cost) as total_cost,
        COUNT(agc.id) FILTER (WHERE agc.success = true) as successful_generations,
        COUNT(agc.id) FILTER (WHERE agc.success = false) as failed_generations,
        AVG(agc.cost) as avg_cost_per_generation
    FROM ai_provider_config apc
    LEFT JOIN ai_generation_costs agc ON apc.provider_name = agc.provider_name
    GROUP BY apc.provider_name, apc.provider_type, apc.is_active, apc.cost_per_image, apc.priority
),
recent_activity AS (
    SELECT 
        provider_name,
        COUNT(*) as last_24h_generations,
        SUM(cost) as last_24h_cost
    FROM ai_generation_costs
    WHERE created_at >= NOW() - INTERVAL '24 hours'
    GROUP BY provider_name
)
SELECT 
    ps.*,
    ra.last_24h_generations,
    ra.last_24h_cost,
    CASE 
        WHEN ps.total_generations > 0 THEN 
            ROUND((ps.successful_generations::numeric / ps.total_generations::numeric * 100), 2)
        ELSE 0
    END as success_rate_percentage
FROM provider_stats ps
LEFT JOIN recent_activity ra ON ps.provider_name = ra.provider_name
ORDER BY ps.priority DESC, ps.is_active DESC;

-- Create function to update metrics
CREATE OR REPLACE FUNCTION update_project_metrics()
RETURNS void AS $$
BEGIN
    -- Update total products with images
    INSERT INTO project_dashboard_metrics (
        metric_type,
        metric_name,
        metric_value
    ) VALUES (
        'products',
        'total_with_images',
        (SELECT COUNT(*) FROM uses_products WHERE image_url IS NOT NULL)
    ) ON CONFLICT (metric_date, metric_type, metric_name) DO UPDATE
    SET metric_value = EXCLUDED.metric_value;
    
    -- Update total products without images
    INSERT INTO project_dashboard_metrics (
        metric_type,
        metric_name,
        metric_value
    ) VALUES (
        'products',
        'total_without_images',
        (SELECT COUNT(*) FROM uses_products WHERE image_url IS NULL)
    ) ON CONFLICT (metric_date, metric_type, metric_name) DO UPDATE
    SET metric_value = EXCLUDED.metric_value;
    
    -- Update queue status
    INSERT INTO project_dashboard_metrics (
        metric_type,
        metric_name,
        metric_value
    )
    SELECT 
        'queue_status',
        status,
        COUNT(*)::numeric
    FROM image_generation_queue
    GROUP BY status
    ON CONFLICT (metric_date, metric_type, metric_name) DO UPDATE
    SET metric_value = EXCLUDED.metric_value;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ai_provider_config_updated_at BEFORE UPDATE ON ai_provider_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();