"use client";

import Image from "next/image";
import { useState } from "react";

export default function ScoreRow({ name, score, img }) {
  const [src, setSrc] = useState(
    img?.length
      ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${img[0]}`
      : "/images/warz-dummy.png"
  );

  return (
    <div className="score-row d-flex align-items-center justify-content-between">

      <div className="d-flex align-items-center gap-3">
        <Image
          src={src}
          alt={name}
          width={40}
          height={40}
          className="score-avatar"
          onError={() => setSrc("/images/warz-dummy.png")}
        />
        <span className="fw-semibold">{name}</span>
      </div>

      <strong>{score}</strong>
    </div>
  );
}
