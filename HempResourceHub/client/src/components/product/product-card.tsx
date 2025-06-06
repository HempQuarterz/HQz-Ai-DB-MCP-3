import { Link } from "wouter";
import { HempProduct } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import {
  Shirt,
  Building2,
  FileText,
  Zap,
  Home,
  ArrowRight,
} from "lucide-react";

interface ProductCardProps {
  product: HempProduct;
  industryNames: Record<number, string>;
  subIndustryNames: Record<number, string>;
  plantPartNames: Record<number, string>;
}

const ProductCard = ({
  product,
  industryNames,
  subIndustryNames,
  plantPartNames,
}: ProductCardProps) => {
  // Function to get an icon based on industry name
  const getIconForIndustry = (industryId: number) => {
    const name = industryNames[industryId]?.toLowerCase() || "";
    if (name.includes("textile"))
      return <Shirt className="h-5 w-5 text-primary" data-oid="8ssyoib" />;
    if (name.includes("construction"))
      return <Building2 className="h-5 w-5 text-primary" data-oid="pu4rq9k" />;
    if (name.includes("paper"))
      return <FileText className="h-5 w-5 text-primary" data-oid=".w_:8o5" />;
    if (name.includes("automotive"))
      return <Zap className="h-5 w-5 text-primary" data-oid="g5s:r2a" />;
    if (name.includes("animal"))
      return <Home className="h-5 w-5 text-primary" data-oid="3_yhv6t" />;
    return <Shirt className="h-5 w-5 text-primary" data-oid="bjbaq32" />; // Default
  };

  return (
    <Card
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-neutral-light overflow-hidden"
      data-oid="bk8-9zl"
    >
      <CardHeader
        className="p-4 bg-primary/5 border-b border-neutral-light flex justify-between items-center"
        data-oid="am:eoym"
      >
        <div className="flex items-center" data-oid="zoynahm">
          <div
            className="bg-primary/10 rounded-full p-2 mr-3"
            data-oid=":2q2gn_"
          >
            {getIconForIndustry(product.industryId)}
          </div>
          <div data-oid="kn4bej6">
            <span
              className="text-xs font-medium text-primary"
              data-oid="k._b.wb"
            >
              {industryNames[product.industryId]}
            </span>
            <h3 className="font-heading font-medium" data-oid="h7t8s.u">
              {subIndustryNames[product.subIndustryId || 0] || product.name}
            </h3>
          </div>
        </div>
        <Badge
          variant="outline"
          className="bg-primary/10 text-primary"
          data-oid="mailr-l"
        >
          {plantPartNames[product.plantPartId]}
        </Badge>
      </CardHeader>

      <div className="w-full h-40" data-oid="r092_vl">
        <img
          src={product.imageUrl || "https://via.placeholder.com/800x400"}
          alt={product.name}
          className="w-full h-full object-cover"
          data-oid="3mq4y:."
        />
      </div>

      <CardContent className="p-4" data-oid="y05.59c">
        <p className="text-sm text-neutral-dark mb-4" data-oid="2ktuua3">
          {product.description.length > 150
            ? product.description.substring(0, 150) + "..."
            : product.description}
        </p>

        {Array.isArray(product.properties) && product.properties.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4" data-oid="kibmi7r">
            {product.properties.slice(0, 4).map((property, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-neutral-lightest text-neutral-dark text-xs px-2 py-1 rounded-full"
                data-oid="qkk6503"
              >
                {property}
              </Badge>
            ))}
          </div>
        )}

        <Link href={`/product/${product.id}`} data-oid="tckoasw">
          <div
            className="text-primary hover:text-primary-dark font-medium text-sm flex items-center cursor-pointer"
            data-oid="s_p-g1r"
          >
            View Details
            <ArrowRight className="h-4 w-4 ml-1" data-oid="op7xlzw" />
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
