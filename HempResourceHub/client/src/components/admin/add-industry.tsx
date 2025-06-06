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
    <Card className="w-full max-w-2xl mx-auto mt-6" data-oid="9l9zojb">
      <CardHeader data-oid="ez7gm:_">
        <CardTitle data-oid="vb04bpe">Add New Industry</CardTitle>
        <CardDescription data-oid="5p_ccc5">
          Create a new industry category for hemp applications
        </CardDescription>
      </CardHeader>
      <CardContent data-oid="ovtw2-p">
        <Form {...form} data-oid="lkejkg4">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            data-oid="h6dtt2p"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem data-oid="lmbi4l3">
                  <FormLabel data-oid="yi1fmjz">Industry Name</FormLabel>
                  <FormControl data-oid="-.qutq7">
                    <Input
                      placeholder="Enter industry name"
                      {...field}
                      data-oid="_703wvb"
                    />
                  </FormControl>
                  <FormDescription data-oid="sbrz0c2">
                    The name of the industry (e.g., "Textiles", "Construction",
                    "Food")
                  </FormDescription>
                  <FormMessage data-oid="-oszj9b" />
                </FormItem>
              )}
              data-oid="k591lh6"
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem data-oid="yvsb7.a">
                  <FormLabel data-oid="c4nmjjw">Description</FormLabel>
                  <FormControl data-oid="j2wl1y9">
                    <Textarea
                      placeholder="Enter a detailed description of this industry"
                      className="min-h-32"
                      {...field}
                      value={field.value || ""}
                      data-oid="vmirgvi"
                    />
                  </FormControl>
                  <FormMessage data-oid="in-f5wt" />
                </FormItem>
              )}
              data-oid="19mcgm3"
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem data-oid="9b5fvo_">
                  <FormLabel data-oid="nbq9n65">Image URL</FormLabel>
                  <FormControl data-oid="kkn.och">
                    <Input
                      placeholder="Enter image URL (optional)"
                      {...field}
                      data-oid=":zkv3lj"
                    />
                  </FormControl>
                  <FormMessage data-oid="g.gn_8g" />
                </FormItem>
              )}
              data-oid="vrko09u"
            />

            <Button type="submit" disabled={isSubmitting} data-oid="zjehska">
              {isSubmitting ? "Adding..." : "Add Industry"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
