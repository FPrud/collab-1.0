"use client";

import { useEffect, useState } from "react";
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
}

export function DisplayMultiplePosts({ userId }: DisplayManyPostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postSkills, setPostSkills] = useState<Record<number, SearchedSkill[]>>({});
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPosts();
  }, [userId]);

  const loadPosts = async () => {
    setLoading(true);
    const result = userId
      ? await getUserPosts(userId, offset)
      : await getAllPosts(offset);

    if ("error" in result) {
      console.error(result.error);
      setLoading(false);
      return;
    }

    const newPosts = result as Post[];

    if (newPosts.length < 20) {
      setHasMore(false);
    }

    setPosts([...posts, ...newPosts]);

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

    setPostSkills({ ...postSkills, ...skillsMap });
    setLoading(false);
  };

  const loadMore = () => {
    setOffset(offset + 20);
    loadPosts();
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
        <Link key={post.id} href={`/annonce/${post.id}`}>
          <div>
            <DisplayPost
              post={post}
              searchedSkills={postSkills[post.id] || []}
              showFullContent={false}
            />
          </div>
        </Link>
      ))}

      {hasMore && (
        <button onClick={loadMore} disabled={loading}>
          {loading ? "Chargement..." : "Charger plus d'annonces"}
        </button>
      )}
    </div>
  );
}