import { ResearchPaper, PlantType, PlantPart, Industry } from "@shared/schema";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CalendarIcon, 
  BookOpen, 
  ArrowUpRight, 
  FileText, 
  Link as LinkIcon, 
  Quote, 
  BookmarkIcon,
  Tag 
} from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";

interface ResearchPaperDetailProps {
  paper: ResearchPaper;
  isLoading?: boolean;
  plantType?: PlantType | null;
  plantPart?: PlantPart | null;
  industry?: Industry | null;
  relatedPapers?: ResearchPaper[];
}

const ResearchPaperDetail = ({ 
  paper, 
  isLoading = false,
  plantType,
  plantPart,
  industry,
  relatedPapers = []
}: ResearchPaperDetailProps) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="border-green-600/50 bg-black/80">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 bg-green-900/20" />
            <Skeleton className="h-4 w-1/2 bg-green-900/20" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full mb-6 bg-green-900/20" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Skeleton className="h-16 w-full bg-green-900/20" />
              <Skeleton className="h-16 w-full bg-green-900/20" />
              <Skeleton className="h-16 w-full bg-green-900/20" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format the publication date
  const formattedDate = paper.publicationDate 
    ? format(new Date(paper.publicationDate), 'MMM d, yyyy') 
    : 'Date not available';

  return (
    <div className="space-y-6">
      <Card className="border-green-600/50 bg-black/80">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl sm:text-3xl font-semibold text-green-400">
              {paper.title}
            </CardTitle>
            {paper.pdfUrl && (
              <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="text-green-400 border-green-700 hover:bg-green-900/30 hover:text-green-300">
                  <FileText size={16} className="mr-1" />
                  PDF
                </Button>
              </a>
            )}
          </div>
          <div className="flex flex-wrap gap-2 items-center text-white/70 mt-2">
            <div className="flex items-center gap-1">
              <BookOpen size={16} />
              <span className="text-lg">{paper.authors}</span>
            </div>
            {paper.journal && (
              <>
                <Separator orientation="vertical" className="h-4 bg-green-600/30" />
                <span>{paper.journal}</span>
              </>
            )}
            {paper.publicationDate && (
              <>
                <Separator orientation="vertical" className="h-4 bg-green-600/30" />
                <div className="flex items-center gap-1">
                  <CalendarIcon size={16} />
                  <span>{formattedDate}</span>
                </div>
              </>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {/* Abstract */}
          <div className="mb-6">
            <h3 className="text-xl text-green-400 mb-2">Abstract</h3>
            <p className="text-white leading-relaxed">{paper.abstract}</p>
          </div>

          {/* Keywords */}
          {paper.keywords && paper.keywords.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Tag size={18} className="text-green-400" />
                <h3 className="text-lg text-green-400">Keywords</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {paper.keywords.map((keyword, idx) => (
                  <Badge key={idx} className="bg-green-900/50 text-green-300 border-green-800 hover:bg-green-800/50">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Plant Type */}
            {plantType && (
              <div className="bg-green-950/30 p-4 rounded-md border border-green-900/50">
                <h4 className="text-white/70 mb-1">Plant Type</h4>
                <Link href={`/plant-type/${plantType.id}`}>
                  <a className="text-green-400 hover:text-green-300 font-medium flex items-center gap-1">
                    {plantType.name}
                    <LinkIcon size={14} />
                  </a>
                </Link>
                {plantType.description && (
                  <p className="text-sm text-white/70 mt-1 line-clamp-2">{plantType.description}</p>
                )}
              </div>
            )}

            {/* Plant Part */}
            {plantPart && (
              <div className="bg-green-950/30 p-4 rounded-md border border-green-900/50">
                <h4 className="text-white/70 mb-1">Plant Part</h4>
                <Link href={`/plant-part/${plantPart.id}`}>
                  <a className="text-green-400 hover:text-green-300 font-medium flex items-center gap-1">
                    {plantPart.name}
                    <LinkIcon size={14} />
                  </a>
                </Link>
                {plantPart.description && (
                  <p className="text-sm text-white/70 mt-1 line-clamp-2">{plantPart.description}</p>
                )}
              </div>
            )}

            {/* Industry */}
            {industry && (
              <div className="bg-green-950/30 p-4 rounded-md border border-green-900/50">
                <h4 className="text-white/70 mb-1">Industry</h4>
                <Link href={`/industries?id=${industry.id}`}>
                  <a className="text-green-400 hover:text-green-300 font-medium flex items-center gap-1">
                    {industry.name}
                    <LinkIcon size={14} />
                  </a>
                </Link>
                {industry.description && (
                  <p className="text-sm text-white/70 mt-1 line-clamp-2">{industry.description}</p>
                )}
              </div>
            )}

            {/* DOI */}
            {paper.doi && (
              <div className="bg-green-950/30 p-4 rounded-md border border-green-900/50">
                <h4 className="text-white/70 mb-1">DOI</h4>
                <a 
                  href={`https://doi.org/${paper.doi}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 font-medium flex items-center gap-1 break-all"
                >
                  {paper.doi}
                  <ArrowUpRight size={14} />
                </a>
              </div>
            )}

            {/* Citations */}
            {paper.citations !== null && paper.citations !== undefined && (
              <div className="bg-green-950/30 p-4 rounded-md border border-green-900/50">
                <h4 className="text-white/70 mb-1">Citations</h4>
                <div className="flex items-center gap-2">
                  <Quote size={18} className="text-green-400" />
                  <span className="text-green-300 font-medium text-lg">{paper.citations}</span>
                </div>
              </div>
            )}

            {/* URL */}
            {paper.url && (
              <div className="bg-green-950/30 p-4 rounded-md border border-green-900/50">
                <h4 className="text-white/70 mb-1">Source</h4>
                <a 
                  href={paper.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 font-medium flex items-center gap-1"
                >
                  Visit Publisher Site
                  <ArrowUpRight size={14} />
                </a>
              </div>
            )}
          </div>

          {/* Related Papers */}
          {relatedPapers.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookmarkIcon size={18} className="text-green-400" />
                <h3 className="text-lg text-green-400">Related Research</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedPapers.map(relatedPaper => (
                  <Card key={relatedPaper.id} className="border-green-600/30 bg-black/60 hover:border-green-500/50">
                    <CardContent className="p-4">
                      <Link href={`/research/${relatedPaper.id}`}>
                        <a className="text-green-400 hover:text-green-300 font-medium line-clamp-2">
                          {relatedPaper.title}
                        </a>
                      </Link>
                      <p className="text-sm text-white/70 mt-1">{relatedPaper.authors}</p>
                      <p className="text-xs text-white/50 mt-1">{relatedPaper.journal}, {
                        relatedPaper.publicationDate 
                          ? format(new Date(relatedPaper.publicationDate), 'yyyy') 
                          : 'Date not available'
                      }</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearchPaperDetail;