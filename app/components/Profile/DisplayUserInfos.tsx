"use client";

import { getUserSkills } from "@/app/actions/skills/getUserSkills";
import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { LogOutButton } from "../Connection/LogOutButton";

interface DisplayUserCardProps {
    userId: string;
    name: string;
    bio: string | null;
    birthdate: string | null;
    address: string | null;
    contactLink: string | null;
    isOwnProfile?: boolean;
    onEdit?: () => void;
}

interface UserSkill {
    id: number;
    skillId: number;
    skillName: string | null;
    genreId: number | null;
    genreName: string | null;
}

export function DisplayUserInfos({ 
    userId, 
    name, 
    bio, 
    birthdate, 
    address, 
    contactLink,
    isOwnProfile = false,
    onEdit
}: DisplayUserCardProps) {
    const [userSkills, setUserSkills] = useState<UserSkill[]>([]);

    useEffect(() => {
        loadUserSkills();
    }, [userId]);

    const loadUserSkills = async () => {
        const result = await getUserSkills(userId);
        if (!("error" in result)) {
            setUserSkills(result as UserSkill[]);
        }
    };

    const calculateAge = (birthdate: string) => {
        const birth = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const isEmail = (value: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };

    const getContactHref = (contactLink: string) => {
        if (isEmail(contactLink)) {
            return `mailto:${contactLink}`;
        }
        return contactLink.startsWith('http') ? contactLink : `https://${contactLink}`;
    };

    return (
        <div id="userCard" className="gap-2">
            <div id="artistName" className="flex border-none justify-center">
                <h1>{name}</h1>
            </div>
            {bio && (
                <div id="userBio" className="border-none">
                    <h2>Bio</h2>
                    <p>{bio}</p>
                </div>
            )}
            {userSkills.length > 0 && (
                <div id="userSkills" className="border-none flex flex-col gap-1">
                    <h2>Compétences musicales</h2>
                    <div className="border-none p-0 flex flex-row flex-wrap gap-1">
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
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {birthdate && (
                <div id="userAge" className="border-none">
                    <h2>Âge</h2>
                    <p>{calculateAge(birthdate)} ans</p>
                </div>
            )}
            {address && (
                <div id="userAddress" className="border-none">
                    <h2>Localisation</h2>
                    <p>{address}</p>
                </div>
            )}
            {contactLink && (
                <div id="userContact" className="border-none">
                    <h2>Contact</h2>
                    {isOwnProfile ? (
                        <p>{contactLink}</p>
                    ) : (
                        <div className="border-none p-0 flex justify-center">
                            <a href={getContactHref(contactLink)} target={isEmail(contactLink) ? undefined : "_blank"} rel={isEmail(contactLink) ? undefined : "noopener noreferrer"}>
                                <button>Me contacter</button>
                            </a>
                        </div>
                    )}
                </div>
            )}
            {isOwnProfile && (
                <div className="border-none p-0 flex justify-evenly">
                    <button onClick={onEdit} className="squareButtons">
                        <Pencil />
                    </button>
                    <LogOutButton />
                </div>
            )}
        </div>
    );
}
