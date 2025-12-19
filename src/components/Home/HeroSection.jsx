"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";
import AppDownloadButtons from "./AppDownloadButtons";

export default function HeroSection() {
  return (
    <section className="home-hero-section" >
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="d-flex flex-column gap-4 align-items-start">
              <div className="callout-bubble d-inline-flex align-items-center gap-2">
                <Sparkles size={16} />
                <span className="fw-semibold">Smart Beauty in 15 Minutes</span>
              </div>

              <h1 className="display-3 fw-bold mb-0">
                Smart Nail Box<br />
                <span className="text-danger">Perfect Nails</span> in 15 Minutes
              </h1>

              <p className="fs-5 text-muted" >
                Choose a design in the app. Insert your hand in the Nail Box. Get your perfect manicure — fast and flawless. No professional needed.
              </p>

              <div className="d-flex align-items-center gap-3">
                <Image src="/images/googleplay.png" width={173.96} height={50.32} alt="" />
                <Image src="/images/app-store-icon.png" width={173.96} height={50.32} alt="" />
              </div>
            </div>
          </div>

          <div className="col-lg-6 d-flex justify-content-center align-items-center">
            <div className="hero-phones">
              <Image src="/images/home-img1.png" width={500} height={520} alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

