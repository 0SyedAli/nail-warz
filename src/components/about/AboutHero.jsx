import Image from "next/image";

export default function AboutHero() {
  return (
    <div className="row align-items-center py-5 gy-4">
      <div className="col-md-5">
        <div className="battle-hero-img battle-hero-img2">
          <Image
            src="/images/logo.png"
            alt="Galaxy Nails"
            width={380}
            height={380}
            className="img-fluid"
          />
        </div>
      </div>
      {/* Image */}
      <div className="col-md-7">
        {/* Content */}
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <div className="feature-icon-box">
              <Image src="/images/logo.png" width={400} height={400} alt="" />
            </div>
            <h4 className="mb-0 battle-title2">About</h4>
          </div>
          <p className="battle-desc mb-0">
            Founded in 2020, Nail Warz was created to bring innovation, trust, and creativity to the nail care
            industry. Built with the nail care consumer, or “Nailee” at the center, our platform is designed to
            simplify discovery, save time, elevate transparency, and create meaningful connections between
            consumers and professionals. Nail Warz exists to provide customers with a trustworthy digital
            environment, establish a new gold standard for the industry, and introduce fun, elevated
            competition that celebrates creativity.
          </p>
        </div>
      </div>
    </div>
  );
}
