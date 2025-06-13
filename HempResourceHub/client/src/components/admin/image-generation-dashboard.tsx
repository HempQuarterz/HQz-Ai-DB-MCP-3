import React, { useState } from 'react';
import {
  useImageGenerationStats,
  useImageGenerationQueue,
  useProviderStats,
  useProductsNeedingAttention,
  useRetryFailedGeneration,
  useCancelQueueItem,
  useQueueUpdates
} from '@/hooks/useImageGeneration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { 
  Image, 
  Clock, 
  DollarSign, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Trash2,
  TrendingUp,
  Activity,
  Package
} from 'lucide-react';
import { Link } from 'wouter';

const ImageGenerationDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  
  // Data hooks
  const { data: stats, isLoading: statsLoading } = useImageGenerationStats();
  const { data: queue, isLoading: queueLoading } = useImageGenerationQueue();
  const { data: providerStats, isLoading: providersLoading } = useProviderStats();
  const { data: needsAttention, isLoading: needsAttentionLoading } = useProductsNeedingAttention();
  
  // Mutation hooks
  const retryMutation = useRetryFailedGeneration();
  const cancelMutation = useCancelQueueItem();
  
  // Real-time updates
  useQueueUpdates((payload) => {
    if (payload.eventType === 'INSERT' && payload.new.status === 'completed') {
      toast({
        title: 'Image Generated',
        description: `Successfully generated image for ${payload.new.product_name || 'product'}`,
      });
    }
  });
  
  // Helper functions
  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; icon: React.ReactNode }> = {
      pending: { className: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50', icon: <Clock className="h-3 w-3" /> },
      processing: { className: 'bg-blue-500/20 text-blue-400 border border-blue-500/50', icon: <RefreshCw className="h-3 w-3 animate-spin" /> },
      completed: { className: 'bg-green-500/20 text-green-400 border border-green-500/50', icon: <CheckCircle className="h-3 w-3" /> },
      failed: { className: 'bg-red-500/20 text-red-400 border border-red-500/50', icon: <XCircle className="h-3 w-3" /> },
      retry: { className: 'bg-orange-500/20 text-orange-400 border border-orange-500/50', icon: <RefreshCw className="h-3 w-3" /> }
    };
    
    const variant = variants[status] || variants.pending;
    
    return (
      <Badge className={`${variant.className} flex items-center gap-1`}>
        {variant.icon}
        {status}
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
  
  const handleRetry = async (queueId: number) => {
    try {
      await retryMutation.mutateAsync(queueId);
      toast({
        title: 'Retry Queued',
        description: 'The image generation has been queued for retry.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to retry image generation.',
        variant: 'destructive',
      });
    }
  };
  
  const handleCancel = async (queueId: number) => {
    try {
      await cancelMutation.mutateAsync(queueId);
      toast({
        title: 'Cancelled',
        description: 'The queue item has been cancelled.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel queue item.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-3 w-20 mt-2" />
              </CardContent>
            </Card>
          ))
        ) : stats ? (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Queue Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_in_queue}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.processing_count} processing
                </p>
                <Progress 
                  value={stats.total_in_queue > 0 ? (stats.processing_count / stats.total_in_queue) * 100 : 0} 
                  className="mt-2 h-2"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Monthly Cost
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCost(stats.monthly_cost)}</div>
                <p className="text-xs text-muted-foreground">
                  Today: {formatCost(stats.daily_cost)}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Success Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(stats.success_rate * 100).toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  {stats.completed_count} completed
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Needs Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.products_without_images}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.products_with_placeholder} placeholders
                </p>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
      
      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="queue">Queue Monitor</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="attention">Needs Attention</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Provider Performance</CardTitle>
              <CardDescription>
                Comparison of image generation providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {providersLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Provider</TableHead>
                      <TableHead className="text-right">Generated</TableHead>
                      <TableHead className="text-right">Success Rate</TableHead>
                      <TableHead className="text-right">Avg Cost</TableHead>
                      <TableHead className="text-right">Avg Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {providerStats?.map((provider) => (
                      <TableRow key={provider.provider}>
                        <TableCell className="font-medium capitalize">
                          {provider.provider.replace('_', ' ')}
                        </TableCell>
                        <TableCell className="text-right">{provider.total_generated}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={provider.success_rate > 0.9 ? 'default' : 'secondary'}>
                            {(provider.success_rate * 100).toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{formatCost(provider.avg_cost)}</TableCell>
                        <TableCell className="text-right">
                          {provider.avg_processing_time?.toFixed(1)}s
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generation Queue</CardTitle>
              <CardDescription>
                Real-time monitoring of image generation tasks
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
                        <TableHead>Product</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Attempts</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {queue?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Link href={`/product/${item.hemp_product_id}`}>
                              <a className="text-primary hover:underline">
                                {item.product_name || `Product #${item.hemp_product_id}`}
                              </a>
                            </Link>
                          </TableCell>
                          <TableCell className="capitalize">
                            {item.provider.replace('_', ' ')}
                          </TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell>{item.attempts}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(item.created_at).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {item.status === 'failed' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRetry(item.id)}
                                  disabled={retryMutation.isPending}
                                >
                                  <RefreshCw className="h-3 w-3" />
                                </Button>
                              )}
                              {item.status === 'pending' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleCancel(item.id)}
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
        
        <TabsContent value="providers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {providersLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-5 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : (
              providerStats?.map((provider) => (
                <Card key={provider.provider}>
                  <CardHeader>
                    <CardTitle className="text-lg capitalize">
                      {provider.provider.replace('_', ' ')}
                    </CardTitle>
                    <CardDescription>
                      Last used: {provider.last_used ? new Date(provider.last_used).toLocaleDateString() : 'Never'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Generated</span>
                        <span className="font-medium">{provider.total_generated}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Success Rate</span>
                        <Badge variant={provider.success_rate > 0.9 ? 'default' : 'secondary'}>
                          {(provider.success_rate * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Cost</span>
                        <span className="font-medium">{formatCost(provider.total_cost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Avg Processing Time</span>
                        <span className="font-medium">{provider.avg_processing_time?.toFixed(1)}s</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="attention" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Products Needing Attention</CardTitle>
              <CardDescription>
                Products without images or with generation issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              {needsAttentionLoading ? (
                <Skeleton className="h-96 w-full" />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Plant Part</TableHead>
                        <TableHead>Industry</TableHead>
                        <TableHead>Issue</TableHead>
                        <TableHead>Last Attempt</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {needsAttention?.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <Link href={`/product/${product.id}`}>
                              <a className="text-primary hover:underline">
                                {product.name}
                              </a>
                            </Link>
                          </TableCell>
                          <TableCell>{product.plant_part_name}</TableCell>
                          <TableCell>{product.industry_name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize">
                              {product.issue_type.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {product.last_attempt 
                              ? new Date(product.last_attempt).toLocaleDateString()
                              : 'Never'
                            }
                          </TableCell>
                          <TableCell>
                            <Link href={`/product/${product.id}`}>
                              <Button size="sm" variant="outline">
                                <Image className="h-3 w-3 mr-1" />
                                Manage
                              </Button>
                            </Link>
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
      </Tabs>
    </div>
  );
};

export default ImageGenerationDashboard;
