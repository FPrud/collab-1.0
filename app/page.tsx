"use client";

import { useState } from "react";
import { DisplayMultiplePosts } from "./components/Posts/DisplayMultiplePosts";
import { SearchBar } from "./components/SearchBar";

export default function Home() {
  const [searchTerms, setSearchTerms] = useState<string[]>([]);

  const handleSearch = (terms: string[]) => {
    setSearchTerms(terms);
  };

  return (
    <main className="p-0">
      <SearchBar onSearch={handleSearch} />
      <div className="p-2">
        <DisplayMultiplePosts searchTerms={searchTerms} />
      </div>
    </main>
  );
}