'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type User = {
  id: string;
  username: string;
} | null;

type Props = {
  user: User;
};

export default function Navbar({ user }: Props) {
  const pathname = usePathname();

  const navItem = (href: string, label: string) => {
    const isActive = pathname === href;

    return (
      <Link
        href={href}
        className={`px-3 py-2 rounded-md text-sm font-medium transition
        ${isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-200'}`}>
        {label}
      </Link>
    );
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 border-b bg-white">
      <div className="flex gap-4 items-center">
        <span className="font-bold text-lg">Tic Tac Toe</span>
        {navItem('/', 'Home')}
        {user && navItem('/leaderboard', 'Leaderboard')}
      </div>

      <div className="flex gap-4 items-center">
        {user ? (
          <>
            {navItem('/profile', user.username)}
            <a
              href="/auth/logout"
              className="px-3 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition">
              Logout
            </a>
          </>
        ) : (
          <a
            href="/auth/login"
            className="px-3 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-800 transition">
            Login
          </a>
        )}
      </div>
    </nav>
  );
}
