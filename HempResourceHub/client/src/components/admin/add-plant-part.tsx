import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { insertPlantPartSchema } from '@shared/schema';
import { queryClient } from '@/lib/queryClient';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

// Create a form schema based on the insert schema
const formSchema = insertPlantPartSchema.extend({
  imageUrl: z.string().optional()
});

interface PlantType {
  id: number;
  name: string;
}

export default function AddPlantPartForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [plantTypes, setPlantTypes] = useState<PlantType[]>([]);
  const { toast } = useToast();
  
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      plantTypeId: 0,
      imageUrl: ''
    }
  });
  
  // Fetch plant types for the dropdown
  useEffect(() => {
    const fetchPlantTypes = async () => {
      try {
        const response = await fetch('/api/plant-types');
        if (!response.ok) {
          throw new Error('Failed to fetch plant types');
        }
        const data = await response.json();
        setPlantTypes(data);
      } catch (error) {
        console.error('Error fetching plant types:', error);
      }
    };
    
    fetchPlantTypes();
  }, []);
  
  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      // Send the data to the server
      const response = await fetch('/api/plant-parts', {
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
        title: 'Plant Part Added!',
        description: `Successfully added ${values.name} to the database.`,
        variant: 'default'
      });
      
      // Reset form
      form.reset();
      
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/plant-parts'] });
      
    } catch (error) {
      console.error('Error adding plant part:', error);
      
      // Show error message
      toast({
        title: 'Error Adding Plant Part',
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
        <CardTitle>Add New Plant Part</CardTitle>
        <CardDescription>
          Create a new hemp plant part in the database
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
                    <Input placeholder="Enter plant part name" {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of the hemp plant part (e.g., "Seeds", "Stalk", "Flower")
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
                      placeholder="Enter a detailed description of this plant part"
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
              name="plantTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plant Type</FormLabel>
                  <FormControl>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      defaultValue={field.value.toString()}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a plant type" />
                      </SelectTrigger>
                      <SelectContent>
                        {plantTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    The type of hemp plant this part belongs to
                  </FormDescription>
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
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Plant Part'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}