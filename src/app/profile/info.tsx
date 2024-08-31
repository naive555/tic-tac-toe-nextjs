"use client";

import { useEffect, useState } from "react";

import { User } from "../api/users/route";
import { getUser } from "./page";
import Loader from "../../components/loading";

export default function Info({ email }: { email: string }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User>();

  const fetchUser = async () => {
    setLoading(true);

    const userRes = await getUser(email);
    setUser(userRes);

    setLoading(false);
  };

  useEffect(() => {
    if (!email) return;
    fetchUser();
  }, [email]);

  return (
    <>
      <Loader loading={loading} />
      <section className="bg-ct-blue-600  min-h-screen pt-20">
        <div className="max-w-4xl mx-auto bg-ct-dark-100 rounded-md h-[20rem] flex justify-center items-center">
          <div>
            <p className="mb-3 text-5xl text-center font-semibold">
              Profile Page
            </p>
            {!user ? (
              <p>Loading...</p>
            ) : (
              <div className="flex items-center gap-8">
                <div>
                  <img
                    src={user.image ? user.image : "/images/default.png"}
                    className="max-h-36"
                    alt={`profile photo of ${user.name}`}
                  />
                </div>
                <div className="mt-8">
                  <p className="mb-3">Name: {user.name}</p>
                  <p className="mb-3">Email: {user.email}</p>
                  <p className="mb-3">Score: {user.score}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
