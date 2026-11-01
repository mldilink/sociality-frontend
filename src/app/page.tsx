import { Navbar } from '@/components/layout/navbar';
import FeedPage from './(main)/feed/page';
import { BottomNavigation } from '@/components/layout/button-navigation';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <FeedPage />
      <BottomNavigation />
    </>
  );
}
