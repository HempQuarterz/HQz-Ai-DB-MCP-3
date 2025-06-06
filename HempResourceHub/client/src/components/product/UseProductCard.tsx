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
    <Link href={href} data-oid="ha9-sgv">
      {" "}
      {/* Adjusted for Wouter - passHref and legacyBehavior usually not needed for simple <a> child */}
      <a className="block h-full" data-oid="kah3ybr">
        <Card
          className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200 overflow-hidden"
          data-oid="dw0z7e1"
        >
          {imageUrl && (
            <div
              className="relative w-full aspect-[16/9] overflow-hidden"
              data-oid="32-p74."
            >
              {/* Using standard img tag as next/image is not available */}
              <img
                src={imageUrl}
                alt={name || "Product image"}
                className="w-full h-full object-cover" // Ensure image covers the area
                loading="lazy" // Basic lazy loading
                data-oid="fowvexb"
              />
            </div>
          )}

          <CardHeader className="p-4" data-oid="f.0w1ki">
            {industryName && (
              <div
                className="flex items-center text-xs text-muted-foreground mb-1"
                data-oid="ejazpp-"
              >
                {industryIcon && (
                  <span className="mr-1.5" data-oid="7de3orv">
                    {industryIcon}
                  </span>
                )}
                <span data-oid=".s072:k">{industryName}</span>
                {subIndustryName && (
                  <span className="mx-1" data-oid="r16i.op">
                    /
                  </span>
                )}
                {subIndustryName && (
                  <span data-oid="6adjxsi">{subIndustryName}</span>
                )}
              </div>
            )}
            <CardTitle
              className="text-lg font-semibold line-clamp-2"
              data-oid="ropzacm"
            >
              {name}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4 flex-grow" data-oid="5nbmx0q">
            {descriptionSnippet && (
              <CardDescription
                className="text-sm line-clamp-3 mb-3"
                data-oid=":eoj6iz"
              >
                {descriptionSnippet}
              </CardDescription>
            )}

            {plantPartName && (
              <div className="mb-3" data-oid="ujrspq0">
                <Badge variant="outline" className="text-xs" data-oid="sk5xjy9">
                  Plant Part: {plantPartName}
                </Badge>
              </div>
            )}

            {tags && tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1" data-oid="m..suf6">
                {tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs"
                    data-oid="a2h96bj"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>

          <CardFooter
            className="p-4 flex justify-between items-center"
            data-oid="hdfqm7h"
          >
            {commercializationStage && (
              <Badge variant="default" className="text-xs" data-oid="5u1i5.e">
                {commercializationStage}
              </Badge>
            )}
            <div
              className="text-primary hover:text-primary/80 font-medium text-sm flex items-center"
              data-oid="x:u7ffy"
            >
              View Details
              <ArrowRight className="h-4 w-4 ml-1" data-oid="jm2kcu1" />
            </div>
          </CardFooter>
        </Card>
      </a>
    </Link>
  );
};

export default UseProductCard;
