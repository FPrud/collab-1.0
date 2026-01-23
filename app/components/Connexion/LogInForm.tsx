"use client";

import { logIn } from "@/app/actions/connection/logIn";
import { useState } from "react";

export const LogInForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData(e.currentTarget);
            const result = await logIn(formData);
            
            if (result?.success) {
                window.location.href = "/";
            } else if (result?.error) {
                setError(result.error);
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            setError("Une erreur est survenue");
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col">
            <label htmlFor="email">E-mail</label>
            <input name="email" type="email" required />
            <label htmlFor="password">Mot de passe</label>
            <input name="password" type="password" required />
            {error && <p>{error}</p>}
            <button type="submit" disabled={isLoading}>
                {isLoading ? "Connexion en cours..." : "Se connecter"}
            </button>
        </form>
    );
};