"use server";

import { db } from "@/src/db";
import { profiles, user } from "@/src/schema";
import { eq } from "drizzle-orm";

export async function editProfileData(
  userId: string,
  field: string,
  value: string | null
) {
  try {
    const profileFields = ["birthdate", "address", "bio", "contactLink"];
    const userFields = ["name"];

    if (!profileFields.includes(field) && !userFields.includes(field)) {
      return { error: "Champ non autorisé" };
    }

    if (userFields.includes(field)) {
      await db.update(user).set({ [field]: value }).where(eq(user.id, userId));
    } else {
      await db
        .update(profiles)
        .set({ [field]: value })
        .where(eq(profiles.userId, userId));
    }

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    return { error: "Erreur lors de la mise à jour du profil" };
  }
}