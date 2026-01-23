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
  console.log("Is authenticated:", isAuthenticated);

  return (
    <html lang="en">
      <body>
        <Navigation isAuthenticated={isAuthenticated} />
        {children}
      </body>
    </html>
  );
}