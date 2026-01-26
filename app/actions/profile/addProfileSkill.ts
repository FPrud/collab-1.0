"use server";

import { db } from "@/src/db";
import { userSkills } from "@/src/schema";
import { eq, and, sql } from "drizzle-orm";

export async function addProfileSkill(
  userId: string,
  skillId: number,
  genreId: number | null
) {
  try {
    // Vérifier le nombre de compétences existantes
    const existingSkills = await db
      .select()
      .from(userSkills)
      .where(eq(userSkills.userId, userId));

    if (existingSkills.length >= 50) {
      return { error: "Vous avez atteint la limite de 50 compétences" };
    }

    // Vérifier si la compétence existe déjà pour cet utilisateur avec le même genre
    const duplicateSkill = await db
      .select()
      .from(userSkills)
      .where(
        and(
          eq(userSkills.userId, userId),
          eq(userSkills.skillId, skillId),
          genreId ? eq(userSkills.genreId, genreId) : sql`${userSkills.genreId} IS NULL`
        )
      );

    if (duplicateSkill.length > 0) {
      return { error: "Cette compétence existe déjà dans votre profil" };
    }

    // Ajouter la compétence
    const newUserSkill = await db
      .insert(userSkills)
      .values({
        userId,
        skillId,
        genreId,
      })
      .returning();

    return { success: true, userSkill: newUserSkill[0] };
  } catch (error) {
    console.error("Erreur lors de l'ajout de la compétence:", error);
    return { error: "Erreur lors de l'ajout de la compétence" };
  }
}