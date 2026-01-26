"use server";

import { db } from "@/src/db";
import { posts, user, profiles, searchedSkills, musicSkills, musicGenres } from "@/src/schema";
import { eq } from "drizzle-orm";

export async function getPostById(postId: number) {
  try {
    const post = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        createdAt: posts.createdAt,
        userId: posts.userId,
        userName: user.name,
        contactLink: profiles.contactLink,
      })
      .from(posts)
      .leftJoin(user, eq(posts.userId, user.id))
      .leftJoin(profiles, eq(posts.userId, profiles.userId))
      .where(eq(posts.id, postId))
      .limit(1);

    if (post.length === 0) {
      return { error: "Post non trouvé" };
    }

    return post[0];
  } catch (error) {
    console.error("Erreur lors de la récupération du post:", error);
    return { error: "Erreur lors de la récupération du post" };
  }
}