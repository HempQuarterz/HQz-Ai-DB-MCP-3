import React, { useState } from 'react';
import {
  useProductImages,
  useRegenerateProductImage,
  useSetActiveImage,
  useProductImageUpdates,
  useImageComparisons
} from '@/hooks/useImageGeneration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Image as ImageIcon, 
  RefreshCw, 
  Check, 
  Clock,
  DollarSign,
  Zap,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface ProductImageManagementProps {
  productId: number;
  productName: string;
  currentImageUrl?: string | null;
}

const ProductImageManagement: React.FC<ProductImageManagementProps> = ({
  productId,
  productName,
  currentImageUrl
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>('dalle3');
  const { toast } = useToast();
  
  // Data hooks
  const { data: productImages, isLoading: imagesLoading } = useProductImages(productId);
  const { data: comparisons, isLoading: comparisonsLoading } = useImageComparisons(productId);
  
  // Mutation hooks
  const regenerateMutation = useRegenerateProductImage();
  const setActiveMutation = useSetActiveImage();
  
  // Real-time updates
  useProductImageUpdates(productId, (payload) => {
    if (payload.eventType === 'INSERT') {
      toast({
        title: 'New Image Generated',
        description: `A new image has been generated using ${payload.new.provider}`,
      });
      setIsDialogOpen(false);
    }
  });
  
  const handleRegenerate = async () => {
    try {
      await regenerateMutation.mutateAsync({
        productId,
        provider: selectedProvider
      });
      toast({
        title: 'Image Generation Started',
        description: `Generating new image using ${selectedProvider}. This may take a few moments.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start image generation.',
        variant: 'destructive',
      });
    }
  };
  
  const handleSetActive = async (imageId: number) => {
    try {
      await setActiveMutation.mutateAsync({
        productId,
        imageId
      });
      toast({
        title: 'Image Updated',
        description: 'The product image has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update product image.',
        variant: 'destructive',
      });
    }
  };
  
  const isPlaceholder = currentImageUrl?.includes('placeholder') || currentImageUrl?.includes('via.placeholder');
  
  const providerInfo = {
    dalle3: { name: 'DALL-E 3', icon: <Sparkles className="h-4 w-4" />, avgCost: 0.040 },
    midjourney: { name: 'Midjourney', icon: <Zap className="h-4 w-4" />, avgCost: 0.080 },
    stable_diffusion: { name: 'Stable Diffusion', icon: <ImageIcon className="h-4 w-4" />, avgCost: 0.002 },
    flux: { name: 'Flux', icon: <RefreshCw className="h-4 w-4" />, avgCost: 0.010 }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Image Management</CardTitle>
            <CardDescription>
              {isPlaceholder ? 'No custom image available' : 'Manage product images'}
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant={isPlaceholder ? 'default' : 'outline'} size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                {isPlaceholder ? 'Generate Image' : 'Regenerate'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Generate Product Image</DialogTitle>
                <DialogDescription>
                  Choose a provider to generate a new image for {productName}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Select Provider
                  </label>
                  <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(providerInfo).map(([key, info]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            {info.icon}
                            <span>{info.name}</span>
                            <span className="text-xs text-muted-foreground ml-auto">
                              ~${info.avgCost.toFixed(3)}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {comparisons && comparisons.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Provider Comparison</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(providerInfo).map(([key, info]) => {
                        const comparison = comparisons[0];
                        const providerData = comparison[key as keyof typeof comparison];
                        
                        if (!providerData || typeof providerData !== 'object') return null;
                        
                        return (
                          <div key={key} className="p-3 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              {info.icon}
                              <span className="font-medium text-sm">{info.name}</span>
                            </div>
                            {providerData.image_url ? (
                              <>
                                <img 
                                  src={providerData.image_url} 
                                  alt={`${info.name} preview`}
                                  className="w-full h-24 object-cover rounded mb-2"
                                />
                                <div className="text-xs space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Cost:</span>
                                    <span>${providerData.cost.toFixed(3)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Time:</span>
                                    <span>{providerData.generation_time}s</span>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="h-24 bg-muted rounded flex items-center justify-center">
                                <span className="text-xs text-muted-foreground">Not generated</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleRegenerate}
                    disabled={regenerateMutation.isPending}
                  >
                    {regenerateMutation.isPending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Generate Image
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        {imagesLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : productImages && productImages.length > 0 ? (
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">Current Image</TabsTrigger>
              <TabsTrigger value="history">History ({productImages.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="current" className="space-y-3">
              {currentImageUrl && !isPlaceholder ? (
                <div>
                  <img 
                    src={currentImageUrl} 
                    alt={productName}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="secondary" className="text-xs">
                      <Check className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                    {productImages.find(img => img.is_active) && (
                      <span className="text-xs text-muted-foreground">
                        Generated {new Date(productImages.find(img => img.is_active)!.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No custom image available</p>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="history" className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {productImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <img 
                      src={image.image_url} 
                      alt={`${productName} - ${image.provider}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      {!image.is_active && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleSetActive(image.id)}
                          disabled={setActiveMutation.isPending}
                        >
                          Set Active
                        </Button>
                      )}
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs capitalize">
                          {image.provider.replace('_', ' ')}
                        </Badge>
                        {image.is_active && (
                          <Badge variant="secondary" className="text-xs">
                            <Check className="h-3 w-3" />
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {image.cost ? `$${image.cost.toFixed(3)}` : 'N/A'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {image.generation_time_seconds}s
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-6">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No generated images yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Click "Generate Image" to create your first image
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductImageManagement;
