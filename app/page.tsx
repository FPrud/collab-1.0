"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { DisplayMultiplePosts } from "./components/Posts/DisplayMultiplePosts";
import { SearchBar } from "./components/SearchBar";

export default function Home() {
  const searchParams = useSearchParams();
  const [searchTerms, setSearchTerms] = useState<string[]>([]);
  const [externalSearchTerm, setExternalSearchTerm] = useState<string>("");

  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setExternalSearchTerm(searchParam);
    }
  }, [searchParams]);

  const handleSearch = (terms: string[]) => {
    setSearchTerms(terms);
    setExternalSearchTerm("");
  };

  const handleSkillClick = (skillName: string) => {
    setExternalSearchTerm(skillName);
  };

  return (
    <main className="p-0">
      <SearchBar onSearch={handleSearch} externalSearchTerm={externalSearchTerm} />
      <div className="p-2">
        <DisplayMultiplePosts 
          searchTerms={searchTerms} 
          onSkillClick={handleSkillClick}
          isHomePage={true}
        />
      </div>
    </main>
  );
}