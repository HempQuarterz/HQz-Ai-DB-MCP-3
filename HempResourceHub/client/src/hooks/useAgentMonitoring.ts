import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import { useEffect } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';

// Types
interface AgentStats {
  total_tasks: number;
  tasks_today: number;
  active_agents: number;
  success_rate: number;
  total_cost_24h: number;
  avg_cost_per_task: number;
  by_agent: Record<string, {
    total: number;
    completed: number;
    failed: number;
  }>;
}

interface AgentTask {
  task_id: string;
  agent_type: string;
  task_type: string;
  status: string;
  priority: string;
  params: any;
  result: any;
  error_log: string[];
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
}

interface AgentPerformance {
  by_agent: Record<string, {
    avg_completion_time: number;
    success_rate: number;
    tasks_today: number;
    avg_cost: number;
  }>;
  daily_metrics: Array<{
    agent_type: string;
    metric_date: string;
    total_tasks: number;
    tasks_completed: number;
    tasks_failed: number;
    average_completion_time: number;
    success_rate: number;
  }>;
}

interface AIGenerationCosts {
  total_24h: number;
  total_7d: number;
  total_30d: number;
  avg_per_task: number;
  by_provider: Array<{
    provider: string;
    model: string;
    requests_24h: number;
    total_tokens: number;
    cost_24h: number;
  }>;
  by_agent: Array<{
    agent_type: string;
    cost_24h: number;
  }>;
}

// Fetch agent statistics
export const useAgentStats = () => {
  return useQuery({
    queryKey: ['agent-stats'],
    queryFn: async (): Promise<AgentStats> => {
      // Get today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      // Get 24 hours ago
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      // Fetch total tasks
      const { count: totalTasks } = await supabase
        .from('agent_task_queue')
        .select('*', { count: 'exact', head: true });

      // Fetch tasks today
      const { count: tasksToday } = await supabase
        .from('agent_task_queue')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayISO);

      // Fetch tasks by status
      const { data: tasksByStatus } = await supabase
        .from('agent_task_queue')
        .select('status, agent_type')
        .gte('created_at', twentyFourHoursAgo.toISOString());

      // Count active agents (agents with tasks in last 24h)
      const activeAgents = new Set(tasksByStatus?.map(t => t.agent_type) || []).size;

      // Calculate success rate
      const completed = tasksByStatus?.filter(t => t.status === 'completed').length || 0;
      const failed = tasksByStatus?.filter(t => t.status === 'failed').length || 0;
      const total = completed + failed;
      const successRate = total > 0 ? completed / total : 0;

      // Fetch AI costs for last 24h
      const { data: costs } = await supabase
        .from('ai_generation_costs')
        .select('cost')
        .gte('created_at', twentyFourHoursAgo.toISOString());

      const totalCost24h = costs?.reduce((sum, c) => sum + (c.cost || 0), 0) || 0;
      const avgCostPerTask = total > 0 ? totalCost24h / total : 0;

      // Group by agent
      const byAgent: Record<string, any> = {};
      const agentTypes = ['research_agent', 'content_agent', 'seo_agent', 'outreach_agent', 'monetization_agent', 'compliance_agent'];
      
      for (const agentType of agentTypes) {
        const agentTasks = tasksByStatus?.filter(t => t.agent_type === agentType) || [];
        byAgent[agentType] = {
          total: agentTasks.length,
          completed: agentTasks.filter(t => t.status === 'completed').length,
          failed: agentTasks.filter(t => t.status === 'failed').length
        };
      }

      return {
        total_tasks: totalTasks || 0,
        tasks_today: tasksToday || 0,
        active_agents: activeAgents,
        success_rate: successRate,
        total_cost_24h: totalCost24h,
        avg_cost_per_task: avgCostPerTask,
        by_agent: byAgent
      };
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });
};

