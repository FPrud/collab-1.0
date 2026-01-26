"use server";

import { db } from "@/src/db";
import { userSkills } from "@/src/schema";
import { eq, and } from "drizzle-orm";

export async function deleteSkillProfile(userId: string, userSkillId: number) {
  try {
    await db
      .delete(userSkills)
      .where(
        and(
          eq(userSkills.id, userSkillId),
          eq(userSkills.userId, userId)
        )
      );

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression de la compétence:", error);
    return { error: "Erreur lors de la suppression de la compétence" };
  }
}