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
      <div className="space-y-6" data-oid="k4ceit_">
        <Card className="border-green-600/50 bg-black/80" data-oid="v79f4v:">
          <CardHeader data-oid="9-xeti0">
            <Skeleton
              className="h-8 w-3/4 bg-green-900/20"
              data-oid="_51z5kz"
            />

            <Skeleton
              className="h-4 w-1/2 bg-green-900/20"
              data-oid="ndsiw::"
            />
          </CardHeader>
          <CardContent data-oid="hvcb7sr">
            <Skeleton
              className="h-48 w-full mb-6 bg-green-900/20"
              data-oid="l34o8qr"
            />

            <div
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
              data-oid="5rs0g8n"
            >
              <Skeleton
                className="h-16 w-full bg-green-900/20"
                data-oid="l1ud.ay"
              />

              <Skeleton
                className="h-16 w-full bg-green-900/20"
                data-oid="dd4.s51"
              />

              <Skeleton
                className="h-16 w-full bg-green-900/20"
                data-oid="0_p214v"
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
    <div className="space-y-6" data-oid="txgo1kw">
      <Card className="border-green-600/50 bg-black/80" data-oid="bcrc-yb">
        <CardHeader className="pb-2" data-oid="5804axo">
          <div className="flex justify-between items-start" data-oid="fttu.dr">
            <CardTitle
              className="text-2xl sm:text-3xl font-semibold text-green-400"
              data-oid="3i:r658"
            >
              {paper.title}
            </CardTitle>
            {paper.pdfUrl && (
              <a
                href={paper.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-oid="q_-1cs1"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-400 border-green-700 hover:bg-green-900/30 hover:text-green-300"
                  data-oid="ak5:2cb"
                >
                  <FileText size={16} className="mr-1" data-oid="l_emnws" />
                  PDF
                </Button>
              </a>
            )}
          </div>
          <div
            className="flex flex-wrap gap-2 items-center text-white/70 mt-2"
            data-oid="_nm71v3"
          >
            <div className="flex items-center gap-1" data-oid="k-61_lg">
              <BookOpen size={16} data-oid="q8bpx2g" />
              <span className="text-lg" data-oid="1j6o_2b">
                {paper.authors}
              </span>
            </div>
            {paper.journal && (
              <>
                <Separator
                  orientation="vertical"
                  className="h-4 bg-green-600/30"
                  data-oid="ltu.x-g"
                />

                <span data-oid="u65759c">{paper.journal}</span>
              </>
            )}
            {paper.publicationDate && (
              <>
                <Separator
                  orientation="vertical"
                  className="h-4 bg-green-600/30"
                  data-oid="1l4x5t:"
                />

                <div className="flex items-center gap-1" data-oid="f87jd5b">
                  <CalendarIcon size={16} data-oid="o1y.d23" />
                  <span data-oid="0m6c0f:">{formattedDate}</span>
                </div>
              </>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-4" data-oid="wjdyb3o">
          {/* Abstract */}
          <div className="mb-6" data-oid="r9evemi">
            <h3 className="text-xl text-green-400 mb-2" data-oid="vht::v_">
              Abstract
            </h3>
            <p className="text-white leading-relaxed" data-oid="ndutn1k">
              {paper.abstract}
            </p>
          </div>

          {/* Keywords */}
          {paper.keywords && paper.keywords.length > 0 && (
            <div className="mb-6" data-oid="xr_sq.p">
              <div className="flex items-center gap-2 mb-2" data-oid="eg7ocpx">
                <Tag size={18} className="text-green-400" data-oid="1x5plox" />
                <h3 className="text-lg text-green-400" data-oid="uehgnj7">
                  Keywords
                </h3>
              </div>
              <div className="flex flex-wrap gap-2" data-oid="91c1f38">
                {paper.keywords.map((keyword, idx) => (
                  <Badge
                    key={idx}
                    className="bg-green-900/50 text-green-300 border-green-800 hover:bg-green-800/50"
                    data-oid="t-5srey"
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
            data-oid="mrafi6e"
          >
            {/* Plant Type */}
            {plantType && (
              <div
                className="bg-green-950/30 p-4 rounded-md border border-green-900/50"
                data-oid="cbguj0f"
              >
                <h4 className="text-white/70 mb-1" data-oid="eorup:j">
                  Plant Type
                </h4>
                <Link href={`/plant-type/${plantType.id}`} data-oid="-4x.68u">
                  <a
                    className="text-green-400 hover:text-green-300 font-medium flex items-center gap-1"
                    data-oid="975lvy_"
                  >
                    {plantType.name}
                    <LinkIcon size={14} data-oid="21.ji74" />
                  </a>
                </Link>
                {plantType.description && (
                  <p
                    className="text-sm text-white/70 mt-1 line-clamp-2"
                    data-oid="ay9qlyo"
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
                data-oid="yzemtc8"
              >
                <h4 className="text-white/70 mb-1" data-oid="zo0vjou">
                  Plant Part
                </h4>
                <Link href={`/plant-part/${plantPart.id}`} data-oid="9e8.n10">
                  <a
                    className="text-green-400 hover:text-green-300 font-medium flex items-center gap-1"
                    data-oid="9g7m_9q"
                  >
                    {plantPart.name}
                    <LinkIcon size={14} data-oid="ro973-s" />
                  </a>
                </Link>
                {plantPart.description && (
                  <p
                    className="text-sm text-white/70 mt-1 line-clamp-2"
                    data-oid="xax6qnr"
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
                data-oid="9jnhjrk"
              >
                <h4 className="text-white/70 mb-1" data-oid="lunqv2p">
                  Industry
                </h4>
                <Link href={`/industries?id=${industry.id}`} data-oid="t1rhs9k">
                  <a
                    className="text-green-400 hover:text-green-300 font-medium flex items-center gap-1"
                    data-oid="9_u7f2x"
                  >
                    {industry.name}
                    <LinkIcon size={14} data-oid="515ret8" />
                  </a>
                </Link>
                {industry.description && (
                  <p
                    className="text-sm text-white/70 mt-1 line-clamp-2"
                    data-oid="u:yp4jj"
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
                data-oid="qcxmtl1"
              >
                <h4 className="text-white/70 mb-1" data-oid="rrgua7v">
                  DOI
                </h4>
                <a
                  href={`https://doi.org/${paper.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 font-medium flex items-center gap-1 break-all"
                  data-oid="bmd...f"
                >
                  {paper.doi}
                  <ArrowUpRight size={14} data-oid="6t203nw" />
                </a>
              </div>
            )}

            {/* Citations */}
            {paper.citations !== null && paper.citations !== undefined && (
              <div
                className="bg-green-950/30 p-4 rounded-md border border-green-900/50"
                data-oid="e_trl1f"
              >
                <h4 className="text-white/70 mb-1" data-oid="a-ty.3m">
                  Citations
                </h4>
                <div className="flex items-center gap-2" data-oid="4y.vm-h">
                  <Quote
                    size={18}
                    className="text-green-400"
                    data-oid="3zho1-e"
                  />

                  <span
                    className="text-green-300 font-medium text-lg"
                    data-oid="lhue9_k"
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
                data-oid="_0-.l6d"
              >
                <h4 className="text-white/70 mb-1" data-oid="5dr5q1e">
                  Source
                </h4>
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 font-medium flex items-center gap-1"
                  data-oid="e6zn6o0"
                >
                  Visit Publisher Site
                  <ArrowUpRight size={14} data-oid="laec1o." />
                </a>
              </div>
            )}
          </div>

          {/* Related Papers */}
          {relatedPapers.length > 0 && (
            <div data-oid="lolakyo">
              <div className="flex items-center gap-2 mb-4" data-oid="209uhh4">
                <BookmarkIcon
                  size={18}
                  className="text-green-400"
                  data-oid="gp70m1w"
                />

                <h3 className="text-lg text-green-400" data-oid="-gty0t0">
                  Related Research
                </h3>
              </div>
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                data-oid="phxgbzg"
              >
                {relatedPapers.map((relatedPaper) => (
                  <Card
                    key={relatedPaper.id}
                    className="border-green-600/30 bg-black/60 hover:border-green-500/50"
                    data-oid="5fu_9tz"
                  >
                    <CardContent className="p-4" data-oid="-u.6.re">
                      <Link
                        href={`/research/${relatedPaper.id}`}
                        data-oid="bhc_pe6"
                      >
                        <a
                          className="text-green-400 hover:text-green-300 font-medium line-clamp-2"
                          data-oid="b:rx:.o"
                        >
                          {relatedPaper.title}
                        </a>
                      </Link>
                      <p
                        className="text-sm text-white/70 mt-1"
                        data-oid="5u21fic"
                      >
                        {relatedPaper.authors}
                      </p>
                      <p
                        className="text-xs text-white/50 mt-1"
                        data-oid="i0jdg9v"
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
