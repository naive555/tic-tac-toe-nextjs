'use client';

export default function LoginButton() {
  return (
    <a
      href="/auth/login"
      className="block w-full px-4 py-2 bg-black text-white rounded-lg hover:opacity-90 transition">
      Login with Auth0
    </a>
  );
}
