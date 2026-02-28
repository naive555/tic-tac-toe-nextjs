'use client';

export default function LogoutButton() {
  return (
    <a
      href="/auth/logout"
      className="block w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
      Logout
    </a>
  );
}
