import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import Header from "@/components/header.component";
import Board from "./board";

export async function createOrUpdateUser() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
    method: "POST",
    body: JSON.stringify({
      name: user?.name,
      email: user?.email,
      image: user?.image,
    }),
  });
  if (!res.ok) {
    console.error("Failed to fetch data");
  }

  return res.json();
}

export default async function TicTacToe() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <Header />
      <Board />
    </>
  );
}
