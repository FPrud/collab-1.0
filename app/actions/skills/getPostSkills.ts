"use server";

import { db } from "@/src/db";
import { searchedSkills, musicSkills, musicGenres } from "@/src/schema";
import { eq } from "drizzle-orm";

export async function getPostSkills(postId: number) {
  try {
    const skills = await db
      .select({
        id: searchedSkills.id,
        skillId: searchedSkills.skillId,
        skillName: musicSkills.skillName,
        genreId: searchedSkills.genreId,
        genreName: musicGenres.genreName,
      })
      .from(searchedSkills)
      .leftJoin(musicSkills, eq(searchedSkills.skillId, musicSkills.id))
      .leftJoin(musicGenres, eq(searchedSkills.genreId, musicGenres.id))
      .where(eq(searchedSkills.postId, postId));

    return skills;
  } catch (error) {
    console.error("Erreur lors de la récupération des tags recherchés:", error);
    return { error: "Erreur lors de la récupération des tags recherchés" };
  }
}