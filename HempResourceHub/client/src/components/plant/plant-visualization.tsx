import { useEffect, useState } from "react";
import { Link } from "wouter";
import { usePlantType, usePlantParts } from "@/hooks/use-plant-data";
import { Skeleton } from "@/components/ui/skeleton";
import { InfoIcon } from "lucide-react";
import { PlantPart } from "@shared/schema";
import PlantPartSelector from "./plant-part-selector";

interface PlantVisualizationProps {
  plantTypeId: number;
}

const PlantVisualization = ({ plantTypeId }: PlantVisualizationProps) => {
  const { data: plantType, isLoading: isLoadingPlantType } =
    usePlantType(plantTypeId);
  const { data: plantParts, isLoading: isLoadingPlantParts } =
    usePlantParts(plantTypeId);
  const [activePartId, setActivePartId] = useState<number | null>(null);

  useEffect(() => {
    // Set the first part as active when data loads
    if (plantParts && plantParts.length > 0 && !activePartId) {
      setActivePartId(plantParts[0].id);
    }
  }, [plantParts, activePartId]);

  if (isLoadingPlantType || isLoadingPlantParts) {
    return (
      <div className="bg-gray-950 py-12" data-oid="cmfya16">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          data-oid="u2b_2h_"
        >
          <div
            className="flex flex-col sm:flex-row justify-between items-center mb-8"
            data-oid=":k-47kf"
          >
            <div data-oid="yhqbt44">
              <Skeleton className="h-6 w-48 mb-2" data-oid="p3:i71h" />
              <Skeleton className="h-8 w-96" data-oid="x35c0ed" />
            </div>
          </div>

          <div
            className="bg-gray-900 rounded-2xl shadow-lg shadow-black/50 overflow-hidden border border-green-500/30"
            data-oid="iraujgx"
          >
            <div
              className="grid grid-cols-1 lg:grid-cols-5 gap-8 p-8"
              data-oid="tz_g-l2"
            >
              <div
                className="lg:col-span-2 flex items-center justify-center"
                data-oid="3wdc8z8"
              >
                <Skeleton
                  className="w-full h-[400px] rounded-lg"
                  data-oid="p8m0zld"
                />
              </div>
              <div className="lg:col-span-3 space-y-6" data-oid="ui8a2:s">
                <div data-oid="rbn2jh6">
                  <Skeleton className="h-7 w-64 mb-4" data-oid="qjq4jvs" />
                  <Skeleton className="h-4 w-full mb-2" data-oid="7y_.5bo" />
                  <Skeleton className="h-4 w-full mb-2" data-oid="p4:f4sc" />
                  <Skeleton className="h-4 w-2/3" data-oid=".qqf.t4" />
                </div>
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  data-oid="hlfj:r_"
                >
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton
                      key={i}
                      className="h-24 rounded-lg"
                      data-oid="7b:5iny"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id={`${plantType?.name.toLowerCase().replace(/\s+/g, "-")}`}
      className="py-12 bg-gray-950"
      data-oid="sbjdx0s"
    >
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        data-oid="um-gjyk"
      >
        <div
          className="flex flex-col sm:flex-row justify-between items-center mb-8"
          data-oid="n2vb_9w"
        >
          <div data-oid="ti82d.f">
            <nav className="flex" aria-label="Breadcrumb" data-oid="9hw26nq">
              <ol className="flex items-center space-x-2" data-oid="1u_7_95">
                <li data-oid="zpeh39h">
                  <Link href="/" data-oid="feh-z48">
                    <div
                      className="text-gray-400 hover:text-green-400 cursor-pointer transition-colors"
                      data-oid="wyqo_4q"
                    >
                      Home
                    </div>
                  </Link>
                </li>
                <li className="flex items-center" data-oid="868xe0r">
                  <svg
                    className="h-5 w-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    data-oid="vaid7ta"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                      data-oid="xaw5v8."
                    />
                  </svg>
                  <span
                    className="text-gray-300 font-medium ml-2"
                    data-oid="5qu2d3m"
                  >
                    {plantType?.name}
                  </span>
                </li>
              </ol>
            </nav>
            <h2
              className="text-2xl sm:text-3xl font-heading font-bold text-green-400 mt-2"
              data-oid="tbczvfu"
            >
              {plantType?.name} Plant Parts
            </h2>
          </div>
          <Link href="/" data-oid="6f:br7g">
            <div
              className="text-green-400 hover:text-green-300 font-medium flex items-center cursor-pointer transition-colors"
              data-oid="m6-l:rh"
            >
              <span data-oid="bna7h-n">View Different Plant Type</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                data-oid="5x8m73s"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                  data-oid=":js3mqs"
                />
              </svg>
            </div>
          </Link>
        </div>

        <div
          className="bg-gray-900 rounded-2xl shadow-lg shadow-black/50 overflow-hidden border border-green-500/30"
          data-oid="h8_3civ"
        >
          <div className="grid grid-cols-1 lg:grid-cols-5" data-oid="td2ah8n">
            <div
              className="lg:col-span-2 p-6 flex items-center justify-center"
              data-oid="26iyw4e"
            >
              {/* Interactive plant visualization */}
              <div className="relative w-full max-w-md" data-oid="7:o_m57">
                <img
                  src={
                    plantType?.id === 1
                      ? "https://www.greenentrepreneur.com/wp-content/uploads/2024/01/hemp_field_aerial_view_a_field_of_industrial_hemp_plants_cannabis_sativa_1600.jpg"
                      : plantType?.imageUrl ||
                        "https://via.placeholder.com/800x1000"
                  }
                  alt={`${plantType?.name} diagram`}
                  className="w-full rounded-lg"
                  data-oid="jzi_m64"
                />

                {/* Plant part overlays - this would be more dynamic in a real implementation */}
                {plantParts
                  ?.slice(0, 3)
                  .map((part: PlantPart, index: number) => {
                    // Position the dots at different locations
                    const positions = [
                      "top-[10%] right-[20%]",
                      "top-[40%] left-[15%]",
                      "bottom-[20%] right-[25%]",
                    ];

                    // Different colors for different parts
                    const colors = [
                      "bg-accent/30",
                      "bg-secondary/30",
                      "bg-primary/30",
                    ];

                    const iconColors = [
                      "text-accent",
                      "text-secondary",
                      "text-primary",
                    ];

                    return (
                      <div
                        key={part.id}
                        className={`absolute ${positions[index]} w-24 h-24 plant-part cursor-pointer`}
                        onClick={() => setActivePartId(part.id)}
                        data-oid="u303sdz"
                      >
                        <div className="relative" data-oid="kjttds9">
                          <div
                            className={`absolute inset-0 ${colors[index]} rounded-full ${activePartId === part.id ? "animate-pulse" : ""}`}
                            data-oid="5aobifk"
                          ></div>
                          <div
                            className="absolute -right-2 -top-2 bg-white rounded-full shadow-md p-1"
                            data-oid="-zz6r8p"
                          >
                            <InfoIcon
                              className={`h-6 w-6 ${iconColors[index]}`}
                              data-oid="gd-gfkw"
                            />
                          </div>
                        </div>
                        <div className="mt-2 text-center" data-oid="joqaj8x">
                          <Link
                            href={`/plant-part/${part.id}`}
                            data-oid=":5vzygx"
                          >
                            <div
                              className="text-primary font-medium text-sm cursor-pointer"
                              data-oid="58dovbw"
                            >
                              {part.name}
                            </div>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div
              className="lg:col-span-3 bg-neutral-lightest p-8"
              data-oid="rcup-qk"
            >
              <h3
                className="text-xl font-heading font-semibold mb-4"
                data-oid="o7bgelh"
              >
                Select a Plant Part to Explore
              </h3>
              <p className="text-neutral-dark mb-6" data-oid="_oac1d4">
                {plantType?.description} Each part of the plant offers unique
                applications and benefits.
              </p>

              <PlantPartSelector
                plantParts={plantParts || []}
                activePart={activePartId}
                onSelectPart={setActivePartId}
                data-oid="qc-644k"
              />

              <div
                className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/20"
                data-oid="xl7d9jt"
              >
                <h4
                  className="font-heading font-medium flex items-center"
                  data-oid="g7fdlgd"
                >
                  <InfoIcon
                    className="h-5 w-5 mr-2 text-primary"
                    data-oid="si90wc."
                  />
                  Did you know?
                </h4>
                <p className="text-sm mt-1" data-oid="k30085x">
                  {plantType?.name} plants{" "}
                  {plantType?.characteristics ||
                    "have unique characteristics that make them valuable for various industrial applications."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantVisualization;
