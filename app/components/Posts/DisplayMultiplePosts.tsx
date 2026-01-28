"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { getAllPosts } from "@/app/actions/posts/getAllPosts";
import { getUserPosts } from "@/app/actions/posts/getUserPosts";
import { getPostSkills } from "@/app/actions/skills/getPostSkills";
import { DisplayPost } from "./DisplayPost";

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  userId: string;
  userName: string | null;
  contactLink: string | null;
}

interface SearchedSkill {
  id: number;
  skillId: number;
  skillName: string | null;
  genreId: number | null;
  genreName: string | null;
}

interface DisplayManyPostsProps {
  userId?: string;
  searchTerms?: string[];
}

export function DisplayMultiplePosts({ userId, searchTerms }: DisplayManyPostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postSkills, setPostSkills] = useState<Record<number, SearchedSkill[]>>({});
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);

  useEffect(() => {
    setPosts([]);
    setPostSkills({});
    setOffset(0);
    setHasMore(true);
    loadPosts(0);
  }, [userId, searchTerms]);

  const loadPosts = async (currentOffset: number) => {
    if (loadingRef.current) return;
    
    loadingRef.current = true;
    setLoading(true);
    
    let result;
    if (userId) {
      result = await getUserPosts(userId, currentOffset);
    } else {
      // Passer searchTerms à getAllPosts (tableau vide par défaut)
      result = await getAllPosts(currentOffset, 20, searchTerms || []);
    }

    if ("error" in result) {
      console.error(result.error);
      setLoading(false);
      loadingRef.current = false;
      return;
    }

    const newPosts = result as Post[];

    if (newPosts.length < 20) {
      setHasMore(false);
    }

    setPosts((prevPosts) => {
      const existingIds = new Set(prevPosts.map(p => p.id));
      const uniqueNewPosts = newPosts.filter(p => !existingIds.has(p.id));
      return [...prevPosts, ...uniqueNewPosts];
    });

    const skillsPromises = newPosts.map(async (post) => {
      const skillsResult = await getPostSkills(post.id);
      return {
        postId: post.id,
        skills: "error" in skillsResult ? [] : skillsResult,
      };
    });

    const skillsData = await Promise.all(skillsPromises);
    const skillsMap = skillsData.reduce((acc, { postId, skills }) => {
      acc[postId] = skills;
      return acc;
    }, {} as Record<number, SearchedSkill[]>);

    setPostSkills((prevSkills) => ({ ...prevSkills, ...skillsMap }));
    setLoading(false);
    loadingRef.current = false;
  };

  const loadMore = () => {
    if (loading) return;
    const newOffset = offset + 20;
    setOffset(newOffset);
    loadPosts(newOffset);
  };

  if (posts.length === 0 && !loading) {
    return (
      <div>
        <p>Aucune annonce disponible</p>
      </div>
    );
  }

  return (
    <div id="MultiplePostsContainer" className="border-none p-0 flex flex-col gap-2">
      {posts.map((post) => (
        <div key={post.id}>
          <DisplayPost
            post={post}
            searchedSkills={postSkills[post.id] || []}
            showFullContent={false}
          />
          <div className="border-none p-0 flex justify-center mt-2">
            <Link href={`/annonce/${post.id}`}>
              <button>Voir l'annonce</button>
            </Link>
          </div>
        </div>
      ))}

      {hasMore && (
        <button onClick={loadMore} disabled={loading}>
          {loading ? "Chargement..." : "Charger plus d'annonces"}
        </button>
      )}
    </div>
  );
}