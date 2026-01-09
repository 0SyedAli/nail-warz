"use client";

import TopBanner from "@/components/Home/TopBanner";
import Header from "@/components/Home/Header";
import HeroSection from "@/components/Home/HeroSection";
import FeaturesSection from "@/components/Home/FeaturesSection";
import TestimonialsSection from "@/components/Home/TestimonialsSection";
import AppCTASection from "@/components/Home/AppCTASection";
import Footer from "@/components/Home/Footer";
import SmoothScrollProvider from "@/components/animations/SmoothScrollProvider";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="home-page">
            <TopBanner />
            <Header />
            <HeroSection />
            <FeaturesSection />
            <TestimonialsSection />
            <AppCTASection />
            <Footer />
          </div>
        </div>
      </div>
    </SmoothScrollProvider>

  );
}
