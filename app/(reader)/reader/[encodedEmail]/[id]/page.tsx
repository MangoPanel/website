import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MainWrapper } from "./../../mainwrapper"
import { urlR2 } from "@/app/lib/r2";

interface PageProps {
  params: { encodedEmail: string; id: string };
}

export default async function Home({ params }: PageProps) {
  const { encodedEmail, id } = await params;
  const email = decodeURIComponent(encodedEmail);
  const url = await urlR2(`${email}/${id}`);
  const cookieStore = await cookies();
  const cookieEmail  = cookieStore.get("email")?.value;
  if (cookieEmail !== email)
    redirect("/login");

  return (
    <MainWrapper url={url} />
  );
}