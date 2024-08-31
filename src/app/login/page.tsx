import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Header from "@/components/header.component";

import { LoginForm } from "./form";
import { authOptions } from "../../lib/auth";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (user) {
    redirect("/tic-tac-toe");
  }

  return (
    <>
      <Header />
      <section className="bg-ct-blue-600 min-h-screen pt-20">
        <div className="container mx-auto px-6 py-12 h-full flex justify-center items-center">
          <div className="md:w-8/12 lg:w-5/12 bg-white px-8 py-10">
            <LoginForm />
          </div>
        </div>
      </section>
    </>
  );
}
