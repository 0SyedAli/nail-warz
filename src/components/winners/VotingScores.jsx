import ScoreRow from "./ScoreRow";

const scores = [
  { name: "Alicia", score: 7050, img: "/images/userp2.png" },
  { name: "John", score: 6930, img: "/images/userp2.png" },
  { name: "Alex", score: 6320, img: "/images/userp2.png" },
  { name: "Clinton", score: 5990, img: "/images/userp2.png" },
  { name: "Olivia", score: 4870, img: "/images/userp2.png" },
  { name: "Smith", score: 3750, img: "/images/userp2.png" },
  { name: "Mike", score: 2341, img: "/images/userp2.png" },
];

export default function VotingScores() {
  return (
    <div className="voting-score-container">
      <div className="voting-box">
        <div>
          {scores.map((item, index) => (
            <ScoreRow key={index} {...item} />
          ))}
        </div>

      </div>
    </div>
  );
}
