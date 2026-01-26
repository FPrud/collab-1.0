"use server";

import { db } from "@/src/db";
import { musicSkills } from "@/src/schema";
import { asc } from "drizzle-orm";

export async function getAllSkills() {
  try {
    const skills = await db
      .select()
      .from(musicSkills)
      .orderBy(asc(musicSkills.skillName));

    return skills;
  } catch (error) {
    console.error("Erreur lors de la récupération des compétences:", error);
    return { error: "Erreur lors de la récupération des compétences" };
  }
}