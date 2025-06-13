import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Search, FileText, TrendingUp, Mail, DollarSign, Shield } from 'lucide-react';

const AgentMonitoringDashboardSimple = () => {
  // Mock data for testing
  const agents = [
    { name: 'Research Agent', icon: Search, status: 'active', tasksCompleted: 45, color: 'blue' },
    { name: 'Content Agent', icon: FileText, status: 'active', tasksCompleted: 78, color: 'purple' },
    { name: 'SEO Agent', icon: TrendingUp, status: 'active', tasksCompleted: 23, color: 'green' },
    { name: 'Compliance Agent', icon: Shield, status: 'active', tasksCompleted: 12, color: 'red' },
    { name: 'Outreach Agent', icon: Mail, status: 'pending', tasksCompleted: 0, color: 'orange' },
    { name: 'Monetization Agent', icon: DollarSign, status: 'pending', tasksCompleted: 0, color: 'yellow' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Brain className="h-8 w-8 text-green-400" />
          AI Agent Monitoring
        </h2>
        <p className="text-muted-foreground mt-2">
          Monitor and manage your AI agents in real-time
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const Icon = agent.icon;
          return (
            <Card key={agent.name} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 text-${agent.color}-500`} />
                  {agent.name}
                </CardTitle>
                <CardDescription>
                  <Badge 
                    variant={agent.status === 'active' ? 'default' : 'secondary'}
                    className={agent.status === 'active' ? 'bg-green-500' : ''}
                  >
                    {agent.status}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tasks Completed</span>
                    <span className="font-bold">{agent.tasksCompleted}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-${agent.color}-500 h-2 rounded-full transition-all`}
                      style={{ width: `${Math.min(agent.tasksCompleted, 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
          <CardDescription>Real-time agent performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-500">158</div>
              <div className="text-sm text-muted-foreground">Total Tasks</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-500">4</div>
              <div className="text-sm text-muted-foreground">Active Agents</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-500">92%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-500">$45.32</div>
              <div className="text-sm text-muted-foreground">AI Costs Today</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentMonitoringDashboardSimple;