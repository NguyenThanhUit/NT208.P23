'use server'

import { auth } from '@/auth'

export async function getCurrentUser() {
    try {
        const session = await auth();

        if (!session) return null;
        // console.log('User in session:', session.user);
        return session.user;

    } catch (error) {
        return null;
    }
}