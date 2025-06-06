import { Helmet } from "react-helmet";
import HomepageHero from "@/components/home/hero";
import PlantTypeCards from "@/components/home/plant-type-cards";
import StatsCounter from "@/components/home/stats-counter";

const HomePage = () => {
  return (
    <>
      <Helmet data-oid="kvmw3r3">
        <title data-oid=".bck4vd">
          HempDB - Interactive Industrial Hemp Applications Database
        </title>
        <meta
          name="description"
          content="Explore the versatile applications of industrial hemp across industries, plant parts, and product categories with our comprehensive interactive database."
          data-oid="w4bht9s"
        />
      </Helmet>

      {/* Hero section with stats counters */}
      <HomepageHero data-oid="lxp2po6" />

      {/* Plant type selection cards */}
      <PlantTypeCards data-oid="ib_opk0" />

      {/* Search and total count section */}
      <StatsCounter data-oid="m.:1pmx" />
    </>
  );
};

export default HomePage;
