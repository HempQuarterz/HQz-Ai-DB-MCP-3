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
    <Card className="w-full max-w-2xl mx-auto mt-6" data-oid="cyqtqdg">
      <CardHeader data-oid="b3ofouz">
        <CardTitle data-oid="9sgj_mw">Add New Sub-Industry</CardTitle>
        <CardDescription data-oid="7aabyvu">
          Create a new sub-industry category for more specific hemp applications
        </CardDescription>
      </CardHeader>
      <CardContent data-oid="j0csqyc">
        <Form {...form} data-oid="cf04btl">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            data-oid="h9lb54p"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem data-oid="ow2klde">
                  <FormLabel data-oid="sxqu70h">Sub-Industry Name</FormLabel>
                  <FormControl data-oid="2rb14ao">
                    <Input
                      placeholder="Enter sub-industry name"
                      {...field}
                      data-oid=".kx_78a"
                    />
                  </FormControl>
                  <FormDescription data-oid="dso:8mg">
                    The name of the sub-industry (e.g., "Clothing", "Rope",
                    "Insulation")
                  </FormDescription>
                  <FormMessage data-oid="jppgpp:" />
                </FormItem>
              )}
              data-oid="r-v819n"
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem data-oid="l5n5_z9">
                  <FormLabel data-oid="7_2m5wu">Description</FormLabel>
                  <FormControl data-oid="qfvzhm6">
                    <Textarea
                      placeholder="Enter a detailed description of this sub-industry"
                      className="min-h-32"
                      {...field}
                      value={field.value || ""}
                      data-oid="s200nro"
                    />
                  </FormControl>
                  <FormMessage data-oid="sjcu6hq" />
                </FormItem>
              )}
              data-oid="f-p44zx"
            />

            <FormField
              control={form.control}
              name="industryId"
              render={({ field }) => (
                <FormItem data-oid="75xmdyb">
                  <FormLabel data-oid="-i-5047">Parent Industry</FormLabel>
                  <FormControl data-oid="mginlyu">
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value.toString()}
                      data-oid="4t7ritu"
                    >
                      <SelectTrigger data-oid="csq9tw0">
                        <SelectValue
                          placeholder="Select an industry"
                          data-oid="iqgalq9"
                        />
                      </SelectTrigger>
                      <SelectContent data-oid="nyr9.e9">
                        {industries.map((industry) => (
                          <SelectItem
                            key={industry.id}
                            value={industry.id.toString()}
                            data-oid="8id:k0q"
                          >
                            {industry.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription data-oid="g2:a.y_">
                    The main industry this sub-industry belongs to
                  </FormDescription>
                  <FormMessage data-oid="4krh126" />
                </FormItem>
              )}
              data-oid="aefo1v7"
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem data-oid="mq.aljw">
                  <FormLabel data-oid="7ons_lg">Image URL</FormLabel>
                  <FormControl data-oid="k.ffd0v">
                    <Input
                      placeholder="Enter image URL (optional)"
                      {...field}
                      data-oid="ez09sfo"
                    />
                  </FormControl>
                  <FormMessage data-oid="xdi1az5" />
                </FormItem>
              )}
              data-oid="0s6vt43"
            />

            <Button type="submit" disabled={isSubmitting} data-oid="xs1r5v7">
              {isSubmitting ? "Adding..." : "Add Sub-Industry"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
