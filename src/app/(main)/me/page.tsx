import { Suspense } from 'react';
import MyProfile from '@/features/users/components/my-profile';

export default function MyProfilePage() {
  return (
    <Suspense fallback={<div className='min-h-screen bg-black' />}>
      <MyProfile />
    </Suspense>
  );
}
