import { AddNewProduct } from "../AddNewProduct/page";
import Modal from "./layout";
import "./modal.css";

function AddNow({ isOpen, onClose, btntitle }) {
  return (
    <>
      {/* Passing AddNewProduct as children to Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <AddNewProduct title="22" btntitle={btntitle} />

      </Modal>
    </>
  );
}

export default AddNow;
