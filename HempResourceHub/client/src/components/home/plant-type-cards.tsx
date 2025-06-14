import { usePlantTypes } from "@/hooks/use-plant-data";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlantType } from "@shared/schema";
import SimpleHempModel from "@/components/models/SimpleHempModel";
import { Leaf, ArrowRight, Sparkles } from "lucide-react";
import hempEcosystemImage from "@/assets/images/hemp-ecosystem.webp?url";
import { getPlaceholderImage } from "@/lib/placeholder";
import { useState } from "react";

// Image component with error handling
const PlantImage = ({ plantType, className }: { plantType: PlantType; className: string }) => {
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  if (!plantType.imageUrl || imageError) {
    return (
      <img
        src={getPlaceholderImage(400, 300, plantType.name)}
        alt={`${plantType.name} plant placeholder`}
        className={className}
      />
    );
  }
  
  return (
    <img
      src={plantType.imageUrl}
      alt={`${plantType.name} plant`}
      className={className}
      onError={handleImageError}
    />
  );
};

const PlantTypeCards = () => {
  const { data: plantTypesData, isLoading } = usePlantTypes();
  const plantTypes = Array.isArray(plantTypesData) ? plantTypesData : [];

  // DEBUG: Log plantTypes to verify data is being received
  console.log("PlantTypeCards: plantTypes", plantTypes);
  console.log("PlantTypeCards: first plant type imageUrl:", plantTypes[0]?.imageUrl);
  return (
    <div className="py-16 relative overflow-hidden" data-oid="l3y5paq">
      {/* Enhanced background with animated particles */}
      <div className="absolute inset-0">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl animate-pulse animation-delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-teal-500 rounded-full filter blur-3xl animate-pulse animation-delay-500" />
        </div>
        
        {/* Hemp ecosystem subtle background */}
        <div
          className="absolute inset-0 w-full h-full z-0 opacity-10"
          style={{
            backgroundImage: `url(${hempEcosystemImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(3px)",
          }}
        />
      </div>

      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        data-oid="xkzudud"
      >
        {/* Enhanced section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 mb-6">
            <Leaf className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">Explore Plant Types</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Choose Your Hemp Focus
            </span>
          </h2>
          
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Each hemp variety is optimized for specific applications. Select a type to discover 
            its unique industrial potential and sustainable solutions.
          </p>
        </div>

        {isLoading ? (
          <div
            className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:max-w-5xl lg:mx-auto"
            data-oid="nqv:hyy"
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="overflow-hidden border border-green-500/20 rounded-lg shadow-[0_0_15px_rgba(0,255,0,0.15)]"
                data-oid="k8f:gde"
              >
                <div className="h-80 relative" data-oid="xzp_6y_">
                  <Skeleton
                    className="absolute inset-0 bg-black/40"
                    data-oid="h8ddets"
                  />

                  <div
                    className="absolute inset-0 bg-matrix-effect opacity-10"
                    data-oid="j:sifwx"
                  ></div>
                </div>
                <div className="p-6 bg-black/90" data-oid="v:zbg.7">
                  <Skeleton
                    className="h-6 w-3/4 mb-2 bg-green-900/40"
                    data-oid="l_-_.o."
                  />

                  <Skeleton
                    className="h-4 w-full mb-1 bg-green-900/30"
                    data-oid="nin0fvj"
                  />

                  <Skeleton
                    className="h-4 w-5/6 bg-green-900/30"
                    data-oid=":k1.lzn"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:max-w-6xl lg:mx-auto"
            data-oid="755bxw3"
          >
            {plantTypes.slice(0, 3).map((plantType: PlantType, index) => (
              <Link key={plantType.id} href={`/plant-type/${plantType.id}`}>
                <div
                  className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Card background with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
                  
                  {/* Plant Image */}
                  <div className="absolute inset-0 overflow-hidden">
                    <PlantImage
                      plantType={plantType}
                      className="h-full w-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700"
                    />
                  </div>
                  
                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-green-500/0 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Animated border effect */}
                  <div className="absolute inset-0 rounded-2xl border border-green-400/0 group-hover:border-green-400/50 transition-all duration-500" />
                  <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-500" />
                  
                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-end p-8 z-10">
                    {/* Icon */}
                    <div className="mb-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 border border-green-400/50 group-hover:bg-green-500/30 transition-colors">
                        <Sparkles className="w-6 h-6 text-green-400" />
                      </div>
                    </div>
                    
                    {/* Title and description */}
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                        {plantType.name}
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 group-hover:text-gray-100 transition-colors">
                        {plantType.description}
                      </p>
                    </div>
                    
                    {/* CTA */}
                    <div className="mt-6 flex items-center gap-2 text-green-400 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <span className="text-sm font-medium">Explore Applications</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_50px_rgba(34,197,94,0.2)]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {/* View All Button */}
        {!isLoading && plantTypes.length > 3 && (
          <div className="mt-12 text-center">
            <Link href="/plant-types">
              <button className="group relative inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/50 rounded-full text-green-400 font-medium hover:from-green-500/20 hover:to-emerald-500/20 hover:border-green-400 transition-all duration-300">
                <span>View All Plant Types</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-0 group-hover:opacity-20 blur transition-opacity" />
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantTypeCards;
