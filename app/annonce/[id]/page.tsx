import { getPostById } from "@/app/actions/posts/getPostById";
import { getPostSkills } from "@/app/actions/skills/getPostSkills";
import { notFound } from "next/navigation";
import { DisplayPost } from "@/app/components/Posts/DisplayPost";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = parseInt(id);

  if (isNaN(postId)) {
    notFound();
  }

  const postResult = await getPostById(postId);

  if ("error" in postResult) {
    notFound();
  }

  const post = postResult;
  const searchedSkillsResult = await getPostSkills(postId);
  const searchedSkills = "error" in searchedSkillsResult ? [] : searchedSkillsResult;

  return (
    <main id="" className="p-2">
      <DisplayPost
        post={post}
        searchedSkills={searchedSkills}
        showFullContent={true}
      />
    </main>
  );
}