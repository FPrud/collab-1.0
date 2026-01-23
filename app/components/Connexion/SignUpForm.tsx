"use client";

import { signUp } from "@/app/actions/connection/signUp";
import { useState } from "react";

export const SignUpForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData(e.currentTarget);
            const result = await signUp(formData);
            
            if (result?.success) {
                window.location.href = "/";
            }
        } catch (error: any) {
            console.error("Erreur lors de l'inscription :", error);
            setError(error.message || "Une erreur est survenue");
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col">
            <label htmlFor="name">Nom d'artiste</label>
            <input name="name" type="text" required />
            <label htmlFor="email">E-mail</label>
            <input name="email" type="email" required />
            <label htmlFor="password">Mot de passe</label>
            <input name="password" type="password" required />
            {error && <p>{error}</p>}
            <button type="submit" disabled={isLoading}>
                {isLoading ? "Inscription en cours..." : "S'inscrire"}
            </button>
        </form>
    );
};