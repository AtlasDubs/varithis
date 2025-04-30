import MainLayout from '@/components/layout/MainLayout';
import WelcomeSection from '@/components/home/WelcomeSection';
import FactionSection from '@/components/home/FactionSection';

export default function Home() {
  return (
    <MainLayout>
      <WelcomeSection />
      <FactionSection />
    </MainLayout>
  );
}
