import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DebugSupabase = () => {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runTests = async () => {
      const testResults: any = {};

      // Test 1: Check environment variables
      testResults.env = {
        url: import.meta.env.VITE_SUPABASE_URL ? "Set" : "Missing",
        key: import.meta.env.VITE_SUPABASE_ANON_KEY ? "Set" : "Missing",
        allKeys: Object.keys(import.meta.env),
      };

      // Test 2: Try plant_types table (old name - should fail)
      try {
        const { data, error } = await supabase
          .from("plant_types")
          .select("*")
          .limit(5);
        testResults.plant_types_old = { data, error };
      } catch (e) {
        testResults.plant_types_old = { error: e };
      }

      // Test 3: Try hemp_plant_archetypes table
      try {
        const { data, error } = await supabase
          .from("hemp_plant_archetypes")
          .select("*")
          .limit(5);
        testResults.hemp_plant_archetypes = { data, error };
      } catch (e) {
        testResults.hemp_plant_archetypes = { error: e };
      }

      // Test 4: Try uses_products count
      try {
        const { count, error } = await supabase
          .from("uses_products")
          .select("*", { count: "exact", head: true });
        testResults.uses_products_count = { count, error };
      } catch (e) {
        testResults.uses_products_count = { error: e };
      }

      // Test 5: Try uses_products count
      try {
        const { count, error } = await supabase
          .from("uses_products")
          .select("*", { count: "exact", head: true });
        testResults.uses_products_count = { count, error };
      } catch (e) {
        testResults.uses_products_count = { error: e };
      }

      // Test 6: List all tables
      try {
        const { data, error } = await supabase
          .from("information_schema.tables")
          .select("table_name")
          .eq("table_schema", "public");
        testResults.tables = { data, error };
      } catch (e) {
        testResults.tables = { error: e };
      }

      setResults(testResults);
      setLoading(false);
    };

    runTests();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Supabase Debug Page</h1>

      {loading ? (
        <p>Running tests...</p>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(results.env, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>plant_types Table Test</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(results.plant_types, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>hemp_plant_archetypes Table Test</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(results.hemp_plant_archetypes, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>uses_products Count</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(results.uses_products_count, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>uses_products Count</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(results.uses_products_count, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Tables</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(results.tables, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DebugSupabase;
