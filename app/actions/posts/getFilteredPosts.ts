"use server";

import { db } from "@/src/db";
import { posts, user, profiles, searchedSkills, musicSkills, musicGenres } from "@/src/schema";
import { eq, desc, or, ilike, sql, inArray } from "drizzle-orm";

export async function getFilteredPosts(searchTerms: string[], offset: number = 0, limit: number = 20) {
  try {
    if (searchTerms.length === 0) {
      return [];
    }

    // Recherche des IDs de posts qui correspondent aux skills/genres
    const skillGenreMatches = await db
      .select({
        postId: searchedSkills.postId,
      })
      .from(searchedSkills)
      .leftJoin(musicSkills, eq(searchedSkills.skillId, musicSkills.id))
      .leftJoin(musicGenres, eq(searchedSkills.genreId, musicGenres.id))
      .where(
        or(
          ...searchTerms.map(term => 
            or(
              ilike(musicSkills.skillName, `%${term}%`),
              ilike(musicGenres.genreName, `%${term}%`)
            )
          )
        )
      );

    const matchingPostIds = [...new Set(skillGenreMatches.map(m => m.postId))];

    // Requête principale avec priorisation
    const allPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        createdAt: posts.createdAt,
        userId: posts.userId,
        userName: user.name,
        contactLink: profiles.contactLink,
        hasSkillMatch: sql<boolean>`CASE WHEN ${posts.id} = ANY(${matchingPostIds}) THEN true ELSE false END`,
      })
      .from(posts)
      .leftJoin(user, eq(posts.userId, user.id))
      .leftJoin(profiles, eq(posts.userId, profiles.userId))
      .where(
        or(
          inArray(posts.id, matchingPostIds.length > 0 ? matchingPostIds : [-1]),
          ...searchTerms.map(term =>
            or(
              ilike(posts.title, `%${term}%`),
              ilike(posts.content, `%${term}%`)
            )
          )
        )
      )
      .orderBy(
        sql`${sql.raw('has_skill_match')} DESC`,
        desc(posts.createdAt),
        desc(posts.id)
      )
      .limit(limit)
      .offset(offset);

    return allPosts.map(({ hasSkillMatch, ...post }) => post);
  } catch (error) {
    console.error("Erreur lors de la recherche des posts:", error);
    return { error: "Erreur lors de la recherche des posts" };
  }
}