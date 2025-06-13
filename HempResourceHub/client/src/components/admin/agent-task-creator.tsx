import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase-client';
import { Loader2, PlayCircle, Plus } from 'lucide-react';

interface TaskTemplate {
  agent: string;
  taskType: string;
  description: string;
  defaultParams: any;
}

const taskTemplates: TaskTemplate[] = [
  {
    agent: 'research_agent',
    taskType: 'discover_products',
    description: 'Discover new hemp products from web sources',
    defaultParams: {
      sources: ['https://www.hempindustrydaily.com', 'https://www.leafly.com/news/hemp'],
      limit: 10
    }
  },
  {
    agent: 'research_agent',
    taskType: 'analyze_trends',
    description: 'Analyze industry trends from product data',
    defaultParams: {}
  },
  {
    agent: 'content_agent',
    taskType: 'generate_blog_post',
    description: 'Generate SEO-optimized blog content',
    defaultParams: {
      topic: 'The Future of Hemp Technology',
      keywords: ['hemp innovation', 'sustainable materials', 'hemp technology'],
      word_count: 1000
    }
  },
  {
    agent: 'content_agent',
    taskType: 'generate_social_media',
    description: 'Create social media posts',
    defaultParams: {
      topic: 'Hemp Benefits',
      platforms: ['twitter', 'linkedin', 'instagram']
    }
  },
  {
    agent: 'seo_agent',
    taskType: 'analyze_site',
    description: 'Analyze website SEO performance',
    defaultParams: {
      url: 'https://your-hemp-site.com',
      include_pages: 10
    }
  },
  {
    agent: 'seo_agent',
    taskType: 'research_keywords',
    description: 'Research keywords for hemp products',
    defaultParams: {
      seed_keywords: ['industrial hemp', 'hemp fiber', 'hemp oil'],
      product_focus: 'general'
    }
  },
  {
    agent: 'outreach_agent',
    taskType: 'find_partnerships',
    description: 'Find partnership opportunities',
    defaultParams: {
      industry: 'Hemp Textiles',
      opportunity_type: 'partnership',
      limit: 20
    }
  },
  {
    agent: 'monetization_agent',
    taskType: 'analyze_opportunities',
    description: 'Analyze monetization opportunities',
    defaultParams: {
      focus_areas: ['Hemp Textiles', 'Hemp Construction', 'Hemp Foods']
    }
  },
  {
    agent: 'monetization_agent',
    taskType: 'identify_gaps',
    description: 'Identify market gaps',
    defaultParams: {
      categories: ['Textiles', 'Construction', 'Food & Beverages']
    }
  },
  {
    agent: 'compliance_agent',
    taskType: 'check_compliance',
    description: 'Check regulatory compliance',
    defaultParams: {
      product_id: 'hemp-product-001',
      jurisdictions: ['US', 'EU', 'Canada']
    }
  }
];

export const AgentTaskCreator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<TaskTemplate | null>(null);
  const [taskParams, setTaskParams] = useState('{}');
  const [priority, setPriority] = useState('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleTemplateSelect = (templateIndex: string) => {
    const template = taskTemplates[parseInt(templateIndex)];
    setSelectedTemplate(template);
    setTaskParams(JSON.stringify(template.defaultParams, null, 2));
  };

  const handleSubmit = async () => {
    if (!selectedTemplate) {
      toast({
        title: 'Error',
        description: 'Please select a task template',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Parse params to validate JSON
      let params;
      try {
        params = JSON.parse(taskParams);
      } catch (e) {
        throw new Error('Invalid JSON in parameters');
      }

      // Create task in database
      const task = {
        agent_type: selectedTemplate.agent,
        task_type: selectedTemplate.taskType,
        status: 'pending',
        priority,
        params,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .table('agent_task_queue')
        .insert(task)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Task Created',
        description: `Task ${data.task_id} has been queued for ${selectedTemplate.agent}`,
      });

      // Reset form
      setSelectedTemplate(null);
      setTaskParams('{}');
      setPriority('medium');

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create task',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const runQuickTest = async (agent: string) => {
    const quickTests: Record<string, any> = {
      research_agent: {
        agent_type: 'research_agent',
        task_type: 'discover_products',
        params: { sources: ['https://www.leafly.com/news/hemp'], limit: 3 }
      },
      content_agent: {
        agent_type: 'content_agent',
        task_type: 'generate_blog_post',
        params: { topic: 'Hemp Innovation 2025', keywords: ['hemp', 'innovation'], word_count: 500 }
      },
      seo_agent: {
        agent_type: 'seo_agent',
        task_type: 'research_keywords',
        params: { seed_keywords: ['hemp products'], product_focus: 'general' }
      },
      outreach_agent: {
        agent_type: 'outreach_agent',
        task_type: 'find_partnerships',
        params: { industry: 'Hemp', opportunity_type: 'partnership', limit: 5 }
      },
      monetization_agent: {
        agent_type: 'monetization_agent',
        task_type: 'identify_gaps',
        params: { categories: ['Textiles'] }
      },
      compliance_agent: {
        agent_type: 'compliance_agent',
        task_type: 'check_compliance',
        params: { product_id: 'test-001', jurisdictions: ['US'] }
      }
    };

    const test = quickTests[agent];
    if (!test) return;

    try {
      setIsSubmitting(true);
      
      const task = {
        ...test,
        status: 'pending',
        priority: 'high',
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .table('agent_task_queue')
        .insert(task)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Quick Test Started',
        description: `Task ${data.task_id} created for ${agent}`,
      });

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create test task',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Test Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Agent Tests</CardTitle>
          <CardDescription>Run a quick test task for each agent</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['research_agent', 'content_agent', 'seo_agent', 'outreach_agent', 'monetization_agent', 'compliance_agent'].map((agent) => (
              <Button
                key={agent}
                variant="outline"
                size="sm"
                onClick={() => runQuickTest(agent)}
                disabled={isSubmitting}
              >
                <PlayCircle className="h-4 w-4 mr-1" />
                {agent.replace('_agent', '').charAt(0).toUpperCase() + agent.replace('_agent', '').slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Task Creator */}
      <Card>
        <CardHeader>
          <CardTitle>Create Agent Task</CardTitle>
          <CardDescription>Create a new task for an AI agent to process</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="template">Task Template</Label>
            <Select onValueChange={handleTemplateSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a task template" />
              </SelectTrigger>
              <SelectContent>
                {taskTemplates.map((template, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    <div>
                      <div className="font-medium">
                        {template.agent.replace('_', ' ')} - {template.taskType.replace('_', ' ')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {template.description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTemplate && (
            <>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="params">Task Parameters (JSON)</Label>
                <Textarea
                  id="params"
                  value={taskParams}
                  onChange={(e) => setTaskParams(e.target.value)}
                  rows={10}
                  className="font-mono text-sm"
                  placeholder="{}"
                />
              </div>

              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Task...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Task
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};