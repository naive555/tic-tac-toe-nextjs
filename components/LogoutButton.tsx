'use client';

export default function LogoutButton() {
  return (
    <a
      href="/auth/logout"
      className="block w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
      Logout
    </a>
  );
}
