import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { useAllPlantParts } from "@/hooks/use-plant-data";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/ui/breadcrumb";

const PlantPartsPage = () => {
  const { data: plantParts, isLoading } = useAllPlantParts();

  return (
    <>
      <Helmet data-oid="6_47h8h">
        <title data-oid="sa458v2">Hemp Plant Parts | HempQuarterz</title>
        <meta
          name="description"
          content="Explore different parts of industrial hemp plants and their applications including stalks, seeds, leaves, and flowers."
          data-oid="idoe4z2"
        />
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-white py-6" data-oid="q7hqlzc">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          data-oid="yexgr9s"
        >
          <Breadcrumb
            items={[{ label: "Home", href: "/" }, { label: "Parts of Plant" }]}
            data-oid="dw-k-jo"
          />
        </div>
      </div>

      {/* Hero section */}
      <div className="bg-green-50 py-12" data-oid="0uwmp7m">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          data-oid="ajzn0tg"
        >
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-green-700 text-outline-black"
            data-oid="dd_yi3q"
          >
            Hemp Plant Parts
          </h1>
          <p
            className="mt-4 text-lg text-neutral-dark max-w-3xl mx-auto"
            data-oid="y9la2ml"
          >
            Explore the various parts of the hemp plant and their industrial
            applications, from stalks used in textiles to seeds used in food
            products.
          </p>
        </div>
      </div>

      {/* Plant parts grid */}
      <div className="bg-white py-16" data-oid="wtlgl7_">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          data-oid="5jup4j2"
        >
          <h2
            className="text-2xl sm:text-3xl font-heading font-semibold text-green-700 text-outline-black mb-12 text-center"
            data-oid="0zjw.za"
          >
            Select a Plant Part
          </h2>

          {isLoading ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              data-oid="h4ki-t2"
            >
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden" data-oid="_hqakdy">
                  <div className="aspect-[4/5] relative" data-oid="5ju89m4">
                    <Skeleton className="absolute inset-0" data-oid="-0yc8np" />
                  </div>
                  <CardContent className="p-6" data-oid="jqq5oxo">
                    <Skeleton className="h-6 w-3/4 mb-2" data-oid="s819xz9" />
                    <Skeleton className="h-4 w-full mb-1" data-oid="zyst2f_" />
                    <Skeleton className="h-4 w-5/6" data-oid="7-yg_a4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              data-oid="-vpp.ha"
            >
              {plantParts &&
                plantParts.map((plantPart: any) => (
                  <div
                    key={plantPart.id}
                    className="relative group"
                    data-oid="037ev_o"
                  >
                    <div
                      className="relative h-80 w-full overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 ease-in-out group-hover:shadow-lg"
                      data-oid="8dvn4mv"
                    >
                      <img
                        src={plantPart.image_url || "/placeholder-hemp.jpg"}
                        alt={`${plantPart.name}`}
                        className="h-full w-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
                        data-oid="l9wtt46"
                      />

                      <div
                        className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
                        data-oid="9.ffpe9"
                      ></div>
                      <div
                        className="absolute bottom-0 left-0 p-6"
                        data-oid="7kkp01p"
                      >
                        <h3
                          className="text-xl font-heading font-semibold text-white text-outline-white"
                          data-oid="jfq54k-"
                        >
                          {plantPart.name}
                        </h3>
                        <p
                          className="mt-2 text-sm text-white/80 line-clamp-3"
                          data-oid="i-xsqjv"
                        >
                          {plantPart.description}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/plant-part/${plantPart.id}`}
                      data-oid="qhjab-i"
                    >
                      <div
                        className="absolute inset-0 z-10 block cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        aria-label={`View ${plantPart.name} applications`}
                        data-oid="xawu5j2"
                      ></div>
                    </Link>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Plant parts comparison */}
      <div className="bg-neutral-lightest py-16" data-oid="np445s7">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          data-oid="0xk.30s"
        >
          <h2
            className="text-2xl sm:text-3xl font-heading font-semibold text-green-700 text-outline-black mb-12 text-center"
            data-oid="ekjll.k"
          >
            Hemp Plant Parts Comparison
          </h2>

          <div className="overflow-x-auto" data-oid="m9g.end">
            <table
              className="min-w-full divide-y divide-neutral-light"
              data-oid="clb4_m3"
            >
              <thead className="bg-neutral-lightest" data-oid="lfeaw7e">
                <tr data-oid="9xhw09g">
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-semibold text-neutral-darkest uppercase tracking-wider"
                    data-oid="abpwodb"
                  >
                    Plant Part
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-semibold text-neutral-darkest uppercase tracking-wider"
                    data-oid="1ud4ttf"
                  >
                    Primary Uses
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-semibold text-neutral-darkest uppercase tracking-wider"
                    data-oid="lmxo:by"
                  >
                    Characteristics
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-semibold text-neutral-darkest uppercase tracking-wider"
                    data-oid="kv:4o1u"
                  >
                    Processing Methods
                  </th>
                </tr>
              </thead>
              <tbody
                className="bg-white divide-y divide-neutral-light"
                data-oid="o3.mlgf"
              >
                <tr data-oid="li8pu63">
                  <td
                    className="px-6 py-4 whitespace-nowrap"
                    data-oid="4rvwxo3"
                  >
                    <div
                      className="font-medium text-neutral-darkest"
                      data-oid="yu.ys5s"
                    >
                      Stalks/Stems
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid=".hmv0mw">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid="ie..cht"
                    >
                      Textiles, Paper, Building Materials
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid="um1-0.t">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid="ir1_vh5"
                    >
                      Fibrous, durable, high tensile strength
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid="wsb_x12">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid="37-mg7l"
                    >
                      Retting, decortication, pulping
                    </div>
                  </td>
                </tr>
                <tr data-oid="0j5-p3f">
                  <td
                    className="px-6 py-4 whitespace-nowrap"
                    data-oid="rw:em2s"
                  >
                    <div
                      className="font-medium text-neutral-darkest"
                      data-oid="ral5pui"
                    >
                      Seeds
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid="_jxuxha">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid="3xqyqwk"
                    >
                      Food, Nutritional Supplements, Oil
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid="mbpjc8z">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid="udf2r82"
                    >
                      High protein, rich in omega fatty acids
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid="yde_a:v">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid="exyoy36"
                    >
                      Hulling, cold pressing, roasting
                    </div>
                  </td>
                </tr>
                <tr data-oid="tgv_hst">
                  <td
                    className="px-6 py-4 whitespace-nowrap"
                    data-oid="e_6aujp"
                  >
                    <div
                      className="font-medium text-neutral-darkest"
                      data-oid="njnbpbg"
                    >
                      Leaves
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid=".p283hb">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid="206mded"
                    >
                      Tea, Animal Feed, Compost
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid="b5zeje-">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid="fhm4zml"
                    >
                      Rich in chlorophyll and nutrients
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid=".s4ssfs">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid="m2amhga"
                    >
                      Drying, grinding, extraction
                    </div>
                  </td>
                </tr>
                <tr data-oid="8gmiy1h">
                  <td
                    className="px-6 py-4 whitespace-nowrap"
                    data-oid="zra4s5e"
                  >
                    <div
                      className="font-medium text-neutral-darkest"
                      data-oid=".zwzaf2"
                    >
                      Flowers
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid="4.pk.xz">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid="6ihg0wi"
                    >
                      Wellness Products, Extracts
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid="mzsnfoh">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid="x5f4d-o"
                    >
                      Contains cannabinoids and terpenes
                    </div>
                  </td>
                  <td className="px-6 py-4" data-oid="xffdzv3">
                    <div
                      className="text-sm text-neutral-dark"
                      data-oid="sl7tuup"
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
      <div className="bg-green-50 py-16" data-oid="ue5bf5_">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          data-oid="v5ws8.i"
        >
          <h2
            className="text-2xl sm:text-3xl font-heading font-semibold text-neutral-darkest mb-4"
            data-oid="ckockvd"
          >
            Explore Hemp Industry Applications
          </h2>
          <p
            className="text-lg text-neutral-dark max-w-3xl mx-auto mb-8"
            data-oid="nu3cccx"
          >
            Discover how different parts of the hemp plant are utilized across
            various industries for sustainable solutions.
          </p>
          <Link href="/industries" data-oid="3.ghfy9">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              data-oid="5:ql8fa"
            >
              Browse Industries
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default PlantPartsPage;
