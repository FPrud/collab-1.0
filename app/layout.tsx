import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "./components/Navigation";
import { auth } from "@/src/auth";
import { headers } from "next/headers";

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
      <body className="flex flex-col justify-center align-middle items-center pb-12 border-none">
        <div id="main-content" className="border-none p-0">
          {children}
        </div>
        <Navigation isAuthenticated={isAuthenticated} userId={userId} />
      </body>
    </html>
  );
}