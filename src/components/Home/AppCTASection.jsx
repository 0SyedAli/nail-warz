"use client";

import Image from "next/image";

export default function AppCTASection() {
  return (
    <section className="py-5 text-center position-relative cta_bg" >
      <div className="container">
        <div className="d-flex justify-content-center mb-4">
          <Image
            src="/images/logo.png"
            alt="NAIL WARZ"
            width={196}
            height={178}
            priority
            className="img-fluid"
            style={{ height: '178px', objectFit:"contain" }}
          />
        </div>
        <h3 className="text-white mb-2 fw-medium">Love Our Application?</h3>
        <h3 className="text-white mb-2 fw-bolder">Download Now</h3>
        
        <p className="text-white fs-6 mb-4" style={{ opacity: 0.9 }}>
          Your One-Stop Shop for the Nail Care Industry
        </p>
        <div className="d-flex align-items-center justify-content-center gap-3">
          <Image src="/images/googleplay.png" width={173.96} height={50.32} alt="" />
          <Image src="/images/app-store-icon.png" style={{
            filter: "brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(7472%) hue-rotate(114deg) brightness(109%) contrast(97%)"
          }} width={173.96} height={50.32} alt="" />
        </div>
      </div>
    </section>
  );
}

