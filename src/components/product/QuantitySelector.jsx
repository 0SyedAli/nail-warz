"use client";

export default function ProductQtySelector({ qty, setQty, max }) {
  return (
    <div className="qty">
      <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
      <span>{qty}</span>
      <button onClick={() => setQty(Math.min(max, qty + 1))}>+</button>
    </div>
  );
}
