"use server";

import { db } from "@/src/db";
import { musicGenres } from "@/src/schema";
import { asc } from "drizzle-orm";

export async function getAllGenres() {
  try {
    const genres = await db
      .select()
      .from(musicGenres)
      .orderBy(asc(musicGenres.genreName));

    return genres;
  } catch (error) {
    console.error("Erreur lors de la récupération des genres:", error);
    return { error: "Erreur lors de la récupération des genres" };
  }
}