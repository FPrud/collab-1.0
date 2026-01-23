import { getProfile } from "@/app/actions/profile/getProfile";
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
                <div>
                    <h1>{profileData.name}</h1>
                </div>
                {profileData.address && (
                    <div>
                        <p>{profileData.address}</p>
                    </div>
                )}
                {profileData.birthdate && (
                    <div>
                        <p>{new Date(profileData.birthdate).toLocaleDateString('fr-FR')}</p>
                    </div>
                )}
                {profileData.bio && (
                    <div>
                        <p>{profileData.bio}</p>
                    </div>
                )}
                {profileData.contactLink && (
                    <div>
                        <a href={profileData.contactLink}>{profileData.contactLink}</a>
                    </div>
                )}
            </div>
            <div id="userPosts">
            </div>
        </main>
    );
}