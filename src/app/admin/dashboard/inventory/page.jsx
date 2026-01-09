"use client";

import { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { BsSearch, BsPencil, BsTrash } from "react-icons/bs";
import ProductModal from "@/components/Modal/ProductModal";
import DeleteProductModal from "@/components/Modal/DeleteProductModal";
import { useDisclosure } from "@chakra-ui/react";

const PAGE_SIZE = 10;

export default function SuperAdminInventory() {
    const router = useRouter();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

    const [editProduct, setEditProduct] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [counts, setCounts] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 🔐 Auth Guard
    useEffect(() => {
        if (!Cookies.get("token")) router.push("/admin/auth/login");
    }, []);

    // 🔁 Fetch Products
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/product`,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    },
                }
            );

            const json = await res.json();
            if (!json.success) throw new Error(json.message);

            setProducts(json.products);
            setFiltered(json.products);
            setCounts(json.counts);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // 🔎 Search
    useEffect(() => {
        const f = products.filter(p =>
            `${p.name} ${p.sku} ${p.category?.join(" ")}`
                .toLowerCase()
                .includes(search.toLowerCase())
        );
        setFiltered(f);
        setPage(1);
    }, [search, products]);

    // 📄 Pagination
    const currentProducts = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filtered.slice(start, start + PAGE_SIZE);
    }, [filtered, page]);

    if (loading) return <p className="m-4">Loading inventory…</p>;
    if (error) return <p className="m-4 text-danger">{error}</p>;

    return (
        <div className="page">
            <div className="dashboard_panel_inner pt-4">

                {/* ===== HEADER ===== */}
                <div className="mb-4">
                    <p className="text-muted">Manage Products For The E-Store</p>
                </div>

                {/* ===== STATS ===== */}
                {counts && (
                    <div className="row g-3 mb-4">
                        <StatCard title="Total Products" value={counts.totalProducts} />
                        <StatCard title="In Stock" value={counts.inStock} valueClass="text-success" />
                        <StatCard title="Low Stock" value={counts.lowStock} valueClass="text-warning" />
                        <StatCard title="Out of Stock" value={counts.outOfStock} valueClass="text-danger" />
                    </div>
                )}

                {/* ===== TABLE ===== */}
                <div className="card">
                    <div className="card-header bg-white d-flex justify-content-between align-items-center">
                        <div className="position-relative">
                            <BsSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                            <input
                                className="form-control ps-5"
                                style={{ width: 320 }}
                                placeholder="Search products…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>

                        <button
                            className="btn btn-dark"
                            onClick={() => {
                                setEditProduct(null);   // ADD MODE
                                onEditOpen();
                            }}
                        >
                            Add Product
                        </button>
                    </div>

                    <div className="dash_list card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Product Name</th>
                                        <th>SKU</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {currentProducts.map(p => (
                                        <tr key={p._id}>
                                            <td className="fw-semibold">{p.name}</td>
                                            <td>{p.sku}</td>
                                            <td>{p.category?.join(", ") || "-"}</td>
                                            <td>${p.price}</td>
                                            <td>{p.stock}</td>
                                            <td>
                                                <StatusBadge status={p.status} />
                                            </td>
                                            <td className="text-nowrap">
                                                <button
                                                    className="btn btn-outline-secondary btn-sm me-2"
                                                    onClick={() => {
                                                        setEditProduct(p);      // EDIT MODE
                                                        onEditOpen();
                                                    }}
                                                >
                                                    <BsPencil />
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => {
                                                        setDeleteId(p._id);     // DELETE TARGET
                                                        onDeleteOpen();
                                                    }}
                                                >
                                                    <BsTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
            <ProductModal
                isOpen={isEditOpen}
                onClose={() => {
                    setEditProduct(null);
                    onEditClose();
                }}
                product={editProduct}
                onSuccess={fetchProducts}
            />

            <DeleteProductModal
                isOpen={isDeleteOpen}
                onClose={() => {
                    setDeleteId(null);
                    onDeleteClose();
                }}
                productId={deleteId}
                onSuccess={fetchProducts}
            />
        </div>
    );
}

/* ===== COMPONENTS ===== */

const StatCard = ({ title, value, valueClass = "" }) => (
    <div className="col-md-3">
        <div className="card h-100">
            <div className="card-body">
                <p className="text-muted mb-1">{title}</p>
                <h5 className={`fw-bold ${valueClass}`}>{value}</h5>
            </div>
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const map = {
        inStock: "bg-dark",
        lowStock: "bg-secondary",
        outOfStock: "bg-danger",
    };

    return (
        <span className={`badge ${map[status] || "bg-secondary"}`}>
            {status === "inStock" && "In Stock"}
            {status === "lowStock" && "Low Stock"}
            {status === "outOfStock" && "Out of Stock"}
        </span>
    );
};
