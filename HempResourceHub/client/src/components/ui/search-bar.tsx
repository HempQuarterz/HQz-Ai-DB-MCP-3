import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
  large?: boolean;
}

const SearchBar = ({
  placeholder = "Search...",
  onSearch,
  className = "",
  large = false,
}: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative ${className}`}
      data-oid="42s.vz3"
    >
      <Input
        type="text"
        placeholder={placeholder}
        className={`${large ? "py-4 pl-14 text-lg" : "py-2 pl-10"} rounded-full w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        data-oid="kvx6ryy"
      />

      <div
        className={`absolute inset-y-0 left-0 ${large ? "pl-5" : "pl-3"} flex items-center`}
        data-oid="y4-uapu"
      >
        <Search
          className={`${large ? "h-6 w-6" : "h-5 w-5"} text-neutral-medium`}
          data-oid="-l.fj8x"
        />
      </div>
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="absolute inset-y-0 right-0 flex items-center pr-3 sr-only"
        data-oid="bl3a5b0"
      >
        <span data-oid="1i.stk5">Search</span>
      </Button>
    </form>
  );
};

export default SearchBar;
