import Image from "next/image";

export default function BattleLeaderboard() {
    return (
        <div className="battle-leaderboard my-5">

            <div className="row align-items-center">

                {/* LEFT: Podium */}
                <div className="col-lg-6 text-center mb-4 mb-lg-0">
                    <div className="position-relative">
                        <Image
                            src="/images/reward-stage.png"
                            alt="Nail Art"
                            width={534}
                            height={553}
                            className="img-fluid"
                        />
                        <div className="reward-names rn1">
                            <h6>@playername</h6>
                            <h3>7565</h3>
                        </div>
                        <div className="reward-names rn2">
                            <h6>@playername</h6>
                            <h3>7565</h3>
                        </div>
                        <div className="reward-names rn3">
                            <h6>@playername</h6>
                            <h3>7565</h3>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Prize Details */}
                <div className="col-lg-6">

                    {[1, 2, 3].map((pos) => (
                        <div key={pos} className="prize-row d-flex align-items-center gap-3 mb-4">
                            <Image
                                src={`/images/rew${pos}.png`}
                                alt="Nail Art"
                                width={122}
                                height={122}
                                className="img-fluid"
                            />

                            <div>
                                <h6 className="fw-bold mb-1">Prize Detail</h6>
                                <p className="text-muted mb-0">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </p>
                            </div>

                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}
