"use server";

import { auth } from "@/src/auth";
import { redirect } from "next/navigation";

export const logIn = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Email et mot de passe requis" };
    }

    const response = await auth.api.signInEmail({
        body: {
            email,
            password
        },
        asResponse: true
    });

    if (!response.ok) {
        console.error("Sign in failed:", await response.json());
        redirect("/");
    }
}