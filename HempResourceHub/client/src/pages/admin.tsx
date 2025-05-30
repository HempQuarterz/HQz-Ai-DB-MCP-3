import React from 'react';
import { Helmet } from 'react-helmet';
import AddPlantTypeForm from '@/components/admin/add-plant-type';
import AddPlantPartForm from '@/components/admin/add-plant-part';
import AddIndustryForm from '@/components/admin/add-industry';
import AddSubIndustryForm from '@/components/admin/add-sub-industry';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
          <TabsList className="grid grid-cols-5 w-full max-w-4xl mx-auto">
            <TabsTrigger value="plant-types">Plant Types</TabsTrigger>
            <TabsTrigger value="plant-parts">Plant Parts</TabsTrigger>
            <TabsTrigger value="industries">Industries</TabsTrigger>
            <TabsTrigger value="sub-industries">Sub-Industries</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
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
              <p className="text-lg">Hemp Products form will be available soon.</p>
              <p className="text-sm text-muted-foreground mt-2">
                This form requires more complex fields for multiple relationships. It's being developed.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;