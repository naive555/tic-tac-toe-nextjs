import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import Navbar from '@/components/Navbar';
import ThemeProvider from '@/components/ThemeProvider';
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased`}>
        <ThemeProvider>
          <Navbar user={user} />
          <div>{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
