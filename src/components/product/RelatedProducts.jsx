// import ProductCard from "./ProductCard";

// export default function RelatedProducts() {
//   return (
//     <div className="relate_section">
//       <h2>You might also like</h2>

//       <div className="rs_grid">
//         {[1, 2, 3, 4].map((i) => (
//           <ProductCard
//             key={i}
//             image="/images/prod_paint.png"
//             title="Lorem Ipsum Dollor"
//             price="20.00"
//           />
//         ))}
//       </div>
//     </div>
//   );
// }


// import ProductCard from "./ProductCard";

// export default function RelatedProducts({category, relatedProducts}) {
//   console.log("category", category);
//   console.log("relatedProducts", relatedProducts);

//   return (
//     <div className="relate_section mt-5">
//       <h2>You might also like</h2>

//       <div className="rs_grid">
//         {[1, 2, 3, 4].map((i) => (
//           <ProductCard
//             key={i}
//             image="/images/prod_paint.png"
//             title="Related Product"
//             price="20.00"
//           />
//         ))}
//       </div>
//     </div>
//   );
// }


import Link from "next/link";
import ProductCard from "./ProductCard";

export default function RelatedProducts({ relatedProducts = [] }) {
  if (!Array.isArray(relatedProducts) || relatedProducts.length === 0) {
    return null; // 👈 hide section if no related products
  }

  return (
    <div className="relate_section mt-5">
      <h2>You might also like</h2>

      <div className="rs_grid">
        {relatedProducts.map((item) => {
          const image =
            item.images && item.images?.length > 0
              ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${item.images[0]}`
              : "/images/placeholder.png";

          return (
            <Link
              key={item._id}
              href={`/store/${item._id}`}
              style={{ textDecoration: "none" }}
            >
              <ProductCard
                image={image}
                title={item.name}
                price={item.price}
                status={item.status}
                stock={item.stock}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
