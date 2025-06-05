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
    <nav className="bg-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 bg-black">
        <div className="flex justify-between items-center h-28">
          {/* Logo on the left */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <img 
                src={HempQuarterzLogo} 
                alt="HempQuarterz Logo" 
                className="h-24 w-24 cursor-pointer rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
            </Link>
          </div>
          
          {/* Navigation menu in the center */}
          <div className="hidden sm:flex sm:flex-1 sm:justify-center">
            <div className="flex flex-col items-center">
              {/* Top row */}
              <div className="flex space-x-6 mb-2 items-center">
                <Link href="/">
                  <div className={`${location === '/' ? 'border-primary text-primary' : 'border-transparent text-white hover:text-primary hover:border-primary'} border-b-2 px-0.5 pt-1 text-lg font-medium whitespace-nowrap cursor-pointer`}>
                    Home
                  </div>
                </Link>
                <Link href="/about">
                  <div className={`${location === '/about' ? 'border-primary text-primary' : 'border-transparent text-white hover:text-primary hover:border-primary'} border-b-2 px-0.5 pt-1 text-lg font-medium whitespace-nowrap cursor-pointer`}>
                    About
                  </div>
                </Link>
                <Link href="/plant-types">
                  <div className={`${location === '/plant-types' ? 'border-primary text-primary' : 'border-transparent text-white hover:text-primary hover:border-primary'} border-b-2 px-0.5 pt-1 text-lg font-medium whitespace-nowrap cursor-pointer`}>
                    Plant Types
                  </div>
                </Link>
              </div>
              
              {/* Bottom row */}
              <div className="flex space-x-6 items-center">
                <Link href="/plant-parts">
                  <div className={`${location.startsWith('/plant-part') ? 'border-primary text-primary' : 'border-transparent text-white hover:text-primary hover:border-primary'} border-b-2 px-0.5 pt-1 text-lg font-medium whitespace-nowrap cursor-pointer`}>
                    Parts of Plant
                  </div>
                </Link>
                <Link href="/industries">
                  <div className={`${location === '/industries' ? 'border-primary text-primary' : 'border-transparent text-white hover:text-primary hover:border-primary'} border-b-2 px-0.5 pt-1 text-lg font-medium whitespace-nowrap cursor-pointer`}>
                    Industries
                  </div>
                </Link>
                <Link href="/research">
                  <div className={`${location.startsWith('/research') ? 'border-primary text-primary' : 'border-transparent text-white hover:text-primary hover:border-primary'} border-b-2 px-0.5 pt-1 text-lg font-medium whitespace-nowrap cursor-pointer`}>
                    Research
                  </div>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Search on the right */}
          <div className="hidden sm:flex sm:items-center sm:pr-2">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search..."
                className="w-36 rounded-full px-4 py-2 border border-neutral-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon" 
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <Search className="h-5 w-5 text-white" />
              </Button>
            </form>
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-primary hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
                  <span className="sr-only">Open main menu</span>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                    <Link href="/">
                      <img 
                        src={HempQuarterzLogo} 
                        alt="HempQuarterz Logo" 
                        className="h-24 w-24 cursor-pointer rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
                      />
                    </Link>
                  </div>
                  
                  <div className="mt-6">
                    <form onSubmit={handleSearch} className="mb-6">
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="Search..."
                          className="w-full rounded-full px-4 py-2 border border-neutral-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button 
                          type="submit" 
                          variant="ghost" 
                          size="icon" 
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          <Search className="h-5 w-5 text-white" />
                        </Button>
                      </div>
                    </form>
                    
                    <nav className="flex flex-col space-y-4">
                      <Link href="/">
                        <div className={`${location === '/' ? 'text-primary font-medium' : 'text-white'} hover:text-primary px-3 py-2 text-xl cursor-pointer`}>
                          Home
                        </div>
                      </Link>
                      <Link href="/about">
                        <div className={`${location === '/about' ? 'text-primary font-medium' : 'text-white'} hover:text-primary px-3 py-2 text-xl cursor-pointer`}>
                          About
                        </div>
                      </Link>
                      <Link href="/plant-types">
                        <div className={`${location === '/plant-types' ? 'text-primary font-medium' : 'text-white'} hover:text-primary px-3 py-2 text-xl cursor-pointer`}>
                          Plant Types
                        </div>
                      </Link>
                      <Link href="/plant-parts">
                        <div className={`${location.startsWith('/plant-part') ? 'text-primary font-medium' : 'text-white'} hover:text-primary px-3 py-2 text-xl cursor-pointer`}>
                          Parts of Plant
                        </div>
                      </Link>
                      <Link href="/industries">
                        <div className={`${location === '/industries' ? 'text-primary font-medium' : 'text-white'} hover:text-primary px-3 py-2 text-xl cursor-pointer`}>
                          Industries
                        </div>
                      </Link>
                      <Link href="/research">
                        <div className={`${location.startsWith('/research') ? 'text-primary font-medium' : 'text-white'} hover:text-primary px-3 py-2 text-xl cursor-pointer`}>
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
