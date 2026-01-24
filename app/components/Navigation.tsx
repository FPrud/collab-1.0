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
            <nav className="fixed bottom-0 right-0 left-0 z-10">
                <div id="navigation-links" className="flex justify-around flex-wrap">
                    {isAuthenticated ? (
                        <>
                            <Link href="/">
                                <div className="h-9 w-9">
                                    <AudioWaveform />
                                </div>
                            </Link>
                            <div className="h-9 w-9">
                                <Plus />
                            </div>
                            <Link href={`/profile/${userId}`}>
                                <div className="h-9 w-9">
                                    <User />
                                </div>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/">
                                <div className="h-9 w-9">
                                    <AudioWaveform className="self-center" />
                                </div>
                            </Link>
                            <div className="h-9 w-9 cursor-not-allowed">
                                <Plus className="self-center" />
                            </div>
                            <button onClick={handleShowLogOptions} className="h-9 w-9">
                                <User />
                            </button>
                        </>
                    )}
                </div>
            </nav>
            {showLogOptions && <LogOptions />}
        </>
    );
};