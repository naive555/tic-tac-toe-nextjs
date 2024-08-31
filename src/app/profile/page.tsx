import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Header from "@/components/header.component";

import _ from "lodash";
import Info from "./info";

export async function getUser(email?: string) {
  if (!email) return;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users?email=${email}`
  );

  if (!res.ok) {
    console.error("Failed to fetch data");
  }

  const users = await res.json();
  const user = _.first(users) as any;

  return user;
}

export default async function Profile() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    redirect("/login");
  }

  if (!process.env.NEXT_PUBLIC_API_URL) {
    return null;
  }

  return (
    <>
      <Header />
      <Info email={user.email || ""} />
    </>
  );
}
