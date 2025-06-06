import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { insertPlantPartSchema } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Create a form schema based on the insert schema
const formSchema = insertPlantPartSchema.extend({
  imageUrl: z.string().optional(),
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
      name: "",
      description: "",
      plantTypeId: 0,
      imageUrl: "",
    },
  });

  // Fetch plant types for the dropdown
  useEffect(() => {
    const fetchPlantTypes = async () => {
      try {
        const response = await fetch("/api/plant-types");
        if (!response.ok) {
          throw new Error("Failed to fetch plant types");
        }
        const data = await response.json();
        setPlantTypes(data);
      } catch (error) {
        console.error("Error fetching plant types:", error);
      }
    };

    fetchPlantTypes();
  }, []);

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      // Send the data to the server
      const response = await fetch("/api/plant-parts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      // Show success message
      toast({
        title: "Plant Part Added!",
        description: `Successfully added ${values.name} to the database.`,
        variant: "default",
      });

      // Reset form
      form.reset();

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["/api/plant-parts"] });
    } catch (error) {
      console.error("Error adding plant part:", error);

      // Show error message
      toast({
        title: "Error Adding Plant Part",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-6" data-oid="jqb4-jo">
      <CardHeader data-oid="_8u5li:">
        <CardTitle data-oid="cxomvvs">Add New Plant Part</CardTitle>
        <CardDescription data-oid="g56oili">
          Create a new hemp plant part in the database
        </CardDescription>
      </CardHeader>
      <CardContent data-oid="bb32dz7">
        <Form {...form} data-oid="a4a_wjj">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            data-oid="_c5jh2r"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem data-oid="noqedm9">
                  <FormLabel data-oid="2sm..9c">Name</FormLabel>
                  <FormControl data-oid="74tlrs9">
                    <Input
                      placeholder="Enter plant part name"
                      {...field}
                      data-oid="8mbxq6o"
                    />
                  </FormControl>
                  <FormDescription data-oid="4usagjs">
                    The name of the hemp plant part (e.g., "Seeds", "Stalk",
                    "Flower")
                  </FormDescription>
                  <FormMessage data-oid="-rspa6i" />
                </FormItem>
              )}
              data-oid="uhqvfox"
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem data-oid="x500v9y">
                  <FormLabel data-oid="kiyjml6">Description</FormLabel>
                  <FormControl data-oid="nykt1xo">
                    <Textarea
                      placeholder="Enter a detailed description of this plant part"
                      className="min-h-32"
                      {...field}
                      value={field.value || ""}
                      data-oid="48h11pb"
                    />
                  </FormControl>
                  <FormMessage data-oid="2xcw-qr" />
                </FormItem>
              )}
              data-oid="a-30469"
            />

            <FormField
              control={form.control}
              name="plantTypeId"
              render={({ field }) => (
                <FormItem data-oid="4gx8tc4">
                  <FormLabel data-oid="qjjfn:g">Plant Type</FormLabel>
                  <FormControl data-oid="5nrqiwd">
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value.toString()}
                      data-oid="6zqk54_"
                    >
                      <SelectTrigger data-oid="j38vtqu">
                        <SelectValue
                          placeholder="Select a plant type"
                          data-oid="t-7:ivk"
                        />
                      </SelectTrigger>
                      <SelectContent data-oid="5hpkrhn">
                        {plantTypes.map((type) => (
                          <SelectItem
                            key={type.id}
                            value={type.id.toString()}
                            data-oid="p1f15nm"
                          >
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription data-oid="ovuj0zg">
                    The type of hemp plant this part belongs to
                  </FormDescription>
                  <FormMessage data-oid="0dg3pno" />
                </FormItem>
              )}
              data-oid="6r5nt7b"
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem data-oid=".wsjgfx">
                  <FormLabel data-oid="uktrra4">Image URL</FormLabel>
                  <FormControl data-oid="l7yg-oa">
                    <Input
                      placeholder="Enter image URL (optional)"
                      {...field}
                      data-oid="8ynh3k1"
                    />
                  </FormControl>
                  <FormMessage data-oid="jbb2b90" />
                </FormItem>
              )}
              data-oid="0cdnir4"
            />

            <Button type="submit" disabled={isSubmitting} data-oid="rd.7zja">
              {isSubmitting ? "Adding..." : "Add Plant Part"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
