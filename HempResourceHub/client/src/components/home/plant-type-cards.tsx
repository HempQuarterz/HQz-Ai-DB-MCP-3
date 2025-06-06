import { usePlantTypes } from "@/hooks/use-plant-data";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlantType } from "@shared/schema";
import SimpleHempModel from "@/components/models/SimpleHempModel";
import hempEcosystemImage from "@/assets/images/hemp-ecosystem.webp";

const PlantTypeCards = () => {
  const { data: plantTypesData, isLoading } = usePlantTypes();
  const plantTypes = Array.isArray(plantTypesData) ? plantTypesData : [];

  // DEBUG: Log plantTypes to verify data is being received
  console.log("PlantTypeCards: plantTypes", plantTypes);
  return (
    <div className="py-12 relative overflow-hidden" data-oid="_eu2cno">
      {/* Hemp ecosystem background image */}
      <div
        className="absolute inset-0 bg-black opacity-40 z-0"
        data-oid="cf1e7lq"
      ></div>
      <div
        className="absolute inset-0 w-full h-full z-0 opacity-90 mix-blend-normal"
        style={{
          backgroundImage: `url(${hempEcosystemImage})`,
          backgroundSize: "contain",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          filter: "brightness(1.2) contrast(1.3) saturate(1.3)",
        }}
        aria-label="Hemp ecosystem background"
        data-oid="xyqtjo."
      ></div>
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 z-0"
        data-oid="r0edekv"
      ></div>

      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        data-oid="d6oo122"
      >
        <h2
          className="text-2xl sm:text-3xl font-heading font-bold text-green-400 text-outline-white text-center mb-8 glow-green-sm"
          data-oid="-r.sr55"
        >
          Select Hemp Plant Type
        </h2>
        <p
          className="text-center text-white text-outline-white max-w-3xl mx-auto mb-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          data-oid="z6kmg93"
        >
          Industrial hemp is cultivated with different focuses depending on the
          desired output. Choose a cultivation type below to explore its
          specific applications.
        </p>

        {isLoading ? (
          <div
            className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:max-w-5xl lg:mx-auto"
            data-oid=":_gyos2"
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="overflow-hidden border border-green-500/20 rounded-lg shadow-[0_0_15px_rgba(0,255,0,0.15)]"
                data-oid="kl4d9hy"
              >
                <div className="h-80 relative" data-oid="e5j3c3l">
                  <Skeleton
                    className="absolute inset-0 bg-black/40"
                    data-oid="evbawp-"
                  />
                  <div
                    className="absolute inset-0 bg-matrix-effect opacity-10"
                    data-oid="tjq934b"
                  ></div>
                </div>
                <div className="p-6 bg-black/90" data-oid="gk8uys3">
                  <Skeleton
                    className="h-6 w-3/4 mb-2 bg-green-900/40"
                    data-oid="48u-oq_"
                  />
                  <Skeleton
                    className="h-4 w-full mb-1 bg-green-900/30"
                    data-oid="lodiuc9"
                  />
                  <Skeleton
                    className="h-4 w-5/6 bg-green-900/30"
                    data-oid="5nmbg8u"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:max-w-5xl lg:mx-auto"
            data-oid="s0.v2us"
          >
            {plantTypes.slice(0, 3).map((plantType: PlantType) => (
              <div
                key={plantType.id}
                className="relative group"
                data-oid="9vu62vn"
              >
                <div
                  className="relative h-80 w-full overflow-hidden rounded-lg bg-transparent backdrop-blur-[2px] border-2 border-green-500/70 shadow-[0_0_20px_rgba(0,255,0,0.5)] transition-all duration-300 ease-in-out group-hover:shadow-[0_0_30px_rgba(0,255,0,0.7)] after:absolute after:inset-0 after:bg-black/30 after:group-hover:bg-black/20 after:transition-all after:z-[1]"
                  data-oid="tbu13s."
                >
                  {plantType.id === 1 ? (
                    <div
                      className="h-full w-full relative z-10"
                      data-oid="..unv0a"
                    >
                      <SimpleHempModel
                        className="h-full w-full opacity-70 transition-all duration-500 ease-in-out group-hover:opacity-85"
                        data-oid="9ov5fk0"
                      />
                    </div>
                  ) : (
                    <img
                      src={plantType.imageUrl || "/placeholder-hemp.jpg"}
                      alt={`${plantType.name} plant`}
                      className="h-full w-full object-cover opacity-70 transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:opacity-85 mix-blend-overlay relative z-10"
                      data-oid="n.w2cx-"
                    />
                  )}
                  {plantType.id !== 1 && (
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent mix-blend-multiply z-[5]"
                      data-oid="q9f7nv3"
                    ></div>
                  )}
                  {/* Glowing green overlay on hover */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-300 z-[5]"
                    data-oid="ig_b6_t"
                  ></div>
                  <div
                    className="absolute bottom-0 left-0 p-6 z-20"
                    data-oid="gvi6knl"
                  >
                    <h3
                      className="text-xl font-heading font-semibold text-green-400 text-outline-white"
                      data-oid="_ihdrry"
                    >
                      {plantType.name}
                    </h3>
                    <p
                      className="mt-2 text-sm text-white/90"
                      data-oid="0b23_71"
                    >
                      {plantType.description}
                    </p>
                  </div>
                </div>
                <Link href={`/plant-type/${plantType.id}`} data-oid="pftccbe">
                  <div
                    className="absolute inset-0 z-10 block cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    aria-label={`View ${plantType.name} applications`}
                    data-oid="me8ziae"
                  ></div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantTypeCards;
