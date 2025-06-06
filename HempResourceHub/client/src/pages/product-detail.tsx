import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { Helmet } from "react-helmet";
import { useHempProduct } from "@/hooks/use-product-data";
import { useIndustries } from "@/hooks/use-plant-data";
import Breadcrumb from "@/components/ui/breadcrumb";
import ProductDetailView from "@/components/product/product-detail-view";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetailPage = () => {
  const [match, params] = useRoute("/product/:id");
  const productId = match ? parseInt(params.id) : null;
  const { data: product, isLoading: isLoadingProduct } =
    useHempProduct(productId);
  const { data: industries, isLoading: isLoadingIndustries } = useIndustries();

  // Create lookup objects for industry and subindustry names
  const industryNames: Record<number, string> = {};
  const subIndustryNames: Record<number, string> = {};

  if (industries) {
    industries.forEach((industry) => {
      industryNames[industry.id] = industry.name;
    });
  }

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  if (!match) {
    return (
      <div className="py-12 bg-neutral-lightest" data-oid="e-um7ck">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          data-oid="w9ca872"
        >
          <div
            className="bg-white rounded-xl shadow-md p-8 text-center"
            data-oid="9br-tpc"
          >
            <h1
              className="text-2xl font-heading font-bold text-neutral-darkest mb-4"
              data-oid="8tkcsvd"
            >
              Product Not Found
            </h1>
            <p className="text-neutral-dark mb-6" data-oid="0bt4.ir">
              The requested product could not be found.
            </p>
            <Link href="/" data-oid="58wlpbh">
              <a
                className="text-primary hover:text-primary-dark font-medium"
                data-oid="bib1w_5"
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
      <Helmet data-oid="q8:0c0l">
        <title data-oid="85vrp9e">
          {isLoadingProduct
            ? "Loading Product..."
            : `${product?.name || "Hemp Product"} - HempDB`}
        </title>
        <meta
          name="description"
          content={
            isLoadingProduct
              ? "Loading hemp product information..."
              : `Detailed information about ${product?.name || "this hemp product"}. ${product?.description?.substring(0, 150) || ""}`
          }
          data-oid="w0mlt1m"
        />
      </Helmet>

      <div className="py-12 bg-neutral-lightest" data-oid="2tv4bdk">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          data-oid="8zw:-ny"
        >
          {isLoadingProduct || isLoadingIndustries ? (
            <div className="mb-6" data-oid="y4jb77j">
              <Skeleton className="h-6 w-48 mb-2" data-oid="g3d3704" />
            </div>
          ) : (
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                {
                  label: "Plant Parts",
                  href: `/plant-part/${product?.plantPartId}`,
                },
                {
                  label: industryNames[product?.industryId || 0] || "Industry",
                  href: `/products/${product?.plantPartId}/${product?.industryId}`,
                },
                { label: product?.name || "Product" },
              ]}
              data-oid="zeedwn9"
            />
          )}

          {/* Product detail view */}
          {productId && (
            <ProductDetailView
              productId={productId}
              industryNames={industryNames}
              subIndustryNames={subIndustryNames}
              data-oid="ck.xlf2"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
