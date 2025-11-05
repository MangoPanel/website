import { cookies } from "next/headers";

export async function userEmail() {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("email")?.value;
    return userEmail;
}