-- HempQuarterz AI Agent Infrastructure Migration
-- Version: 004
-- Description: Creates tables for AI agent system including orchestration, tasks, content, and analytics

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- 1. Agent Orchestration Logs
-- Central logging for all agent activities
CREATE TABLE IF NOT EXISTS agent_orchestration_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    agent_name VARCHAR(100) NOT NULL,
    task_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
    priority INTEGER DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    duration_seconds INTEGER,
    input_data JSONB,
    output_data JSONB,
    error_message TEXT,
    error_stack TEXT,
    tokens_used INTEGER DEFAULT 0,
    cost_usd DECIMAL(10, 6) DEFAULT 0,
    parent_task_id UUID REFERENCES agent_orchestration_logs(id),
    workflow_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for orchestration logs
CREATE INDEX idx_orchestration_agent_name ON agent_orchestration_logs(agent_name);
CREATE INDEX idx_orchestration_status ON agent_orchestration_logs(status);
CREATE INDEX idx_orchestration_created_at ON agent_orchestration_logs(created_at DESC);
CREATE INDEX idx_orchestration_workflow ON agent_orchestration_logs(workflow_id);
CREATE INDEX idx_orchestration_parent_task ON agent_orchestration_logs(parent_task_id);

-- 2. Agent Task Queue
-- Manages pending and scheduled tasks
CREATE TABLE IF NOT EXISTS agent_task_queue (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    agent_name VARCHAR(100) NOT NULL,
    task_type VARCHAR(100) NOT NULL,
    priority INTEGER DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'processing', 'completed', 'failed', 'cancelled')),
    scheduled_for TIMESTAMPTZ DEFAULT NOW(),
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    payload JSONB NOT NULL,
    result JSONB,
    error_message TEXT,
    locked_by VARCHAR(255), -- Instance ID that's processing this task
    locked_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for task queue
CREATE INDEX idx_task_queue_status_scheduled ON agent_task_queue(status, scheduled_for) 
    WHERE status IN ('pending', 'scheduled');
CREATE INDEX idx_task_queue_agent_status ON agent_task_queue(agent_name, status);
CREATE INDEX idx_task_queue_priority ON agent_task_queue(priority DESC, scheduled_for);

