"use client";

import { editProfileData } from "@/app/actions/profile/editProfile";
import { Plus } from "lucide-react";
import { useState } from "react";

interface EditUserInfosProps {
    userId: string;
    name: string;
    bio: string | null;
    birthdate: string | null;
    address: string | null;
    contactLink: string | null;
    onSave: () => void;
}

export function EditUserInfos({ userId, name, bio, birthdate, address, contactLink, onSave }: EditUserInfosProps) {
    const [formData, setFormData] = useState({
        name: name || "",
        bio: bio || "",
        birthdate: birthdate || "",
        address: address || "",
        contactLink: contactLink || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
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
                        placeholder="Description de votre projet musical..."
                        rows={4}
                        className="w-full p-2"
                    />
                </div>
                <div id="editUserSkills" className="border-none flex flex-col">
                    <h2>Compétence musicale</h2>
                    <button className="squareButtons"><Plus/></button>
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
            </div>
            <button onClick={handleSubmit} style={{ display: 'none' }} id="submitBtn" />
        </>
    );
}