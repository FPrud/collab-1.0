import { getPostById } from "@/app/actions/posts/getPostById";
import { getPostSkills } from "@/app/actions/skills/getPostSkills";
import { notFound } from "next/navigation";
import Link from "next/link";

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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

  const isEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const getContactHref = (contactLink: string) => {
    if (isEmail(contactLink)) {
      return `mailto:${contactLink}`;
    }
    return contactLink.startsWith("http") ? contactLink : `https://${contactLink}`;
  };

  return (
    <div className="gap-2">
      <div className="border-none">
        <h2>{post.title}</h2>
      </div>

      <div className="border-none">
        <p>{post.userName}</p>
        <p>{formatDate(post.createdAt)}</p>
      </div>

      <div className="border-none">
        <p>{post.content}</p>
      </div>

      {searchedSkills.length > 0 && (
        <div className="border-none flex flex-col gap-1">
          <h2>Recherche</h2>
          {searchedSkills.map((skill) => (
            <div key={skill.id} className="flex justify-between border-none p-0">
              <div className="flex gap-1 justify-center align-middle">
                <span>{skill.skillName}</span>
                {skill.genreName && (
                  <>
                    <span>~</span>
                    <span>{skill.genreName}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Link href={`/profil/${post.userId}`}>
        <button>Voir le profil</button>
      </Link>
      
      {post.contactLink && (
        <a
          href={getContactHref(post.contactLink)}
          target={isEmail(post.contactLink) ? undefined : "_blank"}
          rel={isEmail(post.contactLink) ? undefined : "noopener noreferrer"}
        >
          <button>Contacter</button>
        </a>
      )}
    </div>
  );
}