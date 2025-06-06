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
          <CheckCircle className="h-6 w-6 text-green-600" data-oid="2.r391f" />
        );

      case "error":
        return (
          <AlertCircle className="h-6 w-6 text-red-600" data-oid="fnyq7::" />
        );

      case "loading":
        return (
          <div
            className="h-6 w-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"
            data-oid="otmw9ol"
          />
        );

      default:
        return <Info className="h-6 w-6 text-blue-600" data-oid="grl0sw." />;
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto mt-6" data-oid="fl7ixcf">
      <CardHeader data-oid="lcb8kf1">
        <CardTitle className="flex items-center gap-2" data-oid="nw80zed">
          <span data-oid="3g.a__q">Supabase Connection Test</span>
          {connectionStatus !== "idle" && getStatusIcon()}
        </CardTitle>
      </CardHeader>
      <CardContent data-oid="wdvl8qy">
        <div className="space-y-4" data-oid="9uiy55x">
          <Alert
            variant={
              supabaseUrl && supabaseUrl !== "Not found"
                ? "default"
                : "destructive"
            }
            data-oid="7l9e.1x"
          >
            <AlertTitle data-oid="xyzz_ce">Configuration</AlertTitle>
            <AlertDescription data-oid="pxy4p8i">
              <div className="mt-2 space-y-2 text-sm" data-oid="yhzs1oh">
                <div data-oid="dp9-cg1">
                  <strong data-oid="3veagi0">Supabase URL:</strong>{" "}
                  {supabaseUrl}
                </div>
                <div data-oid="-w_x-g8">
                  <strong data-oid="8jm5.q3">Supabase Key:</strong>{" "}
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
            data-oid="rn:o8z3"
          >
            <AlertTitle data-oid="luuejoi">Connection Status</AlertTitle>
            <AlertDescription className="mt-2" data-oid="oh3o_:d">
              {message}
              {errorDetails && (
                <div
                  className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono whitespace-pre-wrap max-h-48 overflow-y-auto"
                  data-oid="6o76lk3"
                >
                  {errorDetails}
                </div>
              )}
            </AlertDescription>
          </Alert>

          <div
            className="flex flex-col gap-2 sm:flex-row sm:gap-4"
            data-oid="nzk743d"
          >
            <Button
              onClick={handleTestConnection}
              disabled={connectionStatus === "loading"}
              className="flex-1"
              data-oid="z:z6_c0"
            >
              Test Supabase API
            </Button>

            <Button
              onClick={testDirectFetch}
              disabled={connectionStatus === "loading"}
              variant="outline"
              className="flex-1"
              data-oid="-_6s-o0"
            >
              Test Connectivity
            </Button>
          </div>

          <div className="text-sm text-gray-500 mt-4" data-oid=".qagpqy">
            <p data-oid="3t2w0l4">
              If you're seeing connection errors, here are some possible
              reasons:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1" data-oid="qf.cxhh">
              <li data-oid="kiza6zw">Supabase URL or key might be incorrect</li>
              <li data-oid="2i49dh-">CORS policies might be blocking access</li>
              <li data-oid="8dq2-6y">Network connectivity issues</li>
              <li data-oid="1af-459">
                The tables may not exist in your Supabase project
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
