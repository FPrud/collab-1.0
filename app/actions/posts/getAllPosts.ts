"use server";

import { db } from "@/src/db";
import { posts, user, profiles } from "@/src/schema";
import { eq, desc, and, or, ilike } from "drizzle-orm";

export async function getAllPosts(offset: number = 0, limit: number = 20, searchTerms: string[] = []) {
  try {
    const conditions = [eq(posts.postActiveStatus, true)];

    // Ajouter les conditions de recherche si des termes sont fournis
    if (searchTerms.length > 0) {
      const searchConditions = searchTerms.flatMap(term => [
        ilike(posts.title, `%${term}%`),
        ilike(posts.content, `%${term}%`)
      ]);
      
      if (searchConditions.length > 0) {
        conditions.push(or(...searchConditions)!);
      }
    }

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
      .where(and(...conditions))
      .orderBy(desc(posts.createdAt), desc(posts.id))
      .limit(limit)
      .offset(offset);

    return allPosts;
  } catch (error) {
    console.error("Erreur lors de la récupération des posts:", error);
    return { error: "Erreur lors de la récupération des posts" };
  }
}