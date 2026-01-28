"use client";

import { useState, useEffect } from "react";
import { User, X, Check, Plus, Minus, Trash2 } from "lucide-react";
import { createPost } from "@/app/actions/posts/createPost";
import { editPost } from "@/app/actions/posts/editPost";
import { addPostSkill } from "@/app/actions/posts/addPostSkill";
import { deleteSearchedSkill } from "@/app/actions/posts/deleteSearchedSkill";
import { getAllSkills } from "@/app/actions/skills/getAllSkills";
import { getAllGenres } from "@/app/actions/skills/getAllGenres";
import { createSkill } from "@/app/actions/skills/createSkill";
import { createGenre } from "@/app/actions/skills/createGenre";

interface PostEditorProps {
  isAuthenticated: boolean;
  userId?: string;
  onClose: () => void;
  onShowLogOptions: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
  existingPost?: {
    id: number;
    title: string;
    content: string;
  };
  existingSkills?: Array<{
    id: number;
    skillId: number;
    skillName: string | null;
    genreId: number | null;
    genreName: string | null;
  }>;
}

interface SearchedSkill {
  id: number;
  skillId: number;
  skillName: string | null;
  genreId: number | null;
  genreName: string | null;
  isNew?: boolean; // Ajout d'un flag pour identifier les nouveaux tags
}

interface Skill {
  id: number;
  skillName: string;
}

interface Genre {
  id: number;
  genreName: string;
}

