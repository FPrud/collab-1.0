"use server";

import { db } from "@/src/db";
import { posts } from "@/src/schema";

export async function createPost(userId: string, title: string, content: string) {
  try {
    if (!title.trim() || !content.trim()) {
      return { error: "Le titre et le contenu sont requis" };
    }

    const newPost = await db
      .insert(posts)
      .values({
        userId,
        title: title.trim(),
        content: content.trim(),
      })
      .returning();

    return { post: newPost[0] };
  } catch (error) {
    console.error("Erreur lors de la création du post:", error);
    return { error: "Erreur lors de la création du post" };
  }
}