"use client";

import { useState, useEffect } from "react";
import { DisplayUserInfos } from "./DisplayUserInfos";
import { EditUserInfos } from "./EditUserInfos";
import { useRouter, useSearchParams } from "next/navigation";

interface ProfileManagerProps {
    userId: string;
    profileData: {
        name: string;
        bio: string | null;
        birthdate: string | null;
        address: string | null;
        contactLink: string | null;
    };
    isOwnProfile: boolean;
}

export function ProfileManager({ userId, profileData, isOwnProfile }: ProfileManagerProps) {
    const searchParams = useSearchParams();
    const [isEditing, setIsEditing] = useState(searchParams.get('edit') === 'true' && isOwnProfile);
    const router = useRouter();

    useEffect(() => {
        if (searchParams.get('edit') === 'true' && isOwnProfile) {
            router.replace(`/profil/${userId}`);
        }
    }, [searchParams, isOwnProfile, router, userId]);

    const handleSave = () => {
        setIsEditing(false);
        router.refresh();
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleEdit = () => {
        setIsEditing(true);
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
                    onCancel={handleCancel}
                />
            ) : (
                <DisplayUserInfos
                    userId={userId}
                    name={profileData.name}
                    bio={profileData.bio}
                    birthdate={profileData.birthdate}
                    address={profileData.address}
                    contactLink={profileData.contactLink}
                    isOwnProfile={isOwnProfile}
                    onEdit={handleEdit}
                />
            )}
        </>
    );
}