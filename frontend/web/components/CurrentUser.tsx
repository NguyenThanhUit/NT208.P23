'use client';

import { useSession } from "next-auth/react";
import UserLogged from "./UserLogged";

export default function CurrentUser() {
    const { data: session, status } = useSession();

    if (status === "loading") return null;
    if (!session || !session.user) return null;

    return <UserLogged user={session.user} />;
}
