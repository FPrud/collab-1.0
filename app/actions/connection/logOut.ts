"use server";

import { auth } from "@/src/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const logOut = async () => {
    await auth.api.signOut({ headers: await headers() });

    redirect("/");
};