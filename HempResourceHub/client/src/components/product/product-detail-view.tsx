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
      return <Shirt className="h-6 w-6 text-primary" data-oid="v2g-i6s" />;
    if (name.includes("construction"))
      return <Building2 className="h-6 w-6 text-primary" data-oid="apagrkt" />;
    if (name.includes("paper"))
      return <FileText className="h-6 w-6 text-primary" data-oid="ez9d51:" />;
    return <Info className="h-6 w-6 text-primary" data-oid="zm9v0a6" />; // Default
  };

  if (isLoadingProduct || isLoadingPlantPart) {
    return (
      <div
        className="bg-white rounded-xl shadow-md overflow-hidden"
        data-oid="52amy:9"
      >
        <div className="flex flex-col lg:flex-row" data-oid="kqrws_y">
          <div className="lg:w-1/2" data-oid="08ah_oo">
            <Skeleton className="h-96 lg:h-full" data-oid="83cfb2_" />
          </div>

          <div className="lg:w-1/2 p-6 lg:p-8" data-oid="lcsovx3">
            <div className="mb-6" data-oid="cs:3cb2">
              <Skeleton className="h-8 w-3/4 mb-2" data-oid=":2uraf2" />
              <Skeleton className="h-6 w-1/2" data-oid="2l1nx4o" />
            </div>

            <Skeleton className="h-12 w-full mb-6" data-oid="ozy9d7x" />

            <div className="space-y-4" data-oid="9sufnht">
              <Skeleton className="h-6 w-32 mb-2" data-oid="n_cv-1r" />
              <Skeleton className="h-4 w-full mb-1" data-oid="be4qs.i" />
              <Skeleton className="h-4 w-full mb-1" data-oid="zd-3pdh" />
              <Skeleton className="h-4 w-3/4" data-oid="2g.tt5-" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className="bg-white rounded-xl shadow-md p-8 text-center"
        data-oid="f--51p5"
      >
        Product not found
      </div>
    );
  }

  // Mock image gallery with main image and thumbnails
  const productImages = [
    product.imageUrl || "https://via.placeholder.com/1000x1000",
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
    "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
  ];

  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden"
      data-oid="iuo9:t:"
    >
      <div className="flex flex-col lg:flex-row" data-oid="muu2x5_">
        {/* Left column with images */}
        <div className="lg:w-1/2" data-oid="8wfjifb">
          <div className="relative h-64 sm:h-96 lg:h-full" data-oid="rlzc_2:">
            <img
              src={productImages[activeImageIndex]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
              data-oid="j235js."
            />

            <div className="absolute top-4 left-4" data-oid="fpo2ghj">
              <Badge
                className="bg-white/80 backdrop-blur-sm text-primary text-xs font-medium px-3 py-1 rounded-full"
                data-oid="ssv3mue"
              >
                Hemp ID: #{product.id}
              </Badge>
            </div>

            <div
              className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end lg:hidden"
              data-oid="lkfzu3t"
            >
              <div className="p-4 sm:p-6" data-oid="rl9wgbq">
                <div className="flex items-center" data-oid="l6zutma">
                  <div
                    className="bg-primary/80 backdrop-blur-sm rounded-full p-2 mr-3"
                    data-oid="l558mqt"
                  >
                    {getIconForIndustry(industryNames[product.industryId])}
                  </div>
                  <div data-oid="4p..-mo">
                    <span className="text-white/80 text-sm" data-oid="q.cojep">
                      {industryNames[product.industryId]}
                    </span>
                    <h2
                      className="text-xl font-heading font-bold text-white"
                      data-oid="e2gj0pz"
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
            className="grid grid-cols-4 gap-2 p-4 bg-neutral-lightest lg:hidden"
            data-oid="ri03rut"
          >
            {productImages.map((img, index) => (
              <div
                key={index}
                className={`aspect-square overflow-hidden rounded-md cursor-pointer ${
                  activeImageIndex === index ? "border-2 border-primary" : ""
                }`}
                onClick={() => setActiveImageIndex(index)}
                data-oid="oqsx.qx"
              >
                <img
                  src={img}
                  alt={`${product.name} image ${index + 1}`}
                  className="w-full h-full object-cover"
                  data-oid="wla6vrr"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right column with details */}
        <div className="lg:w-1/2 p-6 lg:p-8" data-oid="h:i1.nl">
          <div
            className="hidden lg:flex lg:items-center mb-6"
            data-oid=":f5ns_t"
          >
            <div
              className="bg-primary/10 rounded-full p-3 mr-4"
              data-oid="sdhq-0a"
            >
              {getIconForIndustry(industryNames[product.industryId])}
            </div>
            <div data-oid="1cnxvl8">
              <span className="text-primary font-medium" data-oid="33oe1-:">
                {industryNames[product.industryId]}
              </span>
              <h2
                className="text-2xl font-heading font-bold text-neutral-darkest"
                data-oid="qczwqzk"
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
            data-oid="ezedfdc"
          >
            <TabsList
              className="border-b border-neutral-light w-full justify-start rounded-none bg-transparent"
              data-oid="hqoyq2c"
            >
              <TabsTrigger
                value="overview"
                className={`data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 border-transparent px-1 py-4`}
                data-oid="oiax72t"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="benefits"
                className={`data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 border-transparent px-1 py-4`}
                data-oid="s8rmx7f"
              >
                Benefits
              </TabsTrigger>
              <TabsTrigger
                value="processing"
                className={`data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 border-transparent px-1 py-4`}
                data-oid="2ksadfw"
              >
                Processing
              </TabsTrigger>
              <TabsTrigger
                value="market"
                className={`data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 border-transparent px-1 py-4`}
                data-oid="wpyp30-"
              >
                Market
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6" data-oid="g6ko95r">
              <h3
                className="font-heading font-medium text-lg mb-3"
                data-oid="5tgc0is"
              >
                Description
              </h3>
              <p className="text-neutral-dark mb-4" data-oid=".p.5u_k">
                {product.description}
              </p>

              <div className="grid grid-cols-2 gap-6 my-6" data-oid="fv2p9bh">
                <div
                  className="bg-neutral-lightest p-4 rounded-lg"
                  data-oid="tk5-jog"
                >
                  <h4
                    className="font-heading font-medium text-sm mb-2"
                    data-oid="40y3p5:"
                  >
                    Properties
                  </h4>
                  <ul className="space-y-2 text-sm" data-oid="ca26lgj">
                    {Array.isArray(product.properties) &&
                      product.properties.map((property, index) => (
                        <li
                          key={index}
                          className="flex items-start"
                          data-oid="u6e2tr_"
                        >
                          <CheckCircle
                            className="h-5 w-5 mr-2 text-primary shrink-0"
                            data-oid="jqwa5dj"
                          />
                          {property}
                        </li>
                      ))}
                  </ul>
                </div>

                <div
                  className="bg-neutral-lightest p-4 rounded-lg"
                  data-oid="6:e31s."
                >
                  <h4
                    className="font-heading font-medium text-sm mb-2"
                    data-oid="-p_0h.c"
                  >
                    Key Facts
                  </h4>
                  <ul className="space-y-2 text-sm" data-oid="g37ux9s">
                    {Array.isArray(product.facts) &&
                      product.facts.map((fact, index) => (
                        <li
                          key={index}
                          className="flex items-start"
                          data-oid="6wm.pw3"
                        >
                          <CheckCircle
                            className="h-5 w-5 mr-2 text-primary shrink-0"
                            data-oid="68zsom4"
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
                    data-oid="cb-w_gf"
                  >
                    Sustainability Impact
                  </h3>
                  <p className="text-neutral-dark mb-6" data-oid="8ea-jfn">
                    {product.sustainabilityImpact}
                  </p>
                </>
              )}
            </TabsContent>

            <TabsContent value="benefits" data-oid="-tyzx:w">
              <div
                className="p-6 bg-neutral-lightest rounded-lg"
                data-oid="7.11kqh"
              >
                <h3
                  className="font-heading font-medium text-lg mb-4"
                  data-oid="8r2cjdg"
                >
                  Key Benefits
                </h3>
                <ul className="space-y-4" data-oid="6mw61fd">
                  {Array.isArray(product.properties) &&
                    product.properties.map((property, index) => (
                      <li
                        key={index}
                        className="flex items-start"
                        data-oid="wi8xbd4"
                      >
                        <div
                          className="bg-primary/10 rounded-full p-2 mr-3 mt-1"
                          data-oid="qby8qs-"
                        >
                          <CheckCircle
                            className="h-5 w-5 text-primary"
                            data-oid="x.b9va6"
                          />
                        </div>
                        <div data-oid="0d9d:dp">
                          <h4 className="font-medium" data-oid="v5.iqj1">
                            {property}
                          </h4>
                          <p
                            className="text-sm text-neutral-dark"
                            data-oid="8lg15nq"
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

            <TabsContent value="processing" data-oid="fwzj4ti">
              <div
                className="p-6 bg-neutral-lightest rounded-lg"
                data-oid="if5-mzw"
              >
                <h3
                  className="font-heading font-medium text-lg mb-4"
                  data-oid="g5dz84w"
                >
                  Processing Methods
                </h3>
                <p className="text-neutral-dark mb-4" data-oid="b-0n.u5">
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
                  data-oid="1o4sh2z"
                />

                <h4
                  className="font-heading font-medium mb-2"
                  data-oid="evw-psv"
                >
                  Production Steps:
                </h4>
                <ol
                  className="list-decimal list-inside space-y-2 text-sm text-neutral-dark"
                  data-oid="zydxxq7"
                >
                  <li data-oid="ts1dg0i">Harvesting at optimal maturity</li>
                  <li data-oid="fmzb.ks">Initial processing of raw material</li>
                  <li data-oid=":wsmbru">Refinement and preparation</li>
                  <li data-oid="88kc8_h">Manufacturing into final product</li>
                  <li data-oid="s5-7-:g">Quality testing and packaging</li>
                </ol>
              </div>
            </TabsContent>

            <TabsContent value="market" data-oid="0292rjf">
              <div
                className="p-6 bg-neutral-lightest rounded-lg"
                data-oid="4clqzkf"
              >
                <h3
                  className="font-heading font-medium text-lg mb-4"
                  data-oid="5itu9h."
                >
                  Market Overview
                </h3>
                <p className="text-neutral-dark mb-4" data-oid="12fzrq9">
                  The market for {product.name.toLowerCase()} is growing as
                  consumers and industries seek sustainable alternatives. Recent
                  trends show increased adoption across both specialty and
                  mainstream markets.
                </p>
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4"
                  data-oid="3gqcdw:"
                >
                  <div
                    className="bg-white p-4 rounded-lg border border-neutral-light"
                    data-oid="h65w91q"
                  >
                    <h4 className="font-medium mb-2" data-oid="8hzevp.">
                      Market Growth
                    </h4>
                    <p className="text-sm text-neutral-dark" data-oid="7gt.l43">
                      15-20% annual growth expected in this sector over the next
                      5 years
                    </p>
                  </div>
                  <div
                    className="bg-white p-4 rounded-lg border border-neutral-light"
                    data-oid="mxa1p-7"
                  >
                    <h4 className="font-medium mb-2" data-oid="._.jind">
                      Price Points
                    </h4>
                    <p className="text-sm text-neutral-dark" data-oid="gjrq76m">
                      Premium positioning with increasing price competitiveness
                      as production scales
                    </p>
                  </div>
                </div>
                <h4
                  className="font-heading font-medium mb-2"
                  data-oid="uioje2-"
                >
                  Key Market Drivers:
                </h4>
                <ul
                  className="list-disc list-inside space-y-2 text-sm text-neutral-dark"
                  data-oid="aboa.fp"
                >
                  <li data-oid="ei1oyy:">
                    Growing consumer interest in sustainable products
                  </li>
                  <li data-oid=".x5palm">
                    Corporate sustainability initiatives
                  </li>
                  <li data-oid="n3z6k.q">
                    Improved manufacturing technologies
                  </li>
                  <li data-oid="uj2l7h7">Favorable regulatory environment</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>

          {/* Related products */}
          {Array.isArray(product.relatedProductIds) &&
            product.relatedProductIds.length > 0 && (
              <div
                className="border-t border-neutral-light pt-6 mb-4"
                data-oid="g2ebz9g"
              >
                <h3
                  className="font-heading font-medium text-lg mb-4"
                  data-oid="lj4zq2-"
                >
                  Related Products
                </h3>
                <div
                  className="flex space-x-4 overflow-x-auto pb-2"
                  data-oid="e1lq:fw"
                >
                  {/* This would typically fetch related products from your database */}
                  {[1, 2, 3, 4].map((i) => (
                    <Link
                      key={i}
                      href={`/product/${product.relatedProductIds ? product.relatedProductIds[i % product.relatedProductIds.length] : i}`}
                      data-oid="xh2h-3."
                    >
                      <a className="flex-shrink-0 group" data-oid="ty8lb35">
                        <div
                          className="w-32 h-32 rounded-lg overflow-hidden"
                          data-oid="jc22e_x"
                        >
                          <img
                            src={`https://images.unsplash.com/photo-${1500000000000 + i * 10000}?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150`}
                            alt={`Related hemp product ${i}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-all"
                            data-oid="h:xd9hf"
                          />
                        </div>
                        <p
                          className="mt-2 text-sm font-medium text-center"
                          data-oid="nw_mzo7"
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
                data-oid="ccg3w1:"
              >
                <h3
                  className="font-heading font-medium text-lg mb-4"
                  data-oid="i.62f5."
                >
                  Shop {product.name}
                </h3>
                <p
                  className="text-sm text-neutral-medium mb-4"
                  data-oid="fbd9_4k"
                >
                  Affiliate links to trusted retailers:
                </p>
                <div className="flex flex-wrap gap-3" data-oid="8300ywh">
                  {product.affiliateLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-neutral-lightest hover:bg-neutral-light rounded-lg border border-neutral-light transition-colors"
                      data-oid="xll_p6p"
                    >
                      <span
                        className="font-medium text-neutral-dark"
                        data-oid="xk8k.bu"
                      >
                        {link.name}
                      </span>
                      <ExternalLink
                        className="h-4 w-4 ml-2 text-neutral-medium"
                        data-oid="gegtqf."
                      />
                    </a>
                  ))}
                </div>
                <p
                  className="text-xs text-neutral-medium mt-3"
                  data-oid="8qskko4"
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
