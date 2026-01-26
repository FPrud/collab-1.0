"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllPosts } from "@/app/actions/posts/getAllPosts";
import { getUserPosts } from "@/app/actions/posts/getUserPosts";
import { getPostSkills } from "@/app/actions/skills/getPostSkills";

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

interface DisplayAllPostsProps {
    userId?: string;
}

export function DisplayAllPosts({ userId }: DisplayAllPostsProps) {
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

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(new Date(date));
    };

    const truncateContent = (content: string, maxLength: number = 150) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + "...";
    };

    if (posts.length === 0 && !loading) {
        return (
            <div>
                <p>Aucune annonce disponible</p>
            </div>
        );
    }

    return (
        <div className="gap-2">
            {posts.map((post) => (
                <Link key={post.id} href={`/annonce/${post.id}`}>
                    <div className="gap-2">
                        <div className="border-none">
                            <h2>{post.title}</h2>
                        </div>

                        <div className="border-none">
                            <p>{post.userName}</p>
                            <p>{formatDate(post.createdAt)}</p>
                        </div>

                        <div className="border-none">
                            <p>{truncateContent(post.content)}</p>
                        </div>

                        {postSkills[post.id] && postSkills[post.id].length > 0 && (
                            <div className="border-none flex flex-col gap-1">
                                <h2>Recherche</h2>
                                {postSkills[post.id].map((skill) => (
                                    <div key={skill.id} className="flex justify-between border-none p-0">
                                        <div className="flex gap-1 justify-center align-middle">
                                            <span>{skill.skillName}</span>
                                            {skill.genreName && (
                                                <>
                                                    <span>~</span>
                                                    <span>{skill.genreName}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Link>
            ))}

            {hasMore && (
                <button
                    onClick={loadMore}
                    disabled={loading}
                >
                    {loading ? "Chargement..." : "Charger plus d'annonces"}
                </button>
            )}
        </div>
    );
}