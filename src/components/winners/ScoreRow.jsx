"use client";

import Image from "next/image";
import { useState } from "react";

export default function ScoreRow({ position, name, score, images }) {
    const [img, setImg] = useState(
        images?.length
            ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${images[0]}`
            : "/images/warz-dummy.png"
    );

    return (
        <div className="score-row d-flex align-items-center justify-content-between">

            <div className="d-flex align-items-center gap-3">
                <span className="fw-bold">{position}</span>

                <Image
                    src={img}
                    alt={name}
                    width={40}
                    height={40}
                    className="score-avatar"
                    onError={() => setImg("/images/warz-dummy.png")}
                />

                <span className="fw-semibold">{name}</span>
            </div>

            <strong>{score}</strong>
        </div>
    );
}
