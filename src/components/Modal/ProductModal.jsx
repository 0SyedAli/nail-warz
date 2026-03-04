"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Modal from "./layout";
import MultiImageUpload from "../MultiImageUpload";
import { BsUpload } from "react-icons/bs";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import * as Yup from "yup";
const productSchema = Yup.object().shape({
    name: Yup.string()
        .trim()
        .required("Product name is required")
        .min(3, "Minimum 3 characters required"),

    sku: Yup.string()
        .trim()
        .required("SKU is required")
        .min(2, "SKU must be at least 2 characters"),

    category: Yup.array()
        .of(Yup.string().trim())
        .min(1, "At least one category is required"),

    price: Yup.number()
        .typeError("Price must be a number")
        .required("Price is required")
        .positive("Price must be greater than 0"),

    stock: Yup.number()
        .typeError("Stock must be a number")
        .required("Stock is required")
        .min(0, "Stock cannot be negative"),

    unitType: Yup.string()
        .required("Unit type is required"),
    isActive: Yup.boolean().required("Status is required"),
});
export default function ProductModal({ isOpen, onClose, product, onSuccess }) {
    const isEdit = Boolean(product);
    const [categoryInput, setCategoryInput] = useState("");
    const [removedMedia, setRemovedMedia] = useState([]);
    const [form, setForm] = useState({
        name: "",
        sku: "",
        category: [],
        price: "",
        stock: "",
        unitType: "piece",
        images: [],
        videos: [],
        isActive: true,   // ✅ ADD THIS
    });

    const [loading, setLoading] = useState(false);

    /* ================= PREFILL ================= */
    useEffect(() => {
        if (product) {

            const media = Array.isArray(product.media) ? product.media : [];

            const images = media.filter(m =>
                /\.(jpg|jpeg|png|webp)$/i.test(m)
            );

            const videos = media.filter(m =>
                /\.(mp4|mov|avi|webm)$/i.test(m)
            );

            setForm({
                name: product.name || "",
                sku: product.sku || "",
                category: Array.isArray(product?.category)
                    ? product.category
                    : [],
                price: product.price || "",
                stock: product.stock || "",
                unitType: product.unitType || "piece",
                isActive: product.isActive ?? true,   // ✅ ADD THIS
                images,
                videos
            });
        } else {
            setForm({
                name: "",
                sku: "",
                category: [],
                price: "",
                stock: "",
                unitType: "piece",
                images: [],
                videos: [],
                isActive: true,
            });
        }
    }, [product, isOpen]);

    /* ================= INPUT CHANGE ================= */
    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleAddCategory = () => {
        const value = categoryInput.trim();

        if (!value) return;
        if (form.category.includes(value)) {
            showErrorToast("Category already added");
            return;
        }
        setForm(prev => ({
            ...prev,
            category: [...prev.category, value]
        }));

        setCategoryInput("");
    };

    const handleRemoveCategory = (index) => {
        setForm(prev => ({
            ...prev,
            category: prev.category.filter((_, i) => i !== index)
        }));
    };
    /* ================= SUBMIT ================= */
    const handleSubmit = async () => {

        try {
            await productSchema.validate(form, { abortEarly: false });
        } catch (validationError) {
            if (validationError.inner) {
                validationError.inner.forEach(err => {
                    showErrorToast(err.message);
                });
            } else {
                showErrorToast(validationError.message);
            }
            return;
        }

        if (form.images.length > 5) {
            showErrorToast("Maximum 5 images allowed");
            return;
        }

        if (form.videos.length > 3) {
            showErrorToast("Maximum 3 videos allowed");
            return;
        }

        setLoading(true);

        try {
            const fd = new FormData();

            fd.append("name", form.name);
            fd.append("sku", form.sku);
            fd.append("price", form.price);
            fd.append("stock", form.stock);
            fd.append("unitType", form.unitType);
            fd.append("isActive", form.isActive);
            fd.append("category", JSON.stringify(form.category));

            /* ===== IMAGES ===== */
            form.images.forEach(file => {
                if (file instanceof File) {
                    fd.append("images", file);
                }
            });

            /* ===== VIDEOS ===== */
            form.videos.forEach(file => {
                if (file instanceof File) {
                    fd.append("videos", file);
                }
            });

            /* ===== REMOVED MEDIA ===== */
            if (removedMedia.length > 0) fd.append("removedMedia", JSON.stringify(removedMedia));

            const url = isEdit
                ? `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/product/${product._id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/product`;

            const method = isEdit ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`,
                    // ❗ DO NOT set Content-Type manually for FormData
                },
                body: fd
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to save product");
            }

            showSuccessToast(isEdit ? "Product updated successfully" : "Product added successfully");

            onSuccess();
            onClose();
        } catch (err) {
            console.error("Save failed", err);
            showErrorToast("Failed to save product");
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

                {/* ================= IMAGES ================= */}
                <MultiImageUpload
                    images={form.images}
                    setImages={(value) =>
                        setForm(prev => ({
                            ...prev,
                            images:
                                typeof value === "function"
                                    ? value(prev.images)
                                    : value.slice(0, 5)
                        }))
                    }
                    setRemovedMedia={setRemovedMedia}
                />
                {/* ================= VIDEOS ================= */}
                <div className="multi-image-upload">
                    <label className="upload-box">
                        <BsUpload />
                        <span>Upload Videos (Max 3) </span>

                        <input
                            type="file"
                            accept="video/*"
                            multiple
                            hidden
                            onChange={(e) => {
                                const files = Array.from(e.target.files);
                                if (!files.length) return;

                                setForm(prev => ({
                                    ...prev,
                                    videos: [...prev.videos, ...files].slice(0, 3)
                                }));
                            }}
                        />
                    </label>


                    {/* <div className="d-flex gap-2 mt-2 flex-wrap">
                        {form.videos.map((vid, i) => {
                            const src =
                                vid instanceof File
                                    ? URL.createObjectURL(vid)
                                    : `${process.env.NEXT_PUBLIC_IMAGE_URL}/${vid}`;

                            return (
                                <video
                                    key={i}
                                    src={src}
                                    width="120"
                                    height="80"
                                    controls
                                    autoPlay
                                    style={{ borderRadius: 6 }}
                                />
                            );
                        })}
                    </div> */}
                    <div className="d-flex gap-2 mt-2 flex-wrap">
                        {form.videos.map((vid, i) => {
                            const isFile = vid instanceof File;

                            const src = isFile
                                ? URL.createObjectURL(vid)
                                : `${process.env.NEXT_PUBLIC_IMAGE_URL}/${vid}`;

                            return (
                                <div
                                    key={i}
                                    style={{
                                        position: "relative",
                                        width: 120,
                                        height: 80,
                                    }}
                                >
                                    <video
                                        src={src}
                                        width="120"
                                        height="80px"
                                        controls
                                        autoPlay
                                        muted
                                        style={{ borderRadius: 6, objectFit: "cover", height: "80px" }}
                                    />

                                    {/* REMOVE BUTTON */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const videoToRemove = form.videos[i];

                                            if (typeof videoToRemove === "string") {
                                                setRemovedMedia(prev => [...prev, videoToRemove]);
                                            }

                                            setForm(prev => ({
                                                ...prev,
                                                videos: prev.videos.filter((_, index) => index !== i)
                                            }));
                                        }}
                                        style={{
                                            position: "absolute",
                                            top: -8,
                                            right: -8,
                                            background: "#dc3545",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "50%",
                                            width: 22,
                                            height: 22,
                                            fontSize: 12,
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ================= FORM ================= */}
                <div>
                    <label>Product Name</label>
                    <input name="name" value={form.name} onChange={handleChange} />
                </div>

                {/* <div>
                    <label>Category</label>
                    <input name="category" value={form.category} onChange={handleChange} />
                </div> */}
                {/* <div>
                    <label>Category</label>

                    <Select
                        isMulti
                        value={
                            Array.isArray(form.category)
                                ? form.category.map(cat => ({ label: cat, value: cat }))
                                : []
                        }
                        onChange={(selected) =>
                            setForm(prev => ({
                                ...prev,
                                category: selected ? selected.map(s => s.value) : []
                            }))
                        }
                        options={[]}
                        placeholder="Select or type categories"
                    />
                </div> */}

                <div className="mb-2">
                    <label>Category</label>

                    <div style={{ display: "flex", gap: 10 }}>
                        <input
                            type="text"
                            value={categoryInput}
                            onChange={(e) => setCategoryInput(e.target.value)}
                            placeholder="Type category"
                            className="mb-0"
                        />

                        <button
                            type="button"
                            onClick={handleAddCategory}
                            style={{
                                padding: "6px 12px",
                                background: "#000",
                                color: "#fff",
                                border: "none",
                                borderRadius: 4,
                                cursor: "pointer"
                            }}
                        >
                            Add
                        </button>
                    </div>

                    {/* CATEGORY TAGS */}
                    <div
                        style={{
                            display: "flex",
                            gap: 8,
                            marginTop: 10,
                            flexWrap: "wrap"
                        }}
                    >
                        {form.category.map((cat, index) => (
                            <div
                                key={index}
                                style={{
                                    background: "#f1f1f1",
                                    padding: "5px 10px",
                                    borderRadius: 20,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6
                                }}
                            >
                                <span>{cat}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveCategory(index)}
                                    style={{
                                        background: "red",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: 18,
                                        height: 18,
                                        fontSize: 12,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid-2">
                    <div>
                        <label>Price</label>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={form.stock}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="grid-2">

                    <div>
                        <label>SKU</label>
                        <input name="sku" value={form.sku} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="mb-2 d-block">Status</label>

                        <div className="form-check form-switch d-flex align-items-center gap-2">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                style={{
                                    width: "2.5em",
                                    marginTop: "14px"
                                }}
                                checked={form.isActive}
                                onChange={(e) =>
                                    setForm(prev => ({
                                        ...prev,
                                        isActive: e.target.checked
                                    }))
                                }
                            />
                            <span className="medium fw-semibold">
                                {form.isActive ? "Active" : "Inactive"}
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    className="btn btn-dark w-100 mt-3"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
                </button>
            </div>
        </Modal>
    );
}