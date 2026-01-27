"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DisplayPost } from "./DisplayPost";
import { PostEditor } from "./PostEditor";
import { deletePost } from "@/app/actions/posts/deletePost";

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  userId: string;
  userName: string | null;
  contactLink: string | null;
}

interface SearchedSkill {
  id: number;
  skillId: number;
  skillName: string | null;
  genreId: number | null;
  genreName: string | null;
}

interface PostManagerProps {
  post: Post;
  searchedSkills: SearchedSkill[];
  isAuthor: boolean;
  currentUserId?: string;
}

export function PostManager({ 
  post, 
  searchedSkills, 
  isAuthor,
  currentUserId 
}: PostManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

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

  const handleDelete = async () => {
    if (!currentUserId) return;

    const confirmed = confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?");
    if (!confirmed) return;

    const result = await deletePost(post.id, currentUserId);
    
    if ("error" in result) {
      alert(result.error);
      return;
    }

    // Rediriger vers la page d'accueil après suppression
    router.push("/");
  };

  return (
    <>
      {isEditing ? (
        <PostEditor
          isAuthenticated={!!currentUserId}
          userId={currentUserId}
          onClose={handleSave}
          onCancel={handleCancel}
          onDelete={handleDelete}
          onShowLogOptions={() => {}}
          existingPost={{
            id: post.id,
            title: post.title,
            content: post.content
          }}
          existingSkills={searchedSkills}
        />
      ) : (
        <DisplayPost
          post={post}
          searchedSkills={searchedSkills}
          showFullContent={true}
          isAuthor={isAuthor}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}