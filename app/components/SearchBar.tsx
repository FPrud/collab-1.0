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
    <div className="sticky top-0 bg-white z-10 p-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Rechercher une compétence ou un genre musical"
          className="flex-1"
        />
        <button onClick={handleSearch}>
          <Search size={20} />
        </button>
      </div>
    </div>
  );
}