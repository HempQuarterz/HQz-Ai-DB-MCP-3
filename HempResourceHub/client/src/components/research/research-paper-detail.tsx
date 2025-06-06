import { ResearchPaper, PlantType, PlantPart, Industry } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Tag,
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
  relatedPapers = [],
}: ResearchPaperDetailProps) => {
  if (isLoading) {
    return (
      <div className="space-y-6" data-oid="7u4tlbo">
        <Card className="border-green-600/50 bg-black/80" data-oid="bx.jfbt">
          <CardHeader data-oid="byy_dz1">
            <Skeleton
              className="h-8 w-3/4 bg-green-900/20"
              data-oid="f8lr4fx"
            />
            <Skeleton
              className="h-4 w-1/2 bg-green-900/20"
              data-oid="0cbaixl"
            />
          </CardHeader>
          <CardContent data-oid="o4o:501">
            <Skeleton
              className="h-48 w-full mb-6 bg-green-900/20"
              data-oid="dl1yaxy"
            />
            <div
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
              data-oid="u9-z3rn"
            >
              <Skeleton
                className="h-16 w-full bg-green-900/20"
                data-oid="lk37nux"
              />
              <Skeleton
                className="h-16 w-full bg-green-900/20"
                data-oid="ng_5cwg"
              />
              <Skeleton
                className="h-16 w-full bg-green-900/20"
                data-oid="8gqt.zj"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format the publication date
  const formattedDate = paper.publicationDate
    ? format(new Date(paper.publicationDate), "MMM d, yyyy")
    : "Date not available";

  return (
    <div className="space-y-6" data-oid=".p_z._z">
      <Card className="border-green-600/50 bg-black/80" data-oid="gxm..d3">
        <CardHeader className="pb-2" data-oid="7:azr8m">
          <div className="flex justify-between items-start" data-oid="q.puvhx">
            <CardTitle
              className="text-2xl sm:text-3xl font-semibold text-green-400"
              data-oid="-k20x2x"
            >
              {paper.title}
            </CardTitle>
            {paper.pdfUrl && (
              <a
                href={paper.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-oid="7nky7i-"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-400 border-green-700 hover:bg-green-900/30 hover:text-green-300"
                  data-oid="83yq2_."
                >
                  <FileText size={16} className="mr-1" data-oid="qyg0674" />
                  PDF
                </Button>
              </a>
            )}
          </div>
          <div
            className="flex flex-wrap gap-2 items-center text-white/70 mt-2"
            data-oid="8ttpdnu"
          >
            <div className="flex items-center gap-1" data-oid="glsd6hd">
              <BookOpen size={16} data-oid="j1y_919" />
              <span className="text-lg" data-oid=".56.fy7">
                {paper.authors}
              </span>
            </div>
            {paper.journal && (
              <>
                <Separator
                  orientation="vertical"
                  className="h-4 bg-green-600/30"
                  data-oid="_sm.l6q"
                />
                <span data-oid="74-1.fk">{paper.journal}</span>
              </>
            )}
            {paper.publicationDate && (
              <>
                <Separator
                  orientation="vertical"
                  className="h-4 bg-green-600/30"
                  data-oid="fzbtq7s"
                />
                <div className="flex items-center gap-1" data-oid=":a-o4bc">
                  <CalendarIcon size={16} data-oid="9f3v0c-" />
                  <span data-oid="eemjkim">{formattedDate}</span>
                </div>
              </>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-4" data-oid="m7m1-b6">
          {/* Abstract */}
          <div className="mb-6" data-oid="y.c_g5m">
            <h3 className="text-xl text-green-400 mb-2" data-oid="rx.1d_n">
              Abstract
            </h3>
            <p className="text-white leading-relaxed" data-oid="y1tiyhw">
              {paper.abstract}
            </p>
          </div>

          {/* Keywords */}
          {paper.keywords && paper.keywords.length > 0 && (
            <div className="mb-6" data-oid="7e9ygyq">
              <div className="flex items-center gap-2 mb-2" data-oid="5m0csjm">
                <Tag size={18} className="text-green-400" data-oid="ak_xg5y" />
                <h3 className="text-lg text-green-400" data-oid="al8zjm5">
                  Keywords
                </h3>
              </div>
              <div className="flex flex-wrap gap-2" data-oid="z5gf1e6">
                {paper.keywords.map((keyword, idx) => (
                  <Badge
                    key={idx}
                    className="bg-green-900/50 text-green-300 border-green-800 hover:bg-green-800/50"
                    data-oid="l6oy_:x"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Details */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
            data-oid="71pgdfx"
          >
            {/* Plant Type */}
            {plantType && (
              <div
                className="bg-green-950/30 p-4 rounded-md border border-green-900/50"
                data-oid="waspo-b"
              >
                <h4 className="text-white/70 mb-1" data-oid="k7ipqo1">
                  Plant Type
                </h4>
                <Link href={`/plant-type/${plantType.id}`} data-oid="vcw3o_0">
                  <a
                    className="text-green-400 hover:text-green-300 font-medium flex items-center gap-1"
                    data-oid="x:mu2jp"
                  >
                    {plantType.name}
                    <LinkIcon size={14} data-oid="v59d1lc" />
                  </a>
                </Link>
                {plantType.description && (
                  <p
                    className="text-sm text-white/70 mt-1 line-clamp-2"
                    data-oid="vhl8m86"
                  >
                    {plantType.description}
                  </p>
                )}
              </div>
            )}

            {/* Plant Part */}
            {plantPart && (
              <div
                className="bg-green-950/30 p-4 rounded-md border border-green-900/50"
                data-oid="xjd3z9w"
              >
                <h4 className="text-white/70 mb-1" data-oid="r.86l0o">
                  Plant Part
                </h4>
                <Link href={`/plant-part/${plantPart.id}`} data-oid="jyyb4db">
                  <a
                    className="text-green-400 hover:text-green-300 font-medium flex items-center gap-1"
                    data-oid="d44i_rm"
                  >
                    {plantPart.name}
                    <LinkIcon size={14} data-oid="6z3lk.9" />
                  </a>
                </Link>
                {plantPart.description && (
                  <p
                    className="text-sm text-white/70 mt-1 line-clamp-2"
                    data-oid="tv5goq3"
                  >
                    {plantPart.description}
                  </p>
                )}
              </div>
            )}

            {/* Industry */}
            {industry && (
              <div
                className="bg-green-950/30 p-4 rounded-md border border-green-900/50"
                data-oid="ka5adh1"
              >
                <h4 className="text-white/70 mb-1" data-oid="uslgtiw">
                  Industry
                </h4>
                <Link href={`/industries?id=${industry.id}`} data-oid=":kew.n4">
                  <a
                    className="text-green-400 hover:text-green-300 font-medium flex items-center gap-1"
                    data-oid="6u-_oki"
                  >
                    {industry.name}
                    <LinkIcon size={14} data-oid="-zoofc9" />
                  </a>
                </Link>
                {industry.description && (
                  <p
                    className="text-sm text-white/70 mt-1 line-clamp-2"
                    data-oid="i1a03aq"
                  >
                    {industry.description}
                  </p>
                )}
              </div>
            )}

            {/* DOI */}
            {paper.doi && (
              <div
                className="bg-green-950/30 p-4 rounded-md border border-green-900/50"
                data-oid="12r.92m"
              >
                <h4 className="text-white/70 mb-1" data-oid="hqajqeg">
                  DOI
                </h4>
                <a
                  href={`https://doi.org/${paper.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 font-medium flex items-center gap-1 break-all"
                  data-oid="gulhjyk"
                >
                  {paper.doi}
                  <ArrowUpRight size={14} data-oid="r66u6na" />
                </a>
              </div>
            )}

            {/* Citations */}
            {paper.citations !== null && paper.citations !== undefined && (
              <div
                className="bg-green-950/30 p-4 rounded-md border border-green-900/50"
                data-oid="ytt7apk"
              >
                <h4 className="text-white/70 mb-1" data-oid="bn54_92">
                  Citations
                </h4>
                <div className="flex items-center gap-2" data-oid="yod245h">
                  <Quote
                    size={18}
                    className="text-green-400"
                    data-oid="lg31-3g"
                  />
                  <span
                    className="text-green-300 font-medium text-lg"
                    data-oid="5:j72_2"
                  >
                    {paper.citations}
                  </span>
                </div>
              </div>
            )}

            {/* URL */}
            {paper.url && (
              <div
                className="bg-green-950/30 p-4 rounded-md border border-green-900/50"
                data-oid=":onginp"
              >
                <h4 className="text-white/70 mb-1" data-oid=":2k-.nl">
                  Source
                </h4>
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 font-medium flex items-center gap-1"
                  data-oid="9unxrlu"
                >
                  Visit Publisher Site
                  <ArrowUpRight size={14} data-oid="0k48atr" />
                </a>
              </div>
            )}
          </div>

          {/* Related Papers */}
          {relatedPapers.length > 0 && (
            <div data-oid="n00.kch">
              <div className="flex items-center gap-2 mb-4" data-oid="by7ja3o">
                <BookmarkIcon
                  size={18}
                  className="text-green-400"
                  data-oid="xarw6zv"
                />
                <h3 className="text-lg text-green-400" data-oid="l.-gs69">
                  Related Research
                </h3>
              </div>
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                data-oid="vdurkuc"
              >
                {relatedPapers.map((relatedPaper) => (
                  <Card
                    key={relatedPaper.id}
                    className="border-green-600/30 bg-black/60 hover:border-green-500/50"
                    data-oid="q2e21:c"
                  >
                    <CardContent className="p-4" data-oid="9118cbs">
                      <Link
                        href={`/research/${relatedPaper.id}`}
                        data-oid="ft7-k1:"
                      >
                        <a
                          className="text-green-400 hover:text-green-300 font-medium line-clamp-2"
                          data-oid="uw9xf0i"
                        >
                          {relatedPaper.title}
                        </a>
                      </Link>
                      <p
                        className="text-sm text-white/70 mt-1"
                        data-oid="n5:1-nv"
                      >
                        {relatedPaper.authors}
                      </p>
                      <p
                        className="text-xs text-white/50 mt-1"
                        data-oid="05z842y"
                      >
                        {relatedPaper.journal},{" "}
                        {relatedPaper.publicationDate
                          ? format(
                              new Date(relatedPaper.publicationDate),
                              "yyyy",
                            )
                          : "Date not available"}
                      </p>
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
