import Image from "next/image";

export default function ScoreRow({ name, score, img }) {
    return (
        <div className="score-row d-flex align-items-center justify-content-between">

            <div className="d-flex align-items-center gap-3">
                <Image
                    src={img}
                    alt={name}
                    width={40}
                    height={40}
                    className="score-avatar"
                />
                <span className="fw-semibold">{name}</span>
            </div>

            <strong>{score}</strong>
        </div>
    );
}
