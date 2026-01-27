"use server";

import { db } from "@/src/db";
import { posts } from "@/src/schema";
import { eq } from "drizzle-orm";

export async function editPost(
  postId: number,
  title: string,
  content: string
) {
  try {
    await db
      .update(posts)
      .set({ 
        title, 
        content,
        updatedAt: new Date()
      })
      .where(eq(posts.id, postId));

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du post:", error);
    return { error: "Erreur lors de la mise à jour du post" };
  }
}