"use server";

import { db } from "@/src/db";
import { posts, user, profiles } from "@/src/schema";
import { eq, desc, and } from "drizzle-orm";

export async function getUserPosts(userId: string, offset: number = 0, limit: number = 20) {
  try {
    const userPosts = await db
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
      .where(
        and(
          eq(posts.userId, userId),
          eq(posts.postActiveStatus, true)
        )
      )
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    return userPosts;
  } catch (error) {
    console.error("Erreur lors de la récupération des posts de l'utilisateur:", error);
    return { error: "Erreur lors de la récupération des posts de l'utilisateur" };
  }
}