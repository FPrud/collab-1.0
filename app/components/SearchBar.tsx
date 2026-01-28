"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (searchTerms: string[]) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
    const terms = searchInput
      .trim()
      .split(/\s+/)
      .filter(term => term.length > 0);
    onSearch(terms);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="sticky top-0 bg-white z-10 p-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Rechercher par compétence, genre ou mots-clés..."
          className="flex-1"
        />
        <button onClick={handleSearch}>
          <Search size={20} />
        </button>
      </div>
    </div>
  );
}