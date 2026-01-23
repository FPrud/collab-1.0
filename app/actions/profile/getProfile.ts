"use server";

import { db } from "@/src/db";
import { user, profiles } from "@/src/schema";
import { eq } from "drizzle-orm";

export async function getProfile(userId: string) {
    try {
        const userProfile = await db
            .select({
                name: user.name,
                birthdate: profiles.birthdate,
                address: profiles.address,
                bio: profiles.bio,
                contactLink: profiles.contactLink,
            })
            .from(user)
            .leftJoin(profiles, eq(user.id, profiles.userId))
            .where(eq(user.id, userId));

        if (userProfile.length === 0) {
            return { error: "Utilisateur non trouvé" };
        }

        return userProfile[0];
    } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        return { error: "Erreur lors de la récupération du profil" };
    }
}