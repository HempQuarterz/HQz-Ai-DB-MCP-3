import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import HempQuarterzLogo from "@/assets/circle-logo.png";

const Navbar = () => {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to search results page
    console.log("Search query:", searchQuery);
    // In a real app, we would redirect to a search results page
  };

  return (
    <nav className="bg-black shadow-md" data-oid="h2fdc:v">
      <div
        className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 bg-black"
        data-oid="92uq7ki"
      >
        <div
          className="flex justify-between items-center h-28"
          data-oid="p0vze9n"
        >
          {/* Logo on the left */}
          <div className="flex-shrink-0 flex items-center" data-oid="2jgk4ux">
            <Link href="/" data-oid="zgs56oy">
              <img
                src={HempQuarterzLogo}
                alt="HempQuarterz Logo"
                className="h-24 w-24 cursor-pointer rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
                data-oid="46aw9d3"
              />
            </Link>
          </div>

          {/* Navigation menu in the center */}
          <div
            className="hidden sm:flex sm:flex-1 sm:justify-center"
            data-oid="k4k0r5q"
          >
            <div className="flex flex-col items-center" data-oid="rvs.3j4">
              {/* Top row */}
              <div
                className="flex space-x-6 mb-2 items-center"
                data-oid="lfhq:i2"
              >
                <Link href="/" data-oid=".oqojdu">
                  <div
                    className={`${location === "/" ? "border-primary text-primary" : "border-transparent text-white hover:text-primary hover:border-primary"} border-b-2 px-0.5 pt-1 text-lg font-medium whitespace-nowrap cursor-pointer`}
                    data-oid="vz_4igw"
                  >
                    Home
                  </div>
                </Link>
                <Link href="/about" data-oid=".kwpdto">
                  <div
                    className={`${location === "/about" ? "border-primary text-primary" : "border-transparent text-white hover:text-primary hover:border-primary"} border-b-2 px-0.5 pt-1 text-lg font-medium whitespace-nowrap cursor-pointer`}
                    data-oid="d14t:g5"
                  >
                    About
                  </div>
                </Link>
                <Link href="/plant-types" data-oid="q70a4h7">
                  <div
                    className={`${location === "/plant-types" ? "border-primary text-primary" : "border-transparent text-white hover:text-primary hover:border-primary"} border-b-2 px-0.5 pt-1 text-lg font-medium whitespace-nowrap cursor-pointer`}
                    data-oid="q3yr2s6"
                  >
                    Plant Types
                  </div>
                </Link>
              </div>

              {/* Bottom row */}
              <div className="flex space-x-6 items-center" data-oid="fqaw6wj">
                <Link href="/plant-parts" data-oid="oq1i_m4">
                  <div
                    className={`${location.startsWith("/plant-part") ? "border-primary text-primary" : "border-transparent text-white hover:text-primary hover:border-primary"} border-b-2 px-0.5 pt-1 text-lg font-medium whitespace-nowrap cursor-pointer`}
                    data-oid="q93a8vi"
                  >
                    Parts of Plant
                  </div>
                </Link>
                <Link href="/industries" data-oid="scc3vl.">
                  <div
                    className={`${location === "/industries" ? "border-primary text-primary" : "border-transparent text-white hover:text-primary hover:border-primary"} border-b-2 px-0.5 pt-1 text-lg font-medium whitespace-nowrap cursor-pointer`}
                    data-oid="tusaxam"
                  >
                    Industries
                  </div>
                </Link>
                <Link href="/research" data-oid="uzsb2jr">
                  <div
                    className={`${location.startsWith("/research") ? "border-primary text-primary" : "border-transparent text-white hover:text-primary hover:border-primary"} border-b-2 px-0.5 pt-1 text-lg font-medium whitespace-nowrap cursor-pointer`}
                    data-oid="8q.0.zq"
                  >
                    Research
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Search on the right */}
          <div
            className="hidden sm:flex sm:items-center sm:pr-2"
            data-oid="9gs1kwm"
          >
            <form
              onSubmit={handleSearch}
              className="relative"
              data-oid="gf0llr_"
            >
              <Input
                type="text"
                placeholder="Search..."
                className="w-36 rounded-full px-4 py-2 border border-neutral-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-oid="l4eoh17"
              />

              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                data-oid="63alzio"
              >
                <Search className="h-5 w-5 text-white" data-oid="7jycgng" />
              </Button>
            </form>
          </div>

          <div className="-mr-2 flex items-center sm:hidden" data-oid="sasr.ec">
            <Sheet data-oid="ry8ylhu">
              <SheetTrigger asChild data-oid="6i9wsp8">
                <Button
                  variant="ghost"
                  size="icon"
                  className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-primary hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                  data-oid="d5b:m.l"
                >
                  <span className="sr-only" data-oid="p1yss5v">
                    Open main menu
                  </span>
                  <Menu className="h-6 w-6" data-oid="71ovt:2" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-black"
                data-oid="2n_u-.d"
              >
                <div className="flex flex-col h-full" data-oid="jjpdw57">
                  <div
                    className="flex items-center justify-between pb-4 border-b border-gray-800"
                    data-oid="n0ay509"
                  >
                    <Link href="/" data-oid="ry8bx-f">
                      <img
                        src={HempQuarterzLogo}
                        alt="HempQuarterz Logo"
                        className="h-24 w-24 cursor-pointer rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
                        data-oid="s.sa8u:"
                      />
                    </Link>
                  </div>

                  <div className="mt-6" data-oid="8x3912g">
                    <form
                      onSubmit={handleSearch}
                      className="mb-6"
                      data-oid="xf:d648"
                    >
                      <div className="relative" data-oid="s03b:o_">
                        <Input
                          type="text"
                          placeholder="Search..."
                          className="w-full rounded-full px-4 py-2 border border-neutral-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          data-oid="8w.frzd"
                        />

                        <Button
                          type="submit"
                          variant="ghost"
                          size="icon"
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                          data-oid="rqm2jao"
                        >
                          <Search
                            className="h-5 w-5 text-white"
                            data-oid="4pyaxsh"
                          />
                        </Button>
                      </div>
                    </form>

                    <nav className="flex flex-col space-y-4" data-oid="c01ht9b">
                      <Link href="/" data-oid="yqn-n_4">
                        <div
                          className={`${location === "/" ? "text-primary font-medium" : "text-white"} hover:text-primary px-3 py-2 text-xl cursor-pointer`}
                          data-oid="_opk:7e"
                        >
                          Home
                        </div>
                      </Link>
                      <Link href="/about" data-oid="egoutpt">
                        <div
                          className={`${location === "/about" ? "text-primary font-medium" : "text-white"} hover:text-primary px-3 py-2 text-xl cursor-pointer`}
                          data-oid="unmdvih"
                        >
                          About
                        </div>
                      </Link>
                      <Link href="/plant-types" data-oid="g4t7bhf">
                        <div
                          className={`${location === "/plant-types" ? "text-primary font-medium" : "text-white"} hover:text-primary px-3 py-2 text-xl cursor-pointer`}
                          data-oid="qd6glfv"
                        >
                          Plant Types
                        </div>
                      </Link>
                      <Link href="/plant-parts" data-oid="qvds8x8">
                        <div
                          className={`${location.startsWith("/plant-part") ? "text-primary font-medium" : "text-white"} hover:text-primary px-3 py-2 text-xl cursor-pointer`}
                          data-oid="x2m31gi"
                        >
                          Parts of Plant
                        </div>
                      </Link>
                      <Link href="/industries" data-oid="w4t0_sn">
                        <div
                          className={`${location === "/industries" ? "text-primary font-medium" : "text-white"} hover:text-primary px-3 py-2 text-xl cursor-pointer`}
                          data-oid="8m:7m_r"
                        >
                          Industries
                        </div>
                      </Link>
                      <Link href="/research" data-oid="zbxxzj2">
                        <div
                          className={`${location.startsWith("/research") ? "text-primary font-medium" : "text-white"} hover:text-primary px-3 py-2 text-xl cursor-pointer`}
                          data-oid="mdzr94x"
                        >
                          Research
                        </div>
                      </Link>
                    </nav>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
