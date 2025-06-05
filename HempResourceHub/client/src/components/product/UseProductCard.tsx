import React from 'react';
import { Link } from 'wouter'; // Changed from next/link
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
import { ArrowRight } from 'lucide-react';

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
    <Link href={href}> {/* Adjusted for Wouter - passHref and legacyBehavior usually not needed for simple <a> child */}
      <a className="block h-full">
        <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200 overflow-hidden">
          {imageUrl && (
            <div className="relative w-full aspect-[16/9] overflow-hidden">
              {/* Using standard img tag as next/image is not available */}
              <img
                src={imageUrl}
                alt={name || 'Product image'}
                className="w-full h-full object-cover" // Ensure image covers the area
                loading="lazy" // Basic lazy loading
              />
            </div>
          )}

          <CardHeader className="p-4">
            {industryName && (
              <div className="flex items-center text-xs text-muted-foreground mb-1">
                {industryIcon && <span className="mr-1.5">{industryIcon}</span>}
                <span>{industryName}</span>
                {subIndustryName && <span className="mx-1">/</span>}
                {subIndustryName && <span>{subIndustryName}</span>}
              </div>
            )}
            <CardTitle className="text-lg font-semibold line-clamp-2">{name}</CardTitle>
          </CardHeader>

          <CardContent className="p-4 flex-grow">
            {descriptionSnippet && (
              <CardDescription className="text-sm line-clamp-3 mb-3">
                {descriptionSnippet}
              </CardDescription>
            )}

            {plantPartName && (
              <div className="mb-3">
                <Badge variant="outline" className="text-xs">Plant Part: {plantPartName}</Badge>
              </div>
            )}
            
            {tags && tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1">
                {tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>

          <CardFooter className="p-4 flex justify-between items-center">
            {commercializationStage && (
              <Badge variant="default" className="text-xs">
                {commercializationStage}
              </Badge>
            )}
            <div className="text-primary hover:text-primary/80 font-medium text-sm flex items-center">
              View Details
              <ArrowRight className="h-4 w-4 ml-1" />
            </div>
          </CardFooter>
        </Card>
      </a>
    </Link>
  );
};

export default UseProductCard;