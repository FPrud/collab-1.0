"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { LogOptions } from "./Connexion/LogOptions";
import { LogOutButton } from "./Connexion/LogOutButton";
import { AudioWaveform, Plus, User } from "lucide-react";

interface NavigationProps {
    isAuthenticated: boolean;
    userId?: string;
}

export const Navigation = ({ isAuthenticated, userId }: NavigationProps) => {
    const [showLogOptions, setShowLogOptions] = useState(false);

    useEffect(() => {
        console.log("Navigation - isAuthenticated:", isAuthenticated);
    }, [isAuthenticated]);

    const handleShowLogOptions = () => {
        setShowLogOptions(!showLogOptions);
    };

    return (
        <>
            <Link href="/"><h1 id="title" className="flex justify-center">Co<AudioWaveform />ab'</h1></Link>
            <nav className="fixed bottom-0 right-0 left-0 z-10">
                <div id="navigation-links" className="flex justify-around flex-wrap">
                    {isAuthenticated ? (
                        <>
                            <Link href="/">
                                <div className="flex flex-col text-center items-center">
                                    <AudioWaveform className="self-center" />
                                </div>
                            </Link>
                            <Link href={`/profile/${userId}`}>
                                <div className="flex flex-col text-center items-center">
                                    <User className="self-center" />
                                </div>
                            </Link>
                            <div className="flex flex-col text-center items-center">
                                <Plus className="self-center" />
                            </div>
                        </>
                    ) : (
                        <>
                            <Link href="/">
                                <div className="flex flex-col text-center items-center">
                                    <AudioWaveform className="self-center" />
                                    <span>Annonces</span>
                                </div>
                            </Link>
                            <button onClick={handleShowLogOptions} className="flex flex-col text-center items-center">
                                <User />
                                <span>Connexion</span>
                            </button>
                        </>
                    )}
                </div>
            </nav>
            {showLogOptions && <LogOptions />}
        </>
    );
};