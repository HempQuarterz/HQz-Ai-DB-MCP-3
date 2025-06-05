import { ResearchPaper, PlantType, PlantPart, Industry } from "@shared/schema";
import ResearchPaperCard from "./research-paper-card";
import { usePlantTypes, usePlantParts, useIndustries } from "../../hooks/use-plant-data";
import { Skeleton } from "@/components/ui/skeleton";

interface ResearchPaperListProps {
  papers: ResearchPaper[];
  isLoading?: boolean;
  emptyMessage?: string;
}

const ResearchPaperList = ({ 
  papers, 
  isLoading = false, 
  emptyMessage = "No research papers found" 
}: ResearchPaperListProps) => {
  // Fetch reference data
  const { data: plantTypes, isLoading: isLoadingPlantTypes } = usePlantTypes();
  const { data: plantParts, isLoading: isLoadingPlantParts } = usePlantParts(null);
  const { data: industries, isLoading: isLoadingIndustries } = useIndustries();

  // Create lookup maps for names
  const plantTypeNames: Record<number, string> = {};
  const plantPartNames: Record<number, string> = {};
  const industryNames: Record<number, string> = {};

  // Populate lookup maps
  if (plantTypes && Array.isArray(plantTypes)) {
    plantTypes.forEach((type: PlantType) => {
      plantTypeNames[type.id] = type.name;
    });
  }

  if (plantParts && Array.isArray(plantParts)) {
    plantParts.forEach((part: PlantPart) => {
      plantPartNames[part.id] = part.name;
    });
  }

  if (industries && Array.isArray(industries)) {
    industries.forEach((industry: Industry) => {
      industryNames[industry.id] = industry.name;
    });
  }

  // Show loading state
  if (isLoading || isLoadingPlantTypes || isLoadingPlantParts || isLoadingIndustries) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="border border-green-800/30 rounded-md p-6 bg-black/50">
            <Skeleton className="h-8 w-3/4 mb-2 bg-green-900/20" />
            <Skeleton className="h-4 w-1/2 mb-4 bg-green-900/20" />
            <Skeleton className="h-24 w-full mb-4 bg-green-900/20" />
            <div className="flex gap-2 mb-3">
              <Skeleton className="h-6 w-16 bg-green-900/20" />
              <Skeleton className="h-6 w-16 bg-green-900/20" />
              <Skeleton className="h-6 w-16 bg-green-900/20" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-12 w-full bg-green-900/20" />
              <Skeleton className="h-12 w-full bg-green-900/20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Show empty state
  if (!papers || papers.length === 0) {
    return (
      <div className="text-center py-12 border border-green-800/30 rounded-md bg-black/50">
        <p className="text-green-400 text-xl">{emptyMessage}</p>
      </div>
    );
  }

  // Show research papers list
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {papers.map(paper => (
        <ResearchPaperCard 
          key={paper.id}
          paper={paper}
          plantTypeNames={plantTypeNames}
          plantPartNames={plantPartNames}
          industryNames={industryNames}
        />
      ))}
    </div>
  );
};

export default ResearchPaperList;