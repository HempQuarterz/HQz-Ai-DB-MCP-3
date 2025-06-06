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
    <nav className="bg-black shadow-md" data-oid="w3r8ark">
      <div
        className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 bg-black"
        data-oid="dqog7gd"
      >
        <div
          className="flex justify-between items-center h-28"
          data-oid=".q3l2d3"
        >
          {/* Logo on the left */}
          <div className="flex-shrink-0 flex items-center" data-oid="ygzt06w">
            <Link href="/" data-oid="of8nbes">
              <img
                src={HempQuarterzLogo}
                alt="HempQuarterz Logo"
                className="h-24 w-24 cursor-pointer rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
                data-oid="rw8achz"
              />
            </Link>
          </div>

          {/* Navigation menu in the center */}
          <div
            className="hidden sm:flex sm:flex-1 sm:justify-center"
            data-oid="mp51aze"
          >
            <div className="flex flex-col items-center" data-oid="a025_87">
              {/* Top row */}
              <div
                className="flex space-x-6 mb-2 items-center"
                data-oid="k6qevit"
              >
                <Link href="/" data-oid="njt21s0">
                  <div
                    className={`${location === "/" ? "border-primary text-primary" : "border-transparent text-white hover:text-primary hover:border-primary"} border-b-2 px-0.5 pt-1 text-lg font-medium whitespace-nowrap cursor-pointer`}
                    data-oid="j2d:1b1"
                  >
                    Home
                  </div>
                </Link>
                <Link href="/about" data-oid="r-w-k3e">
                  <div
                    className={`${location === "/about" ? "border-primary text-primary" : "border-transparent text-white hover:text-primary hover:border-primary"} border-b-2 px-0.5 pt-1 text-lg font-medium whitespace-nowrap cursor-pointer`}
                    data-oid="3q8idwb"
                  >
                    About
                  </div>
                </Link>
                <Link href="/plant-types" data-oid="nvr:0yg">
                  <div
                    className={`${location === "/plant-types" ? "border-primary text-primary" : "border-transparent text-white hover:text-primary hover:border-primary"} border-b-2 px-0.5 pt-1 text-lg font-medium whitespace-nowrap cursor-pointer`}
                    data-oid="4ebckn2"
                  >
                    Plant Types
                  </div>
                </Link>
              </div>

              {/* Bottom row */}
              <div className="flex space-x-6 items-center" data-oid="pnsas1x">
                <Link href="/plant-parts" data-oid="qlxua8i">
                  <div
                    className={`${location.startsWith("/plant-part") ? "border-primary text-primary" : "border-transparent text-white hover:text-primary hover:border-primary"} border-b-2 px-0.5 pt-1 text-lg font-medium whitespace-nowrap cursor-pointer`}
                    data-oid="29w29kj"
                  >
                    Parts of Plant
                  </div>
                </Link>
                <Link href="/industries" data-oid="igjn6a2">
                  <div
                    className={`${location === "/industries" ? "border-primary text-primary" : "border-transparent text-white hover:text-primary hover:border-primary"} border-b-2 px-0.5 pt-1 text-lg font-medium whitespace-nowrap cursor-pointer`}
                    data-oid="69nylw_"
                  >
                    Industries
                  </div>
                </Link>
                <Link href="/research" data-oid="5ezvn33">
                  <div
                    className={`${location.startsWith("/research") ? "border-primary text-primary" : "border-transparent text-white hover:text-primary hover:border-primary"} border-b-2 px-0.5 pt-1 text-lg font-medium whitespace-nowrap cursor-pointer`}
                    data-oid="4q:kp-u"
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
            data-oid="g_tfe-j"
          >
            <form
              onSubmit={handleSearch}
              className="relative"
              data-oid="8:3de6r"
            >
              <Input
                type="text"
                placeholder="Search..."
                className="w-36 rounded-full px-4 py-2 border border-neutral-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-oid="151m22d"
              />

              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                data-oid="0vfgi0:"
              >
                <Search className="h-5 w-5 text-white" data-oid="v5s5blf" />
              </Button>
            </form>
          </div>

          <div className="-mr-2 flex items-center sm:hidden" data-oid="_n3sh2f">
            <Sheet data-oid=".wdbpk3">
              <SheetTrigger asChild data-oid="m6tg5:.">
                <Button
                  variant="ghost"
                  size="icon"
                  className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-primary hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                  data-oid="mk2io:4"
                >
                  <span className="sr-only" data-oid="zbs94uv">
                    Open main menu
                  </span>
                  <Menu className="h-6 w-6" data-oid="28gkf73" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-black"
                data-oid="78su93c"
              >
                <div className="flex flex-col h-full" data-oid="85ua.n0">
                  <div
                    className="flex items-center justify-between pb-4 border-b border-gray-800"
                    data-oid="t9hyibf"
                  >
                    <Link href="/" data-oid="vlli5ut">
                      <img
                        src={HempQuarterzLogo}
                        alt="HempQuarterz Logo"
                        className="h-24 w-24 cursor-pointer rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
                        data-oid="8n7wbq1"
                      />
                    </Link>
                  </div>

                  <div className="mt-6" data-oid="y:q7a3i">
                    <form
                      onSubmit={handleSearch}
                      className="mb-6"
                      data-oid="6veppc3"
                    >
                      <div className="relative" data-oid="bw01jsj">
                        <Input
                          type="text"
                          placeholder="Search..."
                          className="w-full rounded-full px-4 py-2 border border-neutral-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          data-oid=".14iakj"
                        />

                        <Button
                          type="submit"
                          variant="ghost"
                          size="icon"
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                          data-oid="pj.0mpo"
                        >
                          <Search
                            className="h-5 w-5 text-white"
                            data-oid="x-n1:hr"
                          />
                        </Button>
                      </div>
                    </form>

                    <nav className="flex flex-col space-y-4" data-oid="l_h8vw:">
                      <Link href="/" data-oid="r7z7ku1">
                        <div
                          className={`${location === "/" ? "text-primary font-medium" : "text-white"} hover:text-primary px-3 py-2 text-xl cursor-pointer`}
                          data-oid="qwik0i6"
                        >
                          Home
                        </div>
                      </Link>
                      <Link href="/about" data-oid="-x-.a1x">
                        <div
                          className={`${location === "/about" ? "text-primary font-medium" : "text-white"} hover:text-primary px-3 py-2 text-xl cursor-pointer`}
                          data-oid="pz-xb3d"
                        >
                          About
                        </div>
                      </Link>
                      <Link href="/plant-types" data-oid="x4pl3o-">
                        <div
                          className={`${location === "/plant-types" ? "text-primary font-medium" : "text-white"} hover:text-primary px-3 py-2 text-xl cursor-pointer`}
                          data-oid="960s_wu"
                        >
                          Plant Types
                        </div>
                      </Link>
                      <Link href="/plant-parts" data-oid="8.5:d_x">
                        <div
                          className={`${location.startsWith("/plant-part") ? "text-primary font-medium" : "text-white"} hover:text-primary px-3 py-2 text-xl cursor-pointer`}
                          data-oid="n9tuz-b"
                        >
                          Parts of Plant
                        </div>
                      </Link>
                      <Link href="/industries" data-oid="28q78k_">
                        <div
                          className={`${location === "/industries" ? "text-primary font-medium" : "text-white"} hover:text-primary px-3 py-2 text-xl cursor-pointer`}
                          data-oid="uo9xo6r"
                        >
                          Industries
                        </div>
                      </Link>
                      <Link href="/research" data-oid="qtg9bu3">
                        <div
                          className={`${location.startsWith("/research") ? "text-primary font-medium" : "text-white"} hover:text-primary px-3 py-2 text-xl cursor-pointer`}
                          data-oid="9ubv60p"
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
