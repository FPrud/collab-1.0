"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (searchTerms: string[]) => void;
  externalSearchTerm?: string;
}

export function SearchBar({ onSearch, externalSearchTerm }: SearchBarProps) {
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (externalSearchTerm) {
      setSearchInput(externalSearchTerm);
      const terms = externalSearchTerm
        .trim()
        .split(/\s+/)
        .filter(term => term.length > 0);
      onSearch(terms);
    }
  }, [externalSearchTerm]);

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
    <div id="searchbar" className="sticky top-0 z-10 flex gap-1 mt-1 border-t border-b bg-[#a8e6de]">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Rechercher une compétence ou un genre"
          className="flex-1"
        />
        <button onClick={handleSearch}>
          <Search size={20} />
        </button>
      </div>
  );
}