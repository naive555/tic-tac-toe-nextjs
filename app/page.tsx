import { auth0 } from '@/lib/auth0';
import Link from 'next/link';

export default async function Home() {
  const session = await auth0.getSession();
  const userName = session?.user?.name ?? session?.user?.email ?? 'Annonymous';

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 text-center space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Tic Tac Toe</h1>

        {!session ? (
          <a
            href="/auth/login"
            className="block w-full px-4 py-2 bg-black text-white rounded-lg hover:opacity-90 transition">
            Login with Auth0
          </a>
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

            <a
              href="/auth/logout"
              className="block w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
              Logout
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
