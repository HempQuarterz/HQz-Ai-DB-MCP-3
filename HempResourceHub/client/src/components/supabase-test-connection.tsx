import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

export default function SupabaseTestConnection() {
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("Click to test Supabase connection");
  const [supabaseUrl, setSupabaseUrl] = useState<string | null>(null);
  const [supabaseKey, setSupabaseKey] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    // Get and display environment variables (safely)
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

    // Display partial information for debugging
    if (url) {
      setSupabaseUrl(
        typeof url === "string"
          ? `${url.substring(0, 15)}...`
          : "Invalid format",
      );
    } else {
      setSupabaseUrl("Not found");
    }

    if (key) {
      // Just show if it exists, not the actual value
      setSupabaseKey("Present (hidden)");
    } else {
      setSupabaseKey("Not found");
    }
  }, []);

  async function handleTestConnection() {
    setConnectionStatus("loading");
    setMessage("Testing Supabase connection...");
    setErrorDetails(null);

    try {
      // Get the credentials directly
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!url || !key) {
        setConnectionStatus("error");
        setMessage(
          "Missing Supabase credentials. Please check environment variables.",
        );
        return;
      }

      console.log(
        "Creating Supabase client with URL:",
        typeof url,
        url ? url.substring(0, 10) + "..." : "none",
      );

      // Create client directly in this component
      const supabase = createClient(url, key);

      // Test the connection
      const { data, error } = await supabase
        .from("plant_types")
        .select("count")
        .limit(1);

      if (error) {
        setConnectionStatus("error");
        setMessage(`Connection failed: ${error.message}`);
        setErrorDetails(JSON.stringify(error, null, 2));
      } else {
        setConnectionStatus("success");
        setMessage("Successfully connected to Supabase!");

        // Try to get a sample of data
        const { data: sampleData, error: sampleError } = await supabase
          .from("plant_types")
          .select("*")
          .limit(1);

        if (!sampleError && sampleData && sampleData.length > 0) {
          setErrorDetails(`Found data: ${JSON.stringify(sampleData, null, 2)}`);
        }
      }
    } catch (err) {
      setConnectionStatus("error");
      const errorMessage = err instanceof Error ? err.message : String(err);
      setMessage(`Error: ${errorMessage}`);
      setErrorDetails(
        err instanceof Error
          ? err.stack || "No stack trace"
          : "Unknown error type",
      );
      console.error("Supabase connection error:", err);
    }
  }

  async function testDirectFetch() {
    setConnectionStatus("loading");
    setMessage("Testing direct browser fetch to Supabase...");
    setErrorDetails(null);

    try {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!url) {
        setConnectionStatus("error");
        setMessage("No Supabase URL found in environment variables");
        return;
      }

      // Test if we can connect to the Supabase domain at all
      const testUrl = url.endsWith("/") ? url : `${url}/`;

      try {
        const response = await fetch(testUrl, {
          method: "HEAD",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          setConnectionStatus("success");
          setMessage(`Successfully reached ${testUrl}`);
        } else {
          setConnectionStatus("error");
          setMessage(
            `Failed to reach ${testUrl}: ${response.status} ${response.statusText}`,
          );
        }
      } catch (fetchErr) {
        setConnectionStatus("error");
        setMessage(`Network error reaching ${testUrl}`);
        setErrorDetails(
          fetchErr instanceof Error ? fetchErr.message : String(fetchErr),
        );
      }
    } catch (err) {
      setConnectionStatus("error");
      setMessage(`Error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "success":
        return (
          <CheckCircle className="h-6 w-6 text-green-600" data-oid="cqz3.b1" />
        );
      case "error":
        return (
          <AlertCircle className="h-6 w-6 text-red-600" data-oid="jscrkls" />
        );
      case "loading":
        return (
          <div
            className="h-6 w-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"
            data-oid="v43nyoq"
          />
        );

      default:
        return <Info className="h-6 w-6 text-blue-600" data-oid="4vaxq78" />;
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto mt-6" data-oid="qxj4itl">
      <CardHeader data-oid="gy4d_63">
        <CardTitle className="flex items-center gap-2" data-oid="kt2:ef0">
          <span data-oid="fel43tb">Supabase Connection Test</span>
          {connectionStatus !== "idle" && getStatusIcon()}
        </CardTitle>
      </CardHeader>
      <CardContent data-oid="0tuyxbs">
        <div className="space-y-4" data-oid="vtpke73">
          <Alert
            variant={
              supabaseUrl && supabaseUrl !== "Not found"
                ? "default"
                : "destructive"
            }
            data-oid=":dm3xit"
          >
            <AlertTitle data-oid="77rcqlo">Configuration</AlertTitle>
            <AlertDescription data-oid="mmms:lm">
              <div className="mt-2 space-y-2 text-sm" data-oid="tf1ds3d">
                <div data-oid="rq4eunr">
                  <strong data-oid="m9h1wnr">Supabase URL:</strong>{" "}
                  {supabaseUrl}
                </div>
                <div data-oid="l1guz.j">
                  <strong data-oid="8w6wlgt">Supabase Key:</strong>{" "}
                  {supabaseKey}
                </div>
              </div>
            </AlertDescription>
          </Alert>

          <Alert
            variant={
              connectionStatus === "success"
                ? "default"
                : connectionStatus === "error"
                  ? "destructive"
                  : "default"
            }
            data-oid="90xjxq7"
          >
            <AlertTitle data-oid="er3cab3">Connection Status</AlertTitle>
            <AlertDescription className="mt-2" data-oid="b_q_wqq">
              {message}
              {errorDetails && (
                <div
                  className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono whitespace-pre-wrap max-h-48 overflow-y-auto"
                  data-oid="fq3w-my"
                >
                  {errorDetails}
                </div>
              )}
            </AlertDescription>
          </Alert>

          <div
            className="flex flex-col gap-2 sm:flex-row sm:gap-4"
            data-oid="gyx:6dn"
          >
            <Button
              onClick={handleTestConnection}
              disabled={connectionStatus === "loading"}
              className="flex-1"
              data-oid="yi-k43z"
            >
              Test Supabase API
            </Button>

            <Button
              onClick={testDirectFetch}
              disabled={connectionStatus === "loading"}
              variant="outline"
              className="flex-1"
              data-oid="aiybb4k"
            >
              Test Connectivity
            </Button>
          </div>

          <div className="text-sm text-gray-500 mt-4" data-oid="5z.r7-g">
            <p data-oid="l13qzof">
              If you're seeing connection errors, here are some possible
              reasons:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1" data-oid="nb6ydlx">
              <li data-oid="2b2oo_7">Supabase URL or key might be incorrect</li>
              <li data-oid="l0xlmvg">CORS policies might be blocking access</li>
              <li data-oid="oo5sg4m">Network connectivity issues</li>
              <li data-oid="6leaqe8">
                The tables may not exist in your Supabase project
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
