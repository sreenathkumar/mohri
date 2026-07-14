import BenefitsSection from "@/components/ui/BenifitSection";
import CTASection from "@/components/ui/CTASection";
import FeaturesSection from "@/components/ui/FeaturesSection";
import HeroSection from "@/components/ui/HeroSection";
import HowItWorks from "@/components/ui/HowItWorks";
import IntegrationShowcase from "@/components/ui/Integrations";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <IntegrationShowcase />
      <BenefitsSection />
      <CTASection />
    </main>
  );
}
