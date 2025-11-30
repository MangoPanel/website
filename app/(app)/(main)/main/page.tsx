import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Main } from "./main"

{/* render all static elements here and in layout */}

export default async function Home() {
    const cookieStore = await cookies();
    const email = cookieStore.get("email")?.value;
    if (!email)
        redirect("/login");

    return (
        <Main email={email} />
    );
}
