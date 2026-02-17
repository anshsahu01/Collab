import LandingNavbar from "../components/landing/LandingNavbar";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import ProductPreviewSection from "../components/landing/ProductPreviewSection";
import CtaSection from "../components/landing/CtaSection";
import LandingFooter from "../components/landing/LandingFooter";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <ProductPreviewSection />
      <CtaSection />
      <LandingFooter />
    </main>
  );
}
