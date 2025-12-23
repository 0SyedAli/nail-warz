"use client";

import TopBanner from "@/components/Home/TopBanner";
import Header from "@/components/Home/Header";
import HeroSection from "@/components/Home/HeroSection";
import FeaturesSection from "@/components/Home/FeaturesSection";
import TestimonialsSection from "@/components/Home/TestimonialsSection";
import AppCTASection from "@/components/Home/AppCTASection";
import Footer from "@/components/Home/Footer";

export default function Home() {
  return (
    <div className="home-page">
      <TopBanner />
      <Header />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <AppCTASection />
      <Footer />
    </div>
  );
}
