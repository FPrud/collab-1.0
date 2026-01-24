"use client";

import { logIn } from "@/app/actions/connection/logIn";
import { signUp } from "@/app/actions/connection/signUp";
import { useState } from "react";
import { User, UserPlus } from "lucide-react";

type TabType = "login" | "signup";

export const LogOptions = () => {
    const [activeTab, setActiveTab] = useState<TabType>("login");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    const toggleTab = () => {
        setActiveTab(activeTab === "login" ? "signup" : "login");
        setError(null);
    };

    return (
        <div className="flex flex-col justify-center">
            <button
                onClick={toggleTab}
                className="flex items-center"
            >
                {activeTab === "login" ? (
                    <>
                        <span>Créer un compte</span>
                        <UserPlus />
                    </>
                ) : (
                    <>
                        <span>Se connecter</span>
                        <User />
                    </>
                )}
            </button>
            {activeTab === "login" ? (
                <form onSubmit={handleLoginSubmit} className="flex flex-col">
                    <label htmlFor="email">E-mail</label>
                    <input name="email" type="email" required />
                    <label htmlFor="password">Mot de passe</label>
                    <input name="password" type="password" required />
                    {error && <p>{error}</p>}
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Connexion en cours..." : "Se connecter"}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleSignupSubmit} className="flex flex-col">
                    <label htmlFor="name">Nom d'artiste</label>
                    <input name="name" type="text" required />
                    <label htmlFor="email">E-mail</label>
                    <input name="email" type="email" required />
                    <label htmlFor="password">Mot de passe</label>
                    <input name="password" type="password" required />
                    {error && <p>{error}</p>}
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Inscription en cours..." : "Créer un compte"}
                    </button>
                </form>
            )}
        </div>
    );
};