import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { Helmet } from "react-helmet";
import { usePlantPart } from "@/hooks/use-plant-data";
import { useHempProducts } from "@/hooks/use-product-data";
import { useIndustries } from "@/hooks/use-plant-data";
import Breadcrumb from "@/components/ui/breadcrumb";
import IndustryFilter from "@/components/product/industry-filter";
import ProductCard from "@/components/product/product-card";
import ProductPagination from "@/components/product/product-pagination";
import { Skeleton } from "@/components/ui/skeleton";

const ProductListingPage = () => {
  const [match, params] = useRoute("/products/:plantPartId/:industryId?");
  const plantPartId = match ? parseInt(params.plantPartId) : null;
  const initialIndustryId = params.industryId
    ? parseInt(params.industryId)
    : null;

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState<number | null>(
    initialIndustryId,
  );
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
      <div className="py-12 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-xl shadow-lg shadow-black/50 p-8 text-center border border-green-500/30">
            <h1 className="text-2xl font-heading font-bold text-gray-100 mb-4">
              Products Not Found
            </h1>
            <p className="text-gray-300 mb-6">
              The requested products could not be found.
            </p>
            <Link href="/">
              <a className="text-green-400 hover:text-green-300 font-medium transition-colors">
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

  const selectedIndustryName = selectedIndustry
    ? industryNames[selectedIndustry]
    : "All Industries";

  return (
    <>
      <Helmet>
        <title>
          {isLoadingPlantPart
            ? "Loading Products..."
            : `${plantPart?.name || "Hemp"} Products ${selectedIndustry ? `- ${selectedIndustryName}` : ""} - HempDB`}
        </title>
        <meta
          name="description"
          content={
            isLoadingPlantPart
              ? "Loading hemp products..."
              : `Explore hemp ${plantPart?.name.toLowerCase() || "part"} applications and products ${selectedIndustry ? `in the ${selectedIndustryName} industry` : "across various industries"}.`
          }
        />
      </Helmet>

      <div className="py-12 bg-gray-950">
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
                  { label: "Plant Parts", href: `/plant-part/${plantPartId}` },
                  {
                    label: selectedIndustry
                      ? selectedIndustryName
                      : "All Industries",
                  },
                ]}
              />

              <h2 className="text-2xl font-heading font-bold text-gray-100 mt-2 mb-6">
                {plantPart?.name} Products
                {selectedIndustry ? ` in ${selectedIndustryName}` : ""}
              </h2>
            </>
          )}

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-80 rounded-xl" />
              ))}
            </div>
          ) : (
            <>
              {productsData?.products && productsData.products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className="bg-gray-900 rounded-xl shadow-lg shadow-black/50 p-8 text-center border border-green-500/30">
                  <h3 className="text-xl font-heading font-semibold text-gray-100 mb-2">
                    No Products Found
                  </h3>
                  <p className="text-gray-300 mb-4">
                    No products were found for the selected filters. Try
                    selecting a different industry or plant part.
                  </p>
                  {selectedIndustry && (
                    <button
                      onClick={() => setSelectedIndustry(null)}
                      className="text-green-400 hover:text-green-300 font-medium transition-colors"
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
    </>
  );
};

export default ProductListingPage;
