-- Image Generation Automation Schema
-- This creates all necessary tables for the image generation system

-- Create image generation queue table
CREATE TABLE IF NOT EXISTS image_generation_queue (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES uses_products(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'retry')),
    prompt TEXT,
    style_preset TEXT DEFAULT 'product_photography',
    negative_prompt TEXT,
    attempt_count INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    error_message TEXT,
    generated_image_url TEXT,
    generation_provider TEXT DEFAULT 'placeholder',
    priority INTEGER DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- Create image generation history table
CREATE TABLE IF NOT EXISTS image_generation_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    queue_id UUID REFERENCES image_generation_queue(id),
    product_id BIGINT REFERENCES uses_products(id),
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_image_queue_status ON image_generation_queue(status);
CREATE INDEX IF NOT EXISTS idx_image_queue_product ON image_generation_queue(product_id);
CREATE INDEX IF NOT EXISTS idx_image_queue_priority ON image_generation_queue(status, priority DESC, created_at);

-- Create scheduling table
CREATE TABLE IF NOT EXISTS image_generation_schedule (
    id SERIAL PRIMARY KEY,
    schedule_name TEXT NOT NULL,
    cron_expression TEXT DEFAULT '*/15 * * * *',
    is_active BOOLEAN DEFAULT true,
    last_run TIMESTAMP,
    next_run TIMESTAMP DEFAULT NOW() + INTERVAL '15 minutes',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default schedule
INSERT INTO image_generation_schedule (schedule_name)
VALUES ('default_image_generation_schedule')
ON CONFLICT DO NOTHING;

-- Create function to generate image prompts
CREATE OR REPLACE FUNCTION generate_image_prompt(p_product_id BIGINT)
RETURNS TEXT AS $$
DECLARE
    v_prompt TEXT;
    v_product RECORD;
BEGIN
    SELECT 
        up.name,
        up.description,
        pp.name as plant_part,
        i.name as industry,
        isc.name as subcategory,
        up.benefits_advantages,
        up.commercialization_stage
    INTO v_product
    FROM uses_products up
    JOIN plant_parts pp ON up.plant_part_id = pp.id
    LEFT JOIN industry_sub_categories isc ON up.industry_sub_category_id = isc.id
    LEFT JOIN industries i ON isc.industry_id = i.id
    WHERE up.id = p_product_id;
    
    v_prompt := 'Professional product photography of ' || v_product.name || '. ';
    
    -- Industry-specific styling
    CASE 
        WHEN v_product.industry LIKE '%Food%' THEN
            v_prompt := v_prompt || 'Clean, bright, appetizing food photography style. Natural lighting. ';
        WHEN v_product.industry LIKE '%Cosmetics%' THEN
            v_prompt := v_prompt || 'Elegant beauty product photography. Soft lighting, luxurious presentation. ';
        WHEN v_product.industry LIKE '%Textile%' THEN
            v_prompt := v_prompt || 'Fashion photography style showing texture and quality. Professional studio lighting. ';
        WHEN v_product.industry LIKE '%Construction%' THEN
            v_prompt := v_prompt || 'Industrial product photography. Clear, detailed view showing material properties. ';
        ELSE
            v_prompt := v_prompt || 'Professional commercial product photography. Studio lighting. ';
    END CASE;
    
    -- Plant part specific details
    CASE 
        WHEN v_product.plant_part LIKE '%Seed%' THEN
            v_prompt := v_prompt || 'Show hemp seeds in an appealing arrangement. ';
        WHEN v_product.plant_part LIKE '%Fiber%' THEN
            v_prompt := v_prompt || 'Highlight the texture and quality of hemp fibers. ';
        WHEN v_product.plant_part LIKE '%Oil%' THEN
            v_prompt := v_prompt || 'Show oil in elegant glass containers with hemp plants. ';
        WHEN v_product.plant_part LIKE '%Hurd%' THEN
            v_prompt := v_prompt || 'Show hemp hurds/shivs material in industrial context. ';
        WHEN v_product.plant_part LIKE '%Flower%' THEN
            v_prompt := v_prompt || 'Beautiful close-up of hemp flowers with visible trichomes. ';
        ELSE
            v_prompt := v_prompt || 'Show the hemp product clearly with focus on quality. ';
    END CASE;
    
    v_prompt := v_prompt || 'High resolution, white background, professional product shot, commercial quality, sustainable and eco-friendly aesthetic.';
    
    RETURN v_prompt;
END;
$$ LANGUAGE plpgsql;

-- Create function to queue image generation
CREATE OR REPLACE FUNCTION queue_image_generation(p_product_id BIGINT, p_priority INTEGER DEFAULT 5)
RETURNS UUID AS $$
DECLARE
    v_queue_id UUID;
    v_prompt TEXT;
BEGIN
    -- Check if product already has an image
    IF EXISTS (
        SELECT 1 FROM uses_products 
        WHERE id = p_product_id 
        AND image_url IS NOT NULL 
        AND image_url != ''
    ) THEN
        RETURN NULL;
    END IF;
    
    -- Check if already in queue
    IF EXISTS (
        SELECT 1 FROM image_generation_queue 
        WHERE product_id = p_product_id 
        AND status IN ('pending', 'processing')
    ) THEN
        RETURN NULL;
    END IF;
    
    -- Generate prompt
    v_prompt := generate_image_prompt(p_product_id);
    
    -- Insert into queue
    INSERT INTO image_generation_queue (
        product_id, 
        prompt, 
        priority,
        negative_prompt
    ) VALUES (
        p_product_id, 
        v_prompt, 
        p_priority,
        'low quality, blurry, distorted, amateur, watermark, text, logo'
    ) RETURNING id INTO v_queue_id;
    
    -- Log the action
    INSERT INTO image_generation_history (
        queue_id, 
        product_id, 
        action, 
        details
    ) VALUES (
        v_queue_id, 
        p_product_id, 
        'queued', 
        jsonb_build_object('prompt', v_prompt, 'priority', p_priority)
    );
    
    RETURN v_queue_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to process queue
CREATE OR REPLACE FUNCTION process_image_generation_queue(p_batch_size INTEGER DEFAULT 10)
RETURNS TABLE (
    processed_count INTEGER,
    success_count INTEGER,
    failed_count INTEGER,
    retry_count INTEGER
) AS $$
DECLARE
    v_processed INTEGER := 0;
    v_success INTEGER := 0;
    v_failed INTEGER := 0;
    v_retry INTEGER := 0;
    v_queue_item RECORD;
    v_placeholder_url TEXT;
BEGIN
    FOR v_queue_item IN 
        SELECT 
            igq.id as queue_id,
            igq.product_id,
            igq.prompt,
            igq.attempt_count,
            up.name as product_name,
            pp.name as plant_part,
            i.name as industry
        FROM image_generation_queue igq
        JOIN uses_products up ON igq.product_id = up.id
        JOIN plant_parts pp ON up.plant_part_id = pp.id
        LEFT JOIN industry_sub_categories isc ON up.industry_sub_category_id = isc.id
        LEFT JOIN industries i ON isc.industry_id = i.id
        WHERE igq.status IN ('pending', 'retry')
        ORDER BY igq.priority DESC, igq.created_at
        LIMIT p_batch_size
    LOOP
        UPDATE image_generation_queue 
        SET status = 'processing', updated_at = NOW()
        WHERE id = v_queue_item.queue_id;
        
        v_placeholder_url := generate_placeholder_image_url(
            v_queue_item.product_name,
            v_queue_item.plant_part,
            v_queue_item.industry
        );
        
        IF random() > 0.1 THEN
            -- Success
            UPDATE uses_products
            SET image_url = v_placeholder_url, updated_at = NOW()
            WHERE id = v_queue_item.product_id;
            
            UPDATE image_generation_queue
            SET status = 'completed',
                generated_image_url = v_placeholder_url,
                completed_at = NOW(),
                updated_at = NOW()
            WHERE id = v_queue_item.queue_id;
            
            INSERT INTO image_generation_history (
                queue_id, product_id, action, details
            ) VALUES (
                v_queue_item.queue_id, 
                v_queue_item.product_id, 
                'completed',
                jsonb_build_object('image_url', v_placeholder_url, 'provider', 'placeholder')
            );
            
            v_success := v_success + 1;
        ELSE
            -- Failure
            IF v_queue_item.attempt_count < 3 THEN
                UPDATE image_generation_queue
                SET status = 'retry',
                    attempt_count = attempt_count + 1,
                    updated_at = NOW()
                WHERE id = v_queue_item.queue_id;
                
                v_retry := v_retry + 1;
            ELSE
                UPDATE image_generation_queue
                SET status = 'failed',
                    error_message = 'Maximum retry attempts reached',
                    updated_at = NOW()
                WHERE id = v_queue_item.queue_id;
                
                v_failed := v_failed + 1;
            END IF;
            
            INSERT INTO image_generation_history (
                queue_id, product_id, action, details
            ) VALUES (
                v_queue_item.queue_id, 
                v_queue_item.product_id, 
                CASE WHEN v_queue_item.attempt_count < 3 THEN 'retry' ELSE 'failed' END,
                jsonb_build_object('attempt', v_queue_item.attempt_count + 1, 'error', 'Simulated failure')
            );
        END IF;
        
        v_processed := v_processed + 1;
    END LOOP;
    
    RETURN QUERY SELECT v_processed, v_success, v_failed, v_retry;
END;
$$ LANGUAGE plpgsql;

-- Create placeholder URL generator
CREATE OR REPLACE FUNCTION generate_placeholder_image_url(
    p_product_name TEXT,
    p_plant_part TEXT,
    p_industry TEXT
) RETURNS TEXT AS $$
DECLARE
    v_color TEXT;
    v_icon TEXT;
    v_style TEXT;
BEGIN
    CASE 
        WHEN p_plant_part LIKE '%Seed%' THEN
            v_color := '8B4513';
        WHEN p_plant_part LIKE '%Fiber%' THEN
            v_color := '228B22';
        WHEN p_plant_part LIKE '%Flower%' THEN
            v_color := '9370DB';
        WHEN p_plant_part LIKE '%Hurd%' THEN
            v_color := 'D2691E';
        WHEN p_plant_part LIKE '%Root%' THEN
            v_color := '8B4513';
        ELSE
            v_color := '2E8B57';
    END CASE;
    
    RETURN format(
        'https://via.placeholder.com/600x400/%s/FFFFFF?text=%s',
        v_color,
        replace(p_product_name, ' ', '+')
    );
END;
$$ LANGUAGE plpgsql;

-- Create monitoring views
CREATE OR REPLACE VIEW image_generation_progress AS
SELECT 
    COUNT(*) as total_products,
    COUNT(CASE WHEN up.image_url IS NOT NULL THEN 1 END) as products_with_images,
    COUNT(CASE WHEN up.image_url IS NULL THEN 1 END) as products_without_images,
    ROUND(COUNT(CASE WHEN up.image_url IS NOT NULL THEN 1 END)::numeric / COUNT(*)::numeric * 100, 2) as completion_percentage,
    COUNT(CASE WHEN igq.status = 'pending' THEN 1 END) as pending_generation,
    COUNT(CASE WHEN igq.status = 'processing' THEN 1 END) as currently_processing,
    COUNT(CASE WHEN igq.status = 'completed' THEN 1 END) as completed_generation,
    COUNT(CASE WHEN igq.status = 'failed' THEN 1 END) as failed_generation
FROM uses_products up
LEFT JOIN image_generation_queue igq ON up.id = igq.product_id;

CREATE OR REPLACE VIEW image_generation_dashboard AS
WITH queue_stats AS (
    SELECT 
        COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
        COUNT(*) FILTER (WHERE status = 'processing') as processing_count,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_count,
        COUNT(*) FILTER (WHERE status = 'failed') as failed_count,
        COUNT(*) FILTER (WHERE status = 'retry') as retry_count,
        AVG(EXTRACT(EPOCH FROM (completed_at - created_at))) FILTER (WHERE status = 'completed') as avg_processing_time_seconds
    FROM image_generation_queue
),
recent_activity AS (
    SELECT 
        COUNT(*) as last_hour_processed,
        COUNT(*) FILTER (WHERE action = 'completed') as last_hour_completed
    FROM image_generation_history
    WHERE created_at >= NOW() - INTERVAL '1 hour'
)
SELECT 
    p.*,
    q.pending_count,
    q.processing_count,
    q.completed_count,
    q.failed_count,
    q.retry_count,
    q.avg_processing_time_seconds,
    r.last_hour_processed,
    r.last_hour_completed,
    s.last_run,
    s.next_run,
    CASE 
        WHEN q.pending_count = 0 THEN 'All images generated!'
        WHEN q.avg_processing_time_seconds IS NOT NULL THEN 
            format('Estimated completion: %s minutes', 
                   ROUND((q.pending_count * q.avg_processing_time_seconds / 60)::numeric, 2))
        ELSE 'Calculating...'
    END as estimated_completion
FROM image_generation_progress p
CROSS JOIN queue_stats q
CROSS JOIN recent_activity r
CROSS JOIN image_generation_schedule s
WHERE s.is_active = true;

-- Create trigger for auto-queuing new products
CREATE OR REPLACE FUNCTION auto_queue_image_generation()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM queue_image_generation(NEW.id, 8);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_queue_images_trigger
AFTER INSERT ON uses_products
FOR EACH ROW
EXECUTE FUNCTION auto_queue_image_generation();