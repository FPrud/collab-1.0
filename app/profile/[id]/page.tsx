import { getProfile } from "@/app/actions/profile/getProfile";
import { LogOutButton } from "@/app/components/Connexion/LogOutButton";
import { ProfileManager } from "@/app/components/Profile/ProfileManager";
import { notFound } from "next/navigation";
import { use } from "react";

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id: userId } = use(params);
    const profileData = use(getProfile(userId));

    if ('error' in profileData) {
        notFound();
    }

    return (
        <main className="flex flex-col p-5">
            <ProfileManager userId={userId} profileData={profileData} />
        </main>
    );
}