
const productimage1 = "/images/product1.jpg";
const VariantProduct = ({ title, quantity, price }) => {
  return (
    <div className="product_card">
      <img className="product_image" src={productimage1} />
      <div className="d-flex align-items-center justify-content-between">
        <h4>{title}</h4>
        <div className="product_top">
          <h4>${price ? price : "48"}</h4>
        </div>
      </div>
      <h5 className="quanity_h5">Quantity: {quantity}</h5>
    </div>
  );
};

export default VariantProduct;
