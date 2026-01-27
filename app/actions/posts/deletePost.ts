"use server";

import { db } from "@/src/db";
import { posts } from "@/src/schema";
import { eq } from "drizzle-orm";

export async function deletePost(postId: number, userId: string) {
  try {
    // Vérifier que l'utilisateur est bien l'auteur du post
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!post) {
      return { error: "Post introuvable" };
    }

    if (post.userId !== userId) {
      return { error: "Non autorisé" };
    }

    // Désactiver le post au lieu de le supprimer
    await db
      .update(posts)
      .set({ postActiveStatus: false })
      .where(eq(posts.id, postId));

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la désactivation du post:", error);
    return { error: "Erreur lors de la désactivation du post" };
  }
}