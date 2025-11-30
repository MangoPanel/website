"use server"
import { cookies } from "next/headers";

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.set('email', "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0
    });
}