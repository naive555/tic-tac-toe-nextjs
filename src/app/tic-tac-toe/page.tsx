import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import Header from "@/components/header.component";
import Board from "./board";

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
