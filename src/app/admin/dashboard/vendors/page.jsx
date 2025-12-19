"use client";

import { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { BsSearch, BsEye } from "react-icons/bs";

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

    // 🔐 Auth
    useEffect(() => {
        if (!Cookies.get("token")) router.push("/admin/auth/login");
    }, []);

    // 🔁 Fetch Vendors
    const fetchVendors = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/vendor`,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    },
                }
            );

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
    const currentVendors = useMemo(() => {
        const sorted = [...filtered].sort(
            (a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0)
        );
        const start = (page - 1) * PAGE_SIZE;
        return sorted.slice(start, start + PAGE_SIZE);
    }, [filtered, page]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

    if (loading) return <p className="m-4">Loading vendors…</p>;
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
                    <div className="card-header bg-white d-flex justify-content-between align-items-center">
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
                    <div className="dash_list card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Business Name</th>
                                        <th>Owner</th>
                                        <th>Location</th>
                                        <th>Join Date</th>
                                        <th>Status</th>
                                        <th>Total Revenue</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {currentVendors.map(v => (
                                        <tr key={v._id}>
                                            <td>{v.salonName || "-"}</td>
                                            <td>{v.email}</td>
                                            <td>{v.locationName || "-"}</td>
                                            <td>{new Date(v.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`badge ${v.isDeleted ? "bg-secondary" : "bg-success"}`}>
                                                    {v.isDeleted ? "inactive" : "active"}
                                                </span>
                                            </td>
                                            <td className="fw-bold">${v.totalRevenue || 0}</td>
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
