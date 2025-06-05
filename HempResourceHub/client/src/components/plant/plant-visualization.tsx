import { useEffect, useState } from "react";
import { Link } from "wouter";
import { usePlantType, usePlantParts } from "@/hooks/use-plant-data";
import { Skeleton } from "@/components/ui/skeleton";
import { InfoIcon } from "lucide-react";
import { PlantPart } from "@shared/schema";
import PlantPartSelector from "./plant-part-selector";

interface PlantVisualizationProps {
  plantTypeId: number;
}

const PlantVisualization = ({ plantTypeId }: PlantVisualizationProps) => {
  const { data: plantType, isLoading: isLoadingPlantType } = usePlantType(plantTypeId);
  const { data: plantParts, isLoading: isLoadingPlantParts } = usePlantParts(plantTypeId);
  const [activePartId, setActivePartId] = useState<number | null>(null);

  useEffect(() => {
    // Set the first part as active when data loads
    if (plantParts && plantParts.length > 0 && !activePartId) {
      setActivePartId(plantParts[0].id);
    }
  }, [plantParts, activePartId]);
  
  if (isLoadingPlantType || isLoadingPlantParts) {
    return (
      <div className="bg-neutral-lightest py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-8 w-96" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 p-8">
              <div className="lg:col-span-2 flex items-center justify-center">
                <Skeleton className="w-full h-[400px] rounded-lg" />
              </div>
              <div className="lg:col-span-3 space-y-6">
                <div>
                  <Skeleton className="h-7 w-64 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-24 rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id={`${plantType?.name.toLowerCase().replace(/\s+/g, '-')}`} className="py-12 bg-neutral-lightest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div>
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link href="/">
                    <div className="text-neutral-medium hover:text-primary cursor-pointer">Home</div>
                  </Link>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-neutral-medium" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="text-neutral-dark font-medium ml-2">{plantType?.name}</span>
                </li>
              </ol>
            </nav>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-neutral-darkest mt-2">{plantType?.name} Plant Parts</h2>
          </div>
          <Link href="/">
            <div className="text-primary hover:text-primary-dark font-medium flex items-center cursor-pointer">
              <span>View Different Plant Type</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="lg:col-span-2 p-6 flex items-center justify-center">
              {/* Interactive plant visualization */}
              <div className="relative w-full max-w-md">
                <img 
                  src={plantType?.id === 1 
                    ? "https://www.greenentrepreneur.com/wp-content/uploads/2024/01/hemp_field_aerial_view_a_field_of_industrial_hemp_plants_cannabis_sativa_1600.jpg" 
                    : plantType?.imageUrl || 'https://via.placeholder.com/800x1000'
                  } 
                  alt={`${plantType?.name} diagram`} 
                  className="w-full rounded-lg"
                />
                
                {/* Plant part overlays - this would be more dynamic in a real implementation */}
                {plantParts?.slice(0, 3).map((part: PlantPart, index: number) => {
                  // Position the dots at different locations
                  const positions = [
                    'top-[10%] right-[20%]',
                    'top-[40%] left-[15%]',
                    'bottom-[20%] right-[25%]'
                  ];
                  
                  // Different colors for different parts
                  const colors = [
                    'bg-accent/30',
                    'bg-secondary/30',
                    'bg-primary/30'
                  ];
                  
                  const iconColors = [
                    'text-accent',
                    'text-secondary',
                    'text-primary'
                  ];
                  
                  return (
                    <div 
                      key={part.id} 
                      className={`absolute ${positions[index]} w-24 h-24 plant-part cursor-pointer`}
                      onClick={() => setActivePartId(part.id)}
                    >
                      <div className="relative">
                        <div className={`absolute inset-0 ${colors[index]} rounded-full ${activePartId === part.id ? 'animate-pulse' : ''}`}></div>
                        <div className="absolute -right-2 -top-2 bg-white rounded-full shadow-md p-1">
                          <InfoIcon className={`h-6 w-6 ${iconColors[index]}`} />
                        </div>
                      </div>
                      <div className="mt-2 text-center">
                        <Link href={`/plant-part/${part.id}`}>
                          <div className="text-primary font-medium text-sm cursor-pointer">{part.name}</div>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="lg:col-span-3 bg-neutral-lightest p-8">
              <h3 className="text-xl font-heading font-semibold mb-4">Select a Plant Part to Explore</h3>
              <p className="text-neutral-dark mb-6">
                {plantType?.description} Each part of the plant offers unique applications and benefits.
              </p>
              
              <PlantPartSelector 
                plantParts={plantParts || []} 
                activePart={activePartId}
                onSelectPart={setActivePartId}
              />
              
              <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-heading font-medium flex items-center">
                  <InfoIcon className="h-5 w-5 mr-2 text-primary" />
                  Did you know?
                </h4>
                <p className="text-sm mt-1">
                  {plantType?.name} plants {plantType?.characteristics || "have unique characteristics that make them valuable for various industrial applications."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantVisualization;
