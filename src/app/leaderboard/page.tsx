import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import Header from "@/components/header.component";
import Table from "./table";

export async function getUsers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`);
  if (!res.ok) {
    console.error("Failed to fetch data");
  }

  return res.json();
}

export default async function LeaderBoard() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    redirect("/login");
  }

  if (!process.env.NEXT_PUBLIC_API_URL) {
    return null;
  }
  const data = await getUsers();
  return (
    <>
      <Header />
      <h1>
        <strong>LeaderBoard</strong>
      </h1>
      <Table data={data} />
    </>
  );
}
