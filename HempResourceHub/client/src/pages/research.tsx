import { Helmet } from "react-helmet";
import { useResearchPapers } from "../hooks/use-research-papers";
import ResearchPaperList from "@/components/research/research-paper-list";
import { Separator } from "@/components/ui/separator";
import { createBreadcrumb } from "@/components/ui/breadcrumb";

export default function ResearchPage() {
  // Fetch research papers
  const { data: papers, isLoading } = useResearchPapers();

  return (
    <div className="research-page" data-oid="4t.5p6x">
      <Helmet data-oid="53i35y8">
        <title data-oid="t-zrxxl">Research Papers | HempQuarterz</title>
        <meta
          name="description"
          content="Explore peer-reviewed research papers on industrial hemp applications, cultivation methods, and potential benefits across various industries."
          data-oid="_7hci_f"
        />
      </Helmet>

      <div className="container mx-auto px-4 py-12" data-oid="56g7uf5">
        <div className="max-w-5xl mx-auto" data-oid="y7w3soi">
          {/* Breadcrumb */}
          <div className="mb-6" data-oid="::fgdm2">
            {createBreadcrumb([
              { href: "/", label: "Home" },
              { href: "/research", label: "Research", isCurrent: true },
            ])}
          </div>

          <div className="text-center mb-10" data-oid="3qv4z6n">
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-400 mb-4 drop-shadow-[0_0_4px_rgba(74,222,128,0.3)]"
              data-oid="f8wwun_"
            >
              Hemp Research Repository
            </h1>
            <p
              className="text-lg text-white/80 max-w-3xl mx-auto"
              data-oid=":c8dswr"
            >
              Explore our comprehensive collection of peer-reviewed research
              papers on industrial hemp applications, cultivation methods, and
              potential benefits.
            </p>
          </div>

          <Separator className="my-8 bg-green-900/50" data-oid="qwa-tsn" />

          <div className="mb-10" data-oid="lu2lx:j">
            <h2
              className="text-2xl font-bold text-green-400 mb-6"
              data-oid="a338wna"
            >
              Latest Research
            </h2>
            <ResearchPaperList
              papers={papers || []}
              isLoading={isLoading}
              emptyMessage="No research papers found. Check back soon for updates as our repository grows."
              data-oid="plkn07x"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
