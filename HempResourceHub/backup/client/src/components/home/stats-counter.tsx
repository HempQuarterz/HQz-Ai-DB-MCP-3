import { useState } from "react";
import { useStats } from "@/hooks/use-plant-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Counter from "@/components/ui/counter";

const StatsCounter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: stats, isLoading } = useStats();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search query
    console.log("Search query:", searchQuery);
  };

  return (
    <div className="bg-primary py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-6 text-outline-white">Explore All Hemp Applications</h2>
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search by industry, part, or application..."
              className="w-full rounded-full px-6 py-4 pl-14 text-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent shadow-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center">
              <Search className="h-6 w-6 text-neutral-medium" />
            </div>
          </form>
          
          <div className="mt-10 text-white">
            <p className="text-xl sm:text-2xl opacity-95 mb-3 text-outline-white font-medium">Total Documented Hemp Applications:</p>
            <div className="text-5xl sm:text-6xl font-bold text-outline-white">
              {isLoading ? (
                <span className="opacity-50">Loading...</span>
              ) : (
                <Counter end={stats?.totalProducts || 0} suffix="+" duration={2500} />
              )}
            </div>
            <p className="mt-4 text-base sm:text-lg md:text-xl opacity-95 max-w-2xl mx-auto text-outline-white font-medium">
              Our database continues to grow as research uncovers new industrial hemp applications across various sectors. Check back regularly for the latest additions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCounter;
