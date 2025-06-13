import { useStats } from "@/hooks/use-plant-data";
import Counter from "@/components/ui/counter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Database, Search, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import hempBrainImage from "../../assets/hemp-brain.jpg";

const HomepageHero = () => {
  const { data: stats, isLoading } = useStats();
  const [, setLocation] = useLocation();

  return (
    <div
      className="relative py-12 sm:py-16 overflow-hidden bg-gradient-to-b from-black via-green-950/20 to-black"
      style={{ minHeight: "450px" }}
      data-oid="087:_a0"
    >
      {/* Enhanced Background with multiple layers */}
      <div className="absolute inset-0">
        {/* Primary image layer with blur effect */}
        <div
          className="absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage: `url(${hempBrainImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(2px)",
          }}
        />
        
        {/* Gradient overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-10" />
        
        {/* Animated green particles effect */}
        <div className="absolute inset-0 z-20">
          <div className="absolute top-20 left-10 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <div className="absolute top-40 right-20 w-3 h-3 bg-green-500 rounded-full animate-pulse animation-delay-500" />
          <div className="absolute bottom-20 left-1/3 w-2 h-2 bg-green-400 rounded-full animate-pulse animation-delay-1000" />
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-green-300 rounded-full animate-pulse animation-delay-1500" />
        </div>
      </div>

      {/* Content with improved layout */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-400/20 text-green-400 border border-green-400/30">
            <Sparkles className="w-3 h-3" />
            AI-Powered Hemp Intelligence
          </span>
        </div>
        
        {/* Main heading with better typography */}
        <h1 className="text-center text-4xl sm:text-5xl md:text-6xl font-heading font-bold">
          <span className="bg-gradient-to-r from-green-400 via-green-300 to-emerald-400 bg-clip-text text-transparent">
            Hemp Intelligence
          </span>
          <br />
          <span className="text-white text-3xl sm:text-4xl md:text-5xl font-light">
            Database & Analytics
          </span>
        </h1>
        
        <p className="mt-4 max-w-2xl mx-auto text-center text-base sm:text-lg text-gray-300 font-light">
          Discover the future of sustainable materials. Explore comprehensive data on industrial hemp 
          applications, powered by AI agents for real-time insights.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Button
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white group"
            onClick={() => setLocation("/products/all")}
          >
            <Search className="w-4 h-4 mr-2" />
            Explore Products
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-green-400/50 text-green-400 hover:bg-green-400/10"
            onClick={() => setLocation("/research")}
          >
            <Database className="w-4 h-4 mr-2" />
            View Research
          </Button>
        </div>

        {/* Redesigned Statistics */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {/* Products Card */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-sm p-6 border border-green-400/20 hover:border-green-400/40 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/0 to-green-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="text-3xl font-bold text-green-400 mb-1">
                {isLoading ? (
                  <div className="h-8 w-20 bg-green-400/20 rounded animate-pulse" />
                ) : (
                  <Counter end={stats?.totalProducts || 459} suffix="+" />
                )}
              </div>
              <div className="text-sm font-medium text-gray-300">
                Hemp Products
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Verified applications
              </div>
            </div>
          </div>

          {/* Industries Card */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 backdrop-blur-sm p-6 border border-emerald-400/20 hover:border-emerald-400/40 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="text-3xl font-bold text-emerald-400 mb-1">
                {isLoading ? (
                  <div className="h-8 w-16 bg-emerald-400/20 rounded animate-pulse" />
                ) : (
                  <Counter end={stats?.totalIndustries || 49} />
                )}
              </div>
              <div className="text-sm font-medium text-gray-300">
                Industries
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Market sectors
              </div>
            </div>
          </div>

          {/* Plant Parts Card */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-teal-500/10 to-teal-600/10 backdrop-blur-sm p-6 border border-teal-400/20 hover:border-teal-400/40 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400/0 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="text-3xl font-bold text-teal-400 mb-1">
                {isLoading ? (
                  <div className="h-8 w-12 bg-teal-400/20 rounded animate-pulse" />
                ) : (
                  <Counter end={stats?.totalPlantParts || 8} />
                )}
              </div>
              <div className="text-sm font-medium text-gray-300">
                Plant Parts
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Usable components
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageHero;
