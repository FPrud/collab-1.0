"use client";

import { editProfileData } from "@/app/actions/profile/editProfile";
import { getUserSkills } from "@/app/actions/skills/getUserSkills";
import { getAllSkills } from "@/app/actions/skills/getAllSkills";
import { getAllGenres } from "@/app/actions/skills/getAllGenres";
import { createSkill } from "@/app/actions/skills/createSkill";
import { createGenre } from "@/app/actions/skills/createGenre";
import { addProfileSkill } from "@/app/actions/profile/addProfileSkill";
import { deleteProfileSkill } from "@/app/actions/profile/deleteProfileSkill";
import { Check, Minus, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";

interface EditUserInfosProps {
    userId: string;
    name: string;
    bio: string | null;
    birthdate: string | null;
    address: string | null;
    contactLink: string | null;
    onSave: () => void;
    onCancel: () => void;
}

interface UserSkill {
    id: number;
    skillId: number;
    skillName: string | null;
    genreId: number | null;
    genreName: string | null;
}

interface Skill {
    id: number;
    skillName: string;
}

interface Genre {
    id: number;
    genreName: string;
}

export function EditUserInfos({
    userId,
    name,
    bio,
    birthdate,
    address,
    contactLink,
    onSave,
    onCancel
}: EditUserInfosProps) {
    const [formData, setFormData] = useState({
        name: name || "",
        bio: bio || "",
        birthdate: birthdate || "",
        address: address || "",
        contactLink: contactLink || "",
    });

    const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
    const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
    const [availableGenres, setAvailableGenres] = useState<Genre[]>([]);
    const [showAddSkill, setShowAddSkill] = useState(false);
    const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);
    const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
    const [customSkillName, setCustomSkillName] = useState("");
    const [customGenreName, setCustomGenreName] = useState("");
    const [showCustomSkillInput, setShowCustomSkillInput] = useState(false);
    const [showCustomGenreInput, setShowCustomGenreInput] = useState(false);

    useEffect(() => {
        loadUserSkills();
        loadAvailableSkills();
        loadAvailableGenres();
    }, []);

    const loadUserSkills = async () => {
        const result = await getUserSkills(userId);
        if (!("error" in result)) {
            setUserSkills(result as UserSkill[]);
        }
    };

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
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

        // Vérifier si le skill existe déjà (insensible à la casse)
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

        // Vérifier si le genre existe déjà (insensible à la casse)
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
        let skillId = selectedSkillId;
        let genreId = selectedGenreId;

        // Créer le skill s'il est personnalisé
        if (showCustomSkillInput && customSkillName.trim()) {
            const result = await createSkill(customSkillName);
            if ("error" in result) {
                alert(result.error);
                return;
            }
            skillId = result.skill!.id;
            await loadAvailableSkills();
        }

        // Créer le genre s'il est personnalisé
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

        const result = await addProfileSkill(userId, skillId, genreId);
        if ("error" in result) {
            alert(result.error);
            return;
        }

        // Réinitialiser le formulaire
        setShowAddSkill(false);
        setSelectedSkillId(null);
        setSelectedGenreId(null);
        setCustomSkillName("");
        setCustomGenreName("");
        setShowCustomSkillInput(false);
        setShowCustomGenreInput(false);

        // Recharger les skills
        await loadUserSkills();
    };

    const handleDeleteSkill = async (userSkillId: number) => {
        const result = await deleteProfileSkill(userId, userSkillId);
        if ("error" in result) {
            alert(result.error);
            return;
        }
        await loadUserSkills();
    };

    const handleSubmit = async () => {
        for (const [field, value] of Object.entries(formData)) {
            await editProfileData(userId, field, value || null);
        }
        onSave();
    };

    return (
        <>
            <div id="editUserCard" className="gap-2">
                <div id="editArtistName" className="flex border-none justify-center">
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nom"
                        className="text-2xl font-bold text-center"
                    />
                </div>
                <div id="editUserBio" className="border-none">
                    <h2>Bio</h2>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Description de votre parcours, et de votre projet musical. Qu'est-ce qui fait de vous un.e musicien.ne unique ?"
                        rows={4}
                        className="w-full p-2"
                    />
                </div>
                <div id="editUserSkills" className="border-none flex flex-col gap-1">
                    <h2>Compétences musicales ({userSkills.length}/50)</h2>
                    {userSkills.map((skill) => (
                        <div key={skill.id} id="skill" className="flex justify-between border-none p-0">
                            <div className="flex gap-1 justify-center align-middle">
                                <span>{skill.skillName}</span>
                                {skill.genreName &&
                                    <>
                                        <span>~</span>
                                        <span>{skill.genreName}</span>
                                    </>
                                }
                            </div>
                            <button
                                className="squareButtons"
                                onClick={() => handleDeleteSkill(skill.id)}
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
                            disabled={userSkills.length >= 50}
                        >
                            <Plus />
                        </button>
                    )}
                </div>
                <div id="editUserAge" className="border-none">
                    <h2>Date de naissance</h2>
                    <input
                        type="date"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleChange}
                        className="p-2"
                    />
                </div>
                <div id="editUserAddress" className="border-none">
                    <h2>Localisation</h2>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Votre adresse"
                        className="w-full p-2"
                    />
                </div>
                <div id="editUserContact" className="border-none">
                    <h2>Lien de contact</h2>
                    <input
                        type="url"
                        name="contactLink"
                        value={formData.contactLink}
                        onChange={handleChange}
                        placeholder="https://..."
                        className="w-full p-2"
                    />
                </div>
                <div className="border-none p-0 flex justify-evenly">
                    <button className="squareButtons" onClick={handleSubmit}>
                        <Check />
                    </button>
                    <button className="squareButtons" onClick={onCancel}>
                        <X />
                    </button>
                </div>
            </div>
        </>
    );
}