import { getProfile } from "@/app/actions/profile/getProfile";
import { LogOutButton } from "@/app/components/Connexion/LogOutButton";
import { Pencil } from "lucide-react";
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
            <div id="userInfosContainer" className="gap-2 m-5">
                <div id="topLine" className="flex justify-between">
                    <div id="artistName" className="flex flex-wrap">
                        <h1>{profileData.name}</h1></div>
                    <button className="h-9 w-9 justify-center items-center">
                        <Pencil />
                    </button>
                </div>
                {profileData.bio && (
                    <div id="userBio">
                        <h2>Bio : </h2><p>{profileData.bio}</p>
                    </div>
                )}
                {profileData.birthdate && (
                    <div id="userAge">
                        <h2>Âge : </h2><p>{new Date(profileData.birthdate).toLocaleDateString('fr-FR')}</p>
                    </div>
                )}
                {profileData.address && (
                    <div id="userAddress">
                        <h2>Adresse : </h2><p>{profileData.address}</p>
                    </div>
                )}
                {profileData.contactLink && (
                    <a target="_blank" href={profileData.contactLink}><button>Me contacter</button></a>
                )}
            </div>
            <LogOutButton />
        </main>
    );
}