import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { insertPlantTypeSchema } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

// Create a form schema based on the insert schema
const formSchema = insertPlantTypeSchema.extend({
  imageUrl: z.string().optional(),
  plantingDensity: z.string().optional(),
  characteristics: z.string().optional(),
});

export default function AddPlantTypeForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      plantingDensity: "",
      characteristics: "",
    },
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      // Send the data to the server
      const response = await fetch("/api/plant-types", {
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
        title: "Plant Type Added!",
        description: `Successfully added ${values.name} to the database.`,
        variant: "default",
      });

      // Reset form
      form.reset();

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["/api/plant-types"] });
    } catch (error) {
      console.error("Error adding plant type:", error);

      // Show error message
      toast({
        title: "Error Adding Plant Type",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-6" data-oid="c4kfj.3">
      <CardHeader data-oid="mcvmduq">
        <CardTitle data-oid="6g9a2gm">Add New Plant Type</CardTitle>
        <CardDescription data-oid="e:jwk97">
          Create a new hemp plant type in the database
        </CardDescription>
      </CardHeader>
      <CardContent data-oid="c66ryhr">
        <Form {...form} data-oid="yczm_y1">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            data-oid="-0q:1dv"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem data-oid=".rg1icu">
                  <FormLabel data-oid="vd:zj74">Name</FormLabel>
                  <FormControl data-oid="tic0dti">
                    <Input
                      placeholder="Enter plant type name"
                      {...field}
                      data-oid=".klkp3j"
                    />
                  </FormControl>
                  <FormDescription data-oid="fu93l-t">
                    The name of the hemp plant type (e.g., "Fiber Hemp")
                  </FormDescription>
                  <FormMessage data-oid="aipwx4f" />
                </FormItem>
              )}
              data-oid="ga134xo"
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem data-oid="vjfrzf9">
                  <FormLabel data-oid="6o_fg5i">Description</FormLabel>
                  <FormControl data-oid="yh185c:">
                    <Textarea
                      placeholder="Enter a detailed description of this plant type"
                      className="min-h-32"
                      {...field}
                      value={field.value || ""}
                      data-oid="ozsk3hk"
                    />
                  </FormControl>
                  <FormMessage data-oid="h1n12oz" />
                </FormItem>
              )}
              data-oid=".j.p_9k"
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem data-oid="tdg684k">
                  <FormLabel data-oid="ak5asug">Image URL</FormLabel>
                  <FormControl data-oid="q5t.1op">
                    <Input
                      placeholder="Enter image URL (optional)"
                      {...field}
                      data-oid="caljj7s"
                    />
                  </FormControl>
                  <FormMessage data-oid="dsj4500" />
                </FormItem>
              )}
              data-oid="hkn2y8k"
            />

            <FormField
              control={form.control}
              name="plantingDensity"
              render={({ field }) => (
                <FormItem data-oid="4vd0:ql">
                  <FormLabel data-oid="_s7.nqw">Planting Density</FormLabel>
                  <FormControl data-oid="bfvl0j0">
                    <Input
                      placeholder="Enter planting density (optional)"
                      {...field}
                      data-oid="-x.q65d"
                    />
                  </FormControl>
                  <FormMessage data-oid=":e0bbf8" />
                </FormItem>
              )}
              data-oid="yg3tyux"
            />

            <FormField
              control={form.control}
              name="characteristics"
              render={({ field }) => (
                <FormItem data-oid="5wh7nh_">
                  <FormLabel data-oid="1rp_i6-">Characteristics</FormLabel>
                  <FormControl data-oid="j7wzvjk">
                    <Textarea
                      placeholder="Enter characteristics (optional)"
                      className="min-h-24"
                      {...field}
                      data-oid="d6s_irj"
                    />
                  </FormControl>
                  <FormMessage data-oid="4n.j3f9" />
                </FormItem>
              )}
              data-oid="y7sgnxm"
            />

            <Button type="submit" disabled={isSubmitting} data-oid="kzu15.k">
              {isSubmitting ? "Adding..." : "Add Plant Type"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
