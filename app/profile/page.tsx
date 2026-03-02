import Profile from '@/components/Profile';

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-bold dark:text-white">Profile</h1>
      <Profile />
    </div>
  );
}
