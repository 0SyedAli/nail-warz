import Link from "next/link";
import BattleEntryCard from "./BattleEntryCard";

export default function Battles({ title, battles }) {
    if (!battles || battles.length === 0) return null;

    return (
        <div className="py-4">
            <h3 className="fw-bold mb-3 battle-title3">
                {title} Battles
            </h3>

            {battles.map((battle) => (
                <div key={battle._id} className="active-battle-card mb-5">

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <h5 className="battle-title2 mb-1">
                                {battle.name}
                            </h5>
                            <small className="text-muted">
                                Ends on {new Date(battle.endDate).toDateString()}
                            </small>
                        </div>

                        {battle.status === "active" && (
                            <span className="live-badge">● Live</span>
                        )}
                    </div>

                    <div className="d-flex gap-3 overflow-auto pb-3">
                        {battle.participants.map((p, index) => (
                            <BattleEntryCard
                                key={p.participant._id}
                                participant={p.participant}
                                votes={p.vote.length}
                                totalVotes={battle.totalVotes}
                            />
                        ))}
                    </div>

                    <Link
                        href={`/votingscores?battleId=${battle._id}`}
                        className="btn active-battle-btn"
                    >
                        VIEW THE SCORE BOARD
                    </Link>
                </div>
            ))}
        </div>
    );
}
