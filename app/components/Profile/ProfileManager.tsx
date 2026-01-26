"use client";

import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { DisplayUserCard } from "./DisplayUserCard";
import { EditUserInfos } from "./EditUserInfos";
import { useRouter } from "next/navigation";
import { LogOutButton } from "../Connection/LogOutButton";

interface ProfileManagerProps {
    userId: string;
    profileData: {
        name: string;
        bio: string | null;
        birthdate: string | null;
        address: string | null;
        contactLink: string | null;
    };
}

export function ProfileManager({ userId, profileData }: ProfileManagerProps) {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const handleSave = () => {
        setIsEditing(false);
        router.refresh();
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleButtonClick = () => {
        if (isEditing) {
            document.getElementById('submitBtn')?.click();
        } else {
            setIsEditing(true);
        }
    };

    return (
        <>
            {isEditing ? (
                <EditUserInfos
                    userId={userId}
                    name={profileData.name}
                    bio={profileData.bio}
                    birthdate={profileData.birthdate}
                    address={profileData.address}
                    contactLink={profileData.contactLink}
                    onSave={handleSave}
                />
            ) : (
                <DisplayUserCard
                    name={profileData.name}
                    bio={profileData.bio}
                    birthdate={profileData.birthdate}
                    address={profileData.address}
                    contactLink={profileData.contactLink}
                />
            )}
            <div id="userOptions" className="flex border-none justify-evenly">
                <button
                    className="h-9 w-9 justify-center items-center"
                    onClick={handleButtonClick}
                >
                    {isEditing ? <Check /> : <Pencil />}
                </button>
                {isEditing ? (
                    <button
                        className="h-9 w-9 justify-center items-center"
                        onClick={handleCancel}
                    >
                        <X />
                    </button>
                ) : (
                    <LogOutButton />
                )}
            </div>
        </>
    );
}