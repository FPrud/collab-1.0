"use server";

import { db } from "@/src/db";
import { userSkills, musicSkills, musicGenres } from "@/src/schema";
import { eq } from "drizzle-orm";

export async function getUserSkills(userId: string) {
  try {
    const skills = await db
      .select({
        id: userSkills.id,
        skillId: userSkills.skillId,
        skillName: musicSkills.skillName,
        genreId: userSkills.genreId,
        genreName: musicGenres.genreName,
      })
      .from(userSkills)
      .leftJoin(musicSkills, eq(userSkills.skillId, musicSkills.id))
      .leftJoin(musicGenres, eq(userSkills.genreId, musicGenres.id))
      .where(eq(userSkills.userId, userId));

    return skills;
  } catch (error) {
    console.error("Erreur lors de la récupération des compétences:", error);
    return { error: "Erreur lors de la récupération des compétences" };
  }
}