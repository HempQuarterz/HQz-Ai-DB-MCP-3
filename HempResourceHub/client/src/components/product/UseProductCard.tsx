import React from "react";
import { Link } from "wouter"; // Changed from next/link
// import Image from 'next/image'; // Next.js Image component not available in Vite by default
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface UseProductCardProps {
  id: string | number;
  name: string;
  href: string;
  imageUrl?: string;
  descriptionSnippet?: string;
  industryName?: string;
  subIndustryName?: string;
  plantPartName?: string;
  commercializationStage?: string;
  tags?: string[];
  industryIcon?: React.ReactNode;
}

const UseProductCard: React.FC<UseProductCardProps> = ({
  id,
  name,
  href,
  imageUrl,
  descriptionSnippet,
  industryName,
  subIndustryName,
  plantPartName,
  commercializationStage,
  tags,
  industryIcon,
}) => {
  return (
    <Link href={href} data-oid="b62z2is">
      {" "}
      {/* Adjusted for Wouter - passHref and legacyBehavior usually not needed for simple <a> child */}
      <a className="block h-full" data-oid="lphdr9u">
        <Card
          className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200 overflow-hidden"
          data-oid=".n0dl.:"
        >
          {imageUrl && (
            <div
              className="relative w-full aspect-[16/9] overflow-hidden"
              data-oid="e_njk_z"
            >
              {/* Using standard img tag as next/image is not available */}
              <img
                src={imageUrl}
                alt={name || "Product image"}
                className="w-full h-full object-cover" // Ensure image covers the area
                loading="lazy" // Basic lazy loading
                data-oid="3x8ahq_"
              />
            </div>
          )}

          <CardHeader className="p-4" data-oid="mdtcyzt">
            {industryName && (
              <div
                className="flex items-center text-xs text-muted-foreground mb-1"
                data-oid="ne4ykg:"
              >
                {industryIcon && (
                  <span className="mr-1.5" data-oid="2:e5axz">
                    {industryIcon}
                  </span>
                )}
                <span data-oid="6u:qfrg">{industryName}</span>
                {subIndustryName && (
                  <span className="mx-1" data-oid="f91t-tq">
                    /
                  </span>
                )}
                {subIndustryName && (
                  <span data-oid="im8utfp">{subIndustryName}</span>
                )}
              </div>
            )}
            <CardTitle
              className="text-lg font-semibold line-clamp-2"
              data-oid="r0:xqbn"
            >
              {name}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4 flex-grow" data-oid="_a1nve.">
            {descriptionSnippet && (
              <CardDescription
                className="text-sm line-clamp-3 mb-3"
                data-oid="lprc2u:"
              >
                {descriptionSnippet}
              </CardDescription>
            )}

            {plantPartName && (
              <div className="mb-3" data-oid="-1b1v90">
                <Badge variant="outline" className="text-xs" data-oid="02kby90">
                  Plant Part: {plantPartName}
                </Badge>
              </div>
            )}

            {tags && tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1" data-oid="bqv:23p">
                {tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs"
                    data-oid="yp9w28v"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>

          <CardFooter
            className="p-4 flex justify-between items-center"
            data-oid="i6b-ek4"
          >
            {commercializationStage && (
              <Badge variant="default" className="text-xs" data-oid="vs_um-_">
                {commercializationStage}
              </Badge>
            )}
            <div
              className="text-primary hover:text-primary/80 font-medium text-sm flex items-center"
              data-oid="ugqlj_8"
            >
              View Details
              <ArrowRight className="h-4 w-4 ml-1" data-oid="7j:041." />
            </div>
          </CardFooter>
        </Card>
      </a>
    </Link>
  );
};

export default UseProductCard;
