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
import { insertSubIndustrySchema } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Create a form schema based on the insert schema
const formSchema = insertSubIndustrySchema.extend({
  imageUrl: z.string().optional(),
});

interface Industry {
  id: number;
  name: string;
}

export default function AddSubIndustryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const { toast } = useToast();

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      industryId: 0,
      imageUrl: "",
    },
  });

  // Fetch industries for the dropdown
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await fetch("/api/industries");
        if (!response.ok) {
          throw new Error("Failed to fetch industries");
        }
        const data = await response.json();
        setIndustries(data);
      } catch (error) {
        console.error("Error fetching industries:", error);
      }
    };

    fetchIndustries();
  }, []);

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      // Send the data to the server
      const response = await fetch("/api/sub-industries", {
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
        title: "Sub-Industry Added!",
        description: `Successfully added ${values.name} to the database.`,
        variant: "default",
      });

      // Reset form
      form.reset();

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["/api/sub-industries"] });
    } catch (error) {
      console.error("Error adding sub-industry:", error);

      // Show error message
      toast({
        title: "Error Adding Sub-Industry",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-6" data-oid="yva:_d9">
      <CardHeader data-oid="5:nw5d0">
        <CardTitle data-oid="e56-gj6">Add New Sub-Industry</CardTitle>
        <CardDescription data-oid="pj.xeiy">
          Create a new sub-industry category for more specific hemp applications
        </CardDescription>
      </CardHeader>
      <CardContent data-oid="0jn00dk">
        <Form {...form} data-oid="us.rb4l">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            data-oid="so-lf9u"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem data-oid="bw73lnw">
                  <FormLabel data-oid="p4kz:pq">Sub-Industry Name</FormLabel>
                  <FormControl data-oid="89qff_z">
                    <Input
                      placeholder="Enter sub-industry name"
                      {...field}
                      data-oid="qnsiiss"
                    />
                  </FormControl>
                  <FormDescription data-oid="jx17teg">
                    The name of the sub-industry (e.g., "Clothing", "Rope",
                    "Insulation")
                  </FormDescription>
                  <FormMessage data-oid="vf3lhjk" />
                </FormItem>
              )}
              data-oid="f3lpz8n"
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem data-oid="61ggqmh">
                  <FormLabel data-oid="1us59a8">Description</FormLabel>
                  <FormControl data-oid="wozuz54">
                    <Textarea
                      placeholder="Enter a detailed description of this sub-industry"
                      className="min-h-32"
                      {...field}
                      value={field.value || ""}
                      data-oid="d3kukt."
                    />
                  </FormControl>
                  <FormMessage data-oid="s_buezm" />
                </FormItem>
              )}
              data-oid="7nn847s"
            />

            <FormField
              control={form.control}
              name="industryId"
              render={({ field }) => (
                <FormItem data-oid="w839ok5">
                  <FormLabel data-oid="wp06o7j">Parent Industry</FormLabel>
                  <FormControl data-oid="yrw_diu">
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value.toString()}
                      data-oid="qbchfno"
                    >
                      <SelectTrigger data-oid="3qxe-an">
                        <SelectValue
                          placeholder="Select an industry"
                          data-oid=":pl9b4s"
                        />
                      </SelectTrigger>
                      <SelectContent data-oid="ks6fmxr">
                        {industries.map((industry) => (
                          <SelectItem
                            key={industry.id}
                            value={industry.id.toString()}
                            data-oid="8:u-1do"
                          >
                            {industry.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription data-oid="re--9xv">
                    The main industry this sub-industry belongs to
                  </FormDescription>
                  <FormMessage data-oid="lk4qk_d" />
                </FormItem>
              )}
              data-oid="l2_fl.s"
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem data-oid="l1da_ic">
                  <FormLabel data-oid="pbzgi:2">Image URL</FormLabel>
                  <FormControl data-oid="cht449z">
                    <Input
                      placeholder="Enter image URL (optional)"
                      {...field}
                      data-oid="n1k10_."
                    />
                  </FormControl>
                  <FormMessage data-oid="j55fvx6" />
                </FormItem>
              )}
              data-oid="0ap99x6"
            />

            <Button type="submit" disabled={isSubmitting} data-oid="ganu654">
              {isSubmitting ? "Adding..." : "Add Sub-Industry"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
