"use server";

import { db } from "@/src/db";
import { musicGenres } from "@/src/schema";
import { sql } from "drizzle-orm";

export async function createGenre(genreName: string) {
  try {
    const trimmedGenreName = genreName.trim();
    
    if (!trimmedGenreName) {
      return { error: "Le nom du genre ne peut pas être vide" };
    }

    // Vérifier si le genre existe déjà (insensible à la casse)
    const existingGenre = await db
      .select()
      .from(musicGenres)
      .where(sql`LOWER(${musicGenres.genreName}) = LOWER(${trimmedGenreName})`);

    if (existingGenre.length > 0) {
      return { genre: existingGenre[0] };
    }

    // Créer le nouveau genre
    const newGenre = await db
      .insert(musicGenres)
      .values({ genreName: trimmedGenreName })
      .returning();

    return { genre: newGenre[0] };
  } catch (error) {
    console.error("Erreur lors de la création du genre:", error);
    return { error: "Erreur lors de la création du genre" };
  }
}