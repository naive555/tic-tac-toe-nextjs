import { getServerSession } from "next-auth";
import Link from "next/link";
import Header from "@/components/header.component";

import { authOptions } from "../lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col  items-center  p-24">
        <div className="text-3xl">Welcome to</div>
        <div className="text-orange-700 text-7xl">Tic Tac Toe</div>
        <br />
        {!user ? (
          <Link href="/login" className="mt-1 text-4xl">
            <strong>Login</strong>
          </Link>
        ) : (
          <Link href="/tic-tac-toe" className="mt-1 text-4xl">
            <strong>Play</strong>
          </Link>
        )}
      </main>
    </>
  );
}
