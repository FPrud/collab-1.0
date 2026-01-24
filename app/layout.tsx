import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "./components/Navigation";
import { auth } from "@/src/auth";
import { headers } from "next/headers";
import { AudioWaveform } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Collab'",
  description: "Rencontrez votre prochain.e collaborateur.ice de projet musical amateur",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  console.log("Session:", session);
  console.log("User:", session?.user);

  const isAuthenticated = !!session?.user;
  const userId = session?.user?.id;
  console.log("Is authenticated:", isAuthenticated);

  return (
    <html lang="en">
      <body>
        <Link href="/"><h1 id="logo" className="flex justify-center items-center">Co<AudioWaveform size="30" />ab'</h1></Link>
        <Navigation isAuthenticated={isAuthenticated} userId={userId} />
        {children}
      </body>
    </html>
  );
}