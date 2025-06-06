import { Helmet } from "react-helmet";
import { Link } from "wouter";
import Breadcrumb from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import HempEcosystemImage from "@/assets/hemp-ecosystem.webp";

const AboutPage = () => {
  return (
    <>
      <Helmet data-oid="yb.659t">
        <title data-oid="wbonk05">About Industrial Hemp | HempQuarterz</title>
        <meta
          name="description"
          content="Learn about the history, uses, and versatility of industrial hemp as a sustainable resource for numerous applications across different industries."
          data-oid="3u.q725"
        />
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-white py-6" data-oid="t95f0o:">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          data-oid="u0suhk:"
        >
          <Breadcrumb
            items={[{ label: "Home", href: "/" }, { label: "About" }]}
            data-oid="noq0dkb"
          />
        </div>
      </div>

      {/* Hero section */}
      <div className="bg-green-50 py-12" data-oid="00093nl">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          data-oid="ike1-yb"
        >
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-green-700 text-outline-black"
            data-oid="n3_komi"
          >
            About Industrial Hemp
          </h1>
          <p
            className="mt-4 text-lg text-neutral-dark max-w-3xl mx-auto"
            data-oid="3a5ps61"
          >
            Discover the remarkable history and diverse applications of one of
            the world's most versatile and sustainable crops.
          </p>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-white py-16" data-oid="oig_pmq">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          data-oid="x3y2f.7"
        >
          <div
            className="prose prose-lg prose-green max-w-none"
            data-oid="ol3kmk_"
          >
            <h2
              className="text-2xl sm:text-3xl font-heading font-semibold text-green-700 text-outline-black mb-6"
              data-oid="6nq00ws"
            >
              Executive Summary
            </h2>
            <p data-oid="zhnr7vl">
              Industrial hemp, a crop with a rich history dating back millennia,
              stands at the cusp of a significant resurgence due to its
              remarkable versatility. From its foundational uses in ancient
              civilizations for textiles and paper to its burgeoning
              applications in modern industries like construction, automotive,
              and pharmaceuticals, hemp demonstrates an extraordinary capacity
              to adapt and contribute across diverse sectors.
            </p>
            <p data-oid="-57ajzv">
              Driven by a growing global emphasis on sustainability, coupled
              with advancements in processing technologies and increasing market
              demand for natural alternatives, industrial hemp is poised to play
              an increasingly vital role in the future economy.
            </p>
          </div>
        </div>
      </div>

      {/* Introduction with side image */}
      <div className="bg-neutral-lightest py-16" data-oid="cb1eszd">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          data-oid="p.dr549"
        >
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            data-oid="6u.d6pv"
          >
            <div className="prose prose-lg prose-green" data-oid="_f8fh7x">
              <h2
                className="text-2xl sm:text-3xl font-heading font-semibold text-green-700 text-outline-black mb-6"
                data-oid="6up.3c4"
              >
                Introduction
              </h2>
              <p data-oid="o0q:x5-">
                Industrial hemp, scientifically classified as a variety of the
                Cannabis sativa plant species, is distinguished primarily by its
                exceptionally low concentration of tetrahydrocannabinol (THC),
                the psychoactive compound predominantly associated with
                marijuana. Typically, this THC content does not exceed 0.3% on a
                dry weight basis, a crucial threshold that differentiates it
                both legally and practically from its psychoactive counterpart.
              </p>
              <p data-oid="snymkrt">
                The 2018 Farm Bill in the United States enshrined this THC limit
                into law, effectively legalizing hemp and removing it from the
                purview of the Controlled Substances Act. This legislative
                landmark has catalyzed widespread opportunities for hemp
                cultivation, processing, and commercialization, areas previously
                constrained by the plant's association with marijuana.
              </p>
            </div>
            <div
              className="rounded-lg overflow-hidden shadow-lg"
              data-oid="fo978-x"
            >
              <img
                src={HempEcosystemImage}
                alt="Comprehensive hemp ecosystem illustration showing various applications and uses"
                className="w-full h-auto object-cover"
                data-oid=":xi1hm2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Historical timeline */}
      <div className="bg-white py-16" data-oid="x5j7ug8">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          data-oid="y19rwhc"
        >
          <h2
            className="text-2xl sm:text-3xl font-heading font-semibold text-green-700 text-outline-black mb-12 text-center"
            data-oid="aavx_p6"
          >
            A Journey Through Time: Historical Uses of Hemp
          </h2>

          <div
            className="relative border-l-4 border-green-400 ml-6 space-y-10 pl-10 py-4"
            data-oid="4wybtj6"
          >
            {/* Timeline items */}
            <div className="relative" data-oid="7sm5xkt">
              <div
                className="absolute -left-14 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center"
                data-oid=".2g5e2b"
              >
                <span
                  className="text-white font-bold text-sm"
                  data-oid="1hbw5ib"
                >
                  1
                </span>
              </div>
              <h3
                className="text-xl font-heading font-semibold text-green-700 text-outline-black"
                data-oid="ngg7l9z"
              >
                Ancient Beginnings (8000 BCE)
              </h3>
              <p className="mt-2 text-neutral-dark" data-oid="lqb-kf8">
                The earliest tangible evidence points to hemp's use
                approximately 10,000 years ago. Archaeological findings in
                ancient Mesopotamia (present-day Iraq), dating back to around
                8000 BCE, reveal that villagers employed hemp cord in their
                pottery, signifying its early importance for fundamental
                technologies.
              </p>
            </div>

            <div className="relative" data-oid="qdq5pmh">
              <div
                className="absolute -left-14 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center"
                data-oid="41jdaqd"
              >
                <span
                  className="text-white font-bold text-sm"
                  data-oid="bcm95g1"
                >
                  2
                </span>
              </div>
              <h3
                className="text-xl font-heading font-semibold text-green-700 text-outline-black"
                data-oid="gkvxyxv"
              >
                Paper Innovation (150 BCE)
              </h3>
              <p className="mt-2 text-neutral-dark" data-oid="kq7y9h4">
                A pivotal moment in the history of communication occurred around
                150 BCE in China with the groundbreaking invention of paper made
                entirely from hemp fibers. This innovation revolutionized
                record-keeping and the dissemination of knowledge across
                civilizations.
              </p>
            </div>

            <div className="relative" data-oid="gnpteff">
              <div
                className="absolute -left-14 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center"
                data-oid="_8et6y9"
              >
                <span
                  className="text-white font-bold text-sm"
                  data-oid="6kklgcf"
                >
                  3
                </span>
              </div>
              <h3
                className="text-xl font-heading font-semibold text-green-700 text-outline-black"
                data-oid="dau6t-6"
              >
                Age of Exploration (1492)
              </h3>
              <p className="mt-2 text-neutral-dark" data-oid="64fzpj0">
                During the Age of Exploration, in 1492, Christopher Columbus's
                ships, which famously embarked on voyages to North America,
                relied heavily on hemp for their sails and rigging. This
                underscores hemp's crucial role in maritime travel and trade
                during this transformative period in global history.
              </p>
            </div>

            <div className="relative" data-oid="-66kn03">
              <div
                className="absolute -left-14 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center"
                data-oid="h9yc68t"
              >
                <span
                  className="text-white font-bold text-sm"
                  data-oid="x:.m2f."
                >
                  4
                </span>
              </div>
              <h3
                className="text-xl font-heading font-semibold text-green-700 text-outline-black"
                data-oid="z68sp27"
              >
                American History (1776)
              </h3>
              <p className="mt-2 text-neutral-dark" data-oid=":4shctr">
                The Declaration of Independence, a foundational document in
                American history, was drafted on hemp paper in 1776, further
                symbolizing the plant's intimate connection to the birth of the
                nation. Prominent figures in early American history, including
                George Washington, Thomas Jefferson, and John Adams, were all
                hemp farmers.
              </p>
            </div>

            <div className="relative" data-oid="mbjtme8">
              <div
                className="absolute -left-14 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center"
                data-oid="pfwf32k"
              >
                <span
                  className="text-white font-bold text-sm"
                  data-oid=":.z9dok"
                >
                  5
                </span>
              </div>
              <h3
                className="text-xl font-heading font-semibold text-neutral-darkest"
                data-oid="j_ta8:u"
              >
                Modern Revival (2018)
              </h3>
              <p className="mt-2 text-neutral-dark" data-oid="u7kqjqx">
                After decades of prohibition, the 2018 Farm Bill in the United
                States effectively legalized hemp cultivation by removing it
                from the Controlled Substances Act. This has catalyzed a
                significant resurgence in hemp farming, research, and product
                development across multiple industries.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Applications */}
      <div className="bg-neutral-lightest py-16" data-oid="0r_pt7y">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          data-oid=":x.k8fu"
        >
          <h2
            className="text-2xl sm:text-3xl font-heading font-semibold text-neutral-darkest mb-12 text-center"
            data-oid=".8j2d.z"
          >
            The Multifaceted Applications of Modern Industrial Hemp
          </h2>

          <div
            className="prose prose-lg prose-green max-w-none mb-10"
            data-oid="_-rrlfj"
          >
            <p data-oid="p6_sjij">
              The industrial hemp stalk is a versatile resource, yielding two
              primary types of fiber: the outer bast fibers and the inner hurd.
              Bast fibers, which constitute approximately 14% of the plant's
              material, are long, strong, and prized for their use in textiles.
              Reaching lengths of up to 5 meters, these fibers are characterized
              by their durability, absorbency, and even antimicrobial
              properties. The inner woody core, known as hurd or shives,
              comprises shorter fibers that are lighter, dust-free, and highly
              absorbent, making them suitable for a wide array of other
              applications.
            </p>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            data-oid="xufjydi"
          >
            <div
              className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500"
              data-oid="p4paizk"
            >
              <h3
                className="text-xl font-heading font-semibold text-neutral-darkest mb-4"
                data-oid="46lke6."
              >
                Textiles & Fabrics
              </h3>
              <p className="text-neutral-dark" data-oid="g6avhiw">
                Hemp fibers are transformed into durable textiles for clothing,
                accessories, and home goods. Hemp fabric is naturally resistant
                to mold, UV light, and offers 4x the strength of cotton.
              </p>
            </div>

            <div
              className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500"
              data-oid="ebqlfvv"
            >
              <h3
                className="text-xl font-heading font-semibold text-neutral-darkest mb-4"
                data-oid="unjgf.l"
              >
                Construction Materials
              </h3>
              <p className="text-neutral-dark" data-oid="pamo2x:">
                Hempcrete, made from hemp hurd mixed with lime, creates a
                lightweight insulating material that is fire-resistant,
                pest-resistant, and carbon-negative through carbon
                sequestration.
              </p>
            </div>

            <div
              className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500"
              data-oid="i8hl.y9"
            >
              <h3
                className="text-xl font-heading font-semibold text-neutral-darkest mb-4"
                data-oid=":vh2a3k"
              >
                Food & Nutrition
              </h3>
              <p className="text-neutral-dark" data-oid="d37-1hd">
                Hemp seeds are rich in protein, essential fatty acids, and
                numerous vitamins and minerals, making them a nutritious
                addition to diets in the form of oils, protein powders, and
                whole foods.
              </p>
            </div>

            <div
              className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500"
              data-oid="0sl5px_"
            >
              <h3
                className="text-xl font-heading font-semibold text-neutral-darkest mb-4"
                data-oid="o96cy0x"
              >
                Bioplastics
              </h3>
              <p className="text-neutral-dark" data-oid="f885gmr">
                Hemp-based bioplastics offer a biodegradable and renewable
                alternative to petroleum-based plastics, with applications
                ranging from packaging materials to automotive components.
              </p>
            </div>

            <div
              className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500"
              data-oid="6r9vhn2"
            >
              <h3
                className="text-xl font-heading font-semibold text-neutral-darkest mb-4"
                data-oid="xj3cy:m"
              >
                Biofuels
              </h3>
              <p className="text-neutral-dark" data-oid="cbml.m8">
                Hemp biomass can be converted into various biofuels including
                biodiesel and ethanol, offering carbon-neutral alternatives to
                fossil fuels with high energy efficiency.
              </p>
            </div>

            <div
              className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500"
              data-oid="3-amom6"
            >
              <h3
                className="text-xl font-heading font-semibold text-neutral-darkest mb-4"
                data-oid="-3lhaya"
              >
                Paper Products
              </h3>
              <p className="text-neutral-dark" data-oid="n-7o5i.">
                Hemp paper requires fewer chemicals for processing than wood
                pulp, can be recycled more times, and grows much faster than
                trees, making it a sustainable option for the paper industry.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-green-50 py-16" data-oid="nwipcaw">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          data-oid="r8l3s81"
        >
          <h2
            className="text-2xl sm:text-3xl font-heading font-semibold text-neutral-darkest mb-4"
            data-oid="mynt6s4"
          >
            Explore Our Hemp Database
          </h2>
          <p
            className="text-lg text-neutral-dark max-w-3xl mx-auto mb-8"
            data-oid="wdsbuig"
          >
            Discover the remarkable versatility of industrial hemp by exploring
            our comprehensive database of hemp applications, organized by plant
            parts and industries.
          </p>
          <div
            className="flex flex-col sm:flex-row justify-center gap-4"
            data-oid="_v1vnqr"
          >
            <Link href="/plant-parts" data-oid="pwgz-g5">
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                data-oid="16dnok2"
              >
                Explore Plant Parts
              </Button>
            </Link>
            <Link href="/industries" data-oid="_mep91l">
              <Button
                variant="outline"
                className="border-green-600 text-green-700 hover:bg-green-50"
                data-oid="6t0lh.o"
              >
                Browse Industries
                <ArrowRight className="ml-2 h-4 w-4" data-oid="ec:25ia" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
