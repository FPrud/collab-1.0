"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { LogOptions } from "./Connection/LogOptions";
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
            <nav className="fixed bottom-0 right-0 left-0 z-10 h-12 bg-emerald-100">
                <div id="navigation-links" className="flex justify-around flex-wrap">
                    {isAuthenticated ? (
                        <>
                            <Link href="/">
                                <div className="squareButtons">
                                    <AudioWaveform />
                                </div>
                            </Link>
                            <div className="squareButtons">
                                <Plus />
                            </div>
                            <Link href={`/profile/${userId}`}>
                                <div className="squareButtons">
                                    <User />
                                </div>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/">
                                <div className="squareButtons">
                                    <AudioWaveform className="self-center" />
                                </div>
                            </Link>
                            <div className="squareButtons cursor-not-allowed">
                                <Plus className="self-center" />
                            </div>
                            <button onClick={handleShowLogOptions} className="squareButtons">
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