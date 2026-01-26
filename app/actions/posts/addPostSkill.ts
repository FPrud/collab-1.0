"use server";

import { db } from "@/src/db";
import { searchedSkills } from "@/src/schema";

export async function addPostSkill(postId: number, skillId: number, genreId: number | null) {
  try {
    const newSearchedSkill = await db
      .insert(searchedSkills)
      .values({
        postId,
        skillId,
        genreId,
      })
      .returning();

    return { searchedSkill: newSearchedSkill[0] };
  } catch (error) {
    console.error("Erreur lors de l'ajout du tag recherché:", error);
    return { error: "Erreur lors de l'ajout du tag recherché" };
  }
}