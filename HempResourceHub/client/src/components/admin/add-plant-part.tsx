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
    <Card className="w-full max-w-2xl mx-auto mt-6" data-oid="awulb3y">
      <CardHeader data-oid="r_hobbo">
        <CardTitle data-oid="sqllvz5">Add New Plant Part</CardTitle>
        <CardDescription data-oid="uii0p46">
          Create a new hemp plant part in the database
        </CardDescription>
      </CardHeader>
      <CardContent data-oid="0pp2.d:">
        <Form {...form} data-oid="4r_rgaf">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            data-oid="f0nbka0"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem data-oid="ol24buu">
                  <FormLabel data-oid="gx9_vyf">Name</FormLabel>
                  <FormControl data-oid="p.v5xzs">
                    <Input
                      placeholder="Enter plant part name"
                      {...field}
                      data-oid="t8k2byw"
                    />
                  </FormControl>
                  <FormDescription data-oid="rivbv:4">
                    The name of the hemp plant part (e.g., "Seeds", "Stalk",
                    "Flower")
                  </FormDescription>
                  <FormMessage data-oid="tsrj8nk" />
                </FormItem>
              )}
              data-oid="u5m.k6p"
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem data-oid="wc3zno9">
                  <FormLabel data-oid="-k_22vo">Description</FormLabel>
                  <FormControl data-oid="oz7grf7">
                    <Textarea
                      placeholder="Enter a detailed description of this plant part"
                      className="min-h-32"
                      {...field}
                      value={field.value || ""}
                      data-oid=".:_kcq1"
                    />
                  </FormControl>
                  <FormMessage data-oid="i7t0-qa" />
                </FormItem>
              )}
              data-oid="7on1csr"
            />

            <FormField
              control={form.control}
              name="plantTypeId"
              render={({ field }) => (
                <FormItem data-oid="7q8-vhw">
                  <FormLabel data-oid="m_1-0m_">Plant Type</FormLabel>
                  <FormControl data-oid="d8fue_c">
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value.toString()}
                      data-oid="38:0l8c"
                    >
                      <SelectTrigger data-oid="byc5jsx">
                        <SelectValue
                          placeholder="Select a plant type"
                          data-oid="w6pq2.j"
                        />
                      </SelectTrigger>
                      <SelectContent data-oid="v7lo3gh">
                        {plantTypes.map((type) => (
                          <SelectItem
                            key={type.id}
                            value={type.id.toString()}
                            data-oid="zvjdwl4"
                          >
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription data-oid="9sehm3:">
                    The type of hemp plant this part belongs to
                  </FormDescription>
                  <FormMessage data-oid="xc38g9c" />
                </FormItem>
              )}
              data-oid="z_vve84"
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem data-oid="6nq5033">
                  <FormLabel data-oid="l20th3:">Image URL</FormLabel>
                  <FormControl data-oid="s5:l3_r">
                    <Input
                      placeholder="Enter image URL (optional)"
                      {...field}
                      data-oid="tgi1ewa"
                    />
                  </FormControl>
                  <FormMessage data-oid="dk0khc6" />
                </FormItem>
              )}
              data-oid="a7h4cfh"
            />

            <Button type="submit" disabled={isSubmitting} data-oid="7cv-m9h">
              {isSubmitting ? "Adding..." : "Add Plant Part"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
