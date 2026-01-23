"use server";

import { auth } from "@/src/auth";
import { db } from "@/src/db";
import { profiles } from "@/src/schema";
import { redirect } from "next/navigation";


export const signUp = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
        throw Error("Artist name, email and password are required");
    }

    const response = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password
        },
        asResponse: true
    });

    if (!response.ok) {
        console.error("Sign up failed: no user");
        throw new Error("Inscription échouée");
    }

    // Récupérer les données de la réponse
    const data = await response.json();
    const userId = data.user?.id;

    if (!userId) {
        throw Error("Failed to retrieve user ID");
    }

    // Créer un profil vide pour le nouvel utilisateur
    await db.insert(profiles).values({
        userId: userId,
        address: null,
        birthdate: null,
        bio: null,
        contactLink: null
    });

    redirect("/");
};