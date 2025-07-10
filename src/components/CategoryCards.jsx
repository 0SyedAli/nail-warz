import Link from "next/link";

const productimage1 = "/images/product1.jpg";
const CategoryCards = ({ title }) => {
  return (
    <div className="product_card">
      <img className="product_image" src={productimage1} />
      <div className="text-center mt-3">
        <h4 className="my-3">{title}</h4>
        <Link className="button_detele" href="/dashboard/manage-product">
          Delete
        </Link>
      </div>
    </div>
  );
};

export default CategoryCards;
