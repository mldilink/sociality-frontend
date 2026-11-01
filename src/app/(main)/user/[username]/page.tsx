import FriendProfile from '@/features/users/components/friend-profile';

interface UserPageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function UserPage({ params }: UserPageProps) {
  const { username } = await params;

  return <FriendProfile username={username} />;
}