-- 3. Agent Generated Content
-- Stores all content created by agents
CREATE TABLE IF NOT EXISTS agent_generated_content (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('blog_post', 'product_description', 'email', 'social_media', 'meta_description', 'landing_page', 'newsletter')),
    title VARCHAR(500),
    content TEXT NOT NULL,
    excerpt TEXT,
    seo_keywords TEXT[],
    meta_description TEXT,
    target_audience VARCHAR(100),
    tone VARCHAR(50),
    word_count INTEGER,
    readability_score DECIMAL(4, 2),
    seo_score DECIMAL(4, 2),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    published_url TEXT,
    product_id UUID REFERENCES products(id),
    agent_task_id UUID REFERENCES agent_orchestration_logs(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for generated content
CREATE INDEX idx_generated_content_type ON agent_generated_content(content_type);
CREATE INDEX idx_generated_content_status ON agent_generated_content(status);
CREATE INDEX idx_generated_content_product ON agent_generated_content(product_id);
CREATE INDEX idx_generated_content_search ON agent_generated_content USING gin(to_tsvector('english', title || ' ' || content));

-- 4. Agent Outreach Campaigns
-- Manages email and partnership outreach
CREATE TABLE IF NOT EXISTS agent_outreach_campaigns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    campaign_name VARCHAR(255) NOT NULL,
    campaign_type VARCHAR(50) NOT NULL CHECK (campaign_type IN ('partnership', 'influencer', 'investor', 'customer', 'press')),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
    target_count INTEGER DEFAULT 0,
    sent_count INTEGER DEFAULT 0,
    open_count INTEGER DEFAULT 0,
    response_count INTEGER DEFAULT 0,
    conversion_count INTEGER DEFAULT 0,
    email_template_id UUID,
    personalization_fields JSONB,
    schedule_type VARCHAR(50) CHECK (schedule_type IN ('immediate', 'scheduled', 'drip')),
    scheduled_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    metrics JSONB DEFAULT '{}'::jsonb,
    agent_task_id UUID REFERENCES agent_orchestration_logs(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Outreach campaign recipients
CREATE TABLE IF NOT EXISTS agent_outreach_recipients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    campaign_id UUID REFERENCES agent_outreach_campaigns(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    company VARCHAR(255),
    role VARCHAR(255),
    personalization_data JSONB,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'opened', 'clicked', 'responded', 'bounced', 'unsubscribed')),
    sent_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    responded_at TIMESTAMPTZ,
    response_content TEXT,
    sentiment_score DECIMAL(3, 2),
    follow_up_count INTEGER DEFAULT 0,
    last_follow_up_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for outreach
CREATE INDEX idx_outreach_campaign_status ON agent_outreach_campaigns(status);
CREATE INDEX idx_outreach_campaign_type ON agent_outreach_campaigns(campaign_type);
CREATE INDEX idx_outreach_recipient_campaign ON agent_outreach_recipients(campaign_id);
CREATE INDEX idx_outreach_recipient_status ON agent_outreach_recipients(status);
CREATE INDEX idx_outreach_recipient_email ON agent_outreach_recipients(email);

-- 5. Agent SEO Analysis
-- Stores SEO analysis results
CREATE TABLE IF NOT EXISTS agent_seo_analysis (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    analysis_type VARCHAR(50) NOT NULL CHECK (analysis_type IN ('site_audit', 'keyword_research', 'competitor_analysis', 'backlink_analysis', 'content_optimization')),
    target_url TEXT,
    target_keyword VARCHAR(255),
    results JSONB NOT NULL,
    score DECIMAL(4, 2),
    recommendations JSONB,
    issues_found INTEGER DEFAULT 0,
    opportunities_found INTEGER DEFAULT 0,
    competitor_comparison JSONB,
    status VARCHAR(50) DEFAULT 'completed',
    agent_task_id UUID REFERENCES agent_orchestration_logs(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- SEO keywords tracking
CREATE TABLE IF NOT EXISTS agent_seo_keywords (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    keyword VARCHAR(255) NOT NULL,
    search_volume INTEGER,
    difficulty_score DECIMAL(4, 2),
    cpc_usd DECIMAL(10, 2),
    trend VARCHAR(20) CHECK (trend IN ('rising', 'stable', 'declining')),
    current_position INTEGER,
    target_position INTEGER,
    url_ranking TEXT,
    competitors JSONB,
    last_checked_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for SEO
CREATE INDEX idx_seo_analysis_type ON agent_seo_analysis(analysis_type);
CREATE INDEX idx_seo_analysis_created ON agent_seo_analysis(created_at DESC);
CREATE INDEX idx_seo_keywords_keyword ON agent_seo_keywords(keyword);
CREATE INDEX idx_seo_keywords_volume ON agent_seo_keywords(search_volume DESC);

-- 6. Agent Monetization Opportunities
-- Tracks identified business opportunities
CREATE TABLE IF NOT EXISTS agent_monetization_opportunities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    opportunity_type VARCHAR(50) NOT NULL CHECK (opportunity_type IN ('market_gap', 'product_idea', 'partnership', 'expansion', 'optimization')),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    market_size_usd DECIMAL(15, 2),
    revenue_potential_usd DECIMAL(15, 2),
    investment_required_usd DECIMAL(15, 2),
    roi_percentage DECIMAL(6, 2),
    time_to_market_days INTEGER,
    confidence_score DECIMAL(3, 2) CHECK (confidence_score BETWEEN 0 AND 1),
    risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high')),
    competition_level VARCHAR(20) CHECK (competition_level IN ('low', 'medium', 'high')),
    target_audience JSONB,
    implementation_steps JSONB,
    required_resources JSONB,
    potential_partners TEXT[],
    status VARCHAR(50) DEFAULT 'identified' CHECK (status IN ('identified', 'evaluating', 'approved', 'in_progress', 'completed', 'rejected')),
    evaluation_notes TEXT,
    agent_task_id UUID REFERENCES agent_orchestration_logs(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    evaluated_at TIMESTAMPTZ,
    evaluated_by UUID REFERENCES auth.users(id)
);

-- Indexes for monetization
CREATE INDEX idx_monetization_type ON agent_monetization_opportunities(opportunity_type);
CREATE INDEX idx_monetization_status ON agent_monetization_opportunities(status);
CREATE INDEX idx_monetization_roi ON agent_monetization_opportunities(roi_percentage DESC);
CREATE INDEX idx_monetization_confidence ON agent_monetization_opportunities(confidence_score DESC);

-- 7. Agent Compliance Alerts
-- Stores compliance monitoring results and alerts
CREATE TABLE IF NOT EXISTS agent_compliance_alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('regulatory_change', 'policy_violation', 'platform_update', 'product_compliance', 'documentation_required')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    jurisdiction VARCHAR(100),
    regulation_type VARCHAR(100),
    platform VARCHAR(50),
    title VARCHAR(500) NOT NULL,
    details TEXT NOT NULL,
    affected_products UUID[],
    affected_regions TEXT[],
    action_required TEXT,
    deadline TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved', 'ignored')),
    acknowledged_at TIMESTAMPTZ,
    acknowledged_by UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES auth.users(id),
    resolution_notes TEXT,
    notification_sent BOOLEAN DEFAULT FALSE,
    notification_sent_at TIMESTAMPTZ,
    agent_task_id UUID REFERENCES agent_orchestration_logs(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for compliance alerts
CREATE INDEX idx_compliance_alerts_type ON agent_compliance_alerts(alert_type);
CREATE INDEX idx_compliance_alerts_severity ON agent_compliance_alerts(severity);
CREATE INDEX idx_compliance_alerts_status ON agent_compliance_alerts(status);
CREATE INDEX idx_compliance_alerts_deadline ON agent_compliance_alerts(deadline) WHERE deadline IS NOT NULL;
CREATE INDEX idx_compliance_alerts_platform ON agent_compliance_alerts(platform) WHERE platform IS NOT NULL;

-- 8. Agent Performance Metrics
-- Tracks agent performance and costs
CREATE TABLE IF NOT EXISTS agent_performance_metrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    agent_name VARCHAR(100) NOT NULL,
    metric_date DATE NOT NULL,
    tasks_completed INTEGER DEFAULT 0,
    tasks_failed INTEGER DEFAULT 0,
    avg_duration_seconds DECIMAL(10, 2),
    total_tokens_used INTEGER DEFAULT 0,
    total_cost_usd DECIMAL(10, 6) DEFAULT 0,
    success_rate DECIMAL(5, 2),
    error_rate DECIMAL(5, 2),
    avg_tokens_per_task DECIMAL(10, 2),
    avg_cost_per_task DECIMAL(10, 6),
    peak_hour INTEGER,
    slowest_task_type VARCHAR(100),
    fastest_task_type VARCHAR(100),
    common_errors JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(agent_name, metric_date)
);

-- Indexes for performance metrics
CREATE INDEX idx_performance_agent_date ON agent_performance_metrics(agent_name, metric_date DESC);
CREATE INDEX idx_performance_cost ON agent_performance_metrics(total_cost_usd DESC);

-- 9. Agent Market Analyses
-- Stores market research and competitive analysis
CREATE TABLE IF NOT EXISTS agent_market_analyses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    analysis_type VARCHAR(50) NOT NULL CHECK (analysis_type IN ('market_research', 'competitor_analysis', 'trend_analysis', 'pricing_analysis', 'customer_analysis')),
    market_segment VARCHAR(255),
    geographic_region VARCHAR(255),
    competitors JSONB,
    market_size JSONB,
    growth_rate DECIMAL(6, 2),
    key_trends JSONB,
    opportunities JSONB,
    threats JSONB,
    recommendations JSONB,
    data_sources TEXT[],
    confidence_level DECIMAL(3, 2),
    valid_until TIMESTAMPTZ,
    agent_task_id UUID REFERENCES agent_orchestration_logs(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for market analyses
CREATE INDEX idx_market_analysis_type ON agent_market_analyses(analysis_type);
CREATE INDEX idx_market_analysis_segment ON agent_market_analyses(market_segment);
CREATE INDEX idx_market_analysis_created ON agent_market_analyses(created_at DESC);

-- Row Level Security Policies
ALTER TABLE agent_orchestration_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_task_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_outreach_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_outreach_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_seo_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_seo_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_monetization_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_compliance_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_market_analyses ENABLE ROW LEVEL SECURITY;

-- Admin access policies (full access)
CREATE POLICY admin_all_orchestration_logs ON agent_orchestration_logs
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY admin_all_task_queue ON agent_task_queue
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin');

-- Add similar admin policies for all tables...

-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_agent_task_queue_updated_at BEFORE UPDATE ON agent_task_queue
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_generated_content_updated_at BEFORE UPDATE ON agent_generated_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_outreach_campaigns_updated_at BEFORE UPDATE ON agent_outreach_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add similar triggers for other tables with updated_at...

-- Stored procedures for common operations
CREATE OR REPLACE FUNCTION get_agent_task_stats(
    p_agent_name VARCHAR DEFAULT NULL,
    p_days INTEGER DEFAULT 7
)
RETURNS TABLE (
    agent_name VARCHAR,
    total_tasks BIGINT,
    completed_tasks BIGINT,
    failed_tasks BIGINT,
    success_rate DECIMAL,
    avg_duration_seconds DECIMAL,
    total_cost_usd DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        aol.agent_name,
        COUNT(*) as total_tasks,
        COUNT(*) FILTER (WHERE aol.status = 'completed') as completed_tasks,
        COUNT(*) FILTER (WHERE aol.status = 'failed') as failed_tasks,
        ROUND(COUNT(*) FILTER (WHERE aol.status = 'completed')::DECIMAL / NULLIF(COUNT(*), 0) * 100, 2) as success_rate,
        ROUND(AVG(aol.duration_seconds)::DECIMAL, 2) as avg_duration_seconds,
        ROUND(SUM(aol.cost_usd)::DECIMAL, 6) as total_cost_usd
    FROM agent_orchestration_logs aol
    WHERE 
        (p_agent_name IS NULL OR aol.agent_name = p_agent_name)
        AND aol.created_at >= NOW() - INTERVAL '1 day' * p_days
    GROUP BY aol.agent_name
    ORDER BY total_tasks DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get next task from queue
CREATE OR REPLACE FUNCTION get_next_agent_task(
    p_agent_name VARCHAR,
    p_instance_id VARCHAR
)
RETURNS agent_task_queue AS $$
DECLARE
    v_task agent_task_queue;
BEGIN
    -- Lock and return the next available task
    UPDATE agent_task_queue
    SET 
        status = 'processing',
        locked_by = p_instance_id,
        locked_at = NOW()
    WHERE id = (
        SELECT id 
        FROM agent_task_queue
        WHERE 
            agent_name = p_agent_name
            AND status IN ('pending', 'scheduled')
            AND scheduled_for <= NOW()
            AND (locked_at IS NULL OR locked_at < NOW() - INTERVAL '10 minutes')
        ORDER BY priority DESC, scheduled_for ASC
        LIMIT 1
        FOR UPDATE SKIP LOCKED
    )
    RETURNING * INTO v_task;
    
    RETURN v_task;
END;
$$ LANGUAGE plpgsql;

-- Add comments for documentation
COMMENT ON TABLE agent_orchestration_logs IS 'Central logging for all AI agent activities and task execution';
COMMENT ON TABLE agent_task_queue IS 'Queue for managing pending and scheduled agent tasks';
COMMENT ON TABLE agent_generated_content IS 'Storage for all content created by AI agents';
COMMENT ON TABLE agent_outreach_campaigns IS 'Email and partnership outreach campaign management';
COMMENT ON TABLE agent_seo_analysis IS 'SEO analysis results and recommendations';
COMMENT ON TABLE agent_monetization_opportunities IS 'Identified business opportunities and market gaps';
COMMENT ON TABLE agent_compliance_alerts IS 'Regulatory compliance monitoring and alerts';
COMMENT ON TABLE agent_performance_metrics IS 'Agent performance tracking and cost analysis';
COMMENT ON TABLE agent_market_analyses IS 'Market research and competitive analysis data';