"use client";
import { useState } from "react";

export default function QuantitySelector() {
  const [qty, setQty] = useState(1);

  return (
    <div className="qty">
      <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
      <span>{qty}</span>
      <button onClick={() => setQty(qty + 1)}>+</button>
    </div>
  );
}
