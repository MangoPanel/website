import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Main } from "./../main"

interface Props {
  params: Promise<{
    id: number
  }>
}

export default async function Home({ params } : Props) {
  let resolvedParams = await params;
  const cookieStore = await cookies();
  const email  = cookieStore.get("email")?.value;
  if (!email)
    redirect("/login");
  const folder : string = `/pdf/${email}/${resolvedParams.id}/`;

  return (
    <Main folder={folder} />
  );
}