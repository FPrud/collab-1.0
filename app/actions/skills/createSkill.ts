"use server";

import { db } from "@/src/db";
import { musicSkills } from "@/src/schema";
import { eq, sql } from "drizzle-orm";

export async function createSkill(skillName: string) {
  try {
    const trimmedSkillName = skillName.trim();
    
    if (!trimmedSkillName) {
      return { error: "Le nom de la compétence ne peut pas être vide" };
    }

    // Vérifier si la compétence existe déjà (insensible à la casse)
    const existingSkill = await db
      .select()
      .from(musicSkills)
      .where(sql`LOWER(${musicSkills.skillName}) = LOWER(${trimmedSkillName})`);

    if (existingSkill.length > 0) {
      return { skill: existingSkill[0] };
    }

    // Créer la nouvelle compétence
    const newSkill = await db
      .insert(musicSkills)
      .values({ skillName: trimmedSkillName })
      .returning();

    return { skill: newSkill[0] };
  } catch (error) {
    console.error("Erreur lors de la création de la compétence:", error);
    return { error: "Erreur lors de la création de la compétence" };
  }
}