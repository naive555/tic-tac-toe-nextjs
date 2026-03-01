import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import Navbar from '@/components/Navbar';
import { getUser } from '@/lib/auth0';

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Tic Tac Toe',
  description: 'OAuth 2.0 secured Tic Tac Toe game with scoring system',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gray-50 text-gray-900 antialiased`}>
        <Navbar user={user} />
        {children}
      </body>
    </html>
  );
}
