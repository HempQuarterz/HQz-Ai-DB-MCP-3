import { ResearchPaper } from "@shared/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  industryNames = {},
}: ResearchPaperCardProps) => {
  // Format the publication date
  const formattedDate = paper.publicationDate
    ? format(new Date(paper.publicationDate), "MMM d, yyyy")
    : "Date not available";

  return (
    <Card
      className="overflow-hidden border-green-600/50 bg-black/80 hover:border-green-500 transition-all duration-300"
      data-oid=":3y2f51"
    >
      <CardHeader className="p-4 pb-2" data-oid="0ufwurg">
        <CardTitle
          className="text-xl font-semibold text-green-400 line-clamp-2"
          data-oid="g3-g6vp"
        >
          {paper.title}
        </CardTitle>
        <CardDescription
          className="flex items-center gap-1 text-white/70"
          data-oid="i7pfmx7"
        >
          <BookOpen size={14} data-oid="gvw9tbj" />
          <span data-oid="25b.ixf">{paper.authors}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2" data-oid="l153ff3">
        <div
          className="mb-4 text-sm text-white line-clamp-3"
          data-oid="r6jdb9x"
        >
          {paper.abstract}
        </div>

        <div className="flex flex-wrap gap-1 mb-3" data-oid="0suma2r">
          {paper.keywords?.map((keyword, idx) => (
            <Badge
              key={idx}
              variant="outline"
              className="text-xs bg-green-900/50 text-green-300 border-green-800"
              data-oid="tw0e35u"
            >
              {keyword}
            </Badge>
          ))}
        </div>

        <div
          className="grid grid-cols-2 gap-2 text-xs text-white/70"
          data-oid="..hvfec"
        >
          {paper.plantTypeId && plantTypeNames[paper.plantTypeId] && (
            <div data-oid="_o-trl8">
              <span className="block text-white/50" data-oid="xsrym_0">
                Plant Type
              </span>
              <span className="text-green-300" data-oid="1hy5.6x">
                {plantTypeNames[paper.plantTypeId]}
              </span>
            </div>
          )}

          {paper.plantPartId && plantPartNames[paper.plantPartId] && (
            <div data-oid="q6-8ftj">
              <span className="block text-white/50" data-oid="v_-j4y4">
                Plant Part
              </span>
              <span className="text-green-300" data-oid="e14j9sl">
                {plantPartNames[paper.plantPartId]}
              </span>
            </div>
          )}

          {paper.industryId && industryNames[paper.industryId] && (
            <div data-oid="j7e..s-">
              <span className="block text-white/50" data-oid="l6-ap98">
                Industry
              </span>
              <span className="text-green-300" data-oid=".1umwjf">
                {industryNames[paper.industryId]}
              </span>
            </div>
          )}

          <div data-oid="d.eb:x3">
            <span className="block text-white/50" data-oid="4mh9w0m">
              Published
            </span>
            <span className="flex items-center gap-1" data-oid="mvsfsdj">
              <CalendarIcon size={12} data-oid="yc1:i3s" />
              {formattedDate}
            </span>
          </div>

          {paper.journal && (
            <div data-oid="y:-vxeg">
              <span className="block text-white/50" data-oid="r.wnqgy">
                Journal
              </span>
              <span className="line-clamp-1" data-oid="jzp9u-s">
                {paper.journal}
              </span>
            </div>
          )}

          {paper.citations !== null && paper.citations !== undefined && (
            <div data-oid="pcq9b_d">
              <span className="block text-white/50" data-oid="m7rcz1y">
                Citations
              </span>
              <span data-oid="s8g_.re">{paper.citations}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter
        className="p-4 flex justify-between border-t border-green-900/30 bg-green-950/20"
        data-oid="1o.4bug"
      >
        <Link href={`/research/${paper.id}`} data-oid="7p.m54_">
          <Button
            variant="outline"
            size="sm"
            className="text-green-400 border-green-700 hover:bg-green-900/30 hover:text-green-300"
            data-oid="t9jegwi"
          >
            <FileText size={16} className="mr-1" data-oid="ll:swk5" />
            Details
          </Button>
        </Link>

        {paper.url && (
          <a
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            data-oid="o:py-ik"
          >
            <Button
              variant="outline"
              size="sm"
              className="text-green-400 border-green-700 hover:bg-green-900/30 hover:text-green-300"
              data-oid="n:hk8al"
            >
              <ArrowUpRight size={16} className="mr-1" data-oid="whij0x6" />
              View Source
            </Button>
          </a>
        )}
      </CardFooter>
    </Card>
  );
};

export default ResearchPaperCard;
