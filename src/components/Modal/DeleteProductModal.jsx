"use client";

import api from "@/lib/axios";
import Cookies from "js-cookie";
import Modal from "./layout";

export default function DeleteProductModal({ isOpen, onClose, productId, onSuccess }) {

    const handleDelete = async () => {
        if (!productId) return;
        try {
            await api.delete(
                `/superAdmin/product/${productId}`,
                { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
            );
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Delete failed", err);
            alert("Failed to delete product");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="modal-body">
                <h2 className="px-4 pb-0 text-center">
                    Delete Product
                </h2>
                <p className="text-muted text-center">
                    Are you sure you want to delete this category?
                </p>
                <div className="aus_btns d-flex align-items-center justify-content-center gap-3">
                    <button
                        className="themebtn4 red btn"
                        onClick={onClose}
                    >
                        No
                    </button>

                    <button
                        className="themebtn4 green btn"
                        onClick={handleDelete}
                    >
                        Yes
                    </button>
                </div>
            </div>
        </Modal>
    );
}
