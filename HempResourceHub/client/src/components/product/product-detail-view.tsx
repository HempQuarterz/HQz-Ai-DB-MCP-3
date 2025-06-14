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
  ExternalLink,
} from "lucide-react";
import { getPlaceholderImage } from "@/lib/placeholder";

interface ProductDetailViewProps {
  productId: number;
  industryNames: Record<number, string>;
  subIndustryNames: Record<number, string>;
}

const ProductDetailView = ({
  productId,
  industryNames,
  subIndustryNames,
}: ProductDetailViewProps) => {
  const { data: product, isLoading: isLoadingProduct } =
    useHempProduct(productId);
  const { data: plantPart, isLoading: isLoadingPlantPart } = usePlantPart(
    product?.plantPartId || null,
  );
  const [activeTab, setActiveTab] = useState("overview");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Function to get an icon based on industry name
  const getIconForIndustry = (industryName: string = "") => {
    const name = industryName.toLowerCase();
    if (name.includes("textile"))
      return <Shirt className="h-6 w-6 text-green-400" data-oid="42h3r17" />;
    if (name.includes("construction"))
      return <Building2 className="h-6 w-6 text-green-400" data-oid="gbxknls" />;
    if (name.includes("paper"))
      return <FileText className="h-6 w-6 text-green-400" data-oid=".dezqy2" />;
    return <Info className="h-6 w-6 text-green-400" data-oid="norgku9" />; // Default
  };

  if (isLoadingProduct || isLoadingPlantPart) {
    return (
      <div
        className="bg-gray-900 rounded-xl shadow-lg shadow-black/50 overflow-hidden border border-green-500/30"
        data-oid="uj4ljub"
      >
        <div className="flex flex-col lg:flex-row" data-oid="8x.l1i9">
          <div className="lg:w-1/2" data-oid="03lhs5p">
            <Skeleton className="h-96 lg:h-full" data-oid="3v1:sa1" />
          </div>

          <div className="lg:w-1/2 p-6 lg:p-8" data-oid="l9azw1n">
            <div className="mb-6" data-oid="qeheyds">
              <Skeleton className="h-8 w-3/4 mb-2" data-oid="n.tolh8" />
              <Skeleton className="h-6 w-1/2" data-oid="sfkqh3q" />
            </div>

            <Skeleton className="h-12 w-full mb-6" data-oid="0psa5c3" />

            <div className="space-y-4" data-oid="ly.aem.">
              <Skeleton className="h-6 w-32 mb-2" data-oid="_y.wm61" />
              <Skeleton className="h-4 w-full mb-1" data-oid="v7om5k1" />
              <Skeleton className="h-4 w-full mb-1" data-oid="_-zt9.9" />
              <Skeleton className="h-4 w-3/4" data-oid="9.-utkw" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className="bg-gray-900 rounded-xl shadow-lg shadow-black/50 p-8 text-center border border-green-500/30"
        data-oid=".h.9lmm"
      >
        <p className="text-gray-300">Product not found</p>
      </div>
    );
  }

  // Mock image gallery with main image and thumbnails
  const productImages = [
    product.imageUrl || getPlaceholderImage(1000, 1000, product.name),
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
    "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
  ];

  return (
    <div
      className="bg-gray-900 rounded-xl shadow-lg shadow-black/50 overflow-hidden border border-green-500/30"
      data-oid="a11ecko"
    >
      <div className="flex flex-col lg:flex-row" data-oid="1fir4gn">
        {/* Left column with images */}
        <div className="lg:w-1/2" data-oid="ttb8zgg">
          <div className="relative h-64 sm:h-96 lg:h-full" data-oid="24d8qps">
            <img
              src={productImages[activeImageIndex]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
              data-oid="bgy_6lg"
            />

            <div className="absolute top-4 left-4" data-oid="3gwfx-u">
              <Badge
                className="bg-gray-800/80 backdrop-blur-sm text-green-400 text-xs font-medium px-3 py-1 rounded-full border border-green-500/50"
                data-oid="tejkepk"
              >
                Hemp ID: #{product.id}
              </Badge>
            </div>

            <div
              className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end lg:hidden"
              data-oid="0kjykel"
            >
              <div className="p-4 sm:p-6" data-oid="1-3n7zz">
                <div className="flex items-center" data-oid="j_8em7v">
                  <div
                    className="bg-green-500/20 backdrop-blur-sm rounded-full p-2 mr-3"
                    data-oid=".4gjhca"
                  >
                    {getIconForIndustry(industryNames[product.industryId])}
                  </div>
                  <div data-oid="ntoq-p2">
                    <span className="text-white/80 text-sm" data-oid="j1o0oqt">
                      {industryNames[product.industryId]}
                    </span>
                    <h2
                      className="text-xl font-heading font-bold text-white"
                      data-oid="hq5grs0"
                    >
                      {product.name}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Thumbnail gallery */}
          <div
            className="grid grid-cols-4 gap-2 p-4 bg-gray-800 lg:hidden"
            data-oid="u_j-.1k"
          >
            {productImages.map((img, index) => (
              <div
                key={index}
                className={`aspect-square overflow-hidden rounded-md cursor-pointer ${
                  activeImageIndex === index ? "border-2 border-green-400" : "border border-gray-700"
                }`}
                onClick={() => setActiveImageIndex(index)}
                data-oid="86p8r34"
              >
                <img
                  src={img}
                  alt={`${product.name} image ${index + 1}`}
                  className="w-full h-full object-cover"
                  data-oid="wrg0hrc"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right column with details */}
        <div className="lg:w-1/2 p-6 lg:p-8" data-oid=".bk.vfy">
          <div
            className="hidden lg:flex lg:items-center mb-6"
            data-oid="eed22xo"
          >
            <div
              className="bg-green-500/10 rounded-full p-3 mr-4"
              data-oid="r5fvnxv"
            >
              {getIconForIndustry(industryNames[product.industryId])}
            </div>
            <div data-oid="cemhh3m">
              <span className="text-green-400 font-medium" data-oid="eiw8.xr">
                {industryNames[product.industryId]}
              </span>
              <h2
                className="text-2xl font-heading font-bold text-gray-100"
                data-oid="eiseqnm"
              >
                {product.name}
              </h2>
            </div>
          </div>

          {/* Tab navigation */}
          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-6"
            data-oid="cl9e3ax"
          >
            <TabsList
              className="border-b border-gray-700 w-full justify-start rounded-none bg-transparent"
              data-oid="75.wke_"
            >
              <TabsTrigger
                value="overview"
                className={`data-[state=active]:border-green-400 data-[state=active]:text-green-400 border-b-2 border-transparent px-1 py-4 text-gray-300`}
                data-oid="4np3nna"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="benefits"
                className={`data-[state=active]:border-green-400 data-[state=active]:text-green-400 border-b-2 border-transparent px-1 py-4 text-gray-300`}
                data-oid="f-:42::"
              >
                Benefits
              </TabsTrigger>
              <TabsTrigger
                value="processing"
                className={`data-[state=active]:border-green-400 data-[state=active]:text-green-400 border-b-2 border-transparent px-1 py-4 text-gray-300`}
                data-oid="5gppvlq"
              >
                Processing
              </TabsTrigger>
              <TabsTrigger
                value="market"
                className={`data-[state=active]:border-green-400 data-[state=active]:text-green-400 border-b-2 border-transparent px-1 py-4 text-gray-300`}
                data-oid="6:f8a3i"
              >
                Market
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6" data-oid="3f1lav1">
              <h3
                className="font-heading font-medium text-lg mb-3"
                data-oid="g76q89_"
              >
                Description
              </h3>
              <p className="text-neutral-dark mb-4" data-oid="2l6:j27">
                {product.description}
              </p>

              <div className="grid grid-cols-2 gap-6 my-6" data-oid="6clwpwi">
                <div
                  className="bg-neutral-lightest p-4 rounded-lg"
                  data-oid="z.8mc64"
                >
                  <h4
                    className="font-heading font-medium text-sm mb-2"
                    data-oid="j1.02eh"
                  >
                    Properties
                  </h4>
                  <ul className="space-y-2 text-sm" data-oid="os8206n">
                    {Array.isArray(product.properties) &&
                      product.properties.map((property, index) => (
                        <li
                          key={index}
                          className="flex items-start"
                          data-oid="lzlbktb"
                        >
                          <CheckCircle
                            className="h-5 w-5 mr-2 text-primary shrink-0"
                            data-oid="ig3-eer"
                          />

                          {property}
                        </li>
                      ))}
                  </ul>
                </div>

                <div
                  className="bg-neutral-lightest p-4 rounded-lg"
                  data-oid="lqbu8u-"
                >
                  <h4
                    className="font-heading font-medium text-sm mb-2"
                    data-oid="u5cu.g-"
                  >
                    Key Facts
                  </h4>
                  <ul className="space-y-2 text-sm" data-oid="oc:2a9p">
                    {Array.isArray(product.facts) &&
                      product.facts.map((fact, index) => (
                        <li
                          key={index}
                          className="flex items-start"
                          data-oid="dov7m2c"
                        >
                          <CheckCircle
                            className="h-5 w-5 mr-2 text-primary shrink-0"
                            data-oid="5262i-f"
                          />

                          {fact}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>

              {product.sustainabilityImpact && (
                <>
                  <h3
                    className="font-heading font-medium text-lg mb-3"
                    data-oid="hfgxroa"
                  >
                    Sustainability Impact
                  </h3>
                  <p className="text-neutral-dark mb-6" data-oid="j3afi-.">
                    {product.sustainabilityImpact}
                  </p>
                </>
              )}
            </TabsContent>

            <TabsContent value="benefits" data-oid="s.6sfhw">
              <div
                className="p-6 bg-neutral-lightest rounded-lg"
                data-oid="-mw:gvv"
              >
                <h3
                  className="font-heading font-medium text-lg mb-4"
                  data-oid="agkt9us"
                >
                  Key Benefits
                </h3>
                <ul className="space-y-4" data-oid="q1cjd6g">
                  {Array.isArray(product.properties) &&
                    product.properties.map((property, index) => (
                      <li
                        key={index}
                        className="flex items-start"
                        data-oid="xd7xqw8"
                      >
                        <div
                          className="bg-primary/10 rounded-full p-2 mr-3 mt-1"
                          data-oid="vl6dhew"
                        >
                          <CheckCircle
                            className="h-5 w-5 text-primary"
                            data-oid="b.0.ti_"
                          />
                        </div>
                        <div data-oid="i1m2t-u">
                          <h4 className="font-medium" data-oid="7ylo6ci">
                            {property}
                          </h4>
                          <p
                            className="text-sm text-neutral-dark"
                            data-oid="dwwi991"
                          >
                            Hemp products provide exceptional{" "}
                            {property.toLowerCase()} compared to conventional
                            alternatives.
                          </p>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="processing" data-oid="2ez_br6">
              <div
                className="p-6 bg-neutral-lightest rounded-lg"
                data-oid="j65ah8l"
              >
                <h3
                  className="font-heading font-medium text-lg mb-4"
                  data-oid="qm.5meq"
                >
                  Processing Methods
                </h3>
                <p className="text-neutral-dark mb-4" data-oid="v3yq2k_">
                  Hemp {plantPart?.name.toLowerCase() || "material"} undergoes
                  several processing stages before becoming{" "}
                  {product.name.toLowerCase()}. The process typically includes
                  harvesting, retting (for fiber), decortication, and
                  manufacturing.
                </p>
                <img
                  src="https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
                  alt="Hemp processing"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  data-oid="ty4gnm5"
                />

                <h4
                  className="font-heading font-medium mb-2"
                  data-oid="11krewe"
                >
                  Production Steps:
                </h4>
                <ol
                  className="list-decimal list-inside space-y-2 text-sm text-neutral-dark"
                  data-oid="a:tti0x"
                >
                  <li data-oid="iip8imv">Harvesting at optimal maturity</li>
                  <li data-oid="w0dqbz6">Initial processing of raw material</li>
                  <li data-oid="hecxz.f">Refinement and preparation</li>
                  <li data-oid="bb5koi8">Manufacturing into final product</li>
                  <li data-oid=":k_y3o-">Quality testing and packaging</li>
                </ol>
              </div>
            </TabsContent>

            <TabsContent value="market" data-oid="fxasmlh">
              <div
                className="p-6 bg-neutral-lightest rounded-lg"
                data-oid="j5b5sbi"
              >
                <h3
                  className="font-heading font-medium text-lg mb-4"
                  data-oid="ylekes9"
                >
                  Market Overview
                </h3>
                <p className="text-neutral-dark mb-4" data-oid="9:0h1.f">
                  The market for {product.name.toLowerCase()} is growing as
                  consumers and industries seek sustainable alternatives. Recent
                  trends show increased adoption across both specialty and
                  mainstream markets.
                </p>
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4"
                  data-oid="_oilndi"
                >
                  <div
                    className="bg-white p-4 rounded-lg border border-neutral-light"
                    data-oid="o9uiae6"
                  >
                    <h4 className="font-medium mb-2" data-oid="ptfw9ej">
                      Market Growth
                    </h4>
                    <p className="text-sm text-neutral-dark" data-oid="3scn9wx">
                      15-20% annual growth expected in this sector over the next
                      5 years
                    </p>
                  </div>
                  <div
                    className="bg-white p-4 rounded-lg border border-neutral-light"
                    data-oid="7lwtw6x"
                  >
                    <h4 className="font-medium mb-2" data-oid="xx078fx">
                      Price Points
                    </h4>
                    <p className="text-sm text-neutral-dark" data-oid=".xc:asu">
                      Premium positioning with increasing price competitiveness
                      as production scales
                    </p>
                  </div>
                </div>
                <h4
                  className="font-heading font-medium mb-2"
                  data-oid="vtur_:7"
                >
                  Key Market Drivers:
                </h4>
                <ul
                  className="list-disc list-inside space-y-2 text-sm text-neutral-dark"
                  data-oid="3-69u4g"
                >
                  <li data-oid="c.hs3k5">
                    Growing consumer interest in sustainable products
                  </li>
                  <li data-oid="642x14h">
                    Corporate sustainability initiatives
                  </li>
                  <li data-oid="k8h.74u">
                    Improved manufacturing technologies
                  </li>
                  <li data-oid="6-b8vlb">Favorable regulatory environment</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>

          {/* Related products */}
          {Array.isArray(product.relatedProductIds) &&
            product.relatedProductIds.length > 0 && (
              <div
                className="border-t border-neutral-light pt-6 mb-4"
                data-oid="nejrmts"
              >
                <h3
                  className="font-heading font-medium text-lg mb-4"
                  data-oid="9:pc0:t"
                >
                  Related Products
                </h3>
                <div
                  className="flex space-x-4 overflow-x-auto pb-2"
                  data-oid="5o66etw"
                >
                  {/* This would typically fetch related products from your database */}
                  {[1, 2, 3, 4].map((i) => (
                    <Link
                      key={i}
                      href={`/product/${product.relatedProductIds ? product.relatedProductIds[i % product.relatedProductIds.length] : i}`}
                      data-oid="1zz0n_k"
                    >
                      <a className="flex-shrink-0 group" data-oid="mbunq:5">
                        <div
                          className="w-32 h-32 rounded-lg overflow-hidden"
                          data-oid="cyoftxu"
                        >
                          <img
                            src={`https://images.unsplash.com/photo-${1500000000000 + i * 10000}?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150`}
                            alt={`Related hemp product ${i}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-all"
                            data-oid=":h9vr8_"
                          />
                        </div>
                        <p
                          className="mt-2 text-sm font-medium text-center"
                          data-oid="jae6_f7"
                        >
                          Related Product {i}
                        </p>
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          {/* Affiliate links */}
          {Array.isArray(product.affiliateLinks) &&
            product.affiliateLinks.length > 0 && (
              <div
                className="border-t border-neutral-light pt-6"
                data-oid="gli54gi"
              >
                <h3
                  className="font-heading font-medium text-lg mb-4"
                  data-oid="i3o31gh"
                >
                  Shop {product.name}
                </h3>
                <p
                  className="text-sm text-neutral-medium mb-4"
                  data-oid="en5k9l_"
                >
                  Affiliate links to trusted retailers:
                </p>
                <div className="flex flex-wrap gap-3" data-oid=".s0v4u2">
                  {product.affiliateLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-neutral-lightest hover:bg-neutral-light rounded-lg border border-neutral-light transition-colors"
                      data-oid="syrkbur"
                    >
                      <span
                        className="font-medium text-neutral-dark"
                        data-oid="gs11qe:"
                      >
                        {link.name}
                      </span>
                      <ExternalLink
                        className="h-4 w-4 ml-2 text-neutral-medium"
                        data-oid="on_x74k"
                      />
                    </a>
                  ))}
                </div>
                <p
                  className="text-xs text-neutral-medium mt-3"
                  data-oid="7uy609e"
                >
                  Disclaimer: Links may contain affiliate codes. We may receive
                  a commission for purchases made through these links.
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;
