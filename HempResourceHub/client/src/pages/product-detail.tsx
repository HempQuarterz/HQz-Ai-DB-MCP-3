import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { Helmet } from "react-helmet";
import { useHempProduct } from "@/hooks/use-product-data";
import { useIndustries } from "@/hooks/use-plant-data";
import Breadcrumb from "@/components/ui/breadcrumb";
import ProductDetailView from "@/components/product/product-detail-view";
import ProductImageManagement from "@/components/product/product-image-management";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetailPage = () => {
  const [match, params] = useRoute("/product/:id");
  const productId = match ? parseInt(params.id) : null;
  const { data: product, isLoading: isLoadingProduct } = useHempProduct(productId);
  const { data: industries, isLoading: isLoadingIndustries } = useIndustries();
  const [showImageManagement, setShowImageManagement] = useState(false);

  // Create lookup objects for industry and subindustry names
  const industryNames: Record<number, string> = {};
  const subIndustryNames: Record<number, string> = {};
  
  if (industries) {
    industries.forEach(industry => {
      industryNames[industry.id] = industry.name;
    });
  }
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  // Check if user is admin (you may want to implement proper auth check)
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true' || 
                    window.location.search.includes('admin=true');
    setShowImageManagement(isAdmin);
  }, []);

  if (!match) {
    return (
      <div className="py-12 bg-neutral-lightest">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h1 className="text-2xl font-heading font-bold text-neutral-darkest mb-4">Product Not Found</h1>
            <p className="text-neutral-dark mb-6">The requested product could not be found.</p>
            <Link href="/">
              <a className="text-primary hover:text-primary-dark font-medium">Return to Homepage</a>
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
          {isLoadingProduct 
            ? "Loading Product..." 
            : `${product?.name || "Hemp Product"} - HempDB`
          }
        </title>
        <meta 
          name="description" 
          content={
            isLoadingProduct 
              ? "Loading hemp product information..." 
              : `Detailed information about ${product?.name || "this hemp product"}. ${product?.description?.substring(0, 150) || ""}`
          } 
        />
      </Helmet>

      <div className="py-12 bg-neutral-lightest">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoadingProduct || isLoadingIndustries ? (
            <div className="mb-6">
              <Skeleton className="h-6 w-48 mb-2" />
            </div>
          ) : (
            <Breadcrumb 
              items={[
                { label: "Home", href: "/" },
                { label: "Plant Parts", href: `/plant-part/${product?.plantPartId}` },
                { label: industryNames[product?.industryId || 0] || "Industry", href: `/products/${product?.plantPartId}/${product?.industryId}` },
                { label: product?.name || "Product" }
              ]} 
            />
          )}

          <div className="space-y-6">
            {/* Product detail view */}
            {productId && (
              <ProductDetailView 
                productId={productId} 
                industryNames={industryNames}
                subIndustryNames={subIndustryNames}
              />
            )}
            
            {/* Image Management Section (Admin Only) */}
            {showImageManagement && productId && product && (
              <ProductImageManagement
                productId={productId}
                productName={product.name}
                currentImageUrl={product.image_url}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;