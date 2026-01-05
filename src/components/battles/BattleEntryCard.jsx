"use client"
import Image from "next/image";
import { useState } from "react";

export default function BattleEntryCard({ participant, votes, totalVotes }) {
    const progress =
        totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
    const [imgSrc, setImgSrc] = useState(
        participant?.images?.length
            ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${participant.images[0]}`
            : "/images/warz-dummy.png"
    );
    return (
        <div className="battle-entry">

            <Image
                src={imgSrc}
                alt={participant?.name || "Battle entry"}
                width={160}
                height={160}
                className="img-fluid"
                onError={() => setImgSrc("/images/warz-dummy.png")}
            />


            <div className="entry-footer">
                <span className="fw-bold">{participant.name}</span>
                <span>{votes} votes</span>
            </div>

            <div className="entry-progress">
                <div
                    className="entry-bar"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

        </div>
    );
}
