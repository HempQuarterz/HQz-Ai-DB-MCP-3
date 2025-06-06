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
      <div className="py-12 bg-neutral-lightest" data-oid="jy3claf">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          data-oid="5je6bu8"
        >
          <div
            className="bg-white rounded-xl shadow-md p-8 text-center"
            data-oid="t5orxnq"
          >
            <h1
              className="text-2xl font-heading font-bold text-neutral-darkest mb-4"
              data-oid="_obaufz"
            >
              Plant Part Not Found
            </h1>
            <p className="text-neutral-dark mb-6" data-oid="j8kb2go">
              The requested plant part could not be found.
            </p>
            <Link href="/" data-oid="lc:dgy:">
              <a
                className="text-primary hover:text-primary-dark font-medium"
                data-oid="n42h6sd"
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

  return (
    <>
      <Helmet data-oid="dzxdi4z">
        <title data-oid="dk3ibiu">
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
          data-oid="e-659q0"
        />
      </Helmet>

      <div className="py-12 bg-white" data-oid="3v6kclu">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          data-oid="3_9kkkb"
        >
          {isLoadingPlantPart ? (
            <div className="mb-6" data-oid="jruptui">
              <Skeleton className="h-6 w-48 mb-2" data-oid="tin6b4n" />
              <Skeleton className="h-8 w-96" data-oid="9glrq30" />
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
                data-oid=":.zbr3d"
              />

              <h2
                className="text-2xl font-heading font-bold text-neutral-darkest mt-2 mb-6"
                data-oid="rnz_524"
              >
                {plantPart?.name} Applications by Industry
              </h2>
            </>
          )}

          <div className="flex flex-col lg:flex-row gap-8" data-oid="avblc7w">
            {/* Sidebar with plant part info */}
            <div className="lg:w-1/3" data-oid="pwz7ei:">
              <div
                className="bg-neutral-lightest rounded-xl p-6 sticky top-6"
                data-oid="10t0ut2"
              >
                {isLoadingPlantPart ? (
                  <>
                    <div className="flex items-center mb-4" data-oid="8hrmad3">
                      <Skeleton
                        className="h-12 w-12 rounded-full mr-3"
                        data-oid="x.p4huw"
                      />
                      <Skeleton className="h-6 w-32" data-oid="a7eqtbx" />
                    </div>
                    <Skeleton
                      className="h-48 w-full rounded-lg mb-4"
                      data-oid="igf51mk"
                    />
                    <Skeleton className="h-6 w-48 mb-2" data-oid="vhl89-3" />
                    <Skeleton className="h-4 w-full mb-1" data-oid="6gd81tj" />
                    <Skeleton className="h-4 w-full mb-1" data-oid="t3kv-.w" />
                    <Skeleton className="h-4 w-full mb-4" data-oid="vparr1b" />
                    <div className="space-y-3 mb-6" data-oid="sjj7lm:">
                      <Skeleton className="h-4 w-full" data-oid="dt3x3ud" />
                      <Skeleton className="h-4 w-full" data-oid=":6:751f" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center mb-4" data-oid="67hv:fx">
                      <div
                        className="bg-primary/10 rounded-full p-3 mr-3"
                        data-oid="83nim9b"
                      >
                        <InfoIcon
                          className="h-6 w-6 text-primary"
                          data-oid=".3k82:i"
                        />
                      </div>
                      <h2
                        className="text-xl font-heading font-bold"
                        data-oid="tbq19:_"
                      >
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
                      data-oid="j5kfiwj"
                    />

                    <h3
                      className="font-heading font-medium text-lg mb-2"
                      data-oid="6kva_7z"
                    >
                      About Hemp {plantPart?.name}
                    </h3>
                    <p
                      className="text-neutral-dark text-sm mb-4"
                      data-oid="9c2:7xa"
                    >
                      {plantPart?.description}
                    </p>

                    <div
                      className="p-4 bg-accent/10 rounded-lg"
                      data-oid="lhro7l4"
                    >
                      <h4
                        className="font-heading font-medium text-accent-dark flex items-center"
                        data-oid="c:p4jm3"
                      >
                        <InfoIcon className="h-5 w-5 mr-2" data-oid="mpf:a8c" />
                        Key Facts
                      </h4>
                      <ul className="mt-2 space-y-2 text-sm" data-oid="3y.cpyy">
                        <li className="flex items-start" data-oid="fujvo8l">
                          <InfoIcon
                            className="h-5 w-5 mr-2 text-accent shrink-0"
                            data-oid="m8yx_4:"
                          />
                          Hemp has been cultivated for over 10,000 years
                        </li>
                        <li className="flex items-start" data-oid="k.1xp1u">
                          <InfoIcon
                            className="h-5 w-5 mr-2 text-accent shrink-0"
                            data-oid="dj9kh_q"
                          />
                          A single hemp plant can have over 25,000 practical
                          uses
                        </li>
                        <li className="flex items-start" data-oid="o96j3zy">
                          <InfoIcon
                            className="h-5 w-5 mr-2 text-accent shrink-0"
                            data-oid="cj02if5"
                          />
                          Hemp requires 50% less water than cotton to grow
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Main content with applications */}
            <div className="lg:w-2/3" data-oid="eeql:9l">
              {/* Filter tabs */}
              {isLoadingIndustries ? (
                <div className="mb-8" data-oid="o1l:600">
                  <Skeleton className="h-12 w-full" data-oid="a551yxf" />
                </div>
              ) : (
                <IndustryFilter
                  industries={industries || []}
                  selectedIndustry={selectedIndustry}
                  onSelectIndustry={handleIndustryFilter}
                  data-oid="b-ui00a"
                />
              )}

              {/* Application cards */}
              {isLoadingProducts ? (
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  data-oid="a31:u0s"
                >
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton
                      key={i}
                      className="h-80 rounded-xl"
                      data-oid="j1ea.is"
                    />
                  ))}
                </div>
              ) : (
                <>
                  {productsData?.products &&
                  productsData.products.length > 0 ? (
                    <div
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      data-oid=":5ru5q7"
                    >
                      {productsData.products.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          industryNames={industryNames}
                          subIndustryNames={subIndustryNames}
                          plantPartNames={plantPartNames}
                          data-oid=":9ikuzs"
                        />
                      ))}
                    </div>
                  ) : (
                    <div
                      className="bg-white rounded-xl shadow-sm p-8 text-center border border-neutral-light"
                      data-oid="q3ifj9."
                    >
                      <h3
                        className="text-xl font-heading font-semibold mb-2"
                        data-oid="yo6954f"
                      >
                        No Products Found
                      </h3>
                      <p className="text-neutral-dark mb-4" data-oid="n9x5q3v">
                        No products were found for the selected filters. Try
                        selecting a different industry or plant part.
                      </p>
                      {selectedIndustry && (
                        <button
                          onClick={() => setSelectedIndustry(null)}
                          className="text-primary hover:text-primary-dark font-medium"
                          data-oid="zrugre1"
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
                    data-oid="_8:ft:8"
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
