import Image from "next/image";

export default function BattleHero() {
  return (
    <div className="row align-items-center py-5">
      <div className="col-5">
        <div className="battle-hero-img">
          <Image
            src="/images/warz-img1.png"
            alt="Galaxy Nails"
            width={380}
            height={380}
            className="img-fluid"
          />

          <div className="battle-votes">
            <span>Sarah M.</span>
            <span>1,245 votes</span>
          </div>

          <div className="vote-progress">
            <div className="vote-bar"></div>
          </div>
        </div>
      </div>
      {/* Image */}
      <div className="col-7">
        {/* Content */}
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <div className="feature-icon-box">
              <Image src="/images/logo.png" width={36} height={44} alt="" />
            </div>
            <h4 className="mb-0 battle-title2">Galaxy Nails Battle</h4>
          </div>

          <p className="battle-desc">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>
    </div>
  );
}
