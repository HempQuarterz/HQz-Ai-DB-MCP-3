import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { usePlantTypes } from "@/hooks/use-plant-data";
import { PlantType } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchIcon, SlidersHorizontal, Leaf } from "lucide-react";

const HempDex = () => {
  const { data: plantTypesData, isLoading } = usePlantTypes();
  const plantTypes = Array.isArray(plantTypesData) ? plantTypesData : [];

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filteredPlants, setFilteredPlants] = useState<PlantType[]>([]);

  useEffect(() => {
    if (plantTypes.length > 0) {
      let filtered = [...plantTypes];

      // Apply search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (plant) =>
            plant.name.toLowerCase().includes(term) ||
            (plant.description &&
              plant.description.toLowerCase().includes(term)) ||
            plant.id.toString() === term,
        );
      }

      // Apply sorting
      filtered.sort((a, b) => {
        if (sortBy === "id") {
          return a.id - b.id;
        } else if (sortBy === "name-asc") {
          return a.name.localeCompare(b.name);
        } else if (sortBy === "name-desc") {
          return b.name.localeCompare(a.name);
        }
        return 0;
      });

      setFilteredPlants(filtered);
    }
  }, [plantTypes, searchTerm, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleRandomPlant = () => {
    if (plantTypes.length > 0) {
      const randomIndex = Math.floor(Math.random() * plantTypes.length);
      const randomPlant = plantTypes[randomIndex];
      // Navigate to the random plant's detail page
      window.location.href = `/plant-type/${randomPlant.id}`;
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800"
      data-oid="_1-63:c"
    >
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        data-oid="t:cbpzl"
      >
        <div
          className="bg-gradient-to-r from-green-800 via-green-600 to-green-500 p-1 rounded-lg mb-8"
          data-oid="g:_okbf"
        >
          <h1
            className="text-3xl sm:text-4xl font-heading font-bold text-white text-center py-3"
            data-oid="ypvd0fx"
          >
            Industrial HempDex
          </h1>
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
          data-oid="2n:p8as"
        >
          {/* Search Box */}
          <div
            className="lg:col-span-2 bg-gray-800 rounded-lg shadow-lg p-6"
            data-oid="d-7lwsd"
          >
            <h2
              className="text-xl font-heading font-semibold text-white mb-4"
              data-oid="7x2tdxj"
            >
              Name or Number
            </h2>
            <form
              onSubmit={handleSearch}
              className="flex space-x-2 mb-4"
              data-oid="uagskb2"
            >
              <Input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:border-green-500"
                data-oid=".ihqf59"
              />

              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
                data-oid="w4r6znw"
              >
                <SearchIcon className="h-5 w-5" data-oid="6758jks" />
              </Button>
            </form>
            <p className="text-sm text-gray-400" data-oid="3_4twjt">
              Use the search to explore industrial hemp by type,
              characteristics, and applications.
            </p>
          </div>

          {/* Quick Info Box */}
          <div
            className="bg-gray-800 rounded-lg shadow-lg p-6"
            data-oid="lgcqqrf"
          >
            <h2
              className="text-xl font-heading font-semibold text-white mb-4"
              data-oid="a.8g9ly"
            >
              Search Tips
            </h2>
            <p className="text-sm text-gray-400 mb-4" data-oid="wxso-1t">
              Search for a hemp type by name or number. You can also use the
              advanced search to filter by specific characteristics.
            </p>
            <Button
              onClick={handleRandomPlant}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              data-oid="y1f4vjq"
            >
              Surprise Me!
            </Button>
          </div>
        </div>

        {/* Advanced Search Toggle */}
        <div
          className="bg-gray-800 rounded-lg shadow-lg p-4 mb-8"
          data-oid="kvv7oka"
        >
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full text-white"
            data-oid="sw-wa91"
          >
            <span className="font-medium" data-oid="8dzwyr1">
              Show Advanced Search
            </span>
            <SlidersHorizontal className="h-5 w-5" data-oid="mzqke1n" />
          </button>

          {showAdvanced && (
            <div
              className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4"
              data-oid="8yqraez"
            >
              <div data-oid="815kvyg">
                <label
                  className="block text-sm font-medium text-gray-400 mb-1"
                  data-oid="2rmffne"
                >
                  Sort By
                </label>
                <Select
                  value={sortBy}
                  onValueChange={handleSortChange}
                  data-oid="zc9el_-"
                >
                  <SelectTrigger
                    className="bg-gray-700 text-white border-gray-600"
                    data-oid="1k.jnrn"
                  >
                    <SelectValue placeholder="Sort order" data-oid="239ghso" />
                  </SelectTrigger>
                  <SelectContent
                    className="bg-gray-700 text-white border-gray-600"
                    data-oid=".12u5zh"
                  >
                    <SelectItem value="id" data-oid=":p:xdsa">
                      ID (Lowest First)
                    </SelectItem>
                    <SelectItem value="name-asc" data-oid="rnmgofk">
                      Name (A-Z)
                    </SelectItem>
                    <SelectItem value="name-desc" data-oid="vr_3l80">
                      Name (Z-A)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* More filters could be added here */}
            </div>
          )}
        </div>

        {/* Results Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
          data-oid="3uwa9q3"
        >
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
                data-oid="zyqgo4d"
              >
                <Skeleton
                  className="h-48 w-full bg-gray-700"
                  data-oid="hb6j6x3"
                />
                <div className="p-4" data-oid="kayj8-5">
                  <Skeleton
                    className="h-6 w-3/4 mb-2 bg-gray-700"
                    data-oid="fv65098"
                  />
                  <Skeleton
                    className="h-4 w-full mb-1 bg-gray-700"
                    data-oid="sljcntv"
                  />
                  <Skeleton
                    className="h-4 w-2/3 bg-gray-700"
                    data-oid="s.08r06"
                  />
                </div>
              </div>
            ))
          ) : filteredPlants.length > 0 ? (
            filteredPlants.map((plant) => (
              <Link
                key={plant.id}
                href={`/plant-type/${plant.id}`}
                data-oid="ceg9bj3"
              >
                <a className="block" data-oid="moptn0q">
                  <div
                    className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg overflow-hidden shadow-lg border-2 border-green-500 hover:shadow-green-500/20 hover:scale-105 transition-all duration-300"
                    data-oid="9hk2fud"
                  >
                    <div
                      className="p-2 bg-green-600 text-xs font-medium text-white flex justify-between items-center"
                      data-oid="y986ah5"
                    >
                      <span data-oid="cmtsaw6">
                        #{String(plant.id).padStart(3, "0")}
                      </span>
                      <span
                        className="px-2 py-1 rounded-full bg-green-700"
                        data-oid="eeq2ehv"
                      >
                        {plant.plantingDensity || "Hemp"}
                      </span>
                    </div>
                    <div
                      className="p-4 flex flex-col items-center"
                      data-oid="r190nam"
                    >
                      <div
                        className="h-36 w-36 rounded-full bg-gradient-to-br from-green-900/50 to-green-700/30 flex items-center justify-center mb-4"
                        data-oid="7f6qg3d"
                      >
                        {plant.imageUrl ? (
                          <img
                            src={plant.imageUrl}
                            alt={plant.name}
                            className="h-32 w-32 object-cover rounded-full"
                            data-oid="splm.bb"
                          />
                        ) : (
                          <Leaf
                            className="h-20 w-20 text-green-400"
                            data-oid="i50vubr"
                          />
                        )}
                      </div>
                      <h3
                        className="text-xl font-heading font-semibold text-green-400 text-outline-white text-center"
                        data-oid="bbf7elf"
                      >
                        {plant.name}
                      </h3>
                      <p
                        className="mt-2 text-xs text-gray-300 text-center line-clamp-2"
                        data-oid="5pu9.yp"
                      >
                        {plant.description || "No description available"}
                      </p>
                    </div>
                    <div
                      className="p-2 bg-gradient-to-r from-green-800 to-green-600 flex justify-center"
                      data-oid="ueb_nfj"
                    >
                      <span
                        className="text-sm font-medium text-white"
                        data-oid="8w8ggp-"
                      >
                        View Details
                      </span>
                    </div>
                  </div>
                </a>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-10" data-oid="xegh145">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 mb-4"
                data-oid="bhq.cgl"
              >
                <SearchIcon
                  className="h-8 w-8 text-gray-400"
                  data-oid="f-g1r.x"
                />
              </div>
              <h3
                className="text-xl font-heading font-medium text-white mb-2"
                data-oid="qh1p5vo"
              >
                No Results Found
              </h3>
              <p className="text-gray-400" data-oid="aqx:.m7">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HempDex;
