"use client";

import { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { BsSearch, BsPencil, BsTrash } from "react-icons/bs";
import ProductModal from "@/components/Modal/ProductModal";
import DeleteProductModal from "@/components/Modal/DeleteProductModal";
import { useDisclosure, Skeleton } from "@chakra-ui/react";

const PAGE_SIZE = 10;

export default function SuperAdminInventory() {
    const router = useRouter();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const [showAll, setShowAll] = useState(true);
    const [smartStatus, setSmartStatus] = useState(null);
    const [smartFilter, setSmartFilter] = useState(null);

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

    const handleSmartStatus = (status) => {
        setSmartStatus(status);
        setSmartFilter(null);
        setSearch("");
        setPage(1);
        fetchProducts(status, null, null);
    };

    const handleSmartFilter = (filter) => {
        setSmartFilter(filter);
        setSmartStatus(null);
        setSearch("");
        setPage(1);
        fetchProducts(null, filter, null);
    };

    const handleSmartShowAll = (filter) => {
        setShowAll(filter);
        setSmartStatus(null);
        setSmartFilter(null);
        setSearch("");
        setPage(1);
        fetchProducts(null, null, filter);
    };

    // 🔁 Fetch Products
    const fetchProducts = async (status = null, filter = null, showAll = false) => {
        setLoading(true);
        try {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/product`;

            const params = new URLSearchParams();
            if (status) params.append("status", status);
            if (filter) params.append("smartFilter", filter);
            if (showAll) params.append("showAll", showAll);

            const queryString = params.toString();
            if (queryString) {
                url += `?${queryString}`;
            }

            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`,
                },
            });

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
        fetchProducts(smartStatus, smartFilter, showAll);
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
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

    // 📄 Pagination
    const currentProducts = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filtered.slice(start, start + PAGE_SIZE);
    }, [filtered, page]);

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
                    <div className="card-header bg-white">
                        <div className="d-flex justify-content-between align-items-center">

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
                        <div className="d-flex flex-wrap gap-2 my-2">
                            <button
                                className={`btn btn-sm ${showAll === true && smartStatus === null && smartFilter === null ? "btn-dark" : "btn-outline-dark"}`}
                                onClick={() => handleSmartShowAll(true)}
                            >
                                Show All
                            </button>
                            <button
                                className={`btn btn-sm ${smartStatus === "outOfStock" ? "btn-dark" : "btn-outline-dark"}`}
                                onClick={() => handleSmartStatus("outOfStock")}
                            >
                                Out Of Stock
                            </button>

                            <button
                                className={`btn btn-sm ${smartStatus === "inStock" ? "btn-dark" : "btn-outline-dark"}`}
                                onClick={() => handleSmartStatus("inStock")}
                            >
                                In Stock
                            </button>

                            <button
                                className={`btn btn-sm ${smartStatus === "lowStock" ? "btn-dark" : "btn-outline-dark"}`}
                                onClick={() => handleSmartStatus("lowStock")}
                            >
                                Low Stock
                            </button>

                            <button
                                className={`btn btn-sm ${smartFilter === "bestSeller" ? "btn-dark" : "btn-outline-dark"}`}
                                onClick={() => handleSmartFilter("bestSeller")}
                            >
                                Best Seller
                            </button>



                        </div>
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
                                        <th>Is Active</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {loading ? (
                                        Array.from({ length: 7 }).map((_, index) => (
                                            <tr key={index}>
                                                <td><Skeleton height="20px" width="130px" /></td>
                                                <td><Skeleton height="20px" width="80px" /></td>
                                                <td><Skeleton height="20px" width="100px" /></td>
                                                <td><Skeleton height="20px" width="50px" /></td>
                                                <td><Skeleton height="20px" width="40px" /></td>
                                                <td><Skeleton height="20px" width="70px" /></td>
                                                <td><Skeleton height="20px" width="70px" /></td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <Skeleton height="30px" width="30px" />
                                                        <Skeleton height="30px" width="30px" />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        currentProducts.map(p => (
                                            <tr key={p._id}>
                                                <td className="fw-semibold">{p.name}</td>
                                                <td>{p.sku}</td>
                                                <td>{p.category?.join(", ") || "-"}</td>
                                                <td>${p.price}</td>
                                                <td>{p.stock}</td>
                                                <td>
                                                    <StatusBadge status={p.status} />
                                                </td>
                                                <td>
                                                    <ActiveBadge status={p.isActive ? "active" : "inactive"} />
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
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {totalPages > 1 && (
                    <div className="pagination justify-content-end mt-4">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            &lt;
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                            <button
                                key={n}
                                className={n === page ? "active" : ""}
                                onClick={() => setPage(n)}
                            >
                                {n}
                            </button>
                        ))}
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            &gt;
                        </button>
                    </div>
                )}
            </div>
            <ProductModal
                isOpen={isEditOpen}
                onClose={() => {
                    setEditProduct(null);
                    onEditClose();
                }}
                product={editProduct}
                onSuccess={() => fetchProducts(smartStatus, smartFilter)}
            />

            <DeleteProductModal
                isOpen={isDeleteOpen}
                onClose={() => {
                    setDeleteId(null);
                    onDeleteClose();
                }}
                productId={deleteId}
                onSuccess={() => fetchProducts(smartStatus, smartFilter)}
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
        inStock: "bg-success",
        lowStock: "bg-warning",
        outOfStock: "bg-danger",
    };

    return (
        <span className={`badge py-2 ${map[status] || "bg-secondary"}`}>
            {status === "inStock" && "In Stock"}
            {status === "lowStock" && "Low Stock"}
            {status === "outOfStock" && "Out of Stock"}
        </span>
    );
};

const ActiveBadge = ({ status }) => {
    const map = {
        active: "bg-dark",
        inactive: "bg-light text-black",
    };

    return (
        <span className={`badge py-2 ${map[status] || "bg-secondary"}`}>
            {status === "active" && "Active"}
            {status === "inactive" && "InActive"}
        </span>
    );
};
