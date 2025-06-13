import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PublishRequest {
  content_id: string
  platforms: string[]
  schedule_time?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const payload: PublishRequest = await req.json()

    // Fetch content to publish
    const { data: content, error: contentError } = await supabase
      .from('agent_generated_content')
      .select('*')
      .eq('content_id', payload.content_id)
      .single()

    if (contentError) throw contentError

    // Validate content is ready for publishing
    if (content.status !== 'approved' && content.status !== 'scheduled') {
      throw new Error('Content must be approved before publishing')
    }

    // Schedule or publish immediately based on request
    const publishTime = payload.schedule_time 
      ? new Date(payload.schedule_time) 
      : new Date()

    // Update content status
    const { error: updateError } = await supabase
      .from('agent_generated_content')
      .update({
        status: publishTime > new Date() ? 'scheduled' : 'publishing',
        publish_date: publishTime.toISOString(),
        platform: payload.platforms
      })
      .eq('content_id', payload.content_id)

    if (updateError) throw updateError

    // Create publishing tasks for each platform
    const publishingTasks = payload.platforms.map(platform => ({
      agent_type: 'content_agent',
      action: `publish_to_${platform}`,
      priority: 8, // High priority for publishing
      payload: {
        content_id: payload.content_id,
        content_type: content.content_type,
        title: content.title,
        content: content.content,
        metadata: content.metadata
      },
      scheduled_for: publishTime.toISOString(),
      status: 'pending'
    }))

    const { error: tasksError } = await supabase
      .from('agent_task_queue')
      .insert(publishingTasks)

    if (tasksError) throw tasksError

    // Log the publishing request
    await supabase
      .from('agent_orchestration_logs')
      .insert({
        request_type: 'content_publishing',
        priority: 8,
        status: 'initiated',
        assigned_agents: ['content_agent'],
        metadata: {
          content_id: payload.content_id,
          platforms: payload.platforms,
          scheduled_time: publishTime.toISOString()
        }
      })

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Content scheduled for publishing',
        publish_time: publishTime.toISOString(),
        platforms: payload.platforms
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Publishing error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})