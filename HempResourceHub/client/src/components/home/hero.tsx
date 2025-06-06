import { useStats } from "@/hooks/use-plant-data";
import Counter from "@/components/ui/counter";
import hempBrainImage from "../../assets/hemp-brain.jpg";

const HomepageHero = () => {
  const { data: stats, isLoading } = useStats();

  return (
    <div
      className="relative py-16 sm:py-24 overflow-hidden"
      style={{ minHeight: "600px" }}
      data-oid="087:_a0"
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
        data-oid="cpk9qce"
      >
        <div className="absolute inset-0 bg-black/50" data-oid="lau-fgw"></div>
      </div>

      {/* Content */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        data-oid="ocdaehh"
      >
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-green-400 text-outline-white drop-shadow-lg"
          data-oid="4xwoy9a"
        >
          Interactive Industrial Hemp Database
        </h1>
        <p
          className="mt-3 max-w-md mx-auto text-lg sm:text-xl md:mt-5 md:max-w-3xl font-medium text-white text-outline-white"
          data-oid="wsdi:m5"
        >
          Explore the versatile applications of industrial hemp across
          industries, plant parts, and product categories.
        </p>

        <div
          className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
          data-oid="l-hzf0:"
        >
          <div
            className="rounded-lg bg-black/60 backdrop-blur-sm p-4 text-white border border-green-400/30"
            data-oid="d:c_fmx"
          >
            <div
              className="text-2xl font-bold text-green-400 text-outline-white"
              data-oid="-q_1xzy"
            >
              {isLoading ? (
                <span className="opacity-50" data-oid="ty34u0m">
                  Loading...
                </span>
              ) : (
                <Counter
                  end={stats?.totalProducts || 0}
                  suffix="+"
                  data-oid="rb6q.3d"
                />
              )}
            </div>
            <div
              className="text-sm font-medium text-white text-outline-white"
              data-oid="iij9gk7"
            >
              Unique Applications
            </div>
          </div>

          <div
            className="rounded-lg bg-black/60 backdrop-blur-sm p-4 text-white border border-green-400/30"
            data-oid="8tftk48"
          >
            <div
              className="text-2xl font-bold text-green-400 text-outline-white"
              data-oid="7azg1ol"
            >
              {isLoading ? (
                <span className="opacity-50" data-oid="2-j.3xv">
                  Loading...
                </span>
              ) : (
                <Counter end={stats?.totalIndustries || 0} data-oid="f106kgx" />
              )}
            </div>
            <div
              className="text-sm font-medium text-white text-outline-white"
              data-oid="sbg5d8u"
            >
              Industry Categories
            </div>
          </div>

          <div
            className="rounded-lg bg-black/60 backdrop-blur-sm p-4 text-white border border-green-400/30"
            data-oid="fonan9m"
          >
            <div
              className="text-2xl font-bold text-green-400 text-outline-white"
              data-oid="am:alf:"
            >
              {isLoading ? (
                <span className="opacity-50" data-oid="d__g0-2">
                  Loading...
                </span>
              ) : (
                <Counter end={stats?.totalPlantParts || 0} data-oid="cn6c-91" />
              )}
            </div>
            <div
              className="text-sm font-medium text-white text-outline-white"
              data-oid="wkq1o:z"
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
