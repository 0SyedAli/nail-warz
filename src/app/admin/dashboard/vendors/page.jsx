"use client";

import { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { BsSearch, BsEye } from "react-icons/bs";
import BallsLoading from "@/components/Spinner/BallsLoading";

const PAGE_SIZE = 10;

export default function SuperAdminVendors() {
    const router = useRouter();

    const [vendors, setVendors] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [stats, setStats] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [smartFilter, setSmartFilter] = useState(null);

    // 🔐 Auth
    useEffect(() => {
        if (!Cookies.get("token")) router.push("/admin/auth/login");
    }, []);

    // 🔁 Fetch Vendors
    // const fetchVendors = async () => {
    //     setLoading(true);
    //     try {
    //         const res = await fetch(
    //             `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/vendor`,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${Cookies.get("token")}`,
    //                 },
    //             }
    //         );

    //         const json = await res.json();
    //         if (!json.success) throw new Error(json.message);

    //         setVendors(json.vendors);
    //         setFiltered(json.vendors);
    //         setStats(json.stats);
    //     } catch (e) {
    //         setError(e.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const fetchVendors = async (filter = null) => {
        setLoading(true);
        try {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/vendor`;

            if (filter) {
                url += `?smartFilter=${filter}`;
            }

            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`,
                },
            });

            const json = await res.json();
            if (!json.success) throw new Error(json.message);

            setVendors(json.vendors);
            setFiltered(json.vendors);
            setStats(json.stats);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchVendors();
    }, []);


    const handleSmartFilter = (filterKey) => {
        setSmartFilter(filterKey);
        setSearch("");
        setPage(1);
        fetchVendors(filterKey);
    };
    // 🔎 Search
    useEffect(() => {
        const f = vendors.filter(v =>
            `${v.salonName} ${v.email} ${v.locationName}`
                .toLowerCase()
                .includes(search.toLowerCase())
        );
        setFiltered(f);
        setPage(1);
    }, [search, vendors]);

    // 🔢 Sort by Revenue
    // const currentVendors = useMemo(() => {
    //     const sorted = [...filtered].sort(
    //         (a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0)
    //     );
    //     const start = (page - 1) * PAGE_SIZE;
    //     return sorted.slice(start, start + PAGE_SIZE);
    // }, [filtered, page]);
    const currentVendors = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filtered.slice(start, start + PAGE_SIZE);
    }, [filtered, page]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

    if (loading) return
    <div className="page pt-4 px-0">
        <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "400px" }}
        >
            <BallsLoading />
        </div>
    </div>
        ;
    if (error) return <p className="m-4 text-danger">{error}</p>;

    return (
        <div className="page">
            <div className="dashboard_panel_inner pt-4">

                {/* ===== STATS ===== */}
                {stats && (
                    <div className="row g-3 mb-4">
                        <StatCard title="Total Vendors" value={stats.totalVendor} />
                        <StatCard title="Active Vendors" value={stats.activeVendor} />
                        <StatCard title="Total Revenue" value={`$${stats.totalRevenue}`} />
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
                                    className="form-control ps-5"
                                    style={{ width: 280 }}
                                    placeholder="Search vendors…"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
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
                                className={`btn btn-sm ${smartFilter === "highCancellationRate" ? "btn-dark" : "btn-outline-dark"}`}
                                onClick={() => handleSmartFilter("highCancellationRate")}
                            >
                                High Cancellation Rate
                            </button>

                            <button
                                className={`btn btn-sm ${smartFilter === "lowRatting" ? "btn-dark" : "btn-outline-dark"}`}
                                onClick={() => handleSmartFilter("lowRatting")}
                            >
                                Low Ratting
                            </button>

                            <button
                                className={`btn btn-sm ${smartFilter === "highRatting" ? "btn-dark" : "btn-outline-dark"}`}
                                onClick={() => handleSmartFilter("highRatting")}
                            >
                                High Ratting
                            </button>
                        </div>
                    </div>
                    <div className="dash_list card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Business Name</th>
                                        {/* <th>Owner</th> */}
                                        <th>City</th>
                                        <th>Join Date</th>
                                        <th>Total Revenue</th>
                                        <th>Total Ratting</th>
                                        <th>Cancel Count</th>
                                        <th>Payouts Pending</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {currentVendors.map(v => (
                                        <tr key={v._id}>
                                            <td>{v.salonName || "-"}</td>
                                            {/* <td>{v.email}</td> */}
                                            <td>{v?.city || "-"}</td>
                                            <td>{new Date(v.createdAt).toLocaleDateString()}</td>
                                            {/* <td>

                                                <span
                                                    style={{
                                                        padding: "6px 12px",
                                                        borderRadius: "20px",
                                                        fontSize: "12px",
                                                        fontWeight: 600,
                                                        backgroundColor: !v?.isDeleted ? "#e6f4ea" : "#f1f3f5",
                                                        color: !v?.isDeleted ? "#1e7e34" : "#6c757d"
                                                    }}
                                                >
                                                    {!v?.isDeleted ? "Active" : "Inactive"}
                                                </span>
                                            </td> */}
                                            <td className="fw-bold">${v.totalRevenue || 0}</td>
                                            <td className="fw-bold">{v.totalReviews || 0}</td>
                                            <td className="fw-bold">${v.cancelledByCount || 0}</td>
                                            <td className="fw-bold">${v.totalPayoutPending || 0}</td>
                                            <td>
                                                <button
                                                    className="btn btn-outline-secondary btn-sm text-nowrap"
                                                    onClick={() => router.push(`/admin/dashboard/vendors/${v._id}`)}
                                                >
                                                    {/* <BsEye />  */}
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
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
        </div >
    );
}

const StatCard = ({ title, value }) => (
    <div className="col-md-4">
        <div className="card h-100">
            <div className="card-body">
                <p className="text-muted mb-1">{title}</p>
                <h5 className="fw-bold">{value}</h5>
            </div>
        </div>
    </div>
);
