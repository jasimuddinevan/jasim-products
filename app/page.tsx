import { AnimatedBackground } from '@/components/background/AnimatedBackground';
import { FloatingShapes } from '@/components/background/FloatingShapes';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Products } from '@/components/sections/Products';
import { VisitorTracker } from '@/components/VisitorTracker';

export default function Home() {
  return (
    <>
      <VisitorTracker />
      <AnimatedBackground />
      <FloatingShapes />
      <Header />
      <main className="relative z-10">
        <Hero />
        <Products />
      </main>
      <Footer />
    </>
  );
}
