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
      <Helmet data-oid="bs.fjb_">
        <title data-oid="na8gofo">Hemp Plant Parts | HempQuarterz</title>
        <meta
          name="description"
          content="Explore different parts of industrial hemp plants and their applications including stalks, seeds, leaves, and flowers."
          data-oid="xq7sbk_"
        />
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-white py-6" data-oid="mzsc1_p">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          data-oid="zi2ptl0"
        >
          <Breadcrumb
            items={[{ label: "Home", href: "/" }, { label: "Parts of Plant" }]}
            data-oid="r8j-8j2"
          />
        </div>
      </div>

      {/* Hero section */}
      <div className="bg-green-50 py-12" data-oid="ez5lrkq">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          data-oid="digk5_d"
        >
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-neutral-darkest"
            data-oid="-2ytqph"
          >
            Hemp Plant Parts
          </h1>
          <p
            className="mt-4 text-lg text-neutral-dark max-w-3xl mx-auto"
            data-oid="g1p_:44"
          >
            Explore the various parts of the hemp plant and their industrial
            applications, from stalks used in textiles to seeds used in food
            products.
          </p>
        </div>
      </div>

      {/* Plant parts grid */}
      <div className="bg-white py-16" data-oid="-bitbo2">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          data-oid="w8v0q3p"
        >
          <h2
            className="text-2xl sm:text-3xl font-heading font-semibold text-neutral-darkest mb-12 text-center"
            data-oid="huiyt:-"
          >
            Select a Plant Part
          </h2>

          {isLoading ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              data-oid="j.m1i14"
            >
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden" data-oid="dlo4k.z">
                  <div className="aspect-[4/5] relative" data-oid="1r-2ipt">
                    <Skeleton className="absolute inset-0" data-oid="18a7un-" />
                  </div>
                  <CardContent className="p-6" data-oid="2bt7b8n">
                    <Skeleton className="h-6 w-3/4 mb-2" data-oid="zu:-e5f" />
                    <Skeleton className="h-4 w-full mb-1" data-oid="megey4v" />
                    <Skeleton className="h-4 w-5/6" data-oid="c4v-5yf" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              data-oid="a:ps2j2"
            >
              {plantTypes.map((plantType: PlantType) => (
                <div
                  key={plantType.id}
                  className="relative group"
                  data-oid="_agtsek"
                >
                  <div
                    className="relative h-80 w-full overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 ease-in-out group-hover:shadow-lg"
                    data-oid="7w5xvj_"
                  >
                    <img
                      src={
                        plantType.imageUrl ||
                        "https://via.placeholder.com/800x1000"
                      }
                      alt={`${plantType.name} plant`}
                      className="h-full w-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
                      data-oid="i.rc_07"
                    />

                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
                      data-oid="ltp4b4k"
                    ></div>
                    <div
                      className="absolute bottom-0 left-0 p-6"
                      data-oid="ie8q.73"
                    >
                      <h3
                        className="text-xl font-heading font-semibold text-white"
                        data-oid="_94au0m"
                      >
                        {plantType.name}
                      </h3>
                      <p
                        className="mt-2 text-sm text-white/80 line-clamp-3"
                        data-oid="uo.5ewd"
                      >
                        {plantType.description}
                      </p>
                    </div>
                  </div>
                  <Link href={`/plant-type/${plantType.id}`} data-oid="k2n621w">
                    <div
                      className="absolute inset-0 z-10 block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
                      aria-label={`View ${plantType.name} applications`}
                      data-oid="hxeclnc"
                    ></div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Plant parts comparison */}
      <div className="bg-neutral-lightest py-16" data-oid="r:ms2rc">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          data-oid=":ckro05"
        >
          <h2
            className="text-2xl sm:text-3xl font-heading font-semibold text-neutral-darkest mb-12 text-center"
            data-oid="_oqk1hx"
          >
            Hemp Plant Parts Comparison
          </h2>

          <div className="overflow-x-auto" data-oid="_v4qy6k">
            <table
              className="min-w-full divide-y divide-neutral-light"
              data-oid=":7dhlyd"
            >
              <thead className="bg-neutral-lightest" data-oid="7tb0iip">
                <tr data-oid="fs7x5kc">
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-semibold text-neutral-darkest uppercase tracking-wider"
                    data-oid="yx8vjq3"
                  >
                    Plant Part
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-semibold text-neutral-darkest uppercase tracking-wider"
                    data-oid="7c7-vy."
                  >
                    Primary Uses
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-semibold text-neutral-darkest uppercase tracking-wider"
                    data-oid="bh2:3ew"
                  >
                    Characteristics
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-semibold text-neutral-darkest uppercase tracking-wider"
                    data-oid="_1-7oi8"
                  >
                    Processing Methods
                  </th>
                </tr>
              </thead>
              <tbody
                className="bg-white divide-y divide-neutral-light"
                data-oid="ijrh8:z"
              >
                <tr data-oid="_znuy0.">
                  <td
                    className="px-6 py-4 whitespace-nowrap"
                    data-oid="xbk3506"
                  >
                    <div
                      className="font-medium text-neutral-darkest"
                      data-oid="m6l952:"
                    >
                      Stalks/Stems
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid="2iat4ox">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid="iwyi1bm"
                    >
                      Textiles, Paper, Building Materials
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid="a67yi8o">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid="92.h:np"
                    >
                      Fibrous, durable, high tensile strength
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid="ll5o_1a">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid="cwxfd_p"
                    >
                      Retting, decortication, pulping
                    </div>
                  </td>
                </tr>
                <tr data-oid="q9l8vx4">
                  <td
                    className="px-6 py-4 whitespace-nowrap"
                    data-oid="skdsu2c"
                  >
                    <div
                      className="font-medium text-neutral-darkest"
                      data-oid="_nrgb5k"
                    >
                      Seeds
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid="rgt8wn7">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid="2yv:w0l"
                    >
                      Food, Nutritional Supplements, Oil
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid="wpx46v9">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid="b.ntj-1"
                    >
                      High protein, rich in omega fatty acids
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid=":xcx2gk">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid="0p1-e-j"
                    >
                      Hulling, cold pressing, roasting
                    </div>
                  </td>
                </tr>
                <tr data-oid=":q-bw:x">
                  <td
                    className="px-6 py-4 whitespace-nowrap"
                    data-oid="ev6ukap"
                  >
                    <div
                      className="font-medium text-neutral-darkest"
                      data-oid="09ly6y-"
                    >
                      Leaves
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid="qq4x1:6">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid="d.e_zhy"
                    >
                      Tea, Animal Feed, Compost
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid="6w0g_da">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid="x5bwdg:"
                    >
                      Rich in chlorophyll and nutrients
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid="t_5q_p2">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid="z9lywp4"
                    >
                      Drying, grinding, extraction
                    </div>
                  </td>
                </tr>
                <tr data-oid="9xu8c9_">
                  <td
                    className="px-6 py-4 whitespace-nowrap"
                    data-oid=":4j2_7u"
                  >
                    <div
                      className="font-medium text-neutral-darkest"
                      data-oid="5cfas37"
                    >
                      Flowers
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid="iv4hyzy">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid="jteklru"
                    >
                      Wellness Products, Extracts
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid="os2:w4t">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid="-66s_vy"
                    >
                      Contains cannabinoids and terpenes
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid=".7va0w3">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid="u.2spn7"
                    >
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
      <div className="bg-green-50 py-16" data-oid="bh665da">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          data-oid="rndcs.p"
        >
          <h2
            className="text-2xl sm:text-3xl font-heading font-semibold text-neutral-darkest mb-4"
            data-oid="jffqq4c"
          >
            Explore Hemp Industry Applications
          </h2>
          <p
            className="text-lg text-neutral-dark max-w-3xl mx-auto mb-8"
            data-oid="kfi7n1n"
          >
            Discover how different parts of the hemp plant are utilized across
            various industries for sustainable solutions.
          </p>
          <Link href="/industries" data-oid="t:4-0ys">
            <div className="inline-block" data-oid="hmcymoi">
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                data-oid="tm90j4j"
              >
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
