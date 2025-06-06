import React from "react";
import { Helmet } from "react-helmet";
import AddPlantTypeForm from "@/components/admin/add-plant-type";
import AddPlantPartForm from "@/components/admin/add-plant-part";
import AddIndustryForm from "@/components/admin/add-industry";
import AddSubIndustryForm from "@/components/admin/add-sub-industry";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminPage = () => {
  return (
    <div className="container mx-auto p-6" data-oid="zxf.ngf">
      <Helmet data-oid="oy78dzl">
        <title data-oid="cnwhzak">
          Admin Dashboard - Hemp Industry Database
        </title>
        <meta
          name="description"
          content="Admin dashboard for managing the Hemp Industry Database entries and data."
          data-oid="h9e4.vu"
        />
      </Helmet>

      <div className="space-y-6" data-oid="c.09o6-">
        <div className="text-center mb-8" data-oid=":7qjl4_">
          <h1
            className="text-4xl font-bold tracking-tight text-primary"
            data-oid="b_g:15-"
          >
            Admin Dashboard
          </h1>
          <p className="text-xl text-muted-foreground mt-2" data-oid="dh6__2c">
            Manage and update the Hemp Industry Database
          </p>
        </div>

        <Tabs defaultValue="plant-types" className="w-full" data-oid="3rdssa5">
          <TabsList
            className="grid grid-cols-5 w-full max-w-4xl mx-auto"
            data-oid=".rul1w:"
          >
            <TabsTrigger value="plant-types" data-oid="enn0v19">
              Plant Types
            </TabsTrigger>
            <TabsTrigger value="plant-parts" data-oid="w9etqg.">
              Plant Parts
            </TabsTrigger>
            <TabsTrigger value="industries" data-oid="e888i15">
              Industries
            </TabsTrigger>
            <TabsTrigger value="sub-industries" data-oid="33q_ops">
              Sub-Industries
            </TabsTrigger>
            <TabsTrigger value="products" data-oid="k1-f59j">
              Products
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plant-types" data-oid="7_y:1-j">
            <AddPlantTypeForm data-oid="1uah06y" />
          </TabsContent>

          <TabsContent value="plant-parts" data-oid="85lbt23">
            <AddPlantPartForm data-oid="7q99i6f" />
          </TabsContent>

          <TabsContent value="industries" data-oid="vi4q9.o">
            <AddIndustryForm data-oid="y4.cm98" />
          </TabsContent>

          <TabsContent value="sub-industries" data-oid="84y70fr">
            <AddSubIndustryForm data-oid="_3vtecp" />
          </TabsContent>

          <TabsContent value="products" data-oid=":evpwyw">
            <div
              className="text-center p-12 border rounded-lg"
              data-oid="i2ypu6h"
            >
              <p className="text-lg" data-oid="jb1ksru">
                Hemp Products form will be available soon.
              </p>
              <p
                className="text-sm text-muted-foreground mt-2"
                data-oid="c7f67f7"
              >
                This form requires more complex fields for multiple
                relationships. It's being developed.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
