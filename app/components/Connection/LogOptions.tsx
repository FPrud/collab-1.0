"use client";

import { logIn } from "@/app/actions/connection/logIn";
import { signUp } from "@/app/actions/connection/signUp";
import { useState } from "react";
import { LogIn, User, UserPlus, X } from "lucide-react";

type TabType = "login" | "signup";

interface LogOptionsProps {
    onClose: () => void;
}

export const LogOptions = ({ onClose }: LogOptionsProps) => {
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

            if (result?.success && result.userId) {
                window.location.href = `/profil/${result.userId}?edit=true`;
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
        <div className="fixed top-12 left-0 right-0 bottom-12 bg-white z-20 p-4 flex flex-col justify-center">
            <div id="logOptionsContainer" className="flex flex-col gap-2 m-5">
                <button
                    onClick={toggleTab}
                    className="flex items-center gap-2"
                >
                    {activeTab === "login" ? (
                        <>
                            <UserPlus />
                            <span>Créer un compte</span>
                        </>
                    ) : (
                        <>
                            <User />
                            <span>Se connecter</span>
                        </>
                    )}
                </button>
                {activeTab === "login" ? (
                    <form onSubmit={handleLoginSubmit} className="flex flex-col gap-2">
                        <label htmlFor="email" hidden>E-mail</label>
                        <input name="email" type="email" placeholder="E-mail" required className="text-center"/>
                        <label htmlFor="password" hidden>Mot de passe</label>
                        <input name="password" type="password" placeholder="Mot de passe" required />
                        {error && <p>{error}</p>}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2">
                            {isLoading ? "Connexion en cours..." : (
                                <>
                                    <LogIn />
                                    <span>Se connecter</span>
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSignupSubmit} className="flex flex-col gap-2">
                        <label htmlFor="name" hidden>Nom d'artiste</label>
                        <input name="name" type="text" placeholder="Nom d'artiste" required />
                        <label htmlFor="email" hidden>E-mail</label>
                        <input name="email" type="email" placeholder="E-mail" required />
                        <label htmlFor="password" hidden>Mot de passe</label>
                        <input name="password" type="password" placeholder="Mot de passe" required />
                        {error && <p>{error}</p>}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2">
                            {isLoading ? "Inscription en cours..." : (
                                <>
                                    <LogIn />
                                    <span>Créer un compte</span>
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};