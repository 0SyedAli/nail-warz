// import Image from "next/image";

// export default function ProductCard({ image, title, price }) {
//   return (
//     <div className="prod_card">
//       <Image
//         src={image}
//         width={200}
//         height={200}
//         alt={title}
//         className="prod_image"
//       />

//       <h4 className="prod_title">{title}</h4>
//       <span className="prod_price">${price}</span>

//       <button className="prod_btn">Add To Cart</button>
//     </div>
//   );
// }


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
      : "/images/prod_paint.png" ;

  return (
    <div className="prod_card">
      <Link href={`/store/${actions}`}>
        <Image src={image} width={200} height={200} alt={product.name} className="prod_image" />
        <h4 className="prod_title">{product.name}</h4>
        <span className="prod_price d-block">${product.price}</span>
      </Link>

      <button className="prod_btn" onClick={handleAdd}>
        Add To Cart
      </button>
    </div>
  );
}
