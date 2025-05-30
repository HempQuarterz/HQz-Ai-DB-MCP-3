import { ResearchPaper } from "@shared/schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, BookOpen, ArrowUpRight, FileText } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

interface ResearchPaperCardProps {
  paper: ResearchPaper;
  plantTypeNames?: Record<number, string>;
  plantPartNames?: Record<number, string>;
  industryNames?: Record<number, string>;
}

const ResearchPaperCard = ({ 
  paper, 
  plantTypeNames = {}, 
  plantPartNames = {}, 
  industryNames = {} 
}: ResearchPaperCardProps) => {
  // Format the publication date
  const formattedDate = paper.publicationDate 
    ? format(new Date(paper.publicationDate), 'MMM d, yyyy') 
    : 'Date not available';

  return (
    <Card className="overflow-hidden border-green-600/50 bg-black/80 hover:border-green-500 transition-all duration-300">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-xl font-semibold text-green-400 line-clamp-2">
          {paper.title}
        </CardTitle>
        <CardDescription className="flex items-center gap-1 text-white/70">
          <BookOpen size={14} />
          <span>{paper.authors}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="mb-4 text-sm text-white line-clamp-3">
          {paper.abstract}
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {paper.keywords?.map((keyword, idx) => (
            <Badge key={idx} variant="outline" className="text-xs bg-green-900/50 text-green-300 border-green-800">
              {keyword}
            </Badge>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs text-white/70">
          {paper.plantTypeId && plantTypeNames[paper.plantTypeId] && (
            <div>
              <span className="block text-white/50">Plant Type</span>
              <span className="text-green-300">{plantTypeNames[paper.plantTypeId]}</span>
            </div>
          )}
          
          {paper.plantPartId && plantPartNames[paper.plantPartId] && (
            <div>
              <span className="block text-white/50">Plant Part</span>
              <span className="text-green-300">{plantPartNames[paper.plantPartId]}</span>
            </div>
          )}
          
          {paper.industryId && industryNames[paper.industryId] && (
            <div>
              <span className="block text-white/50">Industry</span>
              <span className="text-green-300">{industryNames[paper.industryId]}</span>
            </div>
          )}
          
          <div>
            <span className="block text-white/50">Published</span>
            <span className="flex items-center gap-1">
              <CalendarIcon size={12} />
              {formattedDate}
            </span>
          </div>
          
          {paper.journal && (
            <div>
              <span className="block text-white/50">Journal</span>
              <span className="line-clamp-1">{paper.journal}</span>
            </div>
          )}
          
          {paper.citations !== null && paper.citations !== undefined && (
            <div>
              <span className="block text-white/50">Citations</span>
              <span>{paper.citations}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between border-t border-green-900/30 bg-green-950/20">
        <Link href={`/research/${paper.id}`}>
          <Button variant="outline" size="sm" className="text-green-400 border-green-700 hover:bg-green-900/30 hover:text-green-300">
            <FileText size={16} className="mr-1" />
            Details
          </Button>
        </Link>
        
        {paper.url && (
          <a href={paper.url} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="text-green-400 border-green-700 hover:bg-green-900/30 hover:text-green-300">
              <ArrowUpRight size={16} className="mr-1" />
              View Source
            </Button>
          </a>
        )}
      </CardFooter>
    </Card>
  );
};

export default ResearchPaperCard;