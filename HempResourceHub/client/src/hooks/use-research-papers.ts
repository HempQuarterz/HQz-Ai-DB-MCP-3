import { useQuery } from "@tanstack/react-query";
import { ResearchPaper } from "@shared/schema";
import { getQueryFn } from "../lib/queryClient";

export function useResearchPapers() {
  return useQuery<ResearchPaper[]>({
    queryKey: ["/api/research-papers"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
}

export function useResearchPaper(id: number | null) {
  return useQuery<ResearchPaper>({
    queryKey: ["/api/research-papers", id],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: id !== null,
  });
}

export function useResearchPapersByPlantType(plantTypeId: number | null) {
  return useQuery<ResearchPaper[]>({
    queryKey: ["/api/research-papers/plant-type", plantTypeId],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: plantTypeId !== null,
  });
}

export function useResearchPapersByPlantPart(plantPartId: number | null) {
  return useQuery<ResearchPaper[]>({
    queryKey: ["/api/research-papers/plant-part", plantPartId],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: plantPartId !== null,
  });
}

export function useResearchPapersByIndustry(industryId: number | null) {
  return useQuery<ResearchPaper[]>({
    queryKey: ["/api/research-papers/industry", industryId],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: industryId !== null,
  });
}

export function useSearchResearchPapers(query: string) {
  return useQuery<ResearchPaper[]>({
    queryKey: ["/api/research-papers/search", query],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: query.length > 0,
  });
}