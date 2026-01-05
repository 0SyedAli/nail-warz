import ScoreRow from "./ScoreRow";

export default function VotingScores({ leaderboard }) {
    return (
        <div className="voting-score-container">
            <div className="voting-box">
                {leaderboard.map((item, index) => (
                    <ScoreRow
                        key={item.id}
                        position={index + 1}
                        name={item.name}
                        score={item.votes}
                        images={item.images}
                    />
                ))}
            </div>
        </div>
    );
}
