"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import Modal from "./layout";
import MultiImageUpload from "../MultiImageUpload";

export default function ProductModal({ isOpen, onClose, product, onSuccess }) {
    const isEdit = Boolean(product);

    const [form, setForm] = useState({
        name: "",
        sku: "",
        category: "",
        price: "",
        stock: "",
        unitType: "piece",
        images: []
    });

    const [loading, setLoading] = useState(false);

    // Prefill for edit
    useEffect(() => {
        if (product) {
            setForm({
                name: product.name || "",
                sku: product.sku || "",
                category: product.category?.join(", ") || "",
                price: product.price || "",
                stock: product.stock || "",
                unitType: product.unitType || "piece",
                images: Array.isArray(product.images) ? product.images : [] // ✅ FIX
            });
        } else {
            setForm({
                name: "",
                sku: "",
                category: "",
                price: "",
                stock: "",
                unitType: "piece",
                images: [] // ✅ ALWAYS ARRAY
            });
        }
    }, [product, isOpen]);


    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);

        try {
            const fd = new FormData();

            fd.append("name", form.name);
            fd.append("sku", form.sku);
            fd.append("price", form.price);
            fd.append("stock", form.stock);
            fd.append("unitType", form.unitType);

            // categories as array
            form.category
                .split(",")
                .map(c => c.trim())
                .forEach(cat => fd.append("category[]", cat));

            // 🔥 IMAGES (VERY IMPORTANT)
            const imgs = Array.isArray(form.images) ? form.images : [];
            console.log("form.images:", form.images, "isArray:", Array.isArray(form.images));

            // imgs.forEach((img) => {
            //     if (img instanceof File) {
            //         fd.append("images", img);
            //     } else if (typeof img === "string") {
            //         fd.append("images", img);
            //     }
            // });
            imgs.forEach((img) => {
                if (img instanceof File) {
                    fd.append("images", img);
                }
            });

            if (isEdit) {
                await api.patch(
                    `/superAdmin/product/${product._id}`,
                    fd,
                    {
                        headers: {
                            Authorization: `Bearer ${Cookies.get("token")}`,
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );
            } else {
                await api.post(
                    `/superAdmin/product`,
                    fd,
                    {
                        headers: {
                            Authorization: `Bearer ${Cookies.get("token")}`,
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error("Save failed", err);
            alert("Failed to save product");
        } finally {
            setLoading(false);
        }
    };


    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="product_modal_body">
                <div className="modal-header">
                    <h5>{isEdit ? "Edit Product" : "Add New Product"}</h5>
                    <button onClick={onClose}>×</button>
                </div>

                <p className="text-muted mb-3">
                    {isEdit
                        ? "Update product information."
                        : "Add a new product to the inventory."}
                </p>
                <div>
                    <MultiImageUpload
                        images={Array.isArray(form.images) ? form.images : []}
                        setImages={(imgs) =>
                            setForm(prev => ({
                                ...prev,
                                images: Array.isArray(imgs) ? imgs : [],
                            }))
                        }
                    />
                </div>
                <div>
                    <label htmlFor="" >Product Name</label>
                    <input
                        name="name"
                        placeholder="Enter product name"
                        value={form.name}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="" >Category</label>
                    <input
                        name="category"
                        placeholder="Enter category"
                        value={form.category}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid-2">
                    <div>
                        <label htmlFor="" >Price</label>
                        <input
                            name="price"
                            placeholder="0.00"
                            type="number"
                            value={form.price}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="" >Stock</label>
                        <input
                            name="stock"
                            placeholder="0"
                            type="number"
                            value={form.stock}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="" >SKU</label>
                    <input
                        name="sku"
                        placeholder="Enter SKU"
                        value={form.sku}
                        onChange={handleChange}
                    />
                </div>

                <button
                    className="btn btn-dark w-100 mt-3"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
                </button>
            </div>
        </Modal >
    );
}
