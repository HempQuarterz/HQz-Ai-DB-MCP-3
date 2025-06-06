import { useState } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { Industry } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useIndustries } from "@/hooks/use-plant-data";
import Breadcrumb from "@/components/ui/breadcrumb";

const IndustriesPage = () => {
  const { data: industries, isLoading } = useIndustries();

  // Industry description placeholders - in a real app, these would come from the database
  const industryDescriptions: Record<string, string> = {
    Textiles:
      "Hemp fibers are used to create durable, sustainable textiles for clothing, accessories, and industrial applications.",
    Construction:
      "Hemp-based materials are used in construction for insulation, hempcrete, and other building materials.",
    "Food & Nutrition":
      "Hemp seeds and oils provide nutritious ingredients for various food products.",
    "Paper & Packaging":
      "Hemp fibers can be processed into paper products that require fewer chemicals and less processing than wood pulp.",
    Biofuels:
      "Hemp biomass can be converted into sustainable biofuels for energy production.",
    Pharmaceuticals:
      "Hemp extracts are used in various pharmaceutical applications and wellness products.",
    Cosmetics:
      "Hemp-derived ingredients are used in skincare, haircare, and other personal care products.",
    Agriculture:
      "Hemp cultivation provides solutions for crop rotation, soil remediation, and sustainable farming practices.",
  };

  // Industry icons using emoji as placeholders - in a real app, these would be proper icons
  const industryIcons: Record<string, string> = {
    Textiles: "👕",
    Construction: "🏗️",
    "Food & Nutrition": "🥗",
    "Paper & Packaging": "📦",
    Biofuels: "⚡",
    Pharmaceuticals: "💊",
    Cosmetics: "💄",
    Agriculture: "🌱",
  };

  // Background colors for cards
  const cardColors = [
    "bg-gradient-to-br from-green-50 to-green-100",
    "bg-gradient-to-br from-emerald-50 to-emerald-100",
    "bg-gradient-to-br from-teal-50 to-teal-100",
    "bg-gradient-to-br from-green-100 to-emerald-50",
  ];

  return (
    <>
      <Helmet>
        <title>Industrial Hemp Industries | HempQuarterz</title>
        <meta
          name="description"
          content="Explore the diverse industrial applications of hemp across various industries including textiles, construction, food, biofuels, and more."
        />
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[{ label: "Home", href: "/" }, { label: "Industries" }]}
          />
        </div>
      </div>

      {/* Hero section */}
      <div className="bg-primary-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-green-700 text-outline-black">
            Industrial Hemp Industry Applications
          </h1>
          <p className="mt-4 text-lg text-neutral-dark max-w-3xl mx-auto">
            Discover how industrial hemp is revolutionizing various industries
            with sustainable, eco-friendly solutions and innovative
            applications.
          </p>
        </div>
      </div>

      {/* Industries grid */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-green-700 text-outline-black mb-12 text-center">
            Explore Industries Using Hemp
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-6">
                    <Skeleton className="h-8 w-24 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-6" />
                    <Skeleton className="h-10 w-36" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {industries?.map((industry: Industry, index: number) => (
                <Card
                  key={industry.id}
                  className={`overflow-hidden border border-green-200 ${cardColors[index % cardColors.length]}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <span
                        className="text-4xl mr-3"
                        role="img"
                        aria-label={industry.name}
                      >
                        {industryIcons[industry.name] || "🌿"}
                      </span>
                      <h3 className="text-xl font-heading font-semibold text-green-700 text-outline-black">
                        {industry.name}
                      </h3>
                    </div>
                    <p className="text-neutral-dark mb-6">
                      {industryDescriptions[industry.name] ||
                        "Industrial hemp provides sustainable solutions for this industry with its versatile applications."}
                    </p>
                    <Link href={`/industry/${industry.id}`}>
                      <Button
                        variant="outline"
                        className="group border-green-600 text-green-700 hover:bg-green-50"
                      >
                        Explore Applications
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Industry stats section */}
      <div className="bg-neutral-lightest py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-green-700 text-outline-black mb-12">
            Hemp Industry Growth
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="text-4xl font-bold text-green-600 text-outline-black mb-2">
                35%
              </div>
              <p className="text-neutral-dark">
                Annual growth in the hemp textiles market
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="text-4xl font-bold text-green-600 text-outline-black mb-2">
                $15B
              </div>
              <p className="text-neutral-dark">
                Projected global hemp market by 2027
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="text-4xl font-bold text-green-600 text-outline-black mb-2">
                25+
              </div>
              <p className="text-neutral-dark">
                Major industries using hemp materials
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-primary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-neutral-darkest mb-4">
            Discover Hemp Plant Types
          </h2>
          <p className="text-lg text-neutral-dark max-w-3xl mx-auto mb-8">
            Explore different hemp plant types and their specific applications
            across industries.
          </p>
          <Link href="/plant-types">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              View Hemp Plant Types
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default IndustriesPage;
