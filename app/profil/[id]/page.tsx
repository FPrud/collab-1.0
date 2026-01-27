import { getProfile } from "@/app/actions/profile/getProfile";
import { ProfileManager } from "@/app/components/Profile/ProfileManager";
import { DisplayMultiplePosts } from "@/app/components/Posts/DisplayMultiplePosts";
import { notFound } from "next/navigation";
import { auth } from "@/src/auth";
import { headers } from "next/headers";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id: userId } = await params;
    const profileData = await getProfile(userId);

    if ('error' in profileData) {
        notFound();
    }

    const session = await auth.api.getSession({
        headers: await headers()
    });

    const currentUserId = session?.user?.id;
    const isOwnProfile = currentUserId === userId;

    return (
        <main className="flex flex-col p-2">
            <ProfileManager
                userId={userId}
                profileData={profileData}
                isOwnProfile={isOwnProfile}
            />
            
            <section className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Annonces de {profileData.name}</h2>
                <DisplayMultiplePosts userId={userId} />
            </section>
        </main>
    );
}