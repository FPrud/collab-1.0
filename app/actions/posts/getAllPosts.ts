"use server";

import { db } from "@/src/db";
import { posts, user, profiles, searchedSkills, musicSkills, musicGenres } from "@/src/schema";
import { eq, desc, and, or, ilike, sql } from "drizzle-orm";

export async function getAllPosts(offset: number = 0, limit: number = 20, searchTerms: string[] = []) {
  try {
    const conditions = [eq(posts.postActiveStatus, true)];

    let relevanceScore = sql<number>`0`;

    if (searchTerms.length > 0) {
      // Score correspondances exactes (skill + genre) (100 pts)
      const exactTagMatches = sql<number>`
        COALESCE((
          SELECT COUNT(DISTINCT ss.id) * 100
          FROM ${searchedSkills} ss
          LEFT JOIN ${musicSkills} ms ON ss.skill_id = ms.id
          LEFT JOIN ${musicGenres} mg ON ss.genre_id = mg.id
          WHERE ss.post_id = ${posts.id}
          AND ${sql.join(
        searchTerms.map((term, index) => {
          if (index < searchTerms.length - 1) {
            return sql`(
                  (LOWER(ms.skill_name) = LOWER(${term}) AND LOWER(mg.genre_name) = LOWER(${searchTerms[index + 1]}))
                  OR (LOWER(mg.genre_name) = LOWER(${term}) AND LOWER(ms.skill_name) = LOWER(${searchTerms[index + 1]}))
                )`;
          }
          return sql`FALSE`;
        }),
        sql` OR `
      )}
        ), 0)
      `;

      // Score pour 1 tag (50 pts)
      const partialTagMatches = sql<number>`
        COALESCE((
          SELECT COUNT(DISTINCT ss.id) * 50
          FROM ${searchedSkills} ss
          LEFT JOIN ${musicSkills} ms ON ss.skill_id = ms.id
          LEFT JOIN ${musicGenres} mg ON ss.genre_id = mg.id
          WHERE ss.post_id = ${posts.id}
          AND (
            ${sql.join(
        searchTerms.map(term =>
          sql`(LOWER(ms.skill_name) = LOWER(${term}) OR LOWER(mg.genre_name) = LOWER(${term}))`
        ),
        sql` OR `
      )}
          )
        ), 0)
      `;

      // Score pour titre et contenu (25 pts)
      const contentMatches = sql<number>`
        (
          ${sql.join(
        searchTerms.map(term =>
          sql`CASE WHEN (LOWER(${posts.title}) LIKE LOWER(${'%' + term + '%'}) 
                   OR LOWER(${posts.content}) LIKE LOWER(${'%' + term + '%'})) THEN 25 ELSE 0 END`
        ),
        sql` + `
      )}
        )
      `;

      relevanceScore = sql<number>`(${exactTagMatches} + ${partialTagMatches} + ${contentMatches})`;

      // Ajouter une condition pour filtrer les posts qui ont au moins un match
      const searchConditions = [
        // Match dans les tags
        sql`EXISTS (
          SELECT 1
          FROM ${searchedSkills} ss
          LEFT JOIN ${musicSkills} ms ON ss.skill_id = ms.id
          LEFT JOIN ${musicGenres} mg ON ss.genre_id = mg.id
          WHERE ss.post_id = ${posts.id}
          AND (
            ${sql.join(
          searchTerms.map(term =>
            sql`(LOWER(ms.skill_name) LIKE LOWER(${'%' + term + '%'}) 
                  OR LOWER(mg.genre_name) LIKE LOWER(${'%' + term + '%'}))`
          ),
          sql` OR `
        )}
          )
        )`,
        // Match dans le titre ou contenu
        or(...searchTerms.flatMap(term => [
          ilike(posts.title, `%${term}%`),
          ilike(posts.content, `%${term}%`)
        ]))!
      ];

      conditions.push(or(...searchConditions)!);
    }

    const allPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        createdAt: posts.createdAt,
        userId: posts.userId,
        userName: user.name,
        contactLink: profiles.contactLink,
        relevanceScore: relevanceScore.as('relevance_score'),
      })
      .from(posts)
      .leftJoin(user, eq(posts.userId, user.id))
      .leftJoin(profiles, eq(posts.userId, profiles.userId))
      .where(and(...conditions))
      .orderBy(
        searchTerms.length > 0 ? desc(sql`relevance_score`) : desc(posts.createdAt),
        desc(posts.createdAt),
        desc(posts.id)
      )
      .limit(limit)
      .offset(offset);

    // Retirer le score de pertinence avant de retourner les résultats
    return allPosts.map(({ relevanceScore, ...post }) => post);
  } catch (error) {
    console.error("Erreur lors de la récupération des posts:", error);
    return { error: "Erreur lors de la récupération des posts" };
  }
}
