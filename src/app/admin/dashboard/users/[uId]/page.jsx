"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter, useParams } from "next/navigation";
import { FaUser, FaRegCalendarAlt, FaWallet, FaCalendarCheck } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { MdModeEdit } from "react-icons/md";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import Modal from "@/components/Modal/layout";

export default function UserDetail() {
    const { uId } = useParams();
    const router = useRouter();

    const token = Cookies.get("token");

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Appointments / pagination
    const [appointments, setAppointments] = useState([]);
    const [appointmentCursor, setAppointmentCursor] = useState(null);
    const [appointmentHasMore, setAppointmentHasMore] = useState(false);
    const [appointmentLoading, setAppointmentLoading] = useState(false);

    // Abuse flags
    const [abuseFlags, setAbuseFlags] = useState([]);
    const [abuseFlagCursor, setAbuseFlagCursor] = useState(null);
    const [abuseFlagHasMore, setAbuseFlagHasMore] = useState(false);
    const [abuseFlagLoading, setAbuseFlagLoading] = useState(false);

    // Abuse flag update modal
    const [selectedAbuseFlag, setSelectedAbuseFlag] = useState(null);
    const [abuseFlagUpdateForm, setAbuseFlagUpdateForm] = useState({ status: "", adminNotes: "" });
    const [updatingAbuseFlag, setUpdatingAbuseFlag] = useState(false);

    useEffect(() => {
        if (!token) {
            router.push("/admin/auth/login");
            return;
        }

        const fetchUser = async () => {
            try {
                setLoading(true);

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/user/${uId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (!res.ok) throw new Error("Failed to fetch user");

                const json = await res.json();
                if (!json.success || !json.user) {
                    throw new Error(json.message || "Invalid user response");
                }

                setUser(json.user);

                // Init appointments and abuse flags
                setAppointments(json.user?.appointmentHistory || []);
                const aptPag = json.user?.appointmentPagination;
                setAppointmentCursor(aptPag?.nextCursor || null);
                setAppointmentHasMore(aptPag?.hasMore ?? false);

                setAbuseFlags(json.user?.abuseFlags || []);
                const abPag = json.user?.abuseFlagPagination;
                setAbuseFlagCursor(abPag?.nextCursor || null);
                setAbuseFlagHasMore(abPag?.hasMore ?? false);
            } catch (err) {
                console.error(err);
                setError(err.message || String(err));
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [uId, token, router]);

    const loadMore = async (type, cursor, setList, setCursor, setHasMore, setLoadingState) => {
        if (!cursor) return;
        setLoadingState(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/user/${uId}?type=${type}&cursor=${cursor}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const json = await res.json();
            if (!json.success) throw new Error(json.message || "Failed to load more");

            const list = (type === "appointment" ? (json.appointments || json.user?.appointmentHistory || []) : (json.abuseFlags || json.user?.abuseFlags || []));
            const nextCursor = json.nextCursor !== undefined ? json.nextCursor : null;
            const hasMore = json.hasMore !== undefined ? json.hasMore : false;

            setList(prev => [...prev, ...list]);
            setCursor(nextCursor);
            setHasMore(hasMore);
        } catch (err) {
            showErrorToast(err.message || "Failed to load more");
        } finally {
            setLoadingState(false);
        }
    };

    const loadMoreAppointments = () => loadMore("appointment", appointmentCursor, setAppointments, setAppointmentCursor, setAppointmentHasMore, setAppointmentLoading);
    const loadMoreAbuseFlags = () => loadMore("abuse_flag", abuseFlagCursor, setAbuseFlags, setAbuseFlagCursor, setAbuseFlagHasMore, setAbuseFlagLoading);

    const handleUpdateAbuseFlagStatus = async (e) => {
        e.preventDefault();
        if (!selectedAbuseFlag) return;

        setUpdatingAbuseFlag(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/dispute/abuse-flags/${selectedAbuseFlag._id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ status: abuseFlagUpdateForm.status, adminNotes: abuseFlagUpdateForm.adminNotes })
                }
            );

            const json = await res.json();
            if (!res.ok || !json.success) throw new Error(json.message || "Failed to update abuse flag status");

            showSuccessToast("Status updated successfully");

            setAbuseFlags(prev => prev.map(flag => flag._id === selectedAbuseFlag._id ? { ...flag, status: abuseFlagUpdateForm.status, adminNotes: abuseFlagUpdateForm.adminNotes } : flag));
            setSelectedAbuseFlag(null);
        } catch (err) {
            showErrorToast(err.message || "Failed to update abuse flag status");
        } finally {
            setUpdatingAbuseFlag(false);
        }
    };

    if (loading) return <p className="m-4">Loading user…</p>;
    if (error) return <p className="m-4 text-danger">{error}</p>;
    if (!user) return <p className="m-4">User not found</p>;

    return (
        <div className="page user-detail-page">
            <div className="dashboard_panel_inner">
                <div className="d-flex justify-content-between align-items-center mt-3 mb-4">
                    <button className="back-btn my-0" onClick={() => router.back()}>
                        ← Back to Users
                    </button>
                    <div className="d-flex align-items-center gap-3">
                        {user?.isFlaggedForAbuse && (
                            <div style={{ padding: "6px 12px", borderRadius: "20px", background: "#fde8ea", color: "#ef3a4d", fontWeight: 600 }}>
                                Flagged
                            </div>
                        )}
                    </div>
                </div>
                <div className="vendor-stats" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                    <StatBox title="Wallet Balance" value={`$${user.walletBalance ?? 0}`} color="purple" icon={<FaWallet size={20} className="text-purple opacity-50" style={{ color: "#7b2cbf" }} />} />
                    <StatBox title="Total Spend" value={`$${user.totalSpend ?? 0}`} color="green" icon={<FaRegCalendarAlt size={18} className="text-success opacity-50" />} />
                    <StatBox title="Appointments" value={user?.appointmentPagination?.totalRecords ?? appointments.length} color="blue" icon={<FaUser size={18} className="text-primary opacity-50" />} />
                    <StatBox title="Last Appointment" value={user.lastAppointmentDate ? new Date(user.lastAppointmentDate).toLocaleDateString("en-GB") : "-"} color="gray" icon={<FaCalendarCheck size={20} className="text-primary opacity-50" />} />
                </div>
                <div className="vendor-header">
                    <div>
                        <h4>{user.username || `${user.firstName || ""} ${user.lastName || ""}`}</h4>
                        <p><strong>Email:</strong> {user.email || "-"}</p>
                        <p><strong>Phone:</strong> {user.phone || "-"}</p>
                        <p className="text-uppercase"><strong className="text-capitalize">Device:</strong> {user.deviceType ? `${user.deviceType}` : null}</p>
                    </div>
                    <span className={`status-badge text-capitalize ${user.isActive ? "active" : "inactive"}`}>{user.isActive ? "Active" : "Inactive"}</span>
                </div>



                <div className="card-box mt-4">
                    <h6>Appointment History ({user?.appointmentPagination?.totalRecords ?? appointments.length})</h6>

                    {appointments.length === 0 ? (
                        <p className="text-muted">No appointments yet</p>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="history-table">
                                    <thead>
                                        <tr>
                                            <th>Salon</th>
                                            <th>Services</th>
                                            <th>Amount</th>
                                            <th>Discount</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.map((apt) => (
                                            <tr key={apt._id}>
                                                <td>{apt?.salonId?.salonName || "-"}</td>
                                                <td>
                                                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                                        {apt?.servicesDetail?.map((s, si) => (
                                                            <span key={si} style={{ fontSize: 13 }}>{s.serviceName} (${s.price})</span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td style={{ fontWeight: 600 }}>${apt.totalAmount}</td>
                                                <td style={{ fontWeight: 600 }}>${apt.discountDetails.amount}</td>
                                                <td>
                                                    <span className={`status-badge mt-0 text-capitalize ${apt.status === "Completed" ? "bg-success text-white" : apt.status === "Confirmed" ? "bg-primary text-white" : "bg-warning text-dark"}`}>
                                                        {apt.status}
                                                    </span>
                                                    </td>
                                                    <td>{apt.servicesDetail[0].scheduledAt ? new Date(apt.servicesDetail[0].scheduledAt).toLocaleDateString("en-GB") : "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {appointmentHasMore && (
                                <div className="d-flex justify-content-center mt-3">
                                    <button className="vd-see-more-btn" onClick={loadMoreAppointments} disabled={appointmentLoading}>
                                        {appointmentLoading ? "Loading..." : "See More Appointments"}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div id="abuse-flags-section" className="card-box mt-4">
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <h6 className="mb-0">Abuse Flags ({user?.abuseFlagPagination?.totalRecords ?? abuseFlags.length})</h6>
                        {user?.isFlaggedForAbuse && (
                            <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, backgroundColor: "#fde8ea", color: "#ef3a4d", marginLeft: "4px" }}>Flagged</span>
                        )}
                    </div>

                    {abuseFlags.length === 0 ? (
                        <p className="text-muted">No abuse flags</p>
                    ) : (
                        <>
                            <table className="history-table">
                                <thead>
                                    <tr>
                                        <th>Trigger Type</th>
                                        <th>Reason</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {abuseFlags.map((flag) => (
                                        <tr key={flag._id}>
                                            <td>
                                                <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, backgroundColor: "#fff3e0", color: "#e65100", whiteSpace: "nowrap" }}>
                                                    {flag.triggerType?.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || "Unknown"}
                                                </span>
                                            </td>
                                            <td style={{ maxWidth: 400, fontSize: 13 }}>{flag.reason || "-"}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className={`status-badge text-capitalize m-0 ${flag.status === "Resolved" ? "bg-success text-white" : flag.status === "Dismissed" ? "bg-secondary text-white" : "bg-warning text-dark"}`}>
                                                        {flag.status || "Pending"}
                                                    </span>
                                                    <button className="btn btn-sm btn-outline-secondary py-1 px-1" onClick={() => { setSelectedAbuseFlag(flag); setAbuseFlagUpdateForm({ status: flag.status || "Pending", adminNotes: flag.adminNotes || "" }); }} style={{ fontSize: 20 }} title="Update Status">
                                                        <MdModeEdit />
                                                    </button>
                                                </div>
                                            </td>
                                            <td style={{ fontSize: 13, whiteSpace: "nowrap" }}>{flag.createdAt ? new Date(flag.createdAt).toLocaleDateString("en-GB") : "-"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {abuseFlagHasMore && (
                                <div className="d-flex justify-content-center mt-3">
                                    <button className="vd-see-more-btn" onClick={loadMoreAbuseFlags} disabled={abuseFlagLoading}>
                                        {abuseFlagLoading ? "Loading..." : "See More Flags"}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <Modal isOpen={!!selectedAbuseFlag} onClose={() => setSelectedAbuseFlag(null)}>
                <div className="p-4" style={{ minWidth: "320px" }}>
                    <h4 className="fw-bold mb-4 text-center">Update Abuse Flag Status</h4>
                    <form onSubmit={handleUpdateAbuseFlagStatus}>
                        <div className="mb-3">
                            <label className="form-label text-muted small fw-bold mb-1">STATUS</label>
                            <select className="form-select border border-secondary border-opacity-25" value={abuseFlagUpdateForm.status} onChange={e => setAbuseFlagUpdateForm(prev => ({ ...prev, status: e.target.value }))} style={{ borderRadius: "8px", padding: "8px 12px" }} required>
                                <option value="Pending">Pending</option>
                                <option value="Resolved">Resolved</option>
                                <option value="Dismissed">Dismissed</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-muted small fw-bold mb-1">ADMIN NOTES</label>
                            <textarea className="form-control border border-secondary border-opacity-25" rows="4" placeholder="Enter admin notes / resolution details..." value={abuseFlagUpdateForm.adminNotes} onChange={e => setAbuseFlagUpdateForm(prev => ({ ...prev, adminNotes: e.target.value }))} style={{ borderRadius: "8px", padding: "10px" }} />
                        </div>
                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <button type="button" className="btn btn-light" onClick={() => setSelectedAbuseFlag(null)} style={{ borderRadius: "8px", padding: "8px 20px" }}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={updatingAbuseFlag} style={{ borderRadius: "8px", padding: "8px 20px", background: "linear-gradient(135deg, #ff6b6b, #ee5a24)", border: "none" }}>{updatingAbuseFlag ? "Saving..." : "Save Changes"}</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}

const StatBox = ({ title, value, color, icon }) => (
    <div className="stat-box d-flex justify-content-between align-items-start">
        <div>
            <p>{title}</p>
            <h5 className={color}>{value}</h5>
        </div>
        {icon && <div>{icon}</div>}
    </div>
)
