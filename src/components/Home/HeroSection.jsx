"use client";

import Image from "next/image";
import ScrollReveal from "@/components/animations/ScrollReveal";

export default function HeroSection() {
  return (
    <section className="home-hero-section" >
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <ScrollReveal direction="left" delay={0.5} duration={1.5}>
              <div className="d-flex flex-column gap-4 align-items-start">
                {/* <div className="callout-bubble d-inline-flex align-items-center gap-2">
                  <Sparkles size={16} />
                  <span className="fw-semibold">Smart Beauty in 15 Minutes</span>
                </div> */}

                <h1 className="display-3 fw-bold mb-0">

                  Nail Warz is Your<br />
                  <span className="text-danger">One-Stop Shop</span> for the Nail Industry
                </h1>

                <p className="fs-5 text-muted" >
                  Easily and reliably find a local nail salon and service on our app. Engage
                  with other nail consumers, win a free manicure, and much more!
                </p>

                <div className="d-flex align-items-center gap-3">
                  <Image src="/images/googleplay.png" width={173.96} height={50.32} alt="" />
                  <Image src="/images/app-store-icon.png" width={173.96} height={50.32} alt="" />
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="col-lg-6 d-flex justify-content-center align-items-center">
            <ScrollReveal direction="right" delay={0.5} duration={1.5}>
              <div className="hero-phones">
                <Image src="/images/home-img1.png" width={500} height={520} alt="" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

