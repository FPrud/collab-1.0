"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LogOptions } from "./Connection/LogOptions";
import { PostEditor } from "./Posts/PostEditor";
import { AudioWaveform, Plus, User, X } from "lucide-react";

interface NavigationProps {
    isAuthenticated: boolean;
    userId?: string;
}

export const Navigation = ({ isAuthenticated, userId }: NavigationProps) => {
    const [showLogOptions, setShowLogOptions] = useState(false);
    const [showPostEditor, setShowPostEditor] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        console.log("Navigation - isAuthenticated:", isAuthenticated);
    }, [isAuthenticated]);

    const handleShowLogOptions = () => {
        setShowLogOptions(!showLogOptions);
        setShowPostEditor(false);
    };

    const handleShowPostEditor = () => {
        setShowPostEditor(!showPostEditor);
        setShowLogOptions(false);
    };

    const handleHomeClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (pathname === "/") {
            // Si déjà sur la home, réinitialiser la recherche et scroller vers la SearchBar
            router.push("/?reset=true");
        } else {
            // Sinon, navigation normale vers home avec ancre
            router.push("/?reset=true");
        }
    };

    return (
        <>
            <nav className="fixed bottom-0 right-0 left-0 z-10 h-12">
                <div id="navigation-links" className="flex justify-around h-full items-center">
                    <button onClick={handleHomeClick} id="homeButton" className="squareButtons">
                        <AudioWaveform />
                    </button>
                    {isAuthenticated ? (
                        <>
                            <button onClick={handleShowPostEditor} className="squareButtons">
                                {showPostEditor ? <X /> : <Plus />}
                            </button>
                            <Link href={`/profil/${userId}`}>
                                <div className="squareButtons">
                                    <User />
                                </div>
                            </Link>
                        </>
                    ) : (
                        <>
                            <button onClick={handleShowPostEditor} className="squareButtons">
                                {showPostEditor ? <X /> : <Plus />}
                            </button>
                            <button onClick={handleShowLogOptions} className="squareButtons">
                                <User />
                            </button>
                        </>
                    )}
                </div>
            </nav>
            {showLogOptions && <LogOptions onClose={() => setShowLogOptions(false)} />}
            {showPostEditor && (
                <PostEditor
                    isAuthenticated={isAuthenticated}
                    userId={userId}
                    onClose={() => setShowPostEditor(false)}
                    onShowLogOptions={handleShowLogOptions}
                />
            )}
        </>
    );
};

export const useNavigationState = () => {
    return { showLogOptions: false, showPostEditor: false };
};