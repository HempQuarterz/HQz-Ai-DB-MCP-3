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
    <Card className="w-full max-w-2xl mx-auto mt-6" data-oid="sv7_fsm">
      <CardHeader data-oid="1lcnyvj">
        <CardTitle data-oid="39.jmvu">Add New Plant Type</CardTitle>
        <CardDescription data-oid="cghhpgw">
          Create a new hemp plant type in the database
        </CardDescription>
      </CardHeader>
      <CardContent data-oid="mhj0xom">
        <Form {...form} data-oid="d0gl12g">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            data-oid="igokf.i"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem data-oid="emup5ch">
                  <FormLabel data-oid="1vya52b">Name</FormLabel>
                  <FormControl data-oid="rptaq-9">
                    <Input
                      placeholder="Enter plant type name"
                      {...field}
                      data-oid="a684-nt"
                    />
                  </FormControl>
                  <FormDescription data-oid="389-qlx">
                    The name of the hemp plant type (e.g., "Fiber Hemp")
                  </FormDescription>
                  <FormMessage data-oid="6ng-rr8" />
                </FormItem>
              )}
              data-oid="2-7hb:t"
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem data-oid="1kmoi2e">
                  <FormLabel data-oid="y8pcne2">Description</FormLabel>
                  <FormControl data-oid="cbr:oa2">
                    <Textarea
                      placeholder="Enter a detailed description of this plant type"
                      className="min-h-32"
                      {...field}
                      value={field.value || ""}
                      data-oid="pkixf_p"
                    />
                  </FormControl>
                  <FormMessage data-oid="3g2nh:f" />
                </FormItem>
              )}
              data-oid="nlxwgk9"
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem data-oid="jq8:s.4">
                  <FormLabel data-oid="43xg2vf">Image URL</FormLabel>
                  <FormControl data-oid="8jh493s">
                    <Input
                      placeholder="Enter image URL (optional)"
                      {...field}
                      data-oid="hn_mtiy"
                    />
                  </FormControl>
                  <FormMessage data-oid="q0ftagk" />
                </FormItem>
              )}
              data-oid="9_y4os8"
            />

            <FormField
              control={form.control}
              name="plantingDensity"
              render={({ field }) => (
                <FormItem data-oid="_764u_4">
                  <FormLabel data-oid="f9lsigi">Planting Density</FormLabel>
                  <FormControl data-oid="55qh-b3">
                    <Input
                      placeholder="Enter planting density (optional)"
                      {...field}
                      data-oid="hypzq21"
                    />
                  </FormControl>
                  <FormMessage data-oid=".sxg6mt" />
                </FormItem>
              )}
              data-oid="rbtp6zs"
            />

            <FormField
              control={form.control}
              name="characteristics"
              render={({ field }) => (
                <FormItem data-oid="nepqz1v">
                  <FormLabel data-oid="642o6nm">Characteristics</FormLabel>
                  <FormControl data-oid="ri-4072">
                    <Textarea
                      placeholder="Enter characteristics (optional)"
                      className="min-h-24"
                      {...field}
                      data-oid="v04y..d"
                    />
                  </FormControl>
                  <FormMessage data-oid=":e57-hk" />
                </FormItem>
              )}
              data-oid="ce7469u"
            />

            <Button type="submit" disabled={isSubmitting} data-oid="i:pt.2d">
              {isSubmitting ? "Adding..." : "Add Plant Type"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
