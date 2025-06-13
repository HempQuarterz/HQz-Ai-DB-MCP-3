import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WebhookPayload {
  action: string
  agent: string
  data: any
  priority?: number
  scheduled_for?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse request body
    const payload: WebhookPayload = await req.json()
    
    // Validate required fields
    if (!payload.action || !payload.agent) {
      throw new Error('Missing required fields: action and agent')
    }

    // Create task in queue
    const task = {
      agent_type: payload.agent,
      action: payload.action,
      priority: payload.priority || 5,
      payload: payload.data || {},
      scheduled_for: payload.scheduled_for || new Date().toISOString(),
      status: 'pending'
    }

    const { data, error } = await supabase
      .from('agent_task_queue')
      .insert(task)
      .select()
      .single()

    if (error) throw error

    // Log the webhook receipt
    await supabase
      .from('agent_orchestration_logs')
      .insert({
        request_type: 'webhook',
        priority: task.priority,
        status: 'queued',
        assigned_agents: [payload.agent],
        metadata: {
          task_id: data.task_id,
          source: 'webhook',
          timestamp: new Date().toISOString()
        }
      })

    return new Response(
      JSON.stringify({
        success: true,
        task_id: data.task_id,
        message: 'Task queued successfully'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Webhook error:', error)
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