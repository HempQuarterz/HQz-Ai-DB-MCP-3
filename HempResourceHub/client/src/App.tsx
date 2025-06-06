import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HomePage from "@/pages/home";
import AboutPage from "@/pages/about";
import PlantPartsPage from "@/pages/plant-parts";
import PlantTypesListPage from "@/pages/plant-types-list";
import PlantTypePage from "@/pages/plant-type";
import PlantPartPage from "@/pages/plant-part";
import ProductListingPage from "@/pages/product-listing";
import ProductDetailPage from "@/pages/product-detail";
import IndustriesPage from "@/pages/industries";
import ResearchPage from "./pages/research";
import ResearchDetailPage from "./pages/research-detail";
import SupabaseTest from "./components/supabase-test";
import SupabaseIndustries from "./components/supabase-industries";
import SupabaseTestConnection from "./components/supabase-test-connection";
import DebugSupabase from "./pages/debug-supabase";

function Router() {
  return (
    <Switch data-oid=":c:eg63">
      <Route path="/" component={HomePage} data-oid="_p5uugv" />
      <Route path="/about" component={AboutPage} data-oid=".hzwc8t" />
      <Route
        path="/plant-parts"
        component={PlantPartsPage}
        data-oid="jejwnax"
      />
      <Route
        path="/plant-types"
        component={PlantTypesListPage}
        data-oid="2ckj:iv"
      />
      <Route
        path="/plant-type/:id"
        component={PlantTypePage}
        data-oid="iz.qqmd"
      />
      <Route
        path="/plant-part/:id"
        component={PlantPartPage}
        data-oid="1r1iqvt"
      />
      <Route
        path="/products/:plantPartId/:industryId?"
        component={ProductListingPage}
        data-oid="c6qut6f"
      />
      <Route
        path="/product/:id"
        component={ProductDetailPage}
        data-oid="hxo9qvh"
      />
      <Route path="/industries" component={IndustriesPage} data-oid="uc:qclq" />
      <Route path="/research" component={ResearchPage} data-oid="704d.pj" />
      <Route
        path="/research/:paperId"
        component={ResearchDetailPage}
        data-oid="mbrpa0:"
      />
      <Route
        path="/supabase-test"
        component={SupabaseTest}
        data-oid="yz9m6ge"
      />
      <Route
        path="/supabase-industries"
        component={SupabaseIndustries}
        data-oid="zc16m69"
      />
      <Route
        path="/supabase-connection"
        component={SupabaseTestConnection}
        data-oid="h5a91h:"
      />
      <Route path="/debug" component={DebugSupabase} data-oid="1a1:ca9" />
      <Route component={NotFound} data-oid="bhiel9m" />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient} data-oid="f_5wujg">
      <TooltipProvider data-oid="54nvnx-">
        <div className="flex flex-col min-h-screen" data-oid="lxa9ai_">
          <Navbar data-oid="2qx9g79" />
          <main className="flex-grow" data-oid="k2nyhcx">
            <Router data-oid="w4s69wh" />
          </main>
          <Footer data-oid="2.y61a_" />
        </div>
        <Toaster data-oid="82tqtb5" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
