import { syncUser } from "@/lib/SyncUser";
import HeroSection from "@/components/landing/hero-section";
import FeaturesShowcase from "@/components/landing/features-showcase";
import BenefitsSection from "@/components/landing/benefits-section";
import TestimonialsSection from "@/components/landing/testimonials-section";
import StatsSection from "@/components/landing/stats-section";
import CtaSection from "@/components/landing/cta-section";

export default async function Home() {
  await syncUser();
  return (
    <main className="relative overflow-hidden">
      <HeroSection />
      <FeaturesShowcase />
      <BenefitsSection />
      <StatsSection />
      <TestimonialsSection />
      <CtaSection />
    </main>
  );
}
