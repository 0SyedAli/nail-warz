"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { BsSearch } from "react-icons/bs";
import BallsLoading from "@/components/Spinner/BallsLoading";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

const PAGE_SIZE = 10;

export default function SuperAdminVendors() {
    const router = useRouter();

    const [vendors, setVendors] = useState([]);
    const [stats, setStats] = useState(null);
    const [pagination, setPagination] = useState(null);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [smartFilter, setSmartFilter] = useState(null);

    // 🔐 Auth
    useEffect(() => {
        if (!Cookies.get("token")) router.push("/admin/auth/login");
    }, [router]);

    // ⏱️ Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    // 🔁 Fetch Vendors from Backend
    const fetchVendors = async (p = page, filter = smartFilter, q = debouncedSearch) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            params.append("page", p);
            params.append("limit", PAGE_SIZE);

            if (filter) {
                params.append("smartFilter", filter);
            }

            if (q && q.trim()) {
                params.append("search", q.trim());
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/vendor?${params.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    },
                }
            );

            const json = await res.json();
            if (!json.success) throw new Error(json.message || "Failed to fetch vendors");

            setVendors(json.vendors || []);
            setStats(json.stats || null);
            setPagination(json.pagination || null);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors(page, smartFilter, debouncedSearch);
    }, [page, smartFilter, debouncedSearch]);

    const handleSmartFilter = (filterKey) => {
        setSmartFilter(filterKey);
        setPage(1);
    };

    const totalPages = pagination?.totalPages || 1;

    const toggleUserStatus = async (vendorId, currentStatus, e) => {
        e.stopPropagation();

        try {
            const newStatus = !currentStatus;

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/vendor/${vendorId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    },
                    body: JSON.stringify({
                        isVerified: newStatus,
                    }),
                }
            );

            const json = await res.json();

            if (!res.ok || !json.success) {
                throw new Error(json.message || "Failed to update vendor status");
            }

            // vendors state update
            setVendors(prev =>
                prev.map(v =>
                    v._id === vendorId ? { ...v, isVerified: newStatus } : v
                )
            );

            showSuccessToast(`Vendor ${newStatus ? "approved" : "unapproved"} successfully`);

        } catch (err) {
            showErrorToast(err.message);
        }
    };

    return (
        <div className="page">
            <div className="dashboard_panel_inner pt-4">

                {/* ===== STATS ===== */}
                {stats && (
                    <div className="row g-3 mb-4">
                        <StatCard title="Total Vendors" value={stats.totalVendor} />
                        <StatCard title="Active Vendors" value={stats.activeVendor} />
                        {stats.pendingVendor !== undefined && (
                            <StatCard title="Pending Vendors" value={stats.pendingVendor} />
                        )}
                        <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} />
                    </div>
                )}

                {/* ===== TABLE ===== */}
                <div className="card">
                    <div className="card-header bg-white gap-2">
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                            <h5 className="fw-bolder mb-0">Vendors</h5>

                            <div className="position-relative">
                                <BsSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                                <input
                                    className="form-control w-100 ps-5"
                                    style={{ width: 280 }}
                                    placeholder="Search vendors…"
                                    value={search}
                                    onChange={e => {
                                        setSearch(e.target.value);
                                        setPage(1);
                                    }}
                                />
                            </div>
                        </div>
                        {/* SMART FILTERS */}
                        <div className="d-flex flex-wrap gap-2 my-2 px-3">
                            <button
                                className={`btn btn-sm ${!smartFilter ? "btn-dark" : "btn-outline-dark"}`}
                                onClick={() => handleSmartFilter(null)}
                            >
                                All Vendors
                            </button>

                            <button
                                className={`btn btn-sm ${smartFilter === "pendingApproval" ? "btn-dark" : "btn-outline-dark"}`}
                                onClick={() => handleSmartFilter("pendingApproval")}
                            >
                                Pending Approval
                            </button>

                            <button
                                className={`btn btn-sm ${smartFilter === "highCancellationRate" ? "btn-dark" : "btn-outline-dark"}`}
                                onClick={() => handleSmartFilter("highCancellationRate")}
                            >
                                High Cancellation Rate
                            </button>

                            <button
                                className={`btn btn-sm ${smartFilter === "lowRating" ? "btn-dark" : "btn-outline-dark"}`}
                                onClick={() => handleSmartFilter("lowRating")}
                            >
                                Low Rating
                            </button>

                            <button
                                className={`btn btn-sm ${smartFilter === "highRating" ? "btn-dark" : "btn-outline-dark"}`}
                                onClick={() => handleSmartFilter("highRating")}
                            >
                                High Rating
                            </button>
                        </div>
                    </div>
                    <div className="dash_list card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Business Name</th>
                                        <th>City</th>
                                        <th>Total Revenue</th>
                                        <th>Platform Fee</th>
                                        <th>Total Paid Out</th>
                                        <th>Average Rating</th>
                                        <th>Cancel Count</th>
                                        <th>Payouts Pending</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="10" className="text-center py-5">
                                                <div
                                                    className="d-flex justify-content-center align-items-center"
                                                    style={{ minHeight: "200px" }}
                                                >
                                                    <BallsLoading />
                                                </div>
                                            </td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan="10" className="text-center py-4 text-danger">
                                                {error}
                                            </td>
                                        </tr>
                                    ) : vendors.length === 0 ? (
                                        <tr>
                                            <td colSpan="10" className="text-center py-4 text-muted">
                                                No vendors found
                                            </td>
                                        </tr>
                                    ) : (
                                        vendors.map(v => (
                                            <tr key={v._id}>
                                                <td>{v.salonName || "-"}</td>
                                                <td>{v?.city || "-"}</td>
                                                <td className="fw-bold">${v.revenueSummary.totalRevenue.toFixed(2) || 0}</td>
                                                <td className="fw-bold">${v.revenueSummary.platformFee.toFixed(2) || 0}</td>
                                                <td className="fw-bold">${v.revenueSummary.totalPaid.toFixed(2) || 0}</td>
                                                <td className="fw-bold">{v.avgRating?.toFixed(2) || 0}</td>
                                                <td className="fw-bold">{v.salonCancellationCount || 0}</td>
                                                <td className="fw-bold">${v.revenueSummary?.payableBalance?.toFixed(2) || 0}</td>
                                                <td className="user-toggle" onClick={(e) => e.stopPropagation()}>
                                                    <div className="form-check form-switch d-flex align-items-center ps-0 gap-2 m-0">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            role="switch"
                                                            checked={Boolean(v.isVerified)}
                                                            onChange={(e) =>
                                                                toggleUserStatus(v._id, v.isVerified, e)
                                                            }
                                                        />

                                                        <span
                                                            style={{
                                                                padding: "6px 12px",
                                                                borderRadius: "20px",
                                                                fontSize: "12px",
                                                                fontWeight: 600,
                                                                backgroundColor: v?.isVerified ? "#e6f4ea" : "#f1f3f5",
                                                                color: v?.isVerified ? "#1e7e34" : "#6c757d"
                                                            }}
                                                        >
                                                            {v?.isVerified ? "Approved" : "Pending"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-outline-secondary btn-sm text-nowrap"
                                                        onClick={() => router.push(`/admin/dashboard/vendors/${v._id}`)}
                                                    >
                                                        View Details
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
                {!loading && totalPages > 1 && (
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
        </div>
    );
}

const StatCard = ({ title, value }) => (
    <div className="col">
        <div className="card h-100">
            <div className="card-body">
                <p className="text-muted mb-1">{title}</p>
                <h5 className="fw-bold">{value}</h5>
            </div>
        </div>
    </div>
);
