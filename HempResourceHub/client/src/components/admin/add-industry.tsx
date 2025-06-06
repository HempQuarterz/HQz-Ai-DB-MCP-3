import { useState } from "react";
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
import { insertIndustrySchema } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

// Create a form schema based on the insert schema
const formSchema = insertIndustrySchema.extend({
  imageUrl: z.string().optional(),
});

export default function AddIndustryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
    },
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      // Send the data to the server
      const response = await fetch("/api/industries", {
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
        title: "Industry Added!",
        description: `Successfully added ${values.name} to the database.`,
        variant: "default",
      });

      // Reset form
      form.reset();

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["/api/industries"] });
    } catch (error) {
      console.error("Error adding industry:", error);

      // Show error message
      toast({
        title: "Error Adding Industry",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-6" data-oid="5tsw-lo">
      <CardHeader data-oid="omk7zy-">
        <CardTitle data-oid="jvhwxv1">Add New Industry</CardTitle>
        <CardDescription data-oid="i7l0hab">
          Create a new industry category for hemp applications
        </CardDescription>
      </CardHeader>
      <CardContent data-oid="e76zj1-">
        <Form {...form} data-oid="i2rblv9">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            data-oid="fvdlha9"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem data-oid="kd305o0">
                  <FormLabel data-oid="dzd13hn">Industry Name</FormLabel>
                  <FormControl data-oid="rfoedo.">
                    <Input
                      placeholder="Enter industry name"
                      {...field}
                      data-oid="tdx:6_1"
                    />
                  </FormControl>
                  <FormDescription data-oid="g_e-ge2">
                    The name of the industry (e.g., "Textiles", "Construction",
                    "Food")
                  </FormDescription>
                  <FormMessage data-oid="6x0eicq" />
                </FormItem>
              )}
              data-oid="x4onsnv"
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem data-oid="h0vl75p">
                  <FormLabel data-oid="62a0lul">Description</FormLabel>
                  <FormControl data-oid="ctz4xld">
                    <Textarea
                      placeholder="Enter a detailed description of this industry"
                      className="min-h-32"
                      {...field}
                      value={field.value || ""}
                      data-oid="3krjgve"
                    />
                  </FormControl>
                  <FormMessage data-oid="_p8v.70" />
                </FormItem>
              )}
              data-oid="zb873ae"
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem data-oid="eb9oq0d">
                  <FormLabel data-oid="czlpywy">Image URL</FormLabel>
                  <FormControl data-oid="-7l7:0n">
                    <Input
                      placeholder="Enter image URL (optional)"
                      {...field}
                      data-oid="9u0udcs"
                    />
                  </FormControl>
                  <FormMessage data-oid="jg:dycq" />
                </FormItem>
              )}
              data-oid="_fmc.8e"
            />

            <Button type="submit" disabled={isSubmitting} data-oid="1s5b:e5">
              {isSubmitting ? "Adding..." : "Add Industry"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
