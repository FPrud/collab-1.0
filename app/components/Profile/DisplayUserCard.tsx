interface DisplayUserCardProps {
    name: string;
    bio: string | null;
    birthdate: string | null;
    address: string | null;
    contactLink: string | null;
}

export function DisplayUserCard({ name, bio, birthdate, address, contactLink }: DisplayUserCardProps) {
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

    return (
        <div id="userCard" className="gap-2">
            <div id="artistName" className="flex flex-wrap border-none p-0 justify-center">
                <h1>{name}</h1>
            </div>
            {bio && (
                <div id="userBio" className="border-none">
                    <h2>Bio : </h2><p>{bio}</p>
                </div>
            )}
            {birthdate && (
                <div id="userAge" className="border-none">
                    <h2>Âge : </h2><p>{calculateAge(birthdate)} ans</p>
                </div>
            )}
            {address && (
                <div id="userAddress" className="border-none">
                    <h2>Adresse : </h2><p>{address}</p>
                </div>
            )}
            {contactLink && (
                <a target="_blank" href={contactLink}><button>Me contacter</button></a>
            )}
        </div>
    );
}