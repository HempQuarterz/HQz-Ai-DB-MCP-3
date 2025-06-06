import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { Helmet } from "react-helmet";
import { usePlantType } from "@/hooks/use-plant-data";
import PlantVisualization from "@/components/plant/plant-visualization";
import Breadcrumb from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";

const PlantTypePage = () => {
  const [match, params] = useRoute("/plant-type/:id");
  const plantTypeId = match ? parseInt(params.id) : null;
  const { data: plantType, isLoading } = usePlantType(plantTypeId);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [plantTypeId]);

  if (!match) {
    return (
      <div className="py-12 bg-neutral-lightest" data-oid="wh3e5md">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          data-oid="6ya97ot"
        >
          <div
            className="bg-white rounded-xl shadow-md p-8 text-center"
            data-oid="gakj::i"
          >
            <h1
              className="text-2xl font-heading font-bold text-neutral-darkest mb-4"
              data-oid="uebffdf"
            >
              Plant Type Not Found
            </h1>
            <p className="text-neutral-dark mb-6" data-oid="siylx-e">
              The requested plant type could not be found.
            </p>
            <Link href="/" data-oid="zjciuk2">
              <a
                className="text-primary hover:text-primary-dark font-medium"
                data-oid="jlv6ezm"
              >
                Return to Homepage
              </a>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet data-oid="_h13j9s">
        <title data-oid="7mne5im">
          {isLoading
            ? "Loading Plant Type..."
            : `${plantType?.name || "Plant Type"} - HempDB`}
        </title>
        <meta
          name="description"
          content={
            isLoading
              ? "Loading plant type information..."
              : `Explore ${plantType?.name || "hemp plant"} parts and applications. ${plantType?.description || ""}`
          }
          data-oid="hzbv0aa"
        />
      </Helmet>

      <div className="py-6 bg-white" data-oid="c6kkrf_">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          data-oid="vj9tjw0"
        >
          {isLoading ? (
            <Skeleton className="h-6 w-48" data-oid="4ro3de_" />
          ) : (
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: plantType?.name || "Plant Type" },
              ]}
              data-oid="ixrin7i"
            />
          )}
        </div>
      </div>

      {/* Plant visualization component with part selection */}
      {plantTypeId && (
        <PlantVisualization plantTypeId={plantTypeId} data-oid="ni02mgw" />
      )}
    </>
  );
};

export default PlantTypePage;
