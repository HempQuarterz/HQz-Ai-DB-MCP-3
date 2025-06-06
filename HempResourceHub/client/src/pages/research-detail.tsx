import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet";
import { ResearchPaper } from "@shared/schema";
import {
  useResearchPaper,
  useResearchPapersByPlantType,
} from "../hooks/use-research-papers";
import {
  usePlantType,
  usePlantPart,
  useIndustries,
} from "../hooks/use-plant-data";
import ResearchPaperDetail from "@/components/research/research-paper-detail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
// Import breadcrumb
import { createBreadcrumb } from "@/components/ui/breadcrumb";

export default function ResearchDetailPage() {
  // Get paperId from URL
  const { paperId } = useParams<{ paperId: string }>();
  const id = parseInt(paperId);

  // Fetch research paper data
  const { data: paper, isLoading: isLoadingPaper } = useResearchPaper(id);

  // Fetch related data based on the paper's associations
  const { data: plantType, isLoading: isLoadingPlantType } = usePlantType(
    paper?.plantTypeId || null,
  );

  const { data: plantPart, isLoading: isLoadingPlantPart } = usePlantPart(
    paper?.plantPartId || null,
  );

  const { data: industries, isLoading: isLoadingIndustries } = useIndustries();
  const industry = industries?.find(
    (i: { id: number }) => i.id === paper?.industryId,
  );

  // Fetch related papers (papers with the same plant type)
  const { data: relatedPapers } = useResearchPapersByPlantType(
    paper?.plantTypeId || null,
  );

  // Filter out the current paper from related papers and limit to 4
  const filteredRelatedPapers = relatedPapers
    ?.filter((relatedPaper: ResearchPaper) => relatedPaper.id !== paper?.id)
    .slice(0, 4);

  // Generate page title and description for SEO
  const pageTitle = paper
    ? `${paper.title} | Research | HempQuarterz`
    : "Research Paper | HempQuarterz";
  const pageDescription =
    paper && paper.abstract
      ? `${paper.abstract.substring(0, 150)}...`
      : "Detailed information about industrial hemp research paper.";

  const isLoading =
    isLoadingPaper ||
    isLoadingPlantType ||
    isLoadingPlantPart ||
    isLoadingIndustries;

  return (
    <div className="research-detail-page">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            {createBreadcrumb([
              { href: "/", label: "Home" },
              { href: "/research", label: "Research" },
              {
                href: `/research/${id}`,
                label: paper?.title
                  ? paper.title.length > 40
                    ? paper.title.substring(0, 40) + "..."
                    : paper.title
                  : "Loading...",
                isCurrent: true,
              },
            ])}
          </div>

          {/* Back button */}
          <div className="mb-6">
            <Link href="/research">
              <Button
                variant="outline"
                className="text-green-400 border-green-700 hover:bg-green-900/30 hover:text-green-300"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to Research
              </Button>
            </Link>
          </div>

          {/* Research paper detail */}
          {!isLoading && paper ? (
            <ResearchPaperDetail
              paper={paper}
              isLoading={isLoading}
              plantType={plantType || null}
              plantPart={plantPart || null}
              industry={industry || null}
              relatedPapers={filteredRelatedPapers || []}
            />
          ) : (
            <ResearchPaperDetail paper={{} as any} isLoading={true} />
          )}
        </div>
      </div>
    </div>
  );
}
