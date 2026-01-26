"use server";

import { db } from "@/src/db";
import { searchedSkills } from "@/src/schema";
import { eq } from "drizzle-orm";

export async function deleteSearchedSkill(searchedSkillId: number) {
  try {
    await db
      .delete(searchedSkills)
      .where(eq(searchedSkills.id, searchedSkillId));

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du tag recherché:", error);
    return { error: "Erreur lors de la suppression du tag recherché" };
  }
}