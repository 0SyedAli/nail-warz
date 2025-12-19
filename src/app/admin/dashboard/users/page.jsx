"use client";

import { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { BsSearch } from "react-icons/bs";

const PAGE_SIZE = 10;

export default function SuperAdminUsers() {
    const router = useRouter();

    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 🔐 Auth check
    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) router.push("/admin/auth/login");
    }, []);

    // 🔁 Fetch users
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/user`,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    },
                }
            );

            if (!res.ok) throw new Error("Failed to fetch users");
            const json = await res.json();

            if (!json.success) throw new Error(json.message);

            setUsers(json.users);
            setFilteredUsers(json.users);
            setStats(json.stats);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // 🔎 Search
    useEffect(() => {
        const filtered = users.filter((u) =>
            `${u.email} ${u.username ?? ""} ${u._id}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
        setPage(1);
    }, [searchTerm, users]);

    // 📄 Pagination
    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));

    // const currentUsers = useMemo(() => {
    //     const start = (page - 1) * PAGE_SIZE;
    //     return filteredUsers.slice(start, start + PAGE_SIZE);
    // }, [filteredUsers, page]);
    const currentUsers = useMemo(() => {
        const sorted = [...filteredUsers].sort(
            (a, b) => b.totalSpend - a.totalSpend
        );

        const start = (page - 1) * PAGE_SIZE;
        return sorted.slice(start, start + PAGE_SIZE);
    }, [filteredUsers, page]);

    if (loading)
        return (
            <div className="page">
                <p className="m-4">Loading users…</p>
            </div>
        );

    if (error)
        return (
            <div className="page">
                <p className="m-4 text-danger">{error}</p>
            </div>
        );

    return (
        <div className="page">
            <div className="dashboard_panel_inner pt-4">

                {/* ======= STATS ======= */}
                {stats && (
                    <div className="row g-3 mb-4">
                        <StatCard title="Total Users" value={stats.totalUser} />
                        <StatCard title="Active Users" value={stats.activeUser} />
                        <StatCard title="Total Orders" value={stats.totalOrders} />
                        <StatCard title="Total Revenue" value={`$${stats.totalRevenue}`} />
                    </div>
                )}

                {/* ======= TABLE ======= */}
                <div className="card">
                    <div className="card-header bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <h5 className="fw-bolder mb-0">Users List</h5>

                        <div className="position-relative">
                            <BsSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                            <input
                                type="text"
                                className="form-control ps-5"
                                placeholder="Search by email, name or ID"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: 280 }}
                            />
                        </div>
                    </div>

                    <div className="dash_list card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th># ID</th>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Join Date</th>
                                        <th>Status</th>
                                        <th>Orders</th>
                                        <th>Total Spent</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {currentUsers.map((u, index) => (
                                        <tr key={u._id}>
                                            <td>#{u._id.slice(-5)}</td>
                                            <td>{u.username || "-"}</td>
                                            <td>{u.email}</td>
                                            <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`badge ${u.isDeleted ? "bg-secondary" : "bg-success"}`}>
                                                    {u.isDeleted ? "Inactive" : "Active"}
                                                </span>
                                            </td>
                                            <td>{u.orderCount}</td>
                                            <td className="fw-bold ">
                                                ${u.totalSpend}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* ======= PAGINATION ======= */}
                        </div>
                    </div>
                </div>
                {totalPages > 1 && (
                    <div className="pagination justify-content-end mt-4">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                            &lt;
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                            <button
                                key={n}
                                className={page === n ? "active" : ""}
                                onClick={() => setPage(n)}
                            >
                                {n}
                            </button>
                        ))}

                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
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

/* ================== STAT CARD ================== */
const StatCard = ({ title, value }) => (
    <div className="col-md-6 col-xl-3">
        <div className="card h-100">
            <div className="card-body">
                <p className="text-muted small mb-1">{title}</p>
                <h5 className="fw-bold">{value}</h5>
            </div>
        </div>
    </div>
);
