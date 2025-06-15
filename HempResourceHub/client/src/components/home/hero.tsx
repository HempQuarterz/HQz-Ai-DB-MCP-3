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
      className="relative py-12 sm:py-16 overflow-hidden"
      style={{ minHeight: "450px", background: "transparent" }}
      data-oid="087:_a0"
    >
      {/* Enhanced Background with multiple layers */}
      <div className="absolute inset-0">
        {/* Primary image layer with blur effect - REDUCED OPACITY */}
        <div
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: `url(${hempBrainImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(4px)",
          }}
        />
        
        {/* Very light gradient overlay to show Three.js background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10 z-10" />
        
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
        {/* Semi-transparent background for better text readability */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-2xl -m-4" />
        <div className="relative z-10 py-8">
        {/* Badge */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-400/20 text-green-400 border border-green-400/30">
            <Sparkles className="w-3 h-3" />
            AI-Powered Hemp Intelligence
          </span>
        </div>
        
        {/* Main heading with better typography */}
        <h1 className="text-center text-4xl sm:text-5xl md:text-6xl font-heading font-bold">
          <span className="bg-gradient-to-r from-green-400 via-green-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,197,94,0.8)]" 
                style={{ textShadow: '0 0 40px rgba(34, 197, 94, 0.6), 0 0 60px rgba(34, 197, 94, 0.4)' }}>
            Hemp Intelligence
          </span>
          <br />
          <span className="text-white text-3xl sm:text-4xl md:text-5xl font-light drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
                style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 20px rgba(0, 0, 0, 0.5)' }}>
            Database & Analytics
          </span>
        </h1>
        
        <p className="mt-4 max-w-2xl mx-auto text-center text-base sm:text-lg text-gray-100 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" 
           style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.9), 0 0 15px rgba(0, 0, 0, 0.7)' }}>
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
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-md p-6 border border-green-400/30 hover:border-green-400/50 transition-all shadow-lg shadow-black/50">
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
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-md p-6 border border-emerald-400/30 hover:border-emerald-400/50 transition-all shadow-lg shadow-black/50">
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
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-600/20 backdrop-blur-md p-6 border border-teal-400/30 hover:border-teal-400/50 transition-all shadow-lg shadow-black/50">
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
    </div>
  );
};

export default HomepageHero;
