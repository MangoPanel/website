import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Main } from "./main"

export default async function Home() {
    const cookieStore = await cookies();
    const email = cookieStore.get("email")?.value;
    if (email)
        redirect("/main");

    return (
        <Main/>
    );
}