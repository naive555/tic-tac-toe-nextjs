import Link from 'next/link';

import LoginButton from '@/components/LoginButton';
import LogoutButton from '@/components/LogoutButton';
import { auth0 } from '@/lib/auth0';

export default async function Home() {
  const session = await auth0.getSession();
  const userName = session?.user?.name ?? session?.user?.email ?? 'Annonymous';

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 text-center space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Tic Tac Toe</h1>

        {!session ? (
          <LoginButton />
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">
              Welcome <span className="font-semibold">{userName}</span>
            </p>
            <Link
              href="/game"
              className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Play Game
            </Link>

            <LogoutButton />
          </div>
        )}
      </div>
    </main>
  );
}
