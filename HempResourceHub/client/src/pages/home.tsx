import { Helmet } from "react-helmet";
import HomepageHero from "@/components/home/hero";
import PlantTypeCards from "@/components/home/plant-type-cards";
import StatsCounter from "@/components/home/stats-counter";

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>HempDB - Interactive Industrial Hemp Applications Database</title>
        <meta name="description" content="Explore the versatile applications of industrial hemp across industries, plant parts, and product categories with our comprehensive interactive database." />
      </Helmet>
      
      {/* Hero section with stats counters */}
      <HomepageHero />
      
      {/* Plant type selection cards */}
      <PlantTypeCards />
      
      {/* Search and total count section */}
      <StatsCounter />
    </>
  );
};

export default HomePage;
