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
      <Helmet data-oid=".rfev48">
        <title data-oid="789d:cy">
          Industrial Hemp Industries | HempQuarterz
        </title>
        <meta
          name="description"
          content="Explore the diverse industrial applications of hemp across various industries including textiles, construction, food, biofuels, and more."
          data-oid="79ztlnt"
        />
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-white py-6" data-oid="sq9t23k">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          data-oid="9fwlkle"
        >
          <Breadcrumb
            items={[{ label: "Home", href: "/" }, { label: "Industries" }]}
            data-oid="mlrv__o"
          />
        </div>
      </div>

      {/* Hero section */}
      <div className="bg-primary-50 py-12" data-oid="4r1rzxu">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          data-oid="gk.g2vi"
        >
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-green-700 text-outline-black"
            data-oid="cnexmse"
          >
            Industrial Hemp Industry Applications
          </h1>
          <p
            className="mt-4 text-lg text-neutral-dark max-w-3xl mx-auto"
            data-oid="-4ocdhy"
          >
            Discover how industrial hemp is revolutionizing various industries
            with sustainable, eco-friendly solutions and innovative
            applications.
          </p>
        </div>
      </div>

      {/* Industries grid */}
      <div className="bg-white py-16" data-oid="akfinqs">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          data-oid="yfqh33e"
        >
          <h2
            className="text-2xl sm:text-3xl font-heading font-semibold text-green-700 text-outline-black mb-12 text-center"
            data-oid="l8l1.dd"
          >
            Explore Industries Using Hemp
          </h2>

          {isLoading ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              data-oid="cwj4vek"
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden" data-oid="msd.220">
                  <CardContent className="p-6" data-oid="uo2owi0">
                    <Skeleton className="h-8 w-24 mb-4" data-oid="ffb.yc7" />
                    <Skeleton className="h-4 w-full mb-2" data-oid="w:d:qya" />
                    <Skeleton className="h-4 w-3/4 mb-6" data-oid="83-r3h-" />
                    <Skeleton className="h-10 w-36" data-oid="op9qgnw" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              data-oid="b36-m-_"
            >
              {industries?.map((industry: Industry, index: number) => (
                <Card
                  key={industry.id}
                  className={`overflow-hidden border border-green-200 ${cardColors[index % cardColors.length]}`}
                  data-oid="-x.dhk8"
                >
                  <CardContent className="p-6" data-oid="0u6vv89">
                    <div className="flex items-center mb-4" data-oid="_mm7aur">
                      <span
                        className="text-4xl mr-3"
                        role="img"
                        aria-label={industry.name}
                        data-oid="1:ay03a"
                      >
                        {industryIcons[industry.name] || "🌿"}
                      </span>
                      <h3
                        className="text-xl font-heading font-semibold text-green-700 text-outline-black"
                        data-oid=".k3k2gp"
                      >
                        {industry.name}
                      </h3>
                    </div>
                    <p className="text-neutral-dark mb-6" data-oid="4k3j00j">
                      {industryDescriptions[industry.name] ||
                        "Industrial hemp provides sustainable solutions for this industry with its versatile applications."}
                    </p>
                    <Link href={`/industry/${industry.id}`} data-oid="v7bpgxy">
                      <Button
                        variant="outline"
                        className="group border-green-600 text-green-700 hover:bg-green-50"
                        data-oid="h_ybnh3"
                      >
                        Explore Applications
                        <ArrowRight
                          className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                          data-oid="9g17nd9"
                        />
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
      <div className="bg-neutral-lightest py-16" data-oid="upwblo:">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          data-oid="r.u1qx:"
        >
          <h2
            className="text-2xl sm:text-3xl font-heading font-semibold text-green-700 text-outline-black mb-12"
            data-oid="uj1dcng"
          >
            Hemp Industry Growth
          </h2>
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            data-oid="m6r046d"
          >
            <div
              className="bg-white rounded-lg shadow-sm p-8"
              data-oid="xuwjjml"
            >
              <div
                className="text-4xl font-bold text-green-600 text-outline-black mb-2"
                data-oid="_w2eysy"
              >
                35%
              </div>
              <p className="text-neutral-dark" data-oid="f0bto-i">
                Annual growth in the hemp textiles market
              </p>
            </div>
            <div
              className="bg-white rounded-lg shadow-sm p-8"
              data-oid="_nlnhwj"
            >
              <div
                className="text-4xl font-bold text-green-600 text-outline-black mb-2"
                data-oid="x1qy:m6"
              >
                $15B
              </div>
              <p className="text-neutral-dark" data-oid="dc32rou">
                Projected global hemp market by 2027
              </p>
            </div>
            <div
              className="bg-white rounded-lg shadow-sm p-8"
              data-oid="b755x:i"
            >
              <div
                className="text-4xl font-bold text-green-600 text-outline-black mb-2"
                data-oid="n0hmu8h"
              >
                25+
              </div>
              <p className="text-neutral-dark" data-oid=".osr096">
                Major industries using hemp materials
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-primary-50 py-16" data-oid="p8hkt-e">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          data-oid="qe3iv0l"
        >
          <h2
            className="text-2xl sm:text-3xl font-heading font-semibold text-neutral-darkest mb-4"
            data-oid="m9:b68f"
          >
            Discover Hemp Plant Types
          </h2>
          <p
            className="text-lg text-neutral-dark max-w-3xl mx-auto mb-8"
            data-oid="sw72w5p"
          >
            Explore different hemp plant types and their specific applications
            across industries.
          </p>
          <Link href="/plant-types" data-oid="mf:sjrd">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              data-oid="a0xazjj"
            >
              View Hemp Plant Types
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default IndustriesPage;
