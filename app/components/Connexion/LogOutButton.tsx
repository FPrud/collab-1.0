"use client";

import { logOut } from "@/app/actions/connection/logOut";
import { LucideLogOut } from "lucide-react";
import { useState } from "react";

export const LogOutButton = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);

        try {
            const result = await logOut();
            if (result?.success) {
                window.location.href = "/";
            }
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
            setIsLoading(false);
        }
    };

    return (
        <button onClick={handleLogout} className="h-9 w-9 justify-center items-center" disabled={isLoading}>
            {isLoading ? "Déconnexion..." : <LucideLogOut />}
        </button>
    );
};