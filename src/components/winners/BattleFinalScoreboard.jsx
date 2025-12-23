import Image from "next/image";
import VotingScores from "./VotingScores";

export default function BattleFinalScoreboard() {
    return (
        <div className="battle-leaderboard my-5">
            <h4 className="fs-h4 mb-4">Final Scoreboard</h4>

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
                    <VotingScores />
                </div>
            </div>
        </div>
    );
}
