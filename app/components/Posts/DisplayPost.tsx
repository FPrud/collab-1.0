import Link from "next/link";
import { useRouter } from "next/navigation";
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
    onSkillClick?: (skillName: string) => void;
    isHomePage?: boolean;
}

export function DisplayPost({
    post,
    searchedSkills,
    showFullContent = true,
    isAuthor = false,
    onEdit,
    onDelete,
    onSkillClick,
    isHomePage = false
}: DisplayPostProps) {
    const router = useRouter();

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

    const handleSkillClick = (skillName: string | null, genreName: string | null) => {
        if (skillName) {
            const searchTerm = genreName ? `${skillName} ${genreName}` : skillName;

            if (isHomePage && onSkillClick) {
                // Si on est sur la HomePage, utiliser le callback
                onSkillClick(searchTerm);
            } else {
                // Sinon, rediriger vers la HomePage avec le terme de recherche
                router.push(`/?search=${encodeURIComponent(searchTerm)}`);
            }
        }
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
                    <h2>Tags</h2>
                    <div className="border-none p-0 flex flex-row flex-wrap gap-1">
                        {searchedSkills.map((skill) => (
                            <button
                                key={skill.id}
                                onClick={() => handleSkillClick(skill.skillName, skill.genreName)}
                                className="p-1 flex gap-1"
                            >
                                <span>{skill.skillName}</span>
                                {skill.genreName && (
                                    <>
                                        <span>~</span>
                                        <span>{skill.genreName}</span>
                                    </>
                                )}
                            </button>
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