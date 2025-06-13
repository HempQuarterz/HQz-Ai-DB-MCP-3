import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { usePlantTypes } from "@/hooks/use-plant-data";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/ui/breadcrumb";
import { PlantType } from "@shared/schema";
import { useState, useEffect } from "react";

const PlantTypesPage = () => {
  const { data: plantTypesData, isLoading } = usePlantTypes();
  const [plantTypes, setPlantTypes] = useState<PlantType[]>([]);

  useEffect(() => {
    if (plantTypesData) {
      setPlantTypes(plantTypesData as PlantType[]);
    }
  }, [plantTypesData]);

  return (
    <>
      <Helmet>
        <title>Hemp Plant Parts | HempQuarterz</title>
        <meta
          name="description"
          content="Explore different parts of industrial hemp plants and their applications including stalks, seeds, leaves, and flowers."
        />
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-gray-900 py-6 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[{ label: "Home", href: "/" }, { label: "Parts of Plant" }]}
          />
        </div>
      </div>

      {/* Hero section */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-green-400">
            Hemp Plant Parts
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
            Explore the various parts of the hemp plant and their industrial
            applications, from stalks used in textiles to seeds used in food
            products.
          </p>
        </div>
      </div>

      {/* Plant parts grid */}
      <div className="bg-gray-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-green-400 mb-12 text-center">
            Select a Plant Part
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-[4/5] relative">
                    <Skeleton className="absolute inset-0" />
                  </div>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-5/6" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {plantTypes.map((plantType: PlantType) => (
                <div key={plantType.id} className="relative group">
                  <div className="relative h-80 w-full overflow-hidden rounded-lg bg-gray-900 shadow-lg shadow-black/50 transition-all duration-300 ease-in-out group-hover:shadow-green-500/20 border border-green-500/30 group-hover:border-green-400/50">
                    <img
                      src={
                        plantType.imageUrl ||
                        "https://via.placeholder.com/800x1000"
                      }
                      alt={`${plantType.name} plant`}
                      className="h-full w-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="text-xl font-heading font-semibold text-white">
                        {plantType.name}
                      </h3>
                      <p className="mt-2 text-sm text-white/80 line-clamp-3">
                        {plantType.description}
                      </p>
                    </div>
                  </div>
                  <Link href={`/plant-type/${plantType.id}`}>
                    <div
                      className="absolute inset-0 z-10 block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
                      aria-label={`View ${plantType.name} applications`}
                    ></div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Plant parts comparison */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-green-400 mb-12 text-center">
            Hemp Plant Parts Comparison
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider"
                  >
                    Plant Part
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-semibold text-neutral-darkest uppercase tracking-wider"
                  >
                    Primary Uses
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-semibold text-neutral-darkest uppercase tracking-wider"
                  >
                    Characteristics
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-semibold text-neutral-darkest uppercase tracking-wider"
                  >
                    Processing Methods
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800/50 divide-y divide-gray-700">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-200">
                      Stalks/Stems
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-400">
                      Textiles, Paper, Building Materials
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-400">
                      Fibrous, durable, high tensile strength
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-400">
                      Retting, decortication, pulping
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-200">
                      Seeds
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-400">
                      Food, Nutritional Supplements, Oil
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-400">
                      High protein, rich in omega fatty acids
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-400">
                      Hulling, cold pressing, roasting
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-200">
                      Leaves
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-400">
                      Tea, Animal Feed, Compost
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-400">
                      Rich in chlorophyll and nutrients
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-400">
                      Drying, grinding, extraction
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-200">
                      Flowers
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-400">
                      Wellness Products, Extracts
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-400">
                      Contains cannabinoids and terpenes
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-400">
                      Curing, extraction, distillation
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-gradient-to-b from-gray-950 to-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-green-400 mb-4">
            Explore Hemp Industry Applications
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
            Discover how different parts of the hemp plant are utilized across
            various industries for sustainable solutions.
          </p>
          <Link href="/industries">
            <div className="inline-block">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Browse Industries
              </Button>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default PlantTypesPage;
