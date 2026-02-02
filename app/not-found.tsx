import Link from "next/link"

export default function NotFound() {

    return (<>
        <h2>Page inconnue</h2>
        <p>La page que vous cherchez n'existe pas.</p>
        <Link href="/">Accueil</Link>
    </>)
}