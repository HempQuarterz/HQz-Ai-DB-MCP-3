import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ComplianceCheckRequest {
  product_id?: number
  content_id?: string
  check_type: 'product' | 'content' | 'platform' | 'all'
  platform?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const payload: ComplianceCheckRequest = await req.json()

    // Create compliance check task
    const task = {
      agent_type: 'compliance_agent',
      action: `check_${payload.check_type}_compliance`,
      priority: payload.check_type === 'all' ? 9 : 7, // Higher priority for comprehensive checks
      payload: {
        product_id: payload.product_id,
        content_id: payload.content_id,
        platform: payload.platform,
        check_type: payload.check_type,
        requested_at: new Date().toISOString()
      },
      status: 'pending'
    }

    const { data: taskData, error: taskError } = await supabase
      .from('agent_task_queue')
      .insert(task)
      .select()
      .single()

    if (taskError) throw taskError

    // If checking specific product or content, fetch details
    let targetDetails = {}
    
    if (payload.product_id) {
      const { data: product } = await supabase
        .from('uses_products')
        .select('name, description, claims')
        .eq('id', payload.product_id)
        .single()
      
      if (product) targetDetails = { product }
    }

    if (payload.content_id) {
      const { data: content } = await supabase
        .from('agent_generated_content')
        .select('title, content_type, platform')
        .eq('content_id', payload.content_id)
        .single()
      
      if (content) targetDetails = { ...targetDetails, content }
    }

    // Log compliance check request
    await supabase
      .from('agent_orchestration_logs')
      .insert({
        request_type: 'compliance_check',
        priority: task.priority,
        status: 'initiated',
        assigned_agents: ['compliance_agent'],
        metadata: {
          task_id: taskData.task_id,
          check_type: payload.check_type,
          target_details: targetDetails,
          source: 'edge_function'
        }
      })

    // For immediate compliance issues, check recent alerts
    let recentAlerts = []
    if (payload.check_type === 'all' || payload.check_type === 'platform') {
      const { data: alerts } = await supabase
        .from('agent_compliance_alerts')
        .select('*')
        .eq('status', 'active')
        .in('severity', ['high', 'critical'])
        .limit(5)

      recentAlerts = alerts || []
    }

    return new Response(
      JSON.stringify({
        success: true,
        task_id: taskData.task_id,
        message: 'Compliance check initiated',
        immediate_alerts: recentAlerts.length,
        recent_critical_issues: recentAlerts.map(a => ({
          type: a.alert_type,
          severity: a.severity,
          description: a.description
        }))
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Compliance check error:', error)
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