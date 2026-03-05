"use client";

import Header from "@/components/Home/Header";
import HeroSection from "@/components/Home/HeroSection";
import FeaturesSection from "@/components/Home/FeaturesSection";
import AppCTASection from "@/components/Home/AppCTASection";
import Footer from "@/components/Home/Footer";
import SmoothScrollProvider from "@/components/animations/SmoothScrollProvider";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const pathname = usePathname();
  const cartItems = useSelector((state) => state.cart.items);
  const totalQty = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const hideCart = pathname === "/cart" || pathname === "/checkout";

  return (
    <>

      <SmoothScrollProvider>
        <div id="smooth-wrapper">
          <div id="smooth-content">
            <div className="home-page">
              {/* <TopBanner /> */}
              <Header />
              <HeroSection />
              <FeaturesSection />
              {/* <TestimonialsSection /> */}
              <AppCTASection />
              <Footer />
            </div>
          </div>
        </div>
      </SmoothScrollProvider>
      {!hideCart && totalQty > 0 && (
        <Link
          href="/cart"
          className="btn btn-link btn-link-header px-0 py-2 text-decoration-none"
          aria-label="Shopping Cart"
        >
          <Image
            src="/images/cart-head.png"
            alt="Cart"
            width={20}
            height={20}
            className="img-fluid"
            priority
          />
          <span>
            {totalQty}
          </span>
        </Link>
      )}
    </>

  );
}
