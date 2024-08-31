"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/login";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={onSubmit}>
      {/* Sign In with Google button */}
      <a
        className="px-7 py-2 text-white bg-red-700 font-medium text-sm leading-snug uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full flex justify-center items-center mb-3"
        onClick={() => signIn("google", { callbackUrl })}
        role="button"
      >
        <Image
          className="pr-2"
          src="/images/google.svg"
          alt="google logo"
          height={32}
          width={32}
        />
        Continue with Google
      </a>
    </form>
  );
};
