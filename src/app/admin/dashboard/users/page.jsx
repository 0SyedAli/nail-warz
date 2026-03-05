"use client";

import { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { BsSearch } from "react-icons/bs";
import UserDataModal from "@/components/Modal/UserDataModal";
import { showErrorToast, showSuccessToast } from "src/lib/toast";

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
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [smartFilter, setSmartFilter] = useState(null);
    // 🔐 Auth check
    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) router.push("/admin/auth/login");
    }, []);

    const handleSmartFilter = (filterKey) => {
        setSmartFilter(filterKey);
        setSearchTerm("");
        setPage(1);
        fetchUsers(filterKey);
    };
    // 🔁 Fetch users
    const fetchUsers = async (filter = null) => {
        setLoading(true);
        try {

            let url = `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/user`;

            if (filter) {
                url += `?smartFilter=${filter}`;
            }

            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`,
                },
            });

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
    // const currentUsers = useMemo(() => {
    //     const sorted = [...filteredUsers].sort(
    //         (a, b) => b.totalSpend - a.totalSpend
    //     );

    //     const start = (page - 1) * PAGE_SIZE;
    //     return sorted.slice(start, start + PAGE_SIZE);
    // }, [filteredUsers, page]);
    const currentUsers = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredUsers.slice(start, start + PAGE_SIZE);
    }, [filteredUsers, page]);

    const toggleUserStatus = async (userId, currentStatus, e) => {
        e.stopPropagation();

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/user`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    },
                    body: JSON.stringify({
                        userId,
                        isActive: !currentStatus,
                    }),
                }
            );

            const json = await res.json();

            if (!res.ok || !json.success) {
                throw new Error(json.message || "Failed to update status");
            }

            // Update UI instantly
            setUsers(prev =>
                prev.map(u =>
                    u._id === userId ? { ...u, isActive: !currentStatus } : u
                )
            );

            showSuccessToast(
                `User ${!currentStatus ? "Enabled" : "Disabled"} successfully`
            );

        } catch (err) {
            showErrorToast(err.message);
        }
    };
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
                    <div className="row flex-wrap g-3 mb-4">
                        <StatCard title="Total Users" value={stats.totalUser} />
                        <StatCard title="Active Users" value={stats.activeUser} />
                        <StatCard title="Total Orders" value={stats.totalOrders} />
                        <StatCard title="Total Revenue" value={`$${stats.totalRevenue}`} />
                        <StatCard title="Total Wallet Balance" value={`$${stats.totalWalletBalance}`} />
                    </div>
                )}

                {/* ======= TABLE ======= */}
                <div className="card">
                    <div className="card-header bg-white gap-2">
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
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
                        {/* SMART FILTERS */}
                        <div className="d-flex flex-wrap gap-2 my-2">

                            <button
                                className={`btn btn-sm ${!smartFilter ? "btn-dark" : "btn-outline-dark"}`}
                                onClick={() => handleSmartFilter(null)}
                            >
                                All Users
                            </button>

                            <button
                                className={`btn btn-sm ${smartFilter === "highValue" ? "btn-dark" : "btn-outline-dark"}`}
                                onClick={() => handleSmartFilter("highValue")}
                            >
                                High-Value Users
                            </button>

                            <button
                                className={`btn btn-sm ${smartFilter === "unusedCredits" ? "btn-dark" : "btn-outline-dark"}`}
                                onClick={() => handleSmartFilter("unusedCredits")}
                            >
                                Unused Credits
                            </button>

                            <button
                                className={`btn btn-sm ${smartFilter === "repeatedCancellations" ? "btn-dark" : "btn-outline-dark"}`}
                                onClick={() => handleSmartFilter("repeatedCancellations")}
                            >
                                Repeated Cancellations
                            </button>

                            <button
                                className={`btn btn-sm ${smartFilter === "inactive" ? "btn-dark" : "btn-outline-dark"}`}
                                onClick={() => handleSmartFilter("inactive")}
                            >
                                Inactive
                            </button>

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
                                        <th>Orders</th>
                                        <th>Cancel Orders</th>
                                        <th>Wallet Balance</th>
                                        <th>Total Spent</th>
                                        {smartFilter === "inactive" ? (<th>Status</th>) : null}
                                        <th>Enable / Disable</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {currentUsers.map((u, index) => (
                                        // <tr key={u._id} >
                                        <tr
                                            key={u._id}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => {
                                                setSelectedUser(u);
                                                setIsOpen(true);
                                            }}
                                        >
                                            <td>#{u._id.slice(-5)}</td>
                                            <td>{u.username || "-"}</td>
                                            <td>{u.email}</td>
                                            <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                            <td>{u.purchaseCount}</td>
                                            <td>{u.cancelledByCount}</td>
                                            <td>${u.walletBalance}</td>
                                            <td className="fw-bold ">
                                                ${u.totalSpend}
                                            </td>
                                            {/* {smartFilter === "inactive" ? (
                                                <span
                                                    style={{
                                                        fontSize: "11px",
                                                        color: "#6c757d",
                                                        marginTop: "4px"
                                                    }}
                                                >
                                                    Last active {u.daysSinceLastActive} days ago
                                                </span>
                                            ) : (
                                                <span
                                                    style={{
                                                        padding: "6px 12px",
                                                        borderRadius: "20px",
                                                        fontSize: "11px",
                                                        fontWeight: 600,
                                                        backgroundColor: u?.isActive ? "#e6f4ea" : "#f1f3f5",
                                                        color: u?.isActive ? "#1e7e34" : "#6c757d"
                                                    }}
                                                >
                                                    {u?.isActive ? "Active" : "Inactive"}

                                                </span>
                                            )} */}
                                            {smartFilter === "inactive" ? (
                                                <td>
                                                    <span
                                                        style={{
                                                            fontSize: "11px",
                                                            color: "#6c757d",
                                                            marginTop: "4px"
                                                        }}
                                                    >
                                                        Last active {u.daysSinceLastActive} days ago
                                                    </span>
                                                </td>
                                            ) :
                                                null
                                            }

                                            <td className="user-toggle" onClick={(e) => e.stopPropagation()}>
                                                <div className="form-check form-switch d-flex align-items-center gap-2 m-0">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        role="switch"
                                                        checked={u.isActive}
                                                        onChange={(e) =>
                                                            toggleUserStatus(u._id, u.isActive, e)
                                                        }
                                                    />
                                                    <span className="medium fw-semibold">
                                                        {u.isActive ? "Active" : "Inactive"}

                                                    </span>
                                                </div>
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
            <UserDataModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                user={selectedUser}
            />
        </div>
    );
}

/* ================== STAT CARD ================== */
const StatCard = ({ title, value }) => (
    <div className="col">
        <div className="card h-100">
            <div className="card-body">
                <p className="text-muted text-nowrap small mb-1">{title}</p>
                <h5 className="fw-bold">{value}</h5>
            </div>
        </div>
    </div>
);
