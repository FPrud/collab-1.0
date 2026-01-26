"use server";

import { db } from "@/src/db";
import { posts, user, profiles } from "@/src/schema";
import { eq, desc } from "drizzle-orm";

export async function getAllPosts(offset: number = 0, limit: number = 20) {
  try {
    const allPosts = await db
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
      .where(eq(posts.postActiveStatus, true))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    return allPosts;
  } catch (error) {
    console.error("Erreur lors de la récupération des posts:", error);
    return { error: "Erreur lors de la récupération des posts" };
  }
}