// Fetch agent task queue
export const useAgentTaskQueue = (limit: number = 50) => {
  return useQuery({
    queryKey: ['agent-task-queue', limit],
    queryFn: async (): Promise<AgentTask[]> => {
      const { data, error } = await supabase
        .from('agent_task_queue')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 10000 // Refresh every 10 seconds
  });
};

// Fetch agent performance metrics
export const useAgentPerformanceMetrics = () => {
  return useQuery({
    queryKey: ['agent-performance'],
    queryFn: async (): Promise<AgentPerformance> => {
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch daily metrics
      const { data: metrics } = await supabase
        .from('agent_performance_metrics')
        .select('*')
        .eq('metric_date', today);

      // Fetch recent tasks for additional calculations
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      const { data: recentTasks } = await supabase
        .from('agent_task_queue')
        .select('agent_type, status, created_at, started_at, completed_at')
        .gte('created_at', twentyFourHoursAgo.toISOString())
        .in('status', ['completed', 'failed']);

      // Fetch AI costs by agent
      const { data: costs } = await supabase
        .from('ai_generation_costs')
        .select('metadata, cost')
        .gte('created_at', twentyFourHoursAgo.toISOString());

      // Calculate by agent metrics
      const byAgent: Record<string, any> = {};
      const agentTypes = ['research_agent', 'content_agent', 'seo_agent', 'outreach_agent', 'monetization_agent', 'compliance_agent'];

      for (const agentType of agentTypes) {
        const agentTasks = recentTasks?.filter(t => t.agent_type === agentType) || [];
        const completed = agentTasks.filter(t => t.status === 'completed');
        
        // Calculate average completion time
        let avgCompletionTime = 0;
        if (completed.length > 0) {
          const times = completed
            .filter(t => t.started_at && t.completed_at)
            .map(t => {
              const start = new Date(t.started_at!).getTime();
              const end = new Date(t.completed_at!).getTime();
              return (end - start) / 1000; // Convert to seconds
            });
          
          if (times.length > 0) {
            avgCompletionTime = times.reduce((a, b) => a + b, 0) / times.length;
          }
        }

        // Calculate agent costs
        const agentCosts = costs?.filter(c => c.metadata?.agent === agentType) || [];
        const totalCost = agentCosts.reduce((sum, c) => sum + (c.cost || 0), 0);
        const avgCost = agentCosts.length > 0 ? totalCost / agentCosts.length : 0;

        byAgent[agentType] = {
          avg_completion_time: Math.round(avgCompletionTime),
          success_rate: agentTasks.length > 0 ? completed.length / agentTasks.length : 0,
          tasks_today: agentTasks.length,
          avg_cost: avgCost
        };
      }

      return {
        by_agent: byAgent,
        daily_metrics: metrics || []
      };
    },
    refetchInterval: 60000 // Refresh every minute
  });
};

// Fetch recent agent activities
export const useAgentActivities = (limit: number = 20) => {
  return useQuery({
    queryKey: ['agent-activities', limit],
    queryFn: async () => {
      // Fetch recent tasks with details
      const { data: tasks } = await supabase
        .from('agent_task_queue')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      // Transform tasks into activities
      const recentActivities = tasks?.map(task => ({
        agent_type: task.agent_type,
        task_type: task.task_type,
        status: task.status,
        description: getTaskDescription(task),
        created_at: task.created_at
      })) || [];

      return {
        recent_activities: recentActivities
      };
    },
    refetchInterval: 30000
  });
};

// Fetch AI generation costs
export const useAIGenerationCosts = () => {
  return useQuery({
    queryKey: ['ai-generation-costs'],
    queryFn: async (): Promise<AIGenerationCosts> => {
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Fetch costs for different periods
      const { data: costs24h } = await supabase
        .from('ai_generation_costs')
        .select('*')
        .gte('created_at', twentyFourHoursAgo.toISOString());

      const { data: costs7d } = await supabase
        .from('ai_generation_costs')
        .select('cost')
        .gte('created_at', sevenDaysAgo.toISOString());

      const { data: costs30d } = await supabase
        .from('ai_generation_costs')
        .select('cost')
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Calculate totals
      const total24h = costs24h?.reduce((sum, c) => sum + (c.cost || 0), 0) || 0;
      const total7d = costs7d?.reduce((sum, c) => sum + (c.cost || 0), 0) || 0;
      const total30d = costs30d?.reduce((sum, c) => sum + (c.cost || 0), 0) || 0;

      // Group by provider
      const byProvider: Record<string, any> = {};
      costs24h?.forEach(cost => {
        const key = `${cost.provider_name}-${cost.model || 'default'}`;
        if (!byProvider[key]) {
          byProvider[key] = {
            provider: cost.provider_name,
            model: cost.model || 'default',
            requests_24h: 0,
            total_tokens: 0,
            cost_24h: 0
          };
        }
        byProvider[key].requests_24h++;
        byProvider[key].total_tokens += cost.total_tokens || 0;
        byProvider[key].cost_24h += cost.cost || 0;
      });

      // Group by agent
      const byAgent: Record<string, number> = {};
      costs24h?.forEach(cost => {
        const agent = cost.metadata?.agent || 'unknown';
        byAgent[agent] = (byAgent[agent] || 0) + (cost.cost || 0);
      });

      const byAgentArray = Object.entries(byAgent).map(([agent_type, cost_24h]) => ({
        agent_type,
        cost_24h
      }));

      // Calculate average per task
      const { count: taskCount } = await supabase
        .from('agent_task_queue')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', twentyFourHoursAgo.toISOString())
        .in('status', ['completed', 'failed']);

      const avgPerTask = taskCount && taskCount > 0 ? total24h / taskCount : 0;

      return {
        total_24h: total24h,
        total_7d: total7d,
        total_30d: total30d,
        avg_per_task: avgPerTask,
        by_provider: Object.values(byProvider),
        by_agent: byAgentArray
      };
    },
    refetchInterval: 60000
  });
};

// Mutations
export const useRetryAgentTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (taskId: string) => {
      // Update task status to pending and reset error log
      const { error } = await supabase
        .from('agent_task_queue')
        .update({ 
          status: 'pending',
          error_log: [],
          started_at: null,
          completed_at: null
        })
        .eq('task_id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-task-queue'] });
      queryClient.invalidateQueries({ queryKey: ['agent-stats'] });
    }
  });
};

