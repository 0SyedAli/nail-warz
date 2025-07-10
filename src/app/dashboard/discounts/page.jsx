"use client";
import AreYouSure from "@/components/Modal/AreYouSure";
import { useDisclosure } from "@chakra-ui/react";
import Link from "next/link";
const edetIcon = "/images/edit-2.svg";
const deleteIcon = "/images/trash.svg";

const Discounts = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <div className="page">
        <div className="dash_head2">
          <h3>All Transactions</h3>
          <div className="dash_head2_select">
            <Link href="/dashboard/discounts/edit-discount" className="gen_btn">
              Generate Discount
            </Link>
            <select class="form-select" aria-label="Default select example">
              <option selected>sort by month</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
          </div>
        </div>
        <div className="transaction_body">
          <div className="transaction_item">
            <div className="d-flex flex-column">
              <h5>Received from James Wilson</h5>
              <div className="d-flex align-items-center gap-3">
                <h6>July 17, 2024</h6>
                <h6>Order ID : #456789</h6>
              </div>
            </div>
            <div className="ed_btns">
              <Link
                href="/dashboard/discounts/edit-discount"
                className="edit_btn"
              >
                <img src={edetIcon} alt="" />
              </Link>
              <button
                className="delete_btn"
                type="button"
                onClick={onOpen}
              >
                <img src={deleteIcon} alt="" />
              </button>
            </div>
          </div>
          <div className="transaction_item">
            <div className="d-flex flex-column">
              <h5>Received from James Wilson</h5>
              <div className="d-flex align-items-center gap-3">
                <h6>July 17, 2024</h6>
                <h6>Order ID : #456789</h6>
              </div>
            </div>
            <div className="ed_btns">
              <Link
                href="/dashboard/discounts/edit-discount"
                className="edit_btn"
              >
                <img src={edetIcon} alt="" />
              </Link>
              <button
                className="delete_btn"
                type="button"
                onClick={onOpen}
              >
                <img src={deleteIcon} alt="" />
              </button>
            </div>
          </div>
          <div className="transaction_item">
            <div className="d-flex flex-column">
              <h5>Received from James Wilson</h5>
              <div className="d-flex align-items-center gap-3">
                <h6>July 17, 2024</h6>
                <h6>Order ID : #456789</h6>
              </div>
            </div>
            <div className="ed_btns">
              <Link
                href="/dashboard/discounts/edit-discount"
                className="edit_btn"
              >
                <img src={edetIcon} alt="" />
              </Link>
              <button
                className="delete_btn"
                type="button"
                onClick={onOpen}
              >
                <img src={deleteIcon} alt="" />
              </button>
            </div>
          </div>
          <div className="transaction_item">
            <div className="d-flex flex-column">
              <h5>Received from James Wilson</h5>
              <div className="d-flex align-items-center gap-3">
                <h6>July 17, 2024</h6>
                <h6>Order ID : #456789</h6>
              </div>
            </div>
            <div className="ed_btns">
              <Link
                href="/dashboard/discounts/edit-discount"
                className="edit_btn"
              >
                <img src={edetIcon} alt="" />
              </Link>
              <button
                className="delete_btn"
                type="button"
                onClick={onOpen}
              >
                <img src={deleteIcon} alt="" />
              </button>
            </div>
          </div>
          <div className="transaction_item">
            <div className="d-flex flex-column">
              <h5>Received from James Wilson</h5>
              <div className="d-flex align-items-center gap-3">
                <h6>July 17, 2024</h6>
                <h6>Order ID : #456789</h6>
              </div>
            </div>
            <div className="ed_btns">
              <Link
                href="/dashboard/discounts/edit-discount"
                className="edit_btn"
              >
                <img src={edetIcon} alt="" />
              </Link>
              <button
                className="delete_btn"
                type="button"
                onClick={onOpen}
              >
                <img src={deleteIcon} alt="" />
              </button>
            </div>
          </div>
          <div className="transaction_item">
            <div className="d-flex flex-column">
              <h5>Received from James Wilson</h5>
              <div className="d-flex align-items-center gap-3">
                <h6>July 17, 2024</h6>
                <h6>Order ID : #456789</h6>
              </div>
            </div>
            <div className="ed_btns">
              <Link
                href="/dashboard/discounts/edit-discount"
                className="edit_btn"
              >
                <img src={edetIcon} alt="" />
              </Link>
              <button
                type="button"
                className="delete_btn"
                onClick={onOpen}
              >
                <img src={deleteIcon} alt="" />
              </button>
            </div>
          </div>
          <div className="transaction_item">
            <div className="d-flex flex-column">
              <h5>Received from James Wilson</h5>
              <div className="d-flex align-items-center gap-3">
                <h6>July 17, 2024</h6>
                <h6>Order ID : #456789</h6>
              </div>
            </div>
            <div className="ed_btns">
              <Link
                href="/dashboard/discounts/edit-discount"
                className="edit_btn"
              >
                <img src={edetIcon} alt="" />
              </Link>
              <button
                className="delete_btn"
                type="button"
                onClick={onOpen}
              >
                <img src={deleteIcon} alt="" />
              </button>
            </div>
          </div>
          <div className="transaction_item">
            <div className="d-flex flex-column">
              <h5>Received from James Wilson</h5>
              <div className="d-flex align-items-center gap-3">
                <h6>July 17, 2024</h6>
                <h6>Order ID : #456789</h6>
              </div>
            </div>
            <div className="ed_btns">
              <Link
                href="/dashboard/discounts/edit-discount"
                className="edit_btn"
              >
                <img src={edetIcon} alt="" />
              </Link>
              <button
                className="delete_btn"
                type="button"
                onClick={onOpen}
              >
                <img src={deleteIcon} alt="" />
              </button>
            </div>
          </div>
          <div className="pagination justify-content-end mt-4">
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>4</button>
            <button>&gt;&gt;</button>
          </div>
        </div>
      </div>
      <AreYouSure btntitle="Add Now" isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Discounts;
