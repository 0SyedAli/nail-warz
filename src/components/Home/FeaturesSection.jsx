"use client";

import Image from "next/image";
import ScrollReveal from "../animations/ScrollReveal";

export default function FeaturesSection() {
  return (
    <section className="py-5 home-our-feature">
      <div className="container">
        {/* Header */}
        <ScrollReveal direction="down" duration={1.5}>
          <div className="text-center mb-5">
            <h2 className="">
              Our <span >Features</span>
            </h2>
            <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '700px' }}>
              Discover salons, book appointments, explore nail trends, and compete
              in Nail Battles — all powered by Nail Warz.
            </p>
          </div>
        </ScrollReveal>
        {/* Feature 1: Nail Compass/Marketplace */}
        <div className="row align-items-center mb-5 pb-5 justify-content-between">
          <div className="col-lg-7 mb-4 mb-lg-0">
            <ScrollReveal direction="left" duration={1.5}>
              <div className="d-flex flex-column gap-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="feature-icon-box">
                    <Image src="/images/logo.png" width={36} height={44} alt="" />
                  </div>
                  <h3 className="fw-bold mb-0"> Nail Compass™ / HOME </h3>
                </div>
                <p className=" text-muted">
                  Explore your local area using our intelligent discovery engine, designed
                  to seamlessly connect users with top-rated nail salons and technicians
                  nearby. Using advanced location-based search and service-specific
                  filtering, users can effortlessly find providers that match their exact
                  needs — from acrylics to gel, artistry to maintenance — delivering
                  precision, convenience, and confidence in every booking decision.
                </p>
                <div className="d-flex align-items-center gap-3">
                  <Image src="/images/googleplay.png" width={173.96} height={50.32} alt="" />
                  <Image src="/images/app-store-icon.png" width={173.96} height={50.32} alt="" />
                </div>
              </div>
            </ScrollReveal>
          </div>
          <div className="col-lg-5 feature-right text-end">
            <ScrollReveal direction="right" duration={1.5}>
              <div className="right-section">
                <div className="phone-wrapper">
                  <Image
                    src="/images/feature-img1.png" // dummy image
                    alt="App Preview"
                    width={320}
                    height={640}
                    className="phone-image"
                    priority
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Feature 2: Booking a Service w/ a Salon */}
        <div className="row align-items-center mb-5 pb-5 justify-content-between">

          <div className="col-lg-5 feature-left">
            <ScrollReveal direction="left" duration={1.5}>
              <div className="right-section">
                <div className="phone-wrapper">
                  <Image
                    src="/images/feature-img2.png" // dummy image
                    alt="App Preview"
                    width={320}
                    height={640}
                    className="phone-image"
                    priority
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
          <div className="col-lg-7 mb-4 mb-lg-0">
            <ScrollReveal direction="right" duration={1.5}>
              <div className="d-flex flex-column gap-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="feature-icon-box">
                    <Image src="/images/logo.png" width={36} height={44} alt="" />
                  </div>
                  <h3 className="fw-bold mb-0">Nail Warz Appointment Booking</h3>
                </div>
                <p className=" text-muted">
                  Booking with Nail Warz transforms appointment scheduling into a
                  seamless digital experience. Users can view real-time availability,
                  select preferred services, and secure appointments with trusted salons
                  and technicians — all within one platform. With secure streamlined
                  payments, instant confirmations, and smart scheduling, Nail Warz
                  eliminates uncertainty and delivers effortless, reliable booking.
                </p>
                <div className="d-flex align-items-center gap-3">
                  <Image src="/images/googleplay.png" width={173.96} height={50.32} alt="" />
                  <Image src="/images/app-store-icon.png" width={173.96} height={50.32} alt="" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Feature 3: Nail Compass/Marketplace */}
        <div className="row align-items-center mb-5 pb-5 justify-content-between">
          <div className="col-lg-7 mb-4 mb-lg-0">
            <ScrollReveal direction="left" duration={1.5}>
              <div className="d-flex flex-column gap-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="feature-icon-box">
                    <Image src="/images/logo.png" width={36} height={44} alt="" />
                  </div>
                  <h3 className="fw-bold mb-0">Nail Warz Battles </h3>
                </div>
                <p className=" text-muted">
                  Our Nail Warz Battles spotlight creativity, talent, and artistry through
                  immersive digital competitions and it is completely free to enter.
                  Discover standout designs, follow live matchups, and track real-time
                  voting momentum as talent rises to the top. Download to support your
                  favorite nail tech, influence outcomes, and become part of the culture
                  shaping, nail care interactive experience. MAY THE BEST SET WIN!
                </p>
                <div className="d-flex align-items-center gap-3">
                  <Image src="/images/googleplay.png" width={173.96} height={50.32} alt="" />
                  <Image src="/images/app-store-icon.png" width={173.96} height={50.32} alt="" />
                </div>
              </div>
            </ScrollReveal>
          </div>
          <div className="col-lg-5 feature-right text-end">
            <ScrollReveal direction="right" duration={1.5}>
              <div className="right-section">
                <div className="phone-wrapper">
                  <Image
                    src="/images/feature-img3.png" // dummy image
                    alt="App Preview"
                    width={320}
                    height={640}
                    className="phone-image"
                    priority
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Feature 4: Booking a Service w/ a Salon */}
        <div className="row align-items-center mb-5 pb-5 justify-content-between">

          <div className="col-lg-5 feature-left">
            <ScrollReveal direction="left" duration={1.5}>
              <div className="right-section">
                <div className="phone-wrapper">
                  <Image
                    src="/images/feature-img4.png" // dummy image
                    alt="App Preview"
                    width={320}
                    height={640}
                    className="phone-image"
                    priority
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
          <div className="col-lg-7 mb-4 mb-lg-0">
            <ScrollReveal direction="right" duration={1.5}>
              <div className="d-flex flex-column gap-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="feature-icon-box">
                    <Image src="/images/logo.png" width={36} height={44} alt="" />
                  </div>
                  <h3 className="fw-bold mb-0">Nail Champions</h3>
                </div>
                <p className=" text-muted">
                  The winners of our Nail Warz Battles are called NAIL CHAMPIONS. Battle
                  winners embody excellence within the Nail Warz ecosystem.
                  Determined by public voting, winning salons and technicians earn
                  elevated visibility, premium promotional placement, and brand
                  recognition across the platform. These victories are designed to uplift
                  the Nail Champion’s reputation, expand reach, and position winning
                  talent at the forefront of nail culture — with select battles offering
                  exclusive cash rewards.
                </p>
                <div className="d-flex align-items-center gap-3">
                  <Image src="/images/googleplay.png" width={173.96} height={50.32} alt="" />
                  <Image src="/images/app-store-icon.png" width={173.96} height={50.32} alt="" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Feature 3: Nail Compass/Marketplace */}
        <div className="row align-items-center justify-content-between" style={{ padding: "100px 0" }}>
          <div className="col-lg-7 mb-4 mb-lg-0">
            <ScrollReveal direction="left" duration={1.5}>
              <div className="d-flex flex-column gap-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="feature-icon-box">
                    <Image src="/images/logo.png" width={36} height={44} alt="" />
                  </div>
                  <h3 className="fw-bold mb-0">Become a Featured Service Provider </h3>
                </div>
                <p className=" text-muted">
                  Nail Warz invites nail salons and technicians to become part of a
                  curated digital ecosystem built to elevate professional visibility. By
                  joining the Nail Compass™, service providers gain exposure to an
                  engaged community of nail care consumers actively searching for
                  trusted talent — creating meaningful opportunities to grow clientele,
                  expand reach, and stand out within a competitive industry.
                </p>
                <div className="d-flex align-items-center gap-3">
                  <Image src="/images/googleplay.png" width={173.96} height={50.32} alt="" />
                  <Image src="/images/app-store-icon.png" width={173.96} height={50.32} alt="" />
                </div>
              </div>
            </ScrollReveal>
          </div>
          <div className="col-lg-5 feature-right text-end">
            <ScrollReveal direction="right" duration={1.5}>
              <div className="right-section">
                <div className="phone-wrapper">
                  <Image
                    src="/images/feature-img5.png" // dummy image
                    alt="App Preview"
                    width={490}
                    height={291.5}
                    className="phone-image"
                    priority
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Feature 4: Booking a Service w/ a Salon */}
        <div className="row align-items-center justify-content-between" style={{ padding: "80px 0" }}>

          <div className="col-lg-5 feature-left">
            <ScrollReveal direction="left" duration={1.5}>
              <div className="right-section">
                <div className="phone-wrapper">
                  <Image
                    src="/images/feature-img6.png" // dummy image
                    alt="App Preview"
                    width={490}
                    height={291.5}
                    className="phone-image"
                    priority
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
          <div className="col-lg-7 mb-4 mb-lg-0">
            <ScrollReveal direction="right" duration={1.5}>
              <div className="d-flex flex-column gap-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="feature-icon-box">
                    <Image src="/images/logo.png" width={36} height={44} alt="" />
                  </div>
                  <h3 className="fw-bold mb-0"> A Smarter Way to Run Your Business </h3>
                </div>
                <p className=" text-muted">
                  The Nail Warz vendor portal delivers a streamlined business experience
                  designed for modern beauty professionals. Manage bookings, track
                  earnings, view performance insights, and stay organized through one
                  intuitive dashboard. With built-in tools that simplify daily operations,
                  Nail Warz empowers salons and technicians to focus less on logistics —
                  and more on delivering exceptional service.
                </p>
                <div className="d-flex align-items-center gap-3">
                  <Image src="/images/googleplay.png" width={173.96} height={50.32} alt="" />
                  <Image src="/images/app-store-icon.png" width={173.96} height={50.32} alt="" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

