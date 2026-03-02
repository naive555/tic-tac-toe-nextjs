'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';

const FALLBACK_AVATAR = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%2363b3ed'/%3E%3Cpath d='M50 45c7.5 0 13.64-6.14 13.64-13.64S57.5 17.72 50 17.72s-13.64 6.14-13.64 13.64S42.5 45 50 45zm0 6.82c-9.09 0-27.28 4.56-27.28 13.64v3.41c0 1.88 1.53 3.41 3.41 3.41h47.74c1.88 0 3.41-1.53 3.41-3.41v-3.41c0-9.08-18.19-13.64-27.28-13.64z' fill='%23fff'/%3E%3C/svg%3E`;

export default function Profile() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500 dark:text-gray-400">
          Loading user profile...
        </p>
      </div>
    );
  }

  if (!user) return null;

  const displayName = user.name ?? 'User';
  const avatarSrc = user.picture ?? FALLBACK_AVATAR;

  return (
    <div className="flex flex-col items-center gap-4 p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
      <Image
        width={200}
        height={200}
        src={avatarSrc}
        alt={`${displayName} profile`}
        className="rounded-full"
        onError={(e) => {
          (e.target as HTMLImageElement).src = FALLBACK_AVATAR;
        }}
        unoptimized
      />
      <h2 className="text-2xl font-bold dark:text-white">{displayName}</h2>
      <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
    </div>
  );
}
