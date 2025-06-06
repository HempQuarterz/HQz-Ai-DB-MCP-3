import { useStats } from "@/hooks/use-plant-data";
import Counter from "@/components/ui/counter";
import hempBrainImage from "../../assets/hemp-brain.jpg";

const HomepageHero = () => {
  const { data: stats, isLoading } = useStats();

  return (
    <div
      className="relative py-16 sm:py-24 overflow-hidden"
      style={{ minHeight: "600px" }}
      data-oid="0z7j8br"
    >
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${hempBrainImage})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        data-oid="o1phs_r"
      >
        <div className="absolute inset-0 bg-black/50" data-oid="q95al_a"></div>
      </div>

      {/* Content */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        data-oid="5ay_d1."
      >
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-green-400 text-outline-white drop-shadow-lg"
          data-oid="69hqanu"
        >
          Interactive Industrial Hemp Database
        </h1>
        <p
          className="mt-3 max-w-md mx-auto text-lg sm:text-xl md:mt-5 md:max-w-3xl font-medium text-white text-outline-white"
          data-oid="vwtnwj1"
        >
          Explore the versatile applications of industrial hemp across
          industries, plant parts, and product categories.
        </p>

        <div
          className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
          data-oid=".wv0i_h"
        >
          <div
            className="rounded-lg bg-black/60 backdrop-blur-sm p-4 text-white border border-green-400/30"
            data-oid="ge7bf4h"
          >
            <div
              className="text-2xl font-bold text-green-400 text-outline-white"
              data-oid="nm5kiu2"
            >
              {isLoading ? (
                <span className="opacity-50" data-oid="lbaefye">
                  Loading...
                </span>
              ) : (
                <Counter
                  end={stats?.totalProducts || 0}
                  suffix="+"
                  data-oid="ikmjncn"
                />
              )}
            </div>
            <div
              className="text-sm font-medium text-white text-outline-white"
              data-oid="nsn6xav"
            >
              Unique Applications
            </div>
          </div>

          <div
            className="rounded-lg bg-black/60 backdrop-blur-sm p-4 text-white border border-green-400/30"
            data-oid="ynd1jbz"
          >
            <div
              className="text-2xl font-bold text-green-400 text-outline-white"
              data-oid="n:-znpv"
            >
              {isLoading ? (
                <span className="opacity-50" data-oid="4yzr330">
                  Loading...
                </span>
              ) : (
                <Counter end={stats?.totalIndustries || 0} data-oid="eonhcqm" />
              )}
            </div>
            <div
              className="text-sm font-medium text-white text-outline-white"
              data-oid="4hhl9vc"
            >
              Industry Categories
            </div>
          </div>

          <div
            className="rounded-lg bg-black/60 backdrop-blur-sm p-4 text-white border border-green-400/30"
            data-oid="y9k7xs:"
          >
            <div
              className="text-2xl font-bold text-green-400 text-outline-white"
              data-oid="xd88:7n"
            >
              {isLoading ? (
                <span className="opacity-50" data-oid="sucsr7-">
                  Loading...
                </span>
              ) : (
                <Counter end={stats?.totalPlantParts || 0} data-oid="woq15.0" />
              )}
            </div>
            <div
              className="text-sm font-medium text-white text-outline-white"
              data-oid="3gp29d6"
            >
              Plant Components
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageHero;
