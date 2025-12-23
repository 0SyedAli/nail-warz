import ProductCard from "./ProductCard";

export default function RelatedProducts() {
  return (
    <div className="relate_section">
      <h2>You might also like</h2>

      <div className="rs_grid">
        {[1, 2, 3, 4].map((i) => (
          <ProductCard
            key={i}
            image="/images/prod_paint.png"
            title="Lorem Ipsum Dollor"
            price="20.00"
          />
        ))}
      </div>
    </div>
  );
}
