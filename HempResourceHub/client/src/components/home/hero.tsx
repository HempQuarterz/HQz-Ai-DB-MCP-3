import { useStats } from "@/hooks/use-plant-data";
import Counter from "@/components/ui/counter";
import hempBrainImage from "../../assets/hemp-brain.jpg";

const HomepageHero = () => {
  const { data: stats, isLoading } = useStats();

  return (
    <div className="relative py-16 sm:py-24 overflow-hidden" style={{ minHeight: "600px" }}>
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 z-0" 
        style={{ 
          backgroundImage: `url(${hempBrainImage})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-green-400 text-outline-white drop-shadow-lg">
          Interactive Industrial Hemp Database
        </h1>
        <p className="mt-3 max-w-md mx-auto text-lg sm:text-xl md:mt-5 md:max-w-3xl font-medium text-white text-outline-white">
          Explore the versatile applications of industrial hemp across industries, plant parts, and product categories.
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <div className="rounded-lg bg-black/60 backdrop-blur-sm p-4 text-white border border-green-400/30">
            <div className="text-2xl font-bold text-green-400 text-outline-white">
              {isLoading ? (
                <span className="opacity-50">Loading...</span>
              ) : (
                <Counter end={stats?.totalProducts || 0} suffix="+" />
              )}
            </div>
            <div className="text-sm font-medium text-white text-outline-white">Unique Applications</div>
          </div>
          
          <div className="rounded-lg bg-black/60 backdrop-blur-sm p-4 text-white border border-green-400/30">
            <div className="text-2xl font-bold text-green-400 text-outline-white">
              {isLoading ? (
                <span className="opacity-50">Loading...</span>
              ) : (
                <Counter end={stats?.totalIndustries || 0} />
              )}
            </div>
            <div className="text-sm font-medium text-white text-outline-white">Industry Categories</div>
          </div>
          
          <div className="rounded-lg bg-black/60 backdrop-blur-sm p-4 text-white border border-green-400/30">
            <div className="text-2xl font-bold text-green-400 text-outline-white">
              {isLoading ? (
                <span className="opacity-50">Loading...</span>
              ) : (
                <Counter end={stats?.totalPlantParts || 0} />
              )}
            </div>
            <div className="text-sm font-medium text-white text-outline-white">Plant Components</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageHero;
