import { useState } from "react";
import { useHempProduct } from "@/hooks/use-product-data";
import { usePlantPart } from "@/hooks/use-plant-data";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Shirt, 
  Building2, 
  FileText, 
  Info, 
  CheckCircle,
  ExternalLink
} from "lucide-react";

interface ProductDetailViewProps {
  productId: number;
  industryNames: Record<number, string>;
  subIndustryNames: Record<number, string>;
}

const ProductDetailView = ({ 
  productId, 
  industryNames, 
  subIndustryNames 
}: ProductDetailViewProps) => {
  const { data: product, isLoading: isLoadingProduct } = useHempProduct(productId);
  const { data: plantPart, isLoading: isLoadingPlantPart } = usePlantPart(product?.plantPartId || null);
  const [activeTab, setActiveTab] = useState("overview");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Function to get an icon based on industry name
  const getIconForIndustry = (industryName: string = '') => {
    const name = industryName.toLowerCase();
    if (name.includes('textile')) return <Shirt className="h-6 w-6 text-primary" />;
    if (name.includes('construction')) return <Building2 className="h-6 w-6 text-primary" />;
    if (name.includes('paper')) return <FileText className="h-6 w-6 text-primary" />;
    return <Info className="h-6 w-6 text-primary" />; // Default
  };
  
  if (isLoadingProduct || isLoadingPlantPart) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2">
            <Skeleton className="h-96 lg:h-full" />
          </div>
          
          <div className="lg:w-1/2 p-6 lg:p-8">
            <div className="mb-6">
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2" />
            </div>
            
            <Skeleton className="h-12 w-full mb-6" />
            
            <div className="space-y-4">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return <div className="bg-white rounded-xl shadow-md p-8 text-center">Product not found</div>;
  }
  
  // Mock image gallery with main image and thumbnails
  const productImages = [
    product.imageUrl || 'https://via.placeholder.com/1000x1000',
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150',
    'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150',
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150'
  ];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Left column with images */}
        <div className="lg:w-1/2">
          <div className="relative h-64 sm:h-96 lg:h-full">
            <img 
              src={productImages[activeImageIndex]} 
              alt={product.name} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            <div className="absolute top-4 left-4">
              <Badge className="bg-white/80 backdrop-blur-sm text-primary text-xs font-medium px-3 py-1 rounded-full">
                Hemp ID: #{product.id}
              </Badge>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end lg:hidden">
              <div className="p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="bg-primary/80 backdrop-blur-sm rounded-full p-2 mr-3">
                    {getIconForIndustry(industryNames[product.industryId])}
                  </div>
                  <div>
                    <span className="text-white/80 text-sm">{industryNames[product.industryId]}</span>
                    <h2 className="text-xl font-heading font-bold text-white">{product.name}</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Thumbnail gallery */}
          <div className="grid grid-cols-4 gap-2 p-4 bg-neutral-lightest lg:hidden">
            {productImages.map((img, index) => (
              <div 
                key={index}
                className={`aspect-square overflow-hidden rounded-md cursor-pointer ${
                  activeImageIndex === index ? 'border-2 border-primary' : ''
                }`}
                onClick={() => setActiveImageIndex(index)}
              >
                <img 
                  src={img} 
                  alt={`${product.name} image ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Right column with details */}
        <div className="lg:w-1/2 p-6 lg:p-8">
          <div className="hidden lg:flex lg:items-center mb-6">
            <div className="bg-primary/10 rounded-full p-3 mr-4">
              {getIconForIndustry(industryNames[product.industryId])}
            </div>
            <div>
              <span className="text-primary font-medium">{industryNames[product.industryId]}</span>
              <h2 className="text-2xl font-heading font-bold text-neutral-darkest">{product.name}</h2>
            </div>
          </div>
          
          {/* Tab navigation */}
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="border-b border-neutral-light w-full justify-start rounded-none bg-transparent">
              <TabsTrigger 
                value="overview" 
                className={`data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 border-transparent px-1 py-4`}
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="benefits" 
                className={`data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 border-transparent px-1 py-4`}
              >
                Benefits
              </TabsTrigger>
              <TabsTrigger 
                value="processing" 
                className={`data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 border-transparent px-1 py-4`}
              >
                Processing
              </TabsTrigger>
              <TabsTrigger 
                value="market" 
                className={`data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 border-transparent px-1 py-4`}
              >
                Market
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <h3 className="font-heading font-medium text-lg mb-3">Description</h3>
              <p className="text-neutral-dark mb-4">
                {product.description}
              </p>
              
              <div className="grid grid-cols-2 gap-6 my-6">
                <div className="bg-neutral-lightest p-4 rounded-lg">
                  <h4 className="font-heading font-medium text-sm mb-2">Properties</h4>
                  <ul className="space-y-2 text-sm">
                    {Array.isArray(product.properties) && product.properties.map((property, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 mr-2 text-primary shrink-0" />
                        {property}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-neutral-lightest p-4 rounded-lg">
                  <h4 className="font-heading font-medium text-sm mb-2">Key Facts</h4>
                  <ul className="space-y-2 text-sm">
                    {Array.isArray(product.facts) && product.facts.map((fact, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 mr-2 text-primary shrink-0" />
                        {fact}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {product.sustainabilityImpact && (
                <>
                  <h3 className="font-heading font-medium text-lg mb-3">Sustainability Impact</h3>
                  <p className="text-neutral-dark mb-6">
                    {product.sustainabilityImpact}
                  </p>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="benefits">
              <div className="p-6 bg-neutral-lightest rounded-lg">
                <h3 className="font-heading font-medium text-lg mb-4">Key Benefits</h3>
                <ul className="space-y-4">
                  {Array.isArray(product.properties) && product.properties.map((property, index) => (
                    <li key={index} className="flex items-start">
                      <div className="bg-primary/10 rounded-full p-2 mr-3 mt-1">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{property}</h4>
                        <p className="text-sm text-neutral-dark">
                          Hemp products provide exceptional {property.toLowerCase()} compared to conventional alternatives.
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="processing">
              <div className="p-6 bg-neutral-lightest rounded-lg">
                <h3 className="font-heading font-medium text-lg mb-4">Processing Methods</h3>
                <p className="text-neutral-dark mb-4">
                  Hemp {plantPart?.name.toLowerCase() || 'material'} undergoes several processing stages before becoming {product.name.toLowerCase()}. The process typically includes harvesting, retting (for fiber), decortication, and manufacturing.
                </p>
                <img 
                  src="https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80" 
                  alt="Hemp processing" 
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h4 className="font-heading font-medium mb-2">Production Steps:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-neutral-dark">
                  <li>Harvesting at optimal maturity</li>
                  <li>Initial processing of raw material</li>
                  <li>Refinement and preparation</li>
                  <li>Manufacturing into final product</li>
                  <li>Quality testing and packaging</li>
                </ol>
              </div>
            </TabsContent>
            
            <TabsContent value="market">
              <div className="p-6 bg-neutral-lightest rounded-lg">
                <h3 className="font-heading font-medium text-lg mb-4">Market Overview</h3>
                <p className="text-neutral-dark mb-4">
                  The market for {product.name.toLowerCase()} is growing as consumers and industries seek sustainable alternatives. Recent trends show increased adoption across both specialty and mainstream markets.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-lg border border-neutral-light">
                    <h4 className="font-medium mb-2">Market Growth</h4>
                    <p className="text-sm text-neutral-dark">15-20% annual growth expected in this sector over the next 5 years</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-neutral-light">
                    <h4 className="font-medium mb-2">Price Points</h4>
                    <p className="text-sm text-neutral-dark">Premium positioning with increasing price competitiveness as production scales</p>
                  </div>
                </div>
                <h4 className="font-heading font-medium mb-2">Key Market Drivers:</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-neutral-dark">
                  <li>Growing consumer interest in sustainable products</li>
                  <li>Corporate sustainability initiatives</li>
                  <li>Improved manufacturing technologies</li>
                  <li>Favorable regulatory environment</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Related products */}
          {Array.isArray(product.relatedProductIds) && product.relatedProductIds.length > 0 && (
            <div className="border-t border-neutral-light pt-6 mb-4">
              <h3 className="font-heading font-medium text-lg mb-4">Related Products</h3>
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {/* This would typically fetch related products from your database */}
                {[1, 2, 3, 4].map((i) => (
                  <Link key={i} href={`/product/${product.relatedProductIds ? product.relatedProductIds[i % product.relatedProductIds.length] : i}`}>
                    <a className="flex-shrink-0 group">
                      <div className="w-32 h-32 rounded-lg overflow-hidden">
                        <img 
                          src={`https://images.unsplash.com/photo-${1500000000000 + i * 10000}?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150`}
                          alt={`Related hemp product ${i}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all"
                        />
                      </div>
                      <p className="mt-2 text-sm font-medium text-center">Related Product {i}</p>
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Affiliate links */}
          {Array.isArray(product.affiliateLinks) && product.affiliateLinks.length > 0 && (
            <div className="border-t border-neutral-light pt-6">
              <h3 className="font-heading font-medium text-lg mb-4">Shop {product.name}</h3>
              <p className="text-sm text-neutral-medium mb-4">Affiliate links to trusted retailers:</p>
              <div className="flex flex-wrap gap-3">
                {product.affiliateLinks.map((link, index) => (
                  <a 
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-neutral-lightest hover:bg-neutral-light rounded-lg border border-neutral-light transition-colors"
                  >
                    <span className="font-medium text-neutral-dark">{link.name}</span>
                    <ExternalLink className="h-4 w-4 ml-2 text-neutral-medium" />
                  </a>
                ))}
              </div>
              <p className="text-xs text-neutral-medium mt-3">
                Disclaimer: Links may contain affiliate codes. We may receive a commission for purchases made through these links.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;