export const useCancelAgentTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from('agent_task_queue')
        .update({ 
          status: 'cancelled',
          completed_at: new Date().toISOString()
        })
        .eq('task_id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-task-queue'] });
      queryClient.invalidateQueries({ queryKey: ['agent-stats'] });
    }
  });
};

// Real-time subscriptions
export const useAgentTaskUpdates = (onUpdate: (payload: any) => void) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    let channel: RealtimeChannel;

    const setupSubscription = async () => {
      channel = supabase
        .channel('agent-task-updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'agent_task_queue'
          },
          (payload) => {
            // Call the callback
            onUpdate(payload);
            
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ['agent-task-queue'] });
            queryClient.invalidateQueries({ queryKey: ['agent-stats'] });
            queryClient.invalidateQueries({ queryKey: ['agent-activities'] });
          }
        )
        .subscribe();
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [queryClient, onUpdate]);
};

// Helper functions
function getTaskDescription(task: AgentTask): string {
  const descriptions: Record<string, string> = {
    'research_agent:discover_products': 'Discovering new hemp products',
    'research_agent:analyze_trends': 'Analyzing industry trends',
    'content_agent:generate_blog_post': 'Generating blog content',
    'content_agent:generate_product_description': 'Creating product description',
    'seo_agent:analyze_site': 'Analyzing site SEO performance',
    'seo_agent:research_keywords': 'Researching keywords',
    'outreach_agent:find_contacts': 'Finding outreach contacts',
    'outreach_agent:send_emails': 'Sending outreach emails',
    'monetization_agent:analyze_opportunities': 'Analyzing monetization opportunities',
    'compliance_agent:check_regulations': 'Checking regulatory compliance'
  };

  const key = `${task.agent_type}:${task.task_type}`;
  return descriptions[key] || `${task.task_type} by ${task.agent_type}`;
}