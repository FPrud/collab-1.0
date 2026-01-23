"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { SignUpForm } from "./Connexion/SignUpForm";
import { LogInForm } from "./Connexion/LogInForm";
import { LogOutButton } from "./Connexion/LogOutButton";

interface NavigationProps {
    isAuthenticated: boolean;
    userId?: string;
}

export const Navigation = ({ isAuthenticated, userId }: NavigationProps) => {
    const [showSignup, setShowSignup] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        console.log("Navigation - isAuthenticated:", isAuthenticated);
    }, [isAuthenticated]);

    const handleShowSignup = () => {
        setShowSignup(!showSignup);
        setShowLogin(false);
    };

    const handleShowLogin = () => {
        setShowLogin(!showLogin);
        setShowSignup(false);
    };

    return (
        <>
            <nav>
                <Link href="/"><h1 id="title" className="flex justify-center">Collab'</h1></Link>
                <div id="navigation-links" className="flex justify-center flex-wrap">
                    {isAuthenticated ? (
                        <>
                            <Link href={`/profile/${userId}`}>
                                <button>Profil</button>
                            </Link>
                            <button>Créer une annonce</button>
                            <LogOutButton />
                        </>
                    ) : (
                        <>
                            <button onClick={handleShowLogin}>
                                Connexion
                            </button>
                            <button onClick={handleShowSignup}>
                                Créer un compte
                            </button>
                        </>
                    )}

                    <div id="searchbar" className="flex justify-center">
                        <input type="text" placeholder="Cherchez un tag" />
                        <button>Recherche</button>
                    </div>
                </div>

            </nav>
            {showLogin && <LogInForm />}
            {showSignup && <SignUpForm />}
        </>
    );
};