import { Helmet } from "react-helmet";
import { Link } from "wouter";
import Breadcrumb from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import HempEcosystemImage from "@/assets/hemp-ecosystem.webp";

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Industrial Hemp | HempQuarterz</title>
        <meta name="description" content="Learn about the history, uses, and versatility of industrial hemp as a sustainable resource for numerous applications across different industries." />
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "About" }
            ]}
          />
        </div>
      </div>

      {/* Hero section */}
      <div className="bg-green-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-green-700 text-outline-black">
            About Industrial Hemp
          </h1>
          <p className="mt-4 text-lg text-neutral-dark max-w-3xl mx-auto">
            Discover the remarkable history and diverse applications of one of the world's most versatile and sustainable crops.
          </p>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg prose-green max-w-none">
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-green-700 text-outline-black mb-6">Executive Summary</h2>
            <p>
              Industrial hemp, a crop with a rich history dating back millennia, stands at the cusp of
              a significant resurgence due to its remarkable versatility. From its foundational uses in
              ancient civilizations for textiles and paper to its burgeoning applications in modern
              industries like construction, automotive, and pharmaceuticals, hemp demonstrates an
              extraordinary capacity to adapt and contribute across diverse sectors.
            </p>
            <p>
              Driven by a growing global emphasis on sustainability, coupled with advancements in processing
              technologies and increasing market demand for natural alternatives, industrial hemp
              is poised to play an increasingly vital role in the future economy.
            </p>
          </div>
        </div>
      </div>

      {/* Introduction with side image */}
      <div className="bg-neutral-lightest py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="prose prose-lg prose-green">
              <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-green-700 text-outline-black mb-6">Introduction</h2>
              <p>
                Industrial hemp, scientifically classified as a variety of the Cannabis sativa plant
                species, is distinguished primarily by its exceptionally low concentration of
                tetrahydrocannabinol (THC), the psychoactive compound predominantly associated
                with marijuana. Typically, this THC content does not exceed 0.3% on a dry weight
                basis, a crucial threshold that differentiates it both legally and practically from its
                psychoactive counterpart.
              </p>
              <p>
                The 2018 Farm Bill in the United States enshrined this THC
                limit into law, effectively legalizing hemp and removing it from the purview of the
                Controlled Substances Act. This legislative landmark has catalyzed widespread
                opportunities for hemp cultivation, processing, and commercialization, areas
                previously constrained by the plant's association with marijuana.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src={HempEcosystemImage} 
                alt="Comprehensive hemp ecosystem illustration showing various applications and uses" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Historical timeline */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-green-700 text-outline-black mb-12 text-center">A Journey Through Time: Historical Uses of Hemp</h2>
          
          <div className="relative border-l-4 border-green-400 ml-6 space-y-10 pl-10 py-4">
            {/* Timeline items */}
            <div className="relative">
              <div className="absolute -left-14 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <h3 className="text-xl font-heading font-semibold text-green-700 text-outline-black">Ancient Beginnings (8000 BCE)</h3>
              <p className="mt-2 text-neutral-dark">
                The earliest tangible evidence points to hemp's use approximately 10,000 years ago. 
                Archaeological findings in ancient Mesopotamia (present-day Iraq), dating back to around 8000 BCE, 
                reveal that villagers employed hemp cord in their pottery, signifying its early importance for fundamental technologies.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute -left-14 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <h3 className="text-xl font-heading font-semibold text-green-700 text-outline-black">Paper Innovation (150 BCE)</h3>
              <p className="mt-2 text-neutral-dark">
                A pivotal moment in the history of communication occurred around 150 BCE in China with 
                the groundbreaking invention of paper made entirely from hemp fibers. This innovation 
                revolutionized record-keeping and the dissemination of knowledge across civilizations.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute -left-14 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <h3 className="text-xl font-heading font-semibold text-green-700 text-outline-black">Age of Exploration (1492)</h3>
              <p className="mt-2 text-neutral-dark">
                During the Age of Exploration, in 1492, Christopher Columbus's ships, which famously 
                embarked on voyages to North America, relied heavily on hemp for their sails and rigging. 
                This underscores hemp's crucial role in maritime travel and trade during this transformative 
                period in global history.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute -left-14 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">4</span>
              </div>
              <h3 className="text-xl font-heading font-semibold text-green-700 text-outline-black">American History (1776)</h3>
              <p className="mt-2 text-neutral-dark">
                The Declaration of Independence, a foundational document in American history, was drafted on 
                hemp paper in 1776, further symbolizing the plant's intimate connection to the birth of the nation. 
                Prominent figures in early American history, including George Washington, Thomas Jefferson, and 
                John Adams, were all hemp farmers.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute -left-14 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">5</span>
              </div>
              <h3 className="text-xl font-heading font-semibold text-neutral-darkest">Modern Revival (2018)</h3>
              <p className="mt-2 text-neutral-dark">
                After decades of prohibition, the 2018 Farm Bill in the United States effectively legalized 
                hemp cultivation by removing it from the Controlled Substances Act. This has catalyzed a 
                significant resurgence in hemp farming, research, and product development across multiple industries.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Applications */}
      <div className="bg-neutral-lightest py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-neutral-darkest mb-12 text-center">
            The Multifaceted Applications of Modern Industrial Hemp
          </h2>
          
          <div className="prose prose-lg prose-green max-w-none mb-10">
            <p>
              The industrial hemp stalk is a versatile resource, yielding two primary types of fiber:
              the outer bast fibers and the inner hurd. Bast fibers, which constitute approximately
              14% of the plant's material, are long, strong, and prized for their use in textiles.
              Reaching lengths of up to 5 meters, these fibers are characterized by their
              durability, absorbency, and even antimicrobial properties. The inner woody core,
              known as hurd or shives, comprises shorter fibers that are lighter, dust-free, and
              highly absorbent, making them suitable for a wide array of other applications.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
              <h3 className="text-xl font-heading font-semibold text-neutral-darkest mb-4">Textiles & Fabrics</h3>
              <p className="text-neutral-dark">
                Hemp fibers are transformed into durable textiles for clothing, accessories, and home goods.
                Hemp fabric is naturally resistant to mold, UV light, and offers 4x the strength of cotton.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
              <h3 className="text-xl font-heading font-semibold text-neutral-darkest mb-4">Construction Materials</h3>
              <p className="text-neutral-dark">
                Hempcrete, made from hemp hurd mixed with lime, creates a lightweight insulating material
                that is fire-resistant, pest-resistant, and carbon-negative through carbon sequestration.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
              <h3 className="text-xl font-heading font-semibold text-neutral-darkest mb-4">Food & Nutrition</h3>
              <p className="text-neutral-dark">
                Hemp seeds are rich in protein, essential fatty acids, and numerous vitamins and minerals,
                making them a nutritious addition to diets in the form of oils, protein powders, and whole foods.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
              <h3 className="text-xl font-heading font-semibold text-neutral-darkest mb-4">Bioplastics</h3>
              <p className="text-neutral-dark">
                Hemp-based bioplastics offer a biodegradable and renewable alternative to petroleum-based plastics,
                with applications ranging from packaging materials to automotive components.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
              <h3 className="text-xl font-heading font-semibold text-neutral-darkest mb-4">Biofuels</h3>
              <p className="text-neutral-dark">
                Hemp biomass can be converted into various biofuels including biodiesel and ethanol,
                offering carbon-neutral alternatives to fossil fuels with high energy efficiency.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
              <h3 className="text-xl font-heading font-semibold text-neutral-darkest mb-4">Paper Products</h3>
              <p className="text-neutral-dark">
                Hemp paper requires fewer chemicals for processing than wood pulp, can be recycled more times,
                and grows much faster than trees, making it a sustainable option for the paper industry.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-neutral-darkest mb-4">
            Explore Our Hemp Database
          </h2>
          <p className="text-lg text-neutral-dark max-w-3xl mx-auto mb-8">
            Discover the remarkable versatility of industrial hemp by exploring our comprehensive database of hemp applications, organized by plant parts and industries.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/plant-parts">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Explore Plant Parts
              </Button>
            </Link>
            <Link href="/industries">
              <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
                Browse Industries
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;