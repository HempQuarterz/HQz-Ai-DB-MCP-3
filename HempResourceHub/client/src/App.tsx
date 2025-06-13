import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/error-boundary";
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
import HempDex from "./pages/hemp-dex";
import SupabaseTest from "./components/supabase-test";
import SupabaseIndustries from "./components/supabase-industries";
import SupabaseTestConnection from "./components/supabase-test-connection";
import DebugSupabase from "./pages/debug-supabase";
import AdminPage from "./pages/admin";

function Router() {
  return (
    <Switch data-oid="mz1m0k7">
      <Route path="/" component={HomePage} data-oid=".stzk2_" />
      <Route path="/about" component={AboutPage} data-oid="8cc79-4" />
      <Route
        path="/plant-parts"
        component={PlantPartsPage}
        data-oid="p8o_m6_"
      />

      <Route
        path="/plant-types"
        component={PlantTypesListPage}
        data-oid="jhw25ys"
      />

      <Route
        path="/plant-type/:id"
        component={PlantTypePage}
        data-oid="-768tu8"
      />

      <Route
        path="/plant-part/:id"
        component={PlantPartPage}
        data-oid="wb_chhl"
      />

      <Route
        path="/products/:plantPartId/:industryId?"
        component={ProductListingPage}
        data-oid="0m.zqih"
      />

      <Route
        path="/product/:id"
        component={ProductDetailPage}
        data-oid="q_cf4tj"
      />

      <Route path="/industries" component={IndustriesPage} data-oid="i4mqmig" />
      <Route path="/hemp-dex" component={HempDex} data-oid="hemp-dex" />
      <Route path="/research" component={ResearchPage} data-oid="r71_flj" />
      <Route
        path="/research/:paperId"
        component={ResearchDetailPage}
        data-oid="foofk03"
      />

      <Route
        path="/supabase-test"
        component={SupabaseTest}
        data-oid="n.xojo2"
      />

      <Route
        path="/supabase-industries"
        component={SupabaseIndustries}
        data-oid="i7ewdxm"
      />

      <Route
        path="/supabase-connection"
        component={SupabaseTestConnection}
        data-oid="80q9r5w"
      />

      <Route path="/debug" component={DebugSupabase} data-oid="1-dlpt_" />
      <Route path="/debug-supabase" component={DebugSupabase} data-oid="debug-sup" />
      <Route path="/admin" component={AdminPage} data-oid="admin-page" />
      <Route component={NotFound} data-oid="94.5p89" />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient} data-oid="u-8-pob">
        <TooltipProvider data-oid="0n1weth">
          <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100" data-oid="9aq6v3f">
            <Navbar data-oid="1wj7t:9" />
            <main className="flex-grow bg-gray-950" data-oid="obhqq-s">
              <Router data-oid="geelxlm" />
            </main>
            <Footer data-oid="lyq7x7v" />
          </div>
          <Toaster data-oid="yh70n6c" />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
