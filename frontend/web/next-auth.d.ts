import NextAuth, { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            username: string;
            address?: string;
            createdAt?: string;
        } & DefaultSession["user"];
        accessToken: string;
    }

    interface User {
        id: string;
        username: string;
        address?: string;
        createdAt?: string;
    }

    interface Profile {
        id: string;
        username: string;
        address?: string;
        createdAt?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id: string;
        username: string;
        address?: string;
        createdAt?: string;
        accessToken: string;
    }
}
