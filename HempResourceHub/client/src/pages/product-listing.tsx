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
      <div className="py-12 bg-neutral-lightest" data-oid="pvw57dj">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          data-oid="iiknmln"
        >
          <div
            className="bg-white rounded-xl shadow-md p-8 text-center"
            data-oid="os:bbek"
          >
            <h1
              className="text-2xl font-heading font-bold text-neutral-darkest mb-4"
              data-oid="rkwjeg:"
            >
              Products Not Found
            </h1>
            <p className="text-neutral-dark mb-6" data-oid="_-b.gyu">
              The requested products could not be found.
            </p>
            <Link href="/" data-oid="r4iwvl_">
              <a
                className="text-primary hover:text-primary-dark font-medium"
                data-oid="0lvtx_3"
              >
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
      <Helmet data-oid="myezidq">
        <title data-oid="x2bucli">
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
          data-oid="l_clylf"
        />
      </Helmet>

      <div className="py-12 bg-white" data-oid="h25w0fl">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          data-oid="e02krr3"
        >
          {isLoadingPlantPart ? (
            <div className="mb-6" data-oid="iq9pa95">
              <Skeleton className="h-6 w-48 mb-2" data-oid="8fovpjb" />
              <Skeleton className="h-8 w-96" data-oid="-2n0sdd" />
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
                data-oid="zqv._r8"
              />

              <h2
                className="text-2xl font-heading font-bold text-neutral-darkest mt-2 mb-6"
                data-oid="jnrefux"
              >
                {plantPart?.name} Products
                {selectedIndustry ? ` in ${selectedIndustryName}` : ""}
              </h2>
            </>
          )}

          {/* Filter tabs */}
          {isLoadingIndustries ? (
            <div className="mb-8" data-oid="h8.5cq0">
              <Skeleton className="h-12 w-full" data-oid="nko.ug9" />
            </div>
          ) : (
            <IndustryFilter
              industries={industries || []}
              selectedIndustry={selectedIndustry}
              onSelectIndustry={handleIndustryFilter}
              data-oid=".mkl7ya"
            />
          )}

          {/* Application cards */}
          {isLoadingProducts ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              data-oid="hoe7cl."
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton
                  key={i}
                  className="h-80 rounded-xl"
                  data-oid="y9wq1s3"
                />
              ))}
            </div>
          ) : (
            <>
              {productsData?.products && productsData.products.length > 0 ? (
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  data-oid="sp:s-f."
                >
                  {productsData.products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      industryNames={industryNames}
                      subIndustryNames={subIndustryNames}
                      plantPartNames={plantPartNames}
                      data-oid="seb2ks8"
                    />
                  ))}
                </div>
              ) : (
                <div
                  className="bg-white rounded-xl shadow-sm p-8 text-center border border-neutral-light"
                  data-oid="wps_5uo"
                >
                  <h3
                    className="text-xl font-heading font-semibold mb-2"
                    data-oid="-c34q.z"
                  >
                    No Products Found
                  </h3>
                  <p className="text-neutral-dark mb-4" data-oid="u3blh12">
                    No products were found for the selected filters. Try
                    selecting a different industry or plant part.
                  </p>
                  {selectedIndustry && (
                    <button
                      onClick={() => setSelectedIndustry(null)}
                      className="text-primary hover:text-primary-dark font-medium"
                      data-oid="m4xj03."
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
                data-oid="7osjt53"
              />
            )}
        </div>
      </div>
    </>
  );
};

export default ProductListingPage;
