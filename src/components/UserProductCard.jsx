import { useDisclosure } from "@chakra-ui/react";

import AddNow from "./Modal/AddNow";
const productimage1 = "/images/product1.jpg";
const edit_icon = "/images/edit_icon.png";
const UserProductCard = ({ checked }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div className="product_card">
      <img className="product_image" src={productimage1} />
      <div className="product_top">
        <div className="status_td">
          <span>In Stock</span>
        </div>
        <h3>$48</h3>
      </div>
      <h3>Orange Juice</h3>
      <div className="product_bottom justify-content-end pt-0">
        <button
          type="button"
          className="border-0 bg-transparent"
          onClick={onOpen}
        >
          <img src={edit_icon} />
        </button>
      </div>
      <AddNow btntitle="Edit" isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export default UserProductCard;
