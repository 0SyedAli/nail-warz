// "use client";

// import RatingStars from "./RatingStars";
// import SizeSelector from "./SizeSelector";
// import QuantitySelector from "./QuantitySelector";

// export default function ProductInfo() {
//   return (
//     <div className="product-info">

//       <h1 className="product-title">
//         Lorem ipsum Dollor
//       </h1>

//       <div className="d-flex align-items-center gap-2 mb-2">
//         <RatingStars rating={4.5} />
//         <span className="rating-text">4.5/5</span>
//       </div>

//       <div className="d-flex align-items-center gap-3 mb-2">
//         <span className="price-current">$260</span>
//         <span className="price-old">$300</span>
//         <span className="price-discount">-40%</span>
//       </div>
//       <p className="product-desc">
//         Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
//         tempor incididunt ut labore et dolore magna aliqua.
//       </p>

//       <hr />

//       <div className="mb-3">
//         <small className="text-muted d-block mb-2">Lorem ipsum</small>
//         <div className="d-flex gap-3">
//           <span className="color-dot color-1 active"></span>
//           <span className="color-dot color-2"></span>
//           <span className="color-dot color-3"></span>
//         </div>
//       </div>

//       <hr />

//       <div className="mb-3">
//         <small className="text-muted d-block mb-2">Choose Size</small>
//         <SizeSelector />
//       </div>

//       <hr />

//       <div className="d-flex align-items-center gap-3 mt-4">
//         <QuantitySelector />
//         <button className="btn btn-danger add-to-cart-btn">
//           Add To Cart
//         </button>
//       </div>

//     </div>
//   );
// }


"use client";

import RatingStars from "./RatingStars";
import QuantitySelector from "./QuantitySelector";

export default function ProductInfo({ product }) {
  return (
    <div className="product-info">
      <h1 className="product-title">{product.name}</h1>

      <div className="d-flex align-items-center gap-2 mb-2">
        <RatingStars rating={4.5} />
        <span className="rating-text">4.5/5</span>
      </div>

      <div className="d-flex align-items-center gap-3 mb-2">
        <span className="price-current">${product.price}</span>

        {product.status === "lowStock" && (
          <span className="badge bg-warning">Low Stock</span>
        )}

        {product.status === "outOfStock" && (
          <span className="badge bg-danger">Out of Stock</span>
        )}
      </div>

      <p className="product-desc">
        SKU: <strong>{product.sku}</strong>
      </p>

      <p className="product-desc">
        Categories: {product.category.join(", ")}
      </p>

      <hr />

      <div className="d-flex align-items-center gap-3 mt-4">
        <QuantitySelector max={product.stock} />

        <button
          className="btn btn-danger add-to-cart-btn"
          disabled={product.status === "outOfStock"}
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
}
