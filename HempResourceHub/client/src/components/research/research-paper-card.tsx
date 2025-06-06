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
      data-oid="jjythir"
    >
      <CardHeader className="p-4 pb-2" data-oid="vdntxcb">
        <CardTitle
          className="text-xl font-semibold text-green-400 line-clamp-2"
          data-oid="fpu:b6-"
        >
          {paper.title}
        </CardTitle>
        <CardDescription
          className="flex items-center gap-1 text-white/70"
          data-oid="zfywnli"
        >
          <BookOpen size={14} data-oid="ahlgwt5" />
          <span data-oid="aub7vuq">{paper.authors}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2" data-oid="-o3vmv0">
        <div
          className="mb-4 text-sm text-white line-clamp-3"
          data-oid="n6n96m7"
        >
          {paper.abstract}
        </div>

        <div className="flex flex-wrap gap-1 mb-3" data-oid="8f5yf82">
          {paper.keywords?.map((keyword, idx) => (
            <Badge
              key={idx}
              variant="outline"
              className="text-xs bg-green-900/50 text-green-300 border-green-800"
              data-oid="wpdqfa."
            >
              {keyword}
            </Badge>
          ))}
        </div>

        <div
          className="grid grid-cols-2 gap-2 text-xs text-white/70"
          data-oid="94sqtsg"
        >
          {paper.plantTypeId && plantTypeNames[paper.plantTypeId] && (
            <div data-oid="o5i5zh5">
              <span className="block text-white/50" data-oid="kjbumyz">
                Plant Type
              </span>
              <span className="text-green-300" data-oid="eddiyfr">
                {plantTypeNames[paper.plantTypeId]}
              </span>
            </div>
          )}

          {paper.plantPartId && plantPartNames[paper.plantPartId] && (
            <div data-oid="aiffgsd">
              <span className="block text-white/50" data-oid="5-oeu:w">
                Plant Part
              </span>
              <span className="text-green-300" data-oid="qh.pc3u">
                {plantPartNames[paper.plantPartId]}
              </span>
            </div>
          )}

          {paper.industryId && industryNames[paper.industryId] && (
            <div data-oid="mfsw.:z">
              <span className="block text-white/50" data-oid="nw-fo:2">
                Industry
              </span>
              <span className="text-green-300" data-oid="mjwcx9s">
                {industryNames[paper.industryId]}
              </span>
            </div>
          )}

          <div data-oid="c7211di">
            <span className="block text-white/50" data-oid="7ep8i3_">
              Published
            </span>
            <span className="flex items-center gap-1" data-oid="-vn_96e">
              <CalendarIcon size={12} data-oid="s.gvr2_" />
              {formattedDate}
            </span>
          </div>

          {paper.journal && (
            <div data-oid="7a1icnk">
              <span className="block text-white/50" data-oid="ufa3de0">
                Journal
              </span>
              <span className="line-clamp-1" data-oid="4x_ywk_">
                {paper.journal}
              </span>
            </div>
          )}

          {paper.citations !== null && paper.citations !== undefined && (
            <div data-oid="3eyk0sf">
              <span className="block text-white/50" data-oid="3hugavx">
                Citations
              </span>
              <span data-oid="_owc:bk">{paper.citations}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter
        className="p-4 flex justify-between border-t border-green-900/30 bg-green-950/20"
        data-oid="i0xoyf7"
      >
        <Link href={`/research/${paper.id}`} data-oid="em6bw8i">
          <Button
            variant="outline"
            size="sm"
            className="text-green-400 border-green-700 hover:bg-green-900/30 hover:text-green-300"
            data-oid="2be89o4"
          >
            <FileText size={16} className="mr-1" data-oid="m_xu9iq" />
            Details
          </Button>
        </Link>

        {paper.url && (
          <a
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            data-oid="hk1jg.r"
          >
            <Button
              variant="outline"
              size="sm"
              className="text-green-400 border-green-700 hover:bg-green-900/30 hover:text-green-300"
              data-oid="c5r3ze4"
            >
              <ArrowUpRight size={16} className="mr-1" data-oid="9nz6-v:" />
              View Source
            </Button>
          </a>
        )}
      </CardFooter>
    </Card>
  );
};

export default ResearchPaperCard;
