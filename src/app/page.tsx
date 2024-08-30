import Header from "@/components/header.component";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col  items-center  p-24">
        <div className="text-2xl">Welcome to</div>
        <div className="text-orange-700 text-7xl">Tic Tac Toe</div>
        <Link href="/login" className="mt-1 text-xl">
          Login
        </Link>
      </main>
    </>
  );
}
