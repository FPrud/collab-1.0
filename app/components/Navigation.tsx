"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { LogOptions } from "./Connection/LogOptions";
import { CreatePost } from "./Posts/CreatePost";
import { AudioWaveform, Plus, User, X } from "lucide-react";

interface NavigationProps {
    isAuthenticated: boolean;
    userId?: string;
}

export const Navigation = ({ isAuthenticated, userId }: NavigationProps) => {
    const [showLogOptions, setShowLogOptions] = useState(false);
    const [showCreatePost, setShowCreatePost] = useState(false);

    useEffect(() => {
        console.log("Navigation - isAuthenticated:", isAuthenticated);
    }, [isAuthenticated]);

    const handleShowLogOptions = () => {
        setShowLogOptions(!showLogOptions);
        setShowCreatePost(false);
    };

    const handleShowCreatePost = () => {
        setShowCreatePost(!showCreatePost);
        setShowLogOptions(false);
    };

    return (
        <>
            <nav className="fixed bottom-0 right-0 left-0 z-10 h-12 bg-emerald-100">
                <div id="navigation-links" className="flex justify-around flex-wrap">
                    <Link href="/">
                        <div className="squareButtons">
                            <AudioWaveform />
                        </div>
                    </Link>
                    {isAuthenticated ? (
                        <>
                            <button onClick={handleShowCreatePost} className="squareButtons">
                                {showCreatePost ? <X /> : <Plus />}
                            </button>
                            <Link href={`/profil/${userId}`}>
                                <div className="squareButtons">
                                    <User />
                                </div>
                            </Link>
                        </>
                    ) : (
                        <>
                            <button onClick={handleShowCreatePost} className="squareButtons">
                                {showCreatePost ? <X /> : <Plus />}
                            </button>
                            <button onClick={handleShowLogOptions} className="squareButtons">
                                <User />
                            </button>
                        </>
                    )}
                </div>
            </nav>
            {showLogOptions && <LogOptions onClose={() => setShowLogOptions(false)} />}
            {showCreatePost && (
                <CreatePost
                    isAuthenticated={isAuthenticated}
                    userId={userId}
                    onClose={() => setShowCreatePost(false)}
                    onShowLogOptions={handleShowLogOptions}
                />
            )}
        </>
    );
};

// Ajoutez cette fonction exportée pour vérifier si un overlay est actif
export const useNavigationState = () => {
    return { showLogOptions: false, showCreatePost: false };
};