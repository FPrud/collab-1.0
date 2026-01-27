import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

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

interface DisplayPostProps {
    post: Post;
    searchedSkills: SearchedSkill[];
    showFullContent?: boolean;
    isAuthor?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
}

export function DisplayPost({ 
    post, 
    searchedSkills, 
    showFullContent = true,
    isAuthor = false,
    onEdit,
    onDelete
}: DisplayPostProps) {
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(new Date(date));
    };

    const truncateContent = (content: string, maxLength: number = 150) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + "...";
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
        <>
            <div className="border-none">
                <h2>{post.title}</h2>
            </div>

            <div className="flex border-none justify-between">
                <span>{post.userName}</span>
                <span>{formatDate(post.createdAt)}</span>
            </div>

            <div className="border-none">
                <p>{showFullContent ? post.content : truncateContent(post.content)}</p>
            </div>

            {searchedSkills.length > 0 && (
                <div className="border-none flex flex-col gap-1">
                    <h2>Recherche</h2>
                    <div className="border-none p-0 flex flex-row flex-wrap gap-1">
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
                </div>
            )}

            {showFullContent && (
                <>
                    {isAuthor ? (
                        <div className="border-none p-0 flex justify-evenly">
                            <button onClick={onEdit} className="squareButtons">
                                <Pencil />
                            </button>
                            <button onClick={onDelete} className="squareButtons">
                                <Trash2 />
                            </button>
                        </div>
                    ) : (
                        <div className="border-none p-0 flex justify-evenly">
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
                    )}
                </>
            )}
        </>
    );
}