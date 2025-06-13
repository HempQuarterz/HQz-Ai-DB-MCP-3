import React, { useState } from 'react';
import {
  useAgentStats,
  useAgentTaskQueue,
  useAgentPerformanceMetrics,
  useAgentActivities,
  useAIGenerationCosts,
  useRetryAgentTask,
  useCancelAgentTask,
  useAgentTaskUpdates
} from '@/hooks/useAgentMonitoring';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain,
  Search,
  FileText,
  TrendingUp,
  Mail,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Trash2,
  Clock,
  Zap,
  Shield,
  Users
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

// Agent type definitions
const AGENT_TYPES = {
  research_agent: { name: 'Research', icon: Search, color: 'blue' },
  content_agent: { name: 'Content', icon: FileText, color: 'purple' },
  seo_agent: { name: 'SEO', icon: TrendingUp, color: 'green' },
  outreach_agent: { name: 'Outreach', icon: Mail, color: 'orange' },
  monetization_agent: { name: 'Monetization', icon: DollarSign, color: 'yellow' },
  compliance_agent: { name: 'Compliance', icon: Shield, color: 'red' }
} as const;

const AgentMonitoringDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  
  // Data hooks
  const { data: stats, isLoading: statsLoading } = useAgentStats();
  const { data: taskQueue, isLoading: queueLoading } = useAgentTaskQueue();
  const { data: performance, isLoading: performanceLoading } = useAgentPerformanceMetrics();
  const { data: activities, isLoading: activitiesLoading } = useAgentActivities();
  const { data: aiCosts, isLoading: costsLoading } = useAIGenerationCosts();
  
  // Mutation hooks
  const retryMutation = useRetryAgentTask();
  const cancelMutation = useCancelAgentTask();
  
  // Real-time updates
  useAgentTaskUpdates((payload) => {
    if (payload.eventType === 'UPDATE' && payload.new.status === 'completed') {
      toast({
        title: 'Task Completed',
        description: `${payload.new.agent_type} completed task successfully`,
      });
    }
  });
  
  // Helper functions
  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: React.ReactNode }> = {
      pending: { variant: 'secondary', icon: <Clock className="h-3 w-3" /> },
      in_progress: { variant: 'default', icon: <RefreshCw className="h-3 w-3 animate-spin" /> },
      completed: { variant: 'success', icon: <CheckCircle className="h-3 w-3" /> },
      failed: { variant: 'destructive', icon: <XCircle className="h-3 w-3" /> },
      cancelled: { variant: 'outline', icon: <Trash2 className="h-3 w-3" /> }
    };
    
    const { variant, icon } = variants[status] || variants.pending;
    
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        {icon}
        <span className="capitalize">{status.replace('_', ' ')}</span>
      </Badge>
    );
  };
  
  const formatCost = (cost: number | null | undefined) => {
    if (!cost) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    }).format(cost);
  };
  
  const getAgentIcon = (agentType: string) => {
    const agent = AGENT_TYPES[agentType as keyof typeof AGENT_TYPES];
    const Icon = agent?.icon || Brain;
    return <Icon className={`h-4 w-4 text-${agent?.color || 'gray'}-600`} />;
  };
  
  const handleRetry = async (taskId: string) => {
    try {
      await retryMutation.mutateAsync(taskId);
      toast({
        title: 'Task Retried',
        description: 'The agent task has been queued for retry.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to retry agent task.',
        variant: 'destructive',
      });
    }
  };
  
  const handleCancel = async (taskId: string) => {
    try {
      await cancelMutation.mutateAsync(taskId);
      toast({
        title: 'Task Cancelled',
        description: 'The agent task has been cancelled.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel agent task.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-32 mt-1" />
              </CardContent>
            </Card>
          ))
        ) : stats ? (
          <>
            <Card>
              <CardHeader className="space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Total Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_tasks || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.tasks_today || 0} today
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Active Agents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.active_agents || 0}</div>
                <p className="text-xs text-muted-foreground">
                  of {Object.keys(AGENT_TYPES).length} total
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Success Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {((stats.success_rate || 0) * 100).toFixed(1)}%
                </div>
                <Progress 
                  value={(stats.success_rate || 0) * 100} 
                  className="mt-2 h-2"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  AI Costs (24h)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCost(stats.total_cost_24h)}</div>
                <p className="text-xs text-muted-foreground">
                  {formatCost(stats.avg_cost_per_task)} per task
                </p>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
      
      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="queue">Task Queue</TabsTrigger>
          <TabsTrigger value="agents">Agent Status</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="costs">AI Costs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Agent Activity Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Agent Activity Summary</CardTitle>
              <CardDescription>
                Recent activities across all agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activitiesLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <div className="space-y-4">
                  {activities?.recent_activities?.map((activity: any, index: number) => (
                    <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50">
                      <div className="mt-1">{getAgentIcon(activity.agent_type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{activity.task_type}</span>
                          {getStatusBadge(activity.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Quick Stats by Agent */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(AGENT_TYPES).map(([key, agent]) => {
              const Icon = agent.icon;
              const agentStats = stats?.by_agent?.[key] || {};
              
              return (
                <Card key={key}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Icon className={`h-5 w-5 text-${agent.color}-600`} />
                      {agent.name} Agent
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-2xl font-bold">{agentStats.total || 0}</div>
                        <p className="text-xs text-muted-foreground">Total</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {agentStats.completed || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">Success</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">
                          {agentStats.failed || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">Failed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Task Queue Monitor</CardTitle>
              <CardDescription>
                Real-time monitoring of agent tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              {queueLoading ? (
                <Skeleton className="h-96 w-full" />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Agent</TableHead>
                        <TableHead>Task Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {taskQueue?.map((task: any) => (
                        <TableRow key={task.task_id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getAgentIcon(task.agent_type)}
                              <span className="capitalize">
                                {AGENT_TYPES[task.agent_type as keyof typeof AGENT_TYPES]?.name || task.agent_type}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{task.task_type}</TableCell>
                          <TableCell>{getStatusBadge(task.status)}</TableCell>
                          <TableCell>
                            <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                              {task.priority}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(task.created_at), 'MMM d, HH:mm')}
                          </TableCell>
                          <TableCell>
                            {task.completed_at ? (
                              <span className="text-sm">
                                {Math.round((new Date(task.completed_at).getTime() - new Date(task.created_at).getTime()) / 1000)}s
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {task.status === 'failed' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRetry(task.task_id)}
                                  disabled={retryMutation.isPending}
                                >
                                  <RefreshCw className="h-3 w-3" />
                                </Button>
                              )}
                              {(task.status === 'pending' || task.status === 'in_progress') && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleCancel(task.task_id)}
                                  disabled={cancelMutation.isPending}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="agents" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {performanceLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-5 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-32 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : (
              Object.entries(AGENT_TYPES).map(([key, agent]) => {
                const Icon = agent.icon;
                const agentPerf = performance?.by_agent?.[key] || {};
                
                return (
                  <Card key={key}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon className={`h-5 w-5 text-${agent.color}-600`} />
                        {agent.name} Agent Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Avg Completion Time</span>
                          <span className="font-medium">
                            {agentPerf.avg_completion_time || 0}s
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Success Rate</span>
                          <Badge variant={agentPerf.success_rate > 0.9 ? 'success' : 'secondary'}>
                            {((agentPerf.success_rate || 0) * 100).toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Tasks Today</span>
                          <span className="font-medium">{agentPerf.tasks_today || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Avg Cost</span>
                          <span className="font-medium">{formatCost(agentPerf.avg_cost)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Detailed performance analysis by agent and time period
              </CardDescription>
            </CardHeader>
            <CardContent>
              {performanceLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent</TableHead>
                      <TableHead className="text-right">Tasks (24h)</TableHead>
                      <TableHead className="text-right">Completed</TableHead>
                      <TableHead className="text-right">Failed</TableHead>
                      <TableHead className="text-right">Avg Time</TableHead>
                      <TableHead className="text-right">Success Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {performance?.daily_metrics?.map((metric: any) => (
                      <TableRow key={metric.agent_type}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getAgentIcon(metric.agent_type)}
                            <span className="capitalize">
                              {AGENT_TYPES[metric.agent_type as keyof typeof AGENT_TYPES]?.name || metric.agent_type}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{metric.total_tasks}</TableCell>
                        <TableCell className="text-right text-green-600">
                          {metric.tasks_completed}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          {metric.tasks_failed}
                        </TableCell>
                        <TableCell className="text-right">
                          {metric.average_completion_time}s
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={metric.success_rate > 0.9 ? 'success' : 'secondary'}>
                            {(metric.success_rate * 100).toFixed(1)}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          
          {/* Performance Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>
                Agent performance over the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* This would be a chart component showing trends */}
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Performance chart visualization would go here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="costs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Generation Costs</CardTitle>
              <CardDescription>
                Track AI API usage and costs across all agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {costsLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <div className="space-y-4">
                  {/* Cost Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Total Cost (24h)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {formatCost(aiCosts?.total_24h || 0)}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Total Cost (7d)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {formatCost(aiCosts?.total_7d || 0)}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Total Cost (30d)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {formatCost(aiCosts?.total_30d || 0)}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Avg per Task</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {formatCost(aiCosts?.avg_per_task || 0)}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Cost by Provider */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Provider</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead className="text-right">Requests (24h)</TableHead>
                        <TableHead className="text-right">Tokens Used</TableHead>
                        <TableHead className="text-right">Cost (24h)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {aiCosts?.by_provider?.map((provider: any) => (
                        <TableRow key={`${provider.provider}-${provider.model}`}>
                          <TableCell className="font-medium">{provider.provider}</TableCell>
                          <TableCell>{provider.model}</TableCell>
                          <TableCell className="text-right">{provider.requests_24h}</TableCell>
                          <TableCell className="text-right">
                            {provider.total_tokens?.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCost(provider.cost_24h)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {/* Cost by Agent */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Cost Distribution by Agent</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {aiCosts?.by_agent?.map((agent: any) => {
                          const agentInfo = AGENT_TYPES[agent.agent_type as keyof typeof AGENT_TYPES];
                          const Icon = agentInfo?.icon || Brain;
                          const percentage = (agent.cost_24h / (aiCosts.total_24h || 1)) * 100;
                          
                          return (
                            <div key={agent.agent_type} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <Icon className={`h-4 w-4 text-${agentInfo?.color || 'gray'}-600`} />
                                  <span>{agentInfo?.name || agent.agent_type}</span>
                                </div>
                                <span className="font-medium">{formatCost(agent.cost_24h)}</span>
                              </div>
                              <Progress value={percentage} className="h-2" />
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentMonitoringDashboard;