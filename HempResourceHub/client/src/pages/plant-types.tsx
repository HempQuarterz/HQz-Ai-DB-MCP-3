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
        <meta name="description" content="Explore different parts of industrial hemp plants and their applications including stalks, seeds, leaves, and flowers." />
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Parts of Plant" }
            ]}
          />
        </div>
      </div>

      {/* Hero section */}
      <div className="bg-green-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-neutral-darkest">
            Hemp Plant Parts
          </h1>
          <p className="mt-4 text-lg text-neutral-dark max-w-3xl mx-auto">
            Explore the various parts of the hemp plant and their industrial applications, from stalks used in textiles to seeds used in food products.
          </p>
        </div>
      </div>

      {/* Plant parts grid */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-neutral-darkest mb-12 text-center">
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
                  <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 ease-in-out group-hover:shadow-lg">
                    <img 
                      src={plantType.imageUrl || 'https://via.placeholder.com/800x1000'} 
                      alt={`${plantType.name} plant`} 
                      className="h-full w-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="text-xl font-heading font-semibold text-white">{plantType.name}</h3>
                      <p className="mt-2 text-sm text-white/80 line-clamp-3">{plantType.description}</p>
                    </div>
                  </div>
                  <Link href={`/plant-type/${plantType.id}`}>
                    <div className="absolute inset-0 z-10 block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer" aria-label={`View ${plantType.name} applications`}></div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Plant parts comparison */}
      <div className="bg-neutral-lightest py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-neutral-darkest mb-12 text-center">
            Hemp Plant Parts Comparison
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-light">
              <thead className="bg-neutral-lightest">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-neutral-darkest uppercase tracking-wider">Plant Part</th>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-neutral-darkest uppercase tracking-wider">Primary Uses</th>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-neutral-darkest uppercase tracking-wider">Characteristics</th>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-neutral-darkest uppercase tracking-wider">Processing Methods</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-light">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-neutral-darkest">Stalks/Stems</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-neutral-dark">Textiles, Paper, Building Materials</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-neutral-dark">Fibrous, durable, high tensile strength</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-neutral-dark">Retting, decortication, pulping</div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-neutral-darkest">Seeds</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-neutral-dark">Food, Nutritional Supplements, Oil</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-neutral-dark">High protein, rich in omega fatty acids</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-neutral-dark">Hulling, cold pressing, roasting</div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-neutral-darkest">Leaves</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-neutral-dark">Tea, Animal Feed, Compost</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-neutral-dark">Rich in chlorophyll and nutrients</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-neutral-dark">Drying, grinding, extraction</div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-neutral-darkest">Flowers</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-neutral-dark">Wellness Products, Extracts</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-neutral-dark">Contains cannabinoids and terpenes</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-neutral-dark">Curing, extraction, distillation</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-neutral-darkest mb-4">
            Explore Hemp Industry Applications
          </h2>
          <p className="text-lg text-neutral-dark max-w-3xl mx-auto mb-8">
            Discover how different parts of the hemp plant are utilized across various industries for sustainable solutions.
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