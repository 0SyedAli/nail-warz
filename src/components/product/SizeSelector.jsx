"use client";

export default function SizeSelector() {
  const sizes = ["Small", "Medium", "Large", "X-Large"];

  return (
    <div className="product_sizes">
      {sizes.map((size) => (
        <button
          key={size}
          className={size === "Large" ? "active" : ""}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
