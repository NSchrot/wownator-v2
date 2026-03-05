import { HeroSection } from "@/components/landing/hero-section";
import { CategoriesSection } from "@/components/landing/categories-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { FactionCtaBlock } from "@/components/landing/faction-cta-block";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[hsl(220,20%,6%)] text-foreground overflow-x-clip">
      <HeroSection />
      <CategoriesSection />
      <HowItWorksSection />
      <FactionCtaBlock />
      <Footer />
    </main>
  );
}
