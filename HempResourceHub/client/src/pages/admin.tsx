import React, { lazy, Suspense } from "react";
import { Helmet } from "react-helmet";
import AddPlantTypeForm from "@/components/admin/add-plant-type";
import AddPlantPartForm from "@/components/admin/add-plant-part";
import AddIndustryForm from "@/components/admin/add-industry";
import AddSubIndustryForm from "@/components/admin/add-sub-industry";
import ImageGenerationDashboard from "@/components/admin/image-generation-dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Lazy load the agent monitoring dashboard for better performance
const AgentMonitoringDashboard = lazy(() => import("@/components/admin/agent-monitoring-dashboard"));
// Temporary simple version for testing
import AgentMonitoringDashboardSimple from "@/components/admin/agent-monitoring-dashboard-simple";

const AdminPage = () => {
  return (
    <div className="container mx-auto p-6">
      <Helmet>
        <title>Admin Dashboard - Hemp Industry Database</title>
        <meta
          name="description"
          content="Admin dashboard for managing the Hemp Industry Database entries and data."
        />
      </Helmet>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            Admin Dashboard
          </h1>
          <p className="text-xl text-muted-foreground mt-2">
            Manage and update the Hemp Industry Database
          </p>
        </div>

        <Tabs defaultValue="plant-types" className="w-full">
          <TabsList className="grid grid-cols-7 w-full max-w-6xl mx-auto">
            <TabsTrigger value="plant-types">Plant Types</TabsTrigger>
            <TabsTrigger value="plant-parts">Plant Parts</TabsTrigger>
            <TabsTrigger value="industries">Industries</TabsTrigger>
            <TabsTrigger value="sub-industries">Sub-Industries</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="image-generation">Images</TabsTrigger>
            <TabsTrigger value="ai-agents">AI Agents</TabsTrigger>
          </TabsList>

          <TabsContent value="plant-types">
            <AddPlantTypeForm />
          </TabsContent>

          <TabsContent value="plant-parts">
            <AddPlantPartForm />
          </TabsContent>

          <TabsContent value="industries">
            <AddIndustryForm />
          </TabsContent>

          <TabsContent value="sub-industries">
            <AddSubIndustryForm />
          </TabsContent>

          <TabsContent value="products">
            <div className="text-center p-12 border rounded-lg">
              <p className="text-lg">
                Hemp Products form will be available soon.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                This form requires more complex fields for multiple
                relationships. It's being developed.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="image-generation">
            <ImageGenerationDashboard />
          </TabsContent>
          
          <TabsContent value="ai-agents">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold">AI Agent Monitoring</h2>
                <p className="text-muted-foreground mt-2">
                  Monitor and manage your AI agents in real-time
                </p>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Agent Status</CardTitle>
                  <CardDescription>Current status of all AI agents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="font-semibold">Research Agent</div>
                      <Badge className="mt-1 bg-green-500">Active</Badge>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="font-semibold">Content Agent</div>
                      <Badge className="mt-1 bg-green-500">Active</Badge>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="font-semibold">SEO Agent</div>
                      <Badge className="mt-1 bg-green-500">Active</Badge>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="font-semibold">Compliance Agent</div>
                      <Badge className="mt-1 bg-green-500">Active</Badge>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="font-semibold">Outreach Agent</div>
                      <Badge className="mt-1" variant="secondary">Pending</Badge>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="font-semibold">Monetization Agent</div>
                      <Badge className="mt-1" variant="secondary">Pending</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
