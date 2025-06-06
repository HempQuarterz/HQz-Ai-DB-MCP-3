import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { Helmet } from "react-helmet";
import { usePlantPart } from "@/hooks/use-plant-data";
import { useHempProducts, useHempProduct } from "@/hooks/use-product-data";
import { useIndustries } from "@/hooks/use-plant-data";
import Breadcrumb from "@/components/ui/breadcrumb";
import IndustryFilter from "@/components/product/industry-filter";
import ProductCard from "@/components/product/product-card";
import ProductPagination from "@/components/product/product-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { InfoIcon } from "lucide-react";

const PlantPartPage = () => {
  const [match, params] = useRoute("/plant-part/:id");
  const plantPartId = match ? parseInt(params.id) : null;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState<number | null>(null);
  const itemsPerPage = 6;

  const { data: plantPart, isLoading: isLoadingPlantPart } =
    usePlantPart(plantPartId);
  const { data: industries, isLoading: isLoadingIndustries } = useIndustries();
  const { data: productsData, isLoading: isLoadingProducts } = useHempProducts(
    plantPartId,
    selectedIndustry,
    currentPage,
    itemsPerPage,
  );

  // Scroll to top on page load or filter change
  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [plantPartId, selectedIndustry]);

  // Create lookup objects for industry and subindustry names
  const industryNames: Record<number, string> = {};
  const subIndustryNames: Record<number, string> = {};
  const plantPartNames: Record<number, string> = {};

  if (industries) {
    industries.forEach((industry) => {
      industryNames[industry.id] = industry.name;
    });
  }

  if (plantPart) {
    plantPartNames[plantPart.id] = plantPart.name;
  }

  if (!match) {
    return (
      <div className="py-12 bg-neutral-lightest">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h1 className="text-2xl font-heading font-bold text-neutral-darkest mb-4">
              Plant Part Not Found
            </h1>
            <p className="text-neutral-dark mb-6">
              The requested plant part could not be found.
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleIndustryFilter = (industryId: number | null) => {
    setSelectedIndustry(industryId);
  };

  return (
    <>
      <Helmet>
        <title>
          {isLoadingPlantPart
            ? "Loading Plant Part..."
            : `${plantPart?.name || "Plant Part"} Applications - HempDB`}
        </title>
        <meta
          name="description"
          content={
            isLoadingPlantPart
              ? "Loading plant part information..."
              : `Explore hemp ${plantPart?.name.toLowerCase() || "part"} applications and products across various industries. ${plantPart?.description || ""}`
          }
        />
      </Helmet>

      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoadingPlantPart ? (
            <div className="mb-6">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-8 w-96" />
            </div>
          ) : (
            <>
              <Breadcrumb
                items={[
                  { label: "Home", href: "/" },
                  {
                    label: "Plant Types",
                    href: `/plant-type/${plantPart?.plantTypeId}`,
                  },
                  { label: plantPart?.name || "Plant Part" },
                ]}
              />

              <h2 className="text-2xl font-heading font-bold text-neutral-darkest mt-2 mb-6">
                {plantPart?.name} Applications by Industry
              </h2>
            </>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar with plant part info */}
            <div className="lg:w-1/3">
              <div className="bg-neutral-lightest rounded-xl p-6 sticky top-6">
                {isLoadingPlantPart ? (
                  <>
                    <div className="flex items-center mb-4">
                      <Skeleton className="h-12 w-12 rounded-full mr-3" />

                      <Skeleton className="h-6 w-32" />
                    </div>
                    <Skeleton className="h-48 w-full rounded-lg mb-4" />

                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <div className="space-y-3 mb-6">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center mb-4">
                      <div className="bg-primary/10 rounded-full p-3 mr-3">
                        <InfoIcon className="h-6 w-6 text-primary" />
                      </div>
                      <h2 className="text-xl font-heading font-bold">
                        Hemp {plantPart?.name}
                      </h2>
                    </div>

                    {/* Part image */}
                    <img
                      src={
                        plantPart?.imageUrl ||
                        "https://images.unsplash.com/photo-1535704882196-765e5fc62a53?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
                      }
                      alt={`Hemp ${plantPart?.name} close-up`}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />

                    <h3 className="font-heading font-medium text-lg mb-2">
                      About Hemp {plantPart?.name}
                    </h3>
                    <p className="text-neutral-dark text-sm mb-4">
                      {plantPart?.description}
                    </p>

                    <div className="p-4 bg-accent/10 rounded-lg">
                      <h4 className="font-heading font-medium text-accent-dark flex items-center">
                        <InfoIcon className="h-5 w-5 mr-2" />
                        Key Facts
                      </h4>
                      <ul className="mt-2 space-y-2 text-sm">
                        <li className="flex items-start">
                          <InfoIcon className="h-5 w-5 mr-2 text-accent shrink-0" />
                          Hemp has been cultivated for over 10,000 years
                        </li>
                        <li className="flex items-start">
                          <InfoIcon className="h-5 w-5 mr-2 text-accent shrink-0" />
                          A single hemp plant can have over 25,000 practical
                          uses
                        </li>
                        <li className="flex items-start">
                          <InfoIcon className="h-5 w-5 mr-2 text-accent shrink-0" />
                          Hemp requires 50% less water than cotton to grow
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Main content with applications */}
            <div className="lg:w-2/3">
              {/* Filter tabs */}
              {isLoadingIndustries ? (
                <div className="mb-8">
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <IndustryFilter
                  industries={industries || []}
                  selectedIndustry={selectedIndustry}
                  onSelectIndustry={handleIndustryFilter}
                />
              )}

              {/* Application cards */}
              {isLoadingProducts ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-80 rounded-xl" />
                  ))}
                </div>
              ) : (
                <>
                  {productsData?.products &&
                  productsData.products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {productsData.products.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          industryNames={industryNames}
                          subIndustryNames={subIndustryNames}
                          plantPartNames={plantPartNames}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-neutral-light">
                      <h3 className="text-xl font-heading font-semibold mb-2">
                        No Products Found
                      </h3>
                      <p className="text-neutral-dark mb-4">
                        No products were found for the selected filters. Try
                        selecting a different industry or plant part.
                      </p>
                      {selectedIndustry && (
                        <button
                          onClick={() => setSelectedIndustry(null)}
                          className="text-primary hover:text-primary-dark font-medium"
                        >
                          Clear Industry Filter
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Pagination controls */}
              {!isLoadingProducts &&
                productsData?.pagination &&
                productsData.pagination.total > itemsPerPage && (
                  <ProductPagination
                    currentPage={currentPage}
                    totalPages={productsData.pagination.pages}
                    totalItems={productsData.pagination.total}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                  />
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlantPartPage;
