import { getPostById } from "@/app/actions/posts/getPostById";
import { getPostSkills } from "@/app/actions/skills/getPostSkills";
import { notFound } from "next/navigation";
import { PostManager } from "@/app/components/Posts/PostManager";
import { auth } from "@/src/auth";
import { headers } from "next/headers";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = parseInt(id);

  if (isNaN(postId)) {
    notFound();
  }

  const session = await auth.api.getSession({
    headers: await headers()
  });

  const currentUserId = session?.user?.id;

  const postResult = await getPostById(postId);

  if ("error" in postResult) {
    notFound();
  }

  const post = postResult;
  const searchedSkillsResult = await getPostSkills(postId);
  const searchedSkills = "error" in searchedSkillsResult ? [] : searchedSkillsResult;

  const isAuthor = currentUserId === post.userId;

  return (
    <main className="p-2">
      <PostManager
        post={post}
        searchedSkills={searchedSkills}
        isAuthor={isAuthor}
        currentUserId={currentUserId}
      />
    </main>
  );
}