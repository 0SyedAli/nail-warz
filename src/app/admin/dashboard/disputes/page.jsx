"use client";

import { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { BsSearch, BsEye } from "react-icons/bs";
import api from "@/lib/axios";

const PAGE_SIZE = 10;

export default function Disputes() {
    const router = useRouter();

    const [items, setItems] = useState([]);
    const [stats, setStats] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    // 🔐 Auth Guard
    useEffect(() => {
        if (!Cookies.get("token")) router.push("/admin/auth/login");
    }, []);

    // 🔁 Fetch contents
    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            try {
                const res = await api.get("/dispute", {
                    headers: {
                        "Authorization": `Bearer ${Cookies.get("token")}`,
                    },
                });

                if (res.data.success) {
                    setItems(res.data.disputes);
                    setStats({
                        total: res.data.count,
                        pending: res.data.disputes.filter(d => d.status === 'pending').length,
                        resolved: res.data.disputes.filter(d => d.status === 'Refunded' || d.status === 'Completed').length,
                    });
                }
            } catch (error) {
                console.error("Error fetching disputes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    // 🔍 Search
    const filtered = useMemo(() => {
        return items.filter(c =>
            `${c.userId?.username} ${c.vendorId?.salonName} ${c.reason}`
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [items, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

    const current = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filtered.slice(start, start + PAGE_SIZE);
    }, [filtered, page]);

    if (loading) return <p className="m-4 text-center">Loading disputes...</p>;

    return (
        <div className="page">
            <div className="dashboard_panel_inner pt-4">

                {/* ===== STATS ===== */}
                {stats && (
                    <div className="row g-3 mb-4">
                        <Stat title="Total Disputes" value={stats.total} />
                        <Stat title="Pending" value={stats.pending} color="text-warning" />
                        <Stat title="Resolved" value={stats.resolved} color="text-success" />
                    </div>
                )}

                {/* ===== TABLE ===== */}
                <div className="card ">
                    <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                        <h5 className="mb-0 fw-bold">Disputes List</h5>
                        <div className="position-relative">
                            <BsSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                            <input
                                className="form-control ps-5"
                                placeholder="Search by user, vendor, or reason..."
                                style={{ width: 350, borderRadius: '8px' }}
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </div>


                    <div className="dash_list card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="ps-4">User</th>
                                        <th>Vendor</th>
                                        <th>Reason</th>
                                        <th>Raised By</th>
                                        <th>Status</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {current.length > 0 ? current.map(c => (
                                        <tr key={c._id}>
                                            <td className="ps-4">
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="avatar2 rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                                                        {c.userId?.username?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="fw-semibold">{c.userId?.username}</div>
                                                        <small className="text-muted">{c.userId?.email}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="fw-medium">{c.vendorId?.salonName}</div>
                                                <small className="text-muted">{c.vendorId?.name}</small>
                                            </td>
                                            <td>
                                                <div className="text-truncate" style={{ maxWidth: 200 }}>{c.reason}</div>
                                            </td>
                                            <td>
                                                <span className={`badge bg-light text-dark border`}>{c.raisedBy}</span>
                                            </td>
                                            <td>
                                                <StatusBadge status={c.status} />
                                            </td>
                                            <td className="text-center">
                                                <button
                                                    className="btn btn-outline-dark btn-sm px-3 rounded-pill d-inline-flex align-items-center gap-1"
                                                    onClick={() =>
                                                        router.push(`/admin/dashboard/disputes/${c._id}`)
                                                    }
                                                >
                                                    <BsEye /> View
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-5 text-muted">No disputes found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* ===== PAGINATION ===== */}
                {totalPages > 1 && (
                    <div className="pagination justify-content-end mt-4">
                        <button
                            className="btn btn-light btn-sm mx-1"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            &lt;
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                            <button
                                key={n}
                                className={`btn btn-sm mx-1 ${n === page ? "btn-primary active" : "btn-light"}`}
                                onClick={() => setPage(n)}
                            >
                                {n}
                            </button>
                        ))}
                        <button
                            className="btn btn-light btn-sm mx-1"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            &gt;
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}

const Stat = ({ title, value, color = "text-dark" }) => (
    <div className="col-md-3">
        <div className="card h-100">
            <div className="card-body">
                <p className="text-muted mb-1 small text-uppercase fw-bold ls-1">{title}</p>
                <h4 className={`fw-bold mb-0 ${color}`}>{value}</h4>
            </div>
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const statusMap = {
        'Refunded': "bg-success text-white",
        'Completed': "bg-primary text-white",
        'pending': "bg-warning text-dark",
    };

    return (
        <span className={`badge ${statusMap[status] || "bg-secondary text-white"} py-2 px-3 rounded-pill`} style={{ fontSize: '0.75rem' }}>
            {status}
        </span>
    );
};

