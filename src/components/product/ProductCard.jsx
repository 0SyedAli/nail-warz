"use client";

import Image from "next/image";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/slice/cartSlice";
import Link from "next/link";

export default function ProductCard({ product, actions }) {
  const dispatch = useDispatch();

  const handleAdd = () => {
    dispatch(addToCart({
      _id: product._id,
      name: product.name,
      sku: product.sku,
      price: product.price,
      images: product.images,
      qty: 1,
    }));
  };

  const image =
    product.images && product.images?.length > 0
      ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.images[0]}`
      : "/images/prod_paint.png";

  // Check stock status and determine if the product is in stock or out of stock
  const isInStock = product.stock > 0 && product.status === "inStock"; // Product is in stock if stock > 0 and status is "inStock"
  const isOutOfStock = product.stock === 0 || product.status === "outOfStock"; // Product is out of stock if stock is 0 or status is "outOfStock"
  const isLowStock = product.stock > 0 && product.stock <= 5 && product.status === "inStock"; // Product is low stock if stock is between 1 and 5

  return (
    <div className="prod_card">
      <Link href={`/store/${actions}`}>
        <Image
          src={image}
          width={200}
          height={200}
          alt={product.name}
          className="prod_image"
        />
        <h4 className="prod_title">{product.name}</h4>
        <span className="prod_price d-block">${product.price}</span>
      </Link>

      {/* Display Stock Status */}
      {isOutOfStock && (
        <span className="prod_stock_status out_of_stock">Out of Stock</span>
      )}
      {isLowStock && !isOutOfStock && (
        <span className="prod_stock_status low_stock">Low Stock</span>
      )}
      {isInStock && !isLowStock && !isOutOfStock && (
        <span className="prod_stock_status in_stock">In Stock</span>
      )}

      {/* Add to Cart Button */}
      <button
        className="prod_btn pb_atc_btn"
        onClick={handleAdd}
        disabled={isOutOfStock} // Disable button if the product is out of stock
      >
        Add To Cart
      </button>
    </div>
  );
}
