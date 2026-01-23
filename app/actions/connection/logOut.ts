"use server";

import { auth } from "@/src/auth";
import { headers } from "next/headers";

export const logOut = async () => {
    await auth.api.signOut({ headers: await headers() });
    return { success: true };
};