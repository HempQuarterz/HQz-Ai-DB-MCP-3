import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { insertPlantTypeSchema } from '@shared/schema';
import { queryClient } from '@/lib/queryClient';

// Create a form schema based on the insert schema
const formSchema = insertPlantTypeSchema.extend({
  imageUrl: z.string().optional(),
  plantingDensity: z.string().optional(),
  characteristics: z.string().optional()
});

export default function AddPlantTypeForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      imageUrl: '',
      plantingDensity: '',
      characteristics: ''
    }
  });
  
  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      // Send the data to the server
      const response = await fetch('/api/plant-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Show success message
      toast({
        title: 'Plant Type Added!',
        description: `Successfully added ${values.name} to the database.`,
        variant: 'default'
      });
      
      // Reset form
      form.reset();
      
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/plant-types'] });
      
    } catch (error) {
      console.error('Error adding plant type:', error);
      
      // Show error message
      toast({
        title: 'Error Adding Plant Type',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <Card className="w-full max-w-2xl mx-auto mt-6">
      <CardHeader>
        <CardTitle>Add New Plant Type</CardTitle>
        <CardDescription>
          Create a new hemp plant type in the database
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter plant type name" {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of the hemp plant type (e.g., "Fiber Hemp")
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter a detailed description of this plant type"
                      className="min-h-32"
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter image URL (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="plantingDensity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Planting Density</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter planting density (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="characteristics"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Characteristics</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter characteristics (optional)"
                      className="min-h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Plant Type'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}