import { getProfile } from "@/app/actions/profile/getProfile";
import { LogOutButton } from "@/app/components/Connexion/LogOutButton";
import { notFound } from "next/navigation";
import { use } from "react";

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id: userId } = use(params);
    const profileData = use(getProfile(userId));

    if ('error' in profileData) {
        notFound();
    }

    return (
        <main>
            <div id="userInfos">
                <h1>{profileData.name}</h1>

                {profileData.address && (
                    <p>Adresse de géolocalisation : {profileData.address}</p>
                )}
                {profileData.birthdate && (
                    <p>Âge : {new Date(profileData.birthdate).toLocaleDateString('fr-FR')}</p>
                )}
                {profileData.bio && (
                    <p>Bio : {profileData.bio}</p>
                )}
                {profileData.contactLink && (
                    <a target="_blank" href={profileData.contactLink}>Me contacter</a>
                )}
            </div>
            <LogOutButton />
        </main>
    );
}