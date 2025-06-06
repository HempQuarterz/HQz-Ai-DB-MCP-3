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
      <div className="py-12 bg-neutral-lightest">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h1 className="text-2xl font-heading font-bold text-neutral-darkest mb-4">
              Plant Type Not Found
            </h1>
            <p className="text-neutral-dark mb-6">
              The requested plant type could not be found.
            </p>
            <Link href="/">
              <a className="text-primary hover:text-primary-dark font-medium">
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
      <Helmet>
        <title>
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
        />
      </Helmet>

      <div className="py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <Skeleton className="h-6 w-48" />
          ) : (
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: plantType?.name || "Plant Type" },
              ]}
            />
          )}
        </div>
      </div>

      {/* Plant visualization component with part selection */}
      {plantTypeId && <PlantVisualization plantTypeId={plantTypeId} />}
    </>
  );
};

export default PlantTypePage;
