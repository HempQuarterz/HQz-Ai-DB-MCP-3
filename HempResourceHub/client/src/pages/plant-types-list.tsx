import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { PlantType } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { usePlantTypes } from "@/hooks/use-plant-data";
import Breadcrumb from "@/components/ui/breadcrumb";

const PlantTypesListPage = () => {
  const { data: plantTypesData, isLoading } = usePlantTypes();
  const [plantTypes, setPlantTypes] = useState<PlantType[]>([]);

  useEffect(() => {
    if (plantTypesData) {
      setPlantTypes(Array.isArray(plantTypesData) ? plantTypesData : []);
    }
  }, [plantTypesData]);

  return (
    <>
      <Helmet data-oid="f.ft2wf">
        <title data-oid="veqp9zr">Hemp Plant Types | HempQuarterz</title>
        <meta
          name="description"
          content="Explore different types of industrial hemp plants including fiber hemp, grain hemp, and cannabinoid hemp varieties."
          data-oid=":tmn.1b"
        />
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-white py-6" data-oid="rg-.ome">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          data-oid=":qxkmwl"
        >
          <Breadcrumb
            items={[{ label: "Home", href: "/" }, { label: "Plant Types" }]}
            data-oid="xion83x"
          />
        </div>
      </div>

      {/* Hero section */}
      <div className="bg-green-50 py-12" data-oid="t7jxi.x">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          data-oid="2dvx:n6"
        >
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-green-700 text-outline-black"
            data-oid=":a5wjsd"
          >
            Hemp Plant Types
          </h1>
          <p
            className="mt-4 text-lg text-neutral-dark max-w-3xl mx-auto"
            data-oid="v.hmvhu"
          >
            Industrial hemp is cultivated for specific purposes based on the
            variety. Learn about the different types of hemp plants and their
            unique characteristics.
          </p>
        </div>
      </div>

      {/* Plant types grid */}
      <div className="bg-white py-16" data-oid="4q8iqi7">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          data-oid=".s998ez"
        >
          <h2
            className="text-2xl sm:text-3xl font-heading font-semibold text-green-700 text-outline-black mb-8 text-center"
            data-oid="suotbru"
          >
            Hemp Cultivation Varieties
          </h2>
          <p
            className="text-center text-neutral-dark max-w-3xl mx-auto mb-12"
            data-oid="ls7gje2"
          >
            Hemp plants are bred and cultivated for different purposes. Each
            type has unique characteristics optimized for specific industrial
            applications.
          </p>

          {isLoading ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              data-oid="7cr2y6:"
            >
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden" data-oid="ltdyb51">
                  <div className="aspect-video relative" data-oid="luq2dhe">
                    <Skeleton className="absolute inset-0" data-oid="cxmqu_0" />
                  </div>
                  <CardContent className="p-6" data-oid="y8p6fh6">
                    <Skeleton className="h-6 w-3/4 mb-2" data-oid="sgitk_e" />
                    <Skeleton className="h-4 w-full mb-1" data-oid="e1uccc7" />
                    <Skeleton className="h-4 w-5/6 mb-4" data-oid="0-va.ch" />
                    <Skeleton className="h-10 w-36" data-oid="929mr4j" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              data-oid="9ok8kh_"
            >
              {plantTypes.map((plantType: PlantType) => (
                <Card
                  key={plantType.id}
                  className="overflow-hidden border border-green-200 hover:shadow-lg transition-shadow duration-300"
                  data-oid="ah_cn75"
                >
                  <div className="aspect-video relative" data-oid="1t8e5xh">
                    <img
                      src={
                        plantType.id === 1
                          ? "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Hanffeld.jpg/1200px-Hanffeld.jpg"
                          : plantType.imageUrl ||
                            "https://via.placeholder.com/800x450?text=Hemp+Plant+Type"
                      }
                      alt={`${plantType.name} plant type`}
                      className="h-full w-full object-cover"
                      data-oid="mup_1el"
                    />

                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                      data-oid="1ghkfq7"
                    ></div>
                    <div
                      className="absolute bottom-0 left-0 p-4"
                      data-oid="g-d52vh"
                    >
                      <h3
                        className="text-xl font-heading font-semibold text-white"
                        data-oid="gd.f-yc"
                      >
                        {plantType.name}
                      </h3>
                    </div>
                  </div>
                  <CardContent className="p-6" data-oid="g9k1n1r">
                    <p className="text-neutral-dark mb-4" data-oid="_tdsv2s">
                      {plantType.description}
                    </p>
                    {plantType.characteristics && (
                      <div className="mb-4" data-oid="f5r8lvh">
                        <h4
                          className="font-medium text-green-700 mb-1"
                          data-oid="olgxbqr"
                        >
                          Characteristics:
                        </h4>
                        <p
                          className="text-sm text-neutral-medium"
                          data-oid="f5dbg43"
                        >
                          {plantType.characteristics}
                        </p>
                      </div>
                    )}
                    {plantType.plantingDensity && (
                      <div className="mb-4" data-oid="wn-.7k4">
                        <h4
                          className="font-medium text-green-700 mb-1"
                          data-oid="3p8z2hm"
                        >
                          Planting Density:
                        </h4>
                        <p
                          className="text-sm text-neutral-medium"
                          data-oid="3xx7kxo"
                        >
                          {plantType.plantingDensity}
                        </p>
                      </div>
                    )}
                    <Link
                      href={`/plant-type/${plantType.id}`}
                      data-oid="i:6:.y6"
                    >
                      <div className="mt-2" data-oid="ma37m2z">
                        <Button
                          variant="outline"
                          className="group border-green-600 text-green-700 hover:bg-green-50"
                          data-oid="31_1hpg"
                        >
                          View Details
                          <ArrowRight
                            className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                            data-oid="hwoy08h"
                          />
                        </Button>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Plant types comparison */}
      <div className="bg-neutral-lightest py-16" data-oid="uquxes4">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          data-oid="e4jxvq9"
        >
          <h2
            className="text-2xl sm:text-3xl font-heading font-semibold text-green-700 text-outline-black mb-12 text-center"
            data-oid="fgo82d5"
          >
            Hemp Plant Types Comparison
          </h2>

          <div className="overflow-x-auto" data-oid="o9xe_x8">
            <table
              className="min-w-full divide-y divide-neutral-light"
              data-oid="-_dx9c1"
            >
              <thead className="bg-neutral-lightest" data-oid="y68_8-p">
                <tr data-oid="yzc6d49">
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-semibold text-neutral-darkest uppercase tracking-wider"
                    data-oid="n_fu0.-"
                  >
                    Plant Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-semibold text-neutral-darkest uppercase tracking-wider"
                    data-oid="b:dyg:-"
                  >
                    Primary Purpose
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-semibold text-neutral-darkest uppercase tracking-wider"
                    data-oid="badd134"
                  >
                    Characteristics
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-semibold text-neutral-darkest uppercase tracking-wider"
                    data-oid="r6-9p-9"
                  >
                    Typical Yield
                  </th>
                </tr>
              </thead>
              <tbody
                className="bg-white divide-y divide-neutral-light"
                data-oid="8:-1q2z"
              >
                <tr data-oid="_qg5dnh">
                  <td
                    className="px-6 py-4 whitespace-nowrap"
                    data-oid="m09yi6j"
                  >
                    <div
                      className="font-medium text-neutral-darkest"
                      data-oid="yt8n6wm"
                    >
                      Fiber Hemp
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid="-45-7qs">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid="e_a_.fv"
                    >
                      Textile fibers, building materials
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid="av12nh-">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid="b97kajt"
                    >
                      Tall plants (3-5m), thin stalks, minimal branching
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid="yh7:tno">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid="yyxzu-0"
                    >
                      5-6 tons of fiber per acre
                    </div>
                  </td>
                </tr>
                <tr data-oid="npj.wb6">
                  <td
                    className="px-6 py-4 whitespace-nowrap"
                    data-oid="-92:5pm"
                  >
                    <div
                      className="font-medium text-neutral-darkest"
                      data-oid="8-b_7y7"
                    >
                      Grain/Seed Hemp
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid="pd094li">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid="b.16_v4"
                    >
                      Food, oil, nutritional products
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid="izv_2es">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid=":n0-j:h"
                    >
                      Medium height (2-3m), more branching, dense seed heads
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid="03gp7ju">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid="s4nngnv"
                    >
                      800-1,200 lbs of seed per acre
                    </div>
                  </td>
                </tr>
                <tr data-oid="hqorpd0">
                  <td
                    className="px-6 py-4 whitespace-nowrap"
                    data-oid="jqq7ur9"
                  >
                    <div
                      className="font-medium text-neutral-darkest"
                      data-oid="9f7t5po"
                    >
                      Cannabinoid Hemp
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid="eh.h_p.">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid="cjybx3q"
                    >
                      CBD, CBG extraction for wellness products
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid="0_5g53-">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid="-g6hwzz"
                    >
                      Shorter (1-2m), bushy plants, flower-optimized
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid="d_prgo9">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid="iy3ff-1"
                    >
                      1,000-2,000 lbs of flower per acre
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-green-50 py-16" data-oid="q0__.hl">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          data-oid="l2hg9tr"
        >
          <h2
            className="text-2xl sm:text-3xl font-heading font-semibold text-green-700 text-outline-black mb-4"
            data-oid="ence3jb"
          >
            Explore Hemp Plant Parts
          </h2>
          <p
            className="text-lg text-neutral-dark max-w-3xl mx-auto mb-8"
            data-oid="fr0_w18"
          >
            Learn about the different parts of the hemp plant and their specific
            industrial applications.
          </p>
          <Link href="/plant-parts" data-oid="sp51wb1">
            <div className="inline-block" data-oid="jwkw4vf">
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                data-oid="s9voddz"
              >
                View Plant Parts
              </Button>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default PlantTypesListPage;
