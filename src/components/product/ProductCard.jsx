import Image from "next/image";

export default function ProductCard({ image, title, price }) {
  return (
    <div className="prod_card">
      <Image
        src={image}
        width={200}
        height={200}
        alt={title}
        className="prod_image"
      />

      <h4 className="prod_title">{title}</h4>
      <span className="prod_price">${price}</span>

      <button className="prod_btn">Add To Cart</button>
    </div>
  );
}
