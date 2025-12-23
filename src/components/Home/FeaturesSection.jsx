"use client";

import Image from "next/image";

export default function FeaturesSection() {
  return (
    <section className="py-5 home-our-feature">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="">
            Our <span >Features</span>
          </h2>
          <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '700px' }}>
            From choosing your design to perfect nails — all in just 15 minutes. No waiting, no mess, no stress.
          </p>
        </div>

        {/* Feature 1: Nail Compass/Marketplace */}
        <div className="row align-items-center mb-5 pb-5 justify-content-between">
          <div className="col-lg-7 mb-4 mb-lg-0">
            <div className="d-flex flex-column gap-4">
              <div className="d-flex align-items-center gap-3">
                <div className="feature-icon-box">
                  <Image src="/images/logo.png" width={36} height={44} alt="" />
                </div>
                <h3 className="fw-bold mb-0">Nail Compass/Marketplace</h3>
              </div>
              <p className=" text-muted">
                Browse 1000+ nail art designs from trending styles to classic looks. Use AI suggestions based on your preferences. Save favorites and book instantly through our easy app. From French tips to custom 3D art — we have it all.Browse 1000+ nail art designs from trending styles to classic looks. Use AI suggestions based on your preferences. Save favorites and book instantly.
              </p>
              <div className="d-flex align-items-center gap-3">
                <Image src="/images/googleplay.png" width={173.96} height={50.32} alt="" />
                <Image src="/images/app-store-icon.png" width={173.96} height={50.32} alt="" />
              </div>
            </div>
          </div>
          <div className="col-lg-5 feature-right text-end">
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
          </div>
        </div>

        {/* Feature 2: Booking a Service w/ a Salon */}
        <div className="row align-items-center mb-5 pb-5 justify-content-between">

          <div className="col-lg-5 feature-left">
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
          </div>
          <div className="col-lg-7 mb-4 mb-lg-0">
            <div className="d-flex flex-column gap-4">
              <div className="d-flex align-items-center gap-3">
                <div className="feature-icon-box">
                  <Image src="/images/logo.png" width={36} height={44} alt="" />
                </div>
                <h3 className="fw-bold mb-0">Booking a Service w/ a Salon</h3>
              </div>
              <p className=" text-muted">
                Browse 1000+ nail art designs from trending styles to classic looks. Use AI suggestions based on your preferences. Save favorites and book instantly through our easy app. From French tips to custom 3D art — we have it all.Browse 1000+ nail art designs from trending styles to classic looks. Use AI suggestions based on your preferences. Save favorites and book instantly.
              </p>
              <div className="d-flex align-items-center gap-3">
                <Image src="/images/googleplay.png" width={173.96} height={50.32} alt="" />
                <Image src="/images/app-store-icon.png" width={173.96} height={50.32} alt="" />
              </div>
            </div>
          </div>
        </div>

        {/* Feature 3: Nail Compass/Marketplace */}
        <div className="row align-items-center mb-5 pb-5 justify-content-between">
          <div className="col-lg-7 mb-4 mb-lg-0">
            <div className="d-flex flex-column gap-4">
              <div className="d-flex align-items-center gap-3">
                <div className="feature-icon-box">
                  <Image src="/images/logo.png" width={36} height={44} alt="" />
                </div>
                <h3 className="fw-bold mb-0">Battles</h3>
              </div>
              <p className=" text-muted">
                Browse 1000+ nail art designs from trending styles to classic looks. Use AI suggestions based on your preferences. Save favorites and book instantly through our easy app. From French tips to custom 3D art — we have it all.Browse 1000+ nail art designs from trending styles to classic looks. Use AI suggestions based on your preferences. Save favorites and book instantly.
              </p>
              <div className="d-flex align-items-center gap-3">
                <Image src="/images/googleplay.png" width={173.96} height={50.32} alt="" />
                <Image src="/images/app-store-icon.png" width={173.96} height={50.32} alt="" />
              </div>
            </div>
          </div>
          <div className="col-lg-5 feature-right text-end">
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
          </div>
        </div>

        {/* Feature 4: Booking a Service w/ a Salon */}
        <div className="row align-items-center mb-5 pb-5 justify-content-between">

          <div className="col-lg-5 feature-left">
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
          </div>
          <div className="col-lg-7 mb-4 mb-lg-0">
            <div className="d-flex flex-column gap-4">
              <div className="d-flex align-items-center gap-3">
                <div className="feature-icon-box">
                  <Image src="/images/logo.png" width={36} height={44} alt="" />
                </div>
                <h3 className="fw-bold mb-0">Battle Winners</h3>
              </div>
              <p className=" text-muted">
                Browse 1000+ nail art designs from trending styles to classic looks. Use AI suggestions based on your preferences. Save favorites and book instantly through our easy app. From French tips to custom 3D art — we have it all.Browse 1000+ nail art designs from trending styles to classic looks. Use AI suggestions based on your preferences. Save favorites and book instantly.
              </p>
              <div className="d-flex align-items-center gap-3">
                <Image src="/images/googleplay.png" width={173.96} height={50.32} alt="" />
                <Image src="/images/app-store-icon.png" width={173.96} height={50.32} alt="" />
              </div>
            </div>
          </div>
        </div>

        {/* Feature 3: Nail Compass/Marketplace */}
        <div className="row align-items-center justify-content-between" style={{padding:"100px 0"}}>
          <div className="col-lg-7 mb-4 mb-lg-0">
            <div className="d-flex flex-column gap-4">
              <div className="d-flex align-items-center gap-3">
                <div className="feature-icon-box">
                  <Image src="/images/logo.png" width={36} height={44} alt="" />
                </div>
                <h3 className="fw-bold mb-0">Join as valued service provider</h3>
              </div>
              <p className=" text-muted">
                Browse 1000+ nail art designs from trending styles to classic looks. Use AI suggestions based on your preferences. Save favorites and book instantly through our easy app. From French tips to custom 3D art — we have it all.Browse 1000+ nail art designs from trending styles to classic looks. Use AI suggestions based on your preferences. Save favorites and book instantly.
              </p>
              <div className="d-flex align-items-center gap-3">
                <Image src="/images/googleplay.png" width={173.96} height={50.32} alt="" />
                <Image src="/images/app-store-icon.png" width={173.96} height={50.32} alt="" />
              </div>
            </div>
          </div>
          <div className="col-lg-5 feature-right text-end">
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
          </div>
        </div>

        {/* Feature 4: Booking a Service w/ a Salon */}
        <div className="row align-items-center justify-content-between" style={{padding:"80px 0"}}>

          <div className="col-lg-5 feature-left">
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
          </div>
          <div className="col-lg-7 mb-4 mb-lg-0">
            <div className="d-flex flex-column gap-4">
              <div className="d-flex align-items-center gap-3">
                <div className="feature-icon-box">
                  <Image src="/images/logo.png" width={36} height={44} alt="" />
                </div>
                <h3 className="fw-bold mb-0">Everything you need to run your salon</h3>
              </div>
              <p className=" text-muted">
                Browse 1000+ nail art designs from trending styles to classic looks. Use AI suggestions based on your preferences. Save favorites and book instantly through our easy app. From French tips to custom 3D art — we have it all.Browse 1000+ nail art designs from trending styles to classic looks. Use AI suggestions based on your preferences. Save favorites and book instantly.
              </p>
              <div className="d-flex align-items-center gap-3">
                <Image src="/images/googleplay.png" width={173.96} height={50.32} alt="" />
                <Image src="/images/app-store-icon.png" width={173.96} height={50.32} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

