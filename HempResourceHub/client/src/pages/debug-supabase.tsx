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

      // Test 2: Try plant_types table
      try {
        const { data, error } = await supabase
          .from("plant_types")
          .select("*")
          .limit(5);
        testResults.plant_types = { data, error };
      } catch (e) {
        testResults.plant_types = { error: e };
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

      // Test 4: Try hemp_products count
      try {
        const { count, error } = await supabase
          .from("hemp_products")
          .select("*", { count: "exact", head: true });
        testResults.hemp_products_count = { count, error };
      } catch (e) {
        testResults.hemp_products_count = { error: e };
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
    <div className="container mx-auto p-4" data-oid="cbglnmr">
      <h1 className="text-2xl font-bold mb-4" data-oid="-xnqr5k">
        Supabase Debug Page
      </h1>

      {loading ? (
        <p data-oid="kyhnhqc">Running tests...</p>
      ) : (
        <div className="space-y-4" data-oid="ol7jy_d">
          <Card data-oid="lz:9ner">
            <CardHeader data-oid="ws9hh30">
              <CardTitle data-oid="rdfuvh6">Environment Variables</CardTitle>
            </CardHeader>
            <CardContent data-oid=".4hcfr1">
              <pre className="text-xs overflow-auto" data-oid="ez9kcwe">
                {JSON.stringify(results.env, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card data-oid="11vx1dr">
            <CardHeader data-oid="0a3:kwh">
              <CardTitle data-oid="a9pypf7">plant_types Table Test</CardTitle>
            </CardHeader>
            <CardContent data-oid="swfhw2n">
              <pre className="text-xs overflow-auto" data-oid="bvhoe66">
                {JSON.stringify(results.plant_types, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card data-oid="-kc-y2r">
            <CardHeader data-oid="m.lrusx">
              <CardTitle data-oid="k.nt1oy">
                hemp_plant_archetypes Table Test
              </CardTitle>
            </CardHeader>
            <CardContent data-oid="684aay9">
              <pre className="text-xs overflow-auto" data-oid="i4os.30">
                {JSON.stringify(results.hemp_plant_archetypes, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card data-oid="lex3.rt">
            <CardHeader data-oid=":6.tu5j">
              <CardTitle data-oid="b3-5ogk">hemp_products Count</CardTitle>
            </CardHeader>
            <CardContent data-oid="j7xr:.e">
              <pre className="text-xs overflow-auto" data-oid="-h9:z22">
                {JSON.stringify(results.hemp_products_count, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card data-oid="775k.ke">
            <CardHeader data-oid="236uczv">
              <CardTitle data-oid="xehbl.9">uses_products Count</CardTitle>
            </CardHeader>
            <CardContent data-oid=".yoc6--">
              <pre className="text-xs overflow-auto" data-oid="y72rspq">
                {JSON.stringify(results.uses_products_count, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card data-oid="5p7522-">
            <CardHeader data-oid=":aq7maw">
              <CardTitle data-oid="mgh:-v7">Available Tables</CardTitle>
            </CardHeader>
            <CardContent data-oid="ln36wrc">
              <pre className="text-xs overflow-auto" data-oid="61wm12.">
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
