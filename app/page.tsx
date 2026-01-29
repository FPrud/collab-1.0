"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DisplayMultiplePosts } from "./components/Posts/DisplayMultiplePosts";
import { SearchBar } from "./components/SearchBar";
import { Logo } from "./components/Logo";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerms, setSearchTerms] = useState<string[]>([]);
  const [externalSearchTerm, setExternalSearchTerm] = useState<string>("");
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const searchParam = searchParams.get("search");
    const reset = searchParams.get("reset");

    if (reset === "true") {
      setSearchTerms([]);
      setExternalSearchTerm("");
      setResetKey(prev => prev + 1);
      router.replace("/", { scroll: false });
    } else if (searchParam) {
      setExternalSearchTerm(searchParam);
    }
  }, [searchParams, router]);

  const handleSearch = (terms: string[]) => {
    setSearchTerms(terms);
    setExternalSearchTerm("");
  };

  const handleSkillClick = (skillName: string) => {
    setExternalSearchTerm(skillName);
  };

  return (
    <main className="p-0">
      <Logo />
      <SearchBar
        key={resetKey}
        onSearch={handleSearch}
        externalSearchTerm={externalSearchTerm}
      />
      <div className="p-2 border-none">
        <DisplayMultiplePosts
          searchTerms={searchTerms}
          onSkillClick={handleSkillClick}
          isHomePage={true}
        />
      </div>
    </main>
  );
}