export function PostEditor({
  isAuthenticated,
  userId,
  onClose,
  onShowLogOptions,
  onCancel,
  onDelete,
  existingPost,
  existingSkills = []
}: PostEditorProps) {
  const [title, setTitle] = useState(existingPost?.title || "");
  const [content, setContent] = useState(existingPost?.content || "");
  const [searchedSkills, setSearchedSkills] = useState<SearchedSkill[]>(existingSkills);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [availableGenres, setAvailableGenres] = useState<Genre[]>([]);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [customSkillName, setCustomSkillName] = useState("");
  const [customGenreName, setCustomGenreName] = useState("");
  const [showCustomSkillInput, setShowCustomSkillInput] = useState(false);
  const [showCustomGenreInput, setShowCustomGenreInput] = useState(false);
  const [skillsToDelete, setSkillsToDelete] = useState<number[]>([]);

  const isEditMode = !!existingPost;

  useEffect(() => {
    if (isAuthenticated) {
      loadAvailableSkills();
      loadAvailableGenres();
    }
  }, [isAuthenticated]);

  const loadAvailableSkills = async () => {
    const result = await getAllSkills();
    if (!("error" in result)) {
      setAvailableSkills(result as Skill[]);
    }
  };

  const loadAvailableGenres = async () => {
    const result = await getAllGenres();
    if (!("error" in result)) {
      setAvailableGenres(result as Genre[]);
    }
  };

  const handleSkillSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "add-new") {
      setShowCustomSkillInput(true);
      setSelectedSkillId(null);
    } else {
      setShowCustomSkillInput(false);
      setSelectedSkillId(value ? Number(value) : null);
    }
  };

  const handleGenreSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "add-new") {
      setShowCustomGenreInput(true);
      setSelectedGenreId(null);
    } else if (value === "none") {
      setShowCustomGenreInput(false);
      setSelectedGenreId(null);
    } else {
      setShowCustomGenreInput(false);
      setSelectedGenreId(value ? Number(value) : null);
    }
  };

  const handleCustomSkillInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomSkillName(value);

    const existingSkill = availableSkills.find(
      skill => skill.skillName.toLowerCase() === value.trim().toLowerCase()
    );

    if (existingSkill) {
      setSelectedSkillId(existingSkill.id);
      setShowCustomSkillInput(false);
      setCustomSkillName("");
    }
  };

  const handleCustomGenreInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomGenreName(value);

    const existingGenre = availableGenres.find(
      genre => genre.genreName.toLowerCase() === value.trim().toLowerCase()
    );

    if (existingGenre) {
      setSelectedGenreId(existingGenre.id);
      setShowCustomGenreInput(false);
      setCustomGenreName("");
    }
  };

  const handleAddSkill = async () => {
    if (searchedSkills.length >= 5) {
      alert("Vous ne pouvez ajouter que 5 tags maximum");
      return;
    }

    let skillId = selectedSkillId;
    let genreId = selectedGenreId;

    if (showCustomSkillInput && customSkillName.trim()) {
      const result = await createSkill(customSkillName);
      if ("error" in result) {
        alert(result.error);
        return;
      }
      skillId = result.skill!.id;
      await loadAvailableSkills();
    }

    if (showCustomGenreInput && customGenreName.trim()) {
      const result = await createGenre(customGenreName);
      if ("error" in result) {
        alert(result.error);
        return;
      }
      genreId = result.genre!.id;
      await loadAvailableGenres();
    }

    if (!skillId) {
      alert("Veuillez sélectionner ou créer une compétence");
      return;
    }

    const skillName = availableSkills.find(s => s.id === skillId)?.skillName || customSkillName;
    const genreName = genreId ? (availableGenres.find(g => g.id === genreId)?.genreName || null) : null;

    setSearchedSkills([
      ...searchedSkills,
      {
        id: Date.now(),
        skillId: skillId,
        skillName: skillName,
        genreId: genreId,
        genreName: genreName,
        isNew: true, // Marquer comme nouveau
      }
    ]);

    setShowAddSkill(false);
    setSelectedSkillId(null);
    setSelectedGenreId(null);
    setCustomSkillName("");
    setCustomGenreName("");
    setShowCustomSkillInput(false);
    setShowCustomGenreInput(false);
  };

  const handleDeleteSkill = async (index: number) => {
    const skill = searchedSkills[index];

    // Si le skill existe en DB (pas marqué comme nouveau), marquer pour suppression
    if (existingPost && !skill.isNew) {
      setSkillsToDelete([...skillsToDelete, skill.id]);
    }

    setSearchedSkills(searchedSkills.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!userId) return;

    if (!title.trim() || !content.trim()) {
      alert("Veuillez remplir le titre et le contenu");
      return;
    }

    let postId: number;

    if (isEditMode) {
      // Mode édition
      const editResult = await editPost(existingPost.id, title, content);
      if ("error" in editResult) {
        alert(editResult.error);
        return;
      }
      postId = existingPost.id;

      // Supprimer les skills marqués pour suppression
      for (const skillId of skillsToDelete) {
        await deleteSearchedSkill(skillId);
      }

      // Ajouter uniquement les nouveaux tags
      for (const skill of searchedSkills) {
        if (skill.isNew) {
          await addPostSkill(postId, skill.skillId, skill.genreId);
        }
      }
    } else {
      // Mode création
      const postResult = await createPost(userId, title, content);
      if ("error" in postResult) {
        alert(postResult.error);
        return;
      }
      postId = postResult.post!.id;

      // Ajouter tous les tags
      for (const skill of searchedSkills) {
        await addPostSkill(postId, skill.skillId, skill.genreId);
      }
    }

    setTitle("");
    setContent("");
    setSearchedSkills([]);
    setSkillsToDelete([]);
    onClose();
  };

  const handleLoginClick = () => {
    onShowLogOptions();
    onClose();
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed h-screen left-0 right-0 bottom-12 bg-white z-20 p-4 flex flex-col items-center justify-center gap-4">
        <p className="ml-10 mb-5 mr-10 text-center">Vous devez vous connecter pour poster une annonce</p>
        <button onClick={handleLoginClick} className="flex items-center gap-2">
          <User />
          Se connecter
        </button>
      </div>
    );
  }

  return (
    <div className={existingPost ? "" : "fixed top-12 left-0 right-0 bottom-12 bg-white z-20 p-4 overflow-y-auto"}>
      <div className="flex flex-col gap-2">
        <div className="border-none">
          <div className="border-none">
            <h2>Titre de l&apos;annonce</h2>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                if (e.target.value.length <= 100) {
                  setTitle(e.target.value);
                }
              }}
              placeholder="Titre de votre annonce"
              className="w-full p-2"
              maxLength={100}
            />
            <span className="text-sm text-gray-500">{title.length}/100</span>
          </div>
        </div>

        <div className="border-none">
          <h2>Description</h2>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Décrivez votre recherche de collaboration..."
            rows={6}
            className="w-full p-2"
          />
        </div>

        <div className="border-none flex flex-col gap-1">
          <h2>Vous recherchez ({searchedSkills.length}/5)</h2>
          {searchedSkills.map((skill, index) => (
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
              <button
                className="squareButtons"
                onClick={() => handleDeleteSkill(index)}
              >
                <Minus />
              </button>
            </div>
          ))}
          {showAddSkill ? (
            <div className="flex flex-col gap-1">
              <select
                className="w-full p-2"
                value={selectedSkillId || ""}
                onChange={handleSkillSelectChange}
              >
                <option value="">-- Sélectionner --</option>
                <option value="add-new">+ Ajouter une compétence</option>
                {availableSkills.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.skillName}
                  </option>
                ))}
              </select>
              {showCustomSkillInput && (
                <input
                  type="text"
                  className="w-full"
                  placeholder="Nom de la compétence"
                  value={customSkillName}
                  onChange={handleCustomSkillInput}
                />
              )}
              <select
                className="w-full p-2"
                value={selectedGenreId || "none"}
                onChange={handleGenreSelectChange}
                disabled={!selectedSkillId && !showCustomSkillInput}
              >
                <option value="none">Pas de genre</option>
                <option value="add-new">+ Ajouter un genre</option>
                {availableGenres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.genreName}
                  </option>
                ))}
              </select>
              {showCustomGenreInput && (
                <input
                  type="text"
                  className="w-full p-2"
                  placeholder="Nom du genre"
                  value={customGenreName}
                  onChange={handleCustomGenreInput}
                />
              )}
              <div className="flex gap-1 justify-evenly border-none">
                <button
                  className="squareButtons"
                  onClick={handleAddSkill}
                >
                  <Check />
                </button>
                <button
                  className="squareButtons"
                  onClick={() => {
                    setShowAddSkill(false);
                    setSelectedSkillId(null);
                    setSelectedGenreId(null);
                    setCustomSkillName("");
                    setCustomGenreName("");
                    setShowCustomSkillInput(false);
                    setShowCustomGenreInput(false);
                  }}
                >
                  <X />
                </button>
              </div>
            </div>
          ) : (
            <button
              className="squareButtons"
              onClick={() => setShowAddSkill(true)}
              disabled={searchedSkills.length >= 5}
            >
              <Plus />
            </button>
          )}
        </div>

        {existingPost ? (
          <div className="border-none p-0 flex justify-evenly">
            <button className="squareButtons" onClick={handleSubmit}>
              <Check />
            </button>
            <button className="squareButtons" onClick={onCancel}>
              <X />
            </button>
            <button className="squareButtons" onClick={onDelete}>
              <Trash2 />
            </button>
          </div>
        ) : (
          <button onClick={handleSubmit}>
            Publier l'annonce
          </button>
        )}
      </div>
    </div>
  );
}