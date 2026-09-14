"use client";

import { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import { useRouter, useParams } from "next/navigation";
import { FaPhoneAlt, FaUser, FaRegCalendarAlt, FaCalendarCheck, FaCalendarTimes, FaWallet, FaChartLine, FaTrash, FaPlus, FaStickyNote } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { MdDescription, MdModeEdit } from "react-icons/md";
import { GiWorld } from "react-icons/gi";
import { IoLocationSharp } from "react-icons/io5";
import { MdOutlineAccessTime, MdAttachMoney } from "react-icons/md";
import { HiTrendingUp } from "react-icons/hi";
// import { IoWarningOutline } from "react-icons/io5";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import Modal from "@/components/Modal/layout";
import AdminAppointmentDetailModal from "@/components/Modal/AdminAppointmentDetailModal";

export default function VendorDetail() {
    const { vId } = useParams();
    const router = useRouter();

    const token = Cookies.get("token");

    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [amount, setAmount] = useState("");
    const [remarks, setRemarks] = useState("");
    const [paying, setPaying] = useState(false);
    const [revenueSummary, setRevenueSummary] = useState(null);
    const [revenueStats, setRevenueStats] = useState(null);
    const [payouts, setPayouts] = useState([]);
    const [payoutSearch, setPayoutSearch] = useState("");
    const [approvalUpdating, setApprovalUpdating] = useState(false);

    // Internal notes states
    const [internalNotes, setInternalNotes] = useState([]);
    const [newNoteText, setNewNoteText] = useState("");
    const [submittingNote, setSubmittingNote] = useState(false);
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editingNoteText, setEditingNoteText] = useState("");
    const [updatingNoteId, setUpdatingNoteId] = useState(null);
    const [deletingNoteId, setDeletingNoteId] = useState(null);

    // Abuse flag status update states
    const [selectedAbuseFlag, setSelectedAbuseFlag] = useState(null);
    const [abuseFlagUpdateForm, setAbuseFlagUpdateForm] = useState({
        status: "",
        adminNotes: ""
    });
    const [updatingAbuseFlag, setUpdatingAbuseFlag] = useState(false);

    // Appointments pagination
    const [appointments, setAppointments] = useState([]);
    const [appointmentCursor, setAppointmentCursor] = useState(null);
    const [appointmentHasMore, setAppointmentHasMore] = useState(false);
    const [appointmentLoading, setAppointmentLoading] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    // Ratings pagination
    const [ratings, setRatings] = useState([]);
    const [ratingCursor, setRatingCursor] = useState(null);
    const [ratingHasMore, setRatingHasMore] = useState(false);
    const [ratingLoading, setRatingLoading] = useState(false);

    // Abuse flags pagination
    const [abuseFlags, setAbuseFlags] = useState([]);
    const [abuseFlagCursor, setAbuseFlagCursor] = useState(null);
    const [abuseFlagHasMore, setAbuseFlagHasMore] = useState(false);
    const [abuseFlagLoading, setAbuseFlagLoading] = useState(false);

    /* ===================== FETCH VENDOR ===================== */
    const fetchVendor = async (silent = false) => {
        try {
            if (!silent) setLoading(true);

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/vendor/${vId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (!res.ok) throw new Error("Failed to fetch vendor");

            const json = await res.json();
            if (!json.success || !json.vendor) {
                throw new Error(json.message || "Invalid vendor response");
            }
            setVendor(json.vendor);
            setRevenueSummary(json.revenueSummary);
            setRevenueStats(json.revenueStats);
            setPayouts(json.revenueSummary?.payoutHistory || []);

            const rawNotes = json.vendor?.internalNotes || json.vendor?.internalNote || json.internalNotes || [];
            const parsedNotes = Array.isArray(rawNotes)
                ? rawNotes
                : rawNotes && typeof rawNotes === "object"
                    ? [rawNotes]
                    : typeof rawNotes === "string" && rawNotes.trim()
                        ? [{ note: rawNotes, _id: "single-note" }]
                        : [];
            setInternalNotes(parsedNotes);

            if (!silent) {
                // Initialize appointments
                setAppointments(json.vendor?.appointments || []);
                const aptPag = json.vendor?.appointmentPagination;
                setAppointmentCursor(aptPag?.nextCursor || null);
                setAppointmentHasMore(aptPag?.hasMore ?? false);

                // Initialize ratings
                setRatings(json.vendor?.ratings || []);
                const ratPag = json.vendor?.ratingPagination;
                setRatingCursor(ratPag?.nextCursor || null);
                setRatingHasMore(ratPag?.hasMore ?? false);

                // Initialize abuse flags
                setAbuseFlags(json.vendor?.abuseFlags || []);
                const abPag = json.vendor?.abuseFlagPagination;
                setAbuseFlagCursor(abPag?.nextCursor || null);
                setAbuseFlagHasMore(abPag?.hasMore ?? false);
            }
        } catch (err) {
            console.error(err);
            if (!silent) setError(err.message);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            router.push("/admin/auth/login");
            return;
        }
        fetchVendor();
    }, [vId, token, router]);

    /* ===================== DERIVED VALUES ===================== */
    const totalRevenue = revenueSummary?.totalRevenue ?? 0;
    const platformFee = revenueSummary?.platformFee?.amount ?? 0;
    const vendorShare = revenueSummary?.totalPayableAmount ?? 0;
    const availableBalance = revenueSummary?.payableBalance ?? 0;
    console.log(availableBalance, "availableBalance");
    /* ===================== DELETE ===================== */
    const deleteVendor = async () => {
        if (!confirm("Are you sure you want to delete this vendor?")) return;

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/vendor/${vId}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (!res.ok) throw new Error("Delete failed");

            router.push("/admin/dashboard/vendors");
        } catch (err) {
            showErrorToast(err.message || "Failed to delete vendor");
        }
    };

    /* ===================== PAYOUT ===================== */
    const handlePayout = async () => {
        const payoutAmount = Number(amount);

        if (!payoutAmount || payoutAmount <= 0) {
            showErrorToast("Enter a valid payout amount");
            return;
        }

        if (payoutAmount > availableBalance) {
            showErrorToast("Amount exceeds available balance");
            return;
        }

        setPaying(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/payout`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        vendor: vendor._id,
                        amount: payoutAmount,
                        remarks: remarks?.trim() || "Vendor payout",
                    }),
                }
            );

            const json = await res.json();
            if (!res.ok || !json.success) {
                throw new Error(json.message || "Payout failed");
            }

            // Immediately update state with response data if returned
            if (json.revenueSummary) {
                setRevenueSummary(json.revenueSummary);
                if (json.revenueSummary.payoutHistory) {
                    setPayouts(json.revenueSummary.payoutHistory);
                }
            } else if (json.payout) {
                setPayouts((prev) => [json.payout, ...(prev || [])]);
                setRevenueSummary((prev) => prev ? {
                    ...prev,
                    payableBalance: Math.max(0, (prev.payableBalance || 0) - payoutAmount),
                    totalPaid: (prev.totalPaid || 0) + payoutAmount,
                } : prev);
            }

            // Silently refetch vendor to keep all calculations & history perfectly synced without reloading the page
            await fetchVendor(true);

            setAmount("");
            setRemarks("");

            showSuccessToast(json.message || "Payout processed successfully");
        } catch (err) {
            showErrorToast(err.message || "Payout error");
        } finally {
            setPaying(false);
        }
    };

    /* ===================== FILTERED PAYOUTS ===================== */
    const filteredPayouts = useMemo(() => {
        if (!payoutSearch.trim()) return payouts;
        const q = payoutSearch.toLowerCase();
        return payouts.filter((p) => {
            const dateStr = new Date(p.payoutDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }).toLowerCase();
            return (
                p.transactionId?.toLowerCase().includes(q) ||
                dateStr.includes(q)
            );
        });
    }, [payouts, payoutSearch]);

    /* ===================== INTERNAL NOTES ===================== */
    const notesList = internalNotes;
    const currentNote = notesList.length > 0 ? notesList[0] : null;

    const handleAddNote = async (e) => {
        if (e) e.preventDefault();
        if (!newNoteText.trim()) {
            showErrorToast("Please enter a note");
            return;
        }

        if (currentNote) {
            showErrorToast("Only one internal note is allowed. Please edit or delete the existing note.");
            return;
        }

        setSubmittingNote(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/vendor/${vId}/internalNote`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        note: newNoteText.trim(),
                    }),
                }
            );

            const json = await res.json();
            if (!res.ok || !json.success) {
                throw new Error(json.message || "Failed to add internal note");
            }

            if (json.internalNote || json.note || json.data) {
                const added = json.internalNote || json.note || json.data;
                if (typeof added === "object") {
                    setInternalNotes([added]);
                } else {
                    setInternalNotes([{ note: String(added), createdAt: new Date().toISOString() }]);
                }
            } else {
                setInternalNotes([{ note: newNoteText.trim(), createdAt: new Date().toISOString() }]);
            }

            setNewNoteText("");
            showSuccessToast("Internal note added successfully");
            await fetchVendor(true);
        } catch (err) {
            showErrorToast(err.message || "Failed to add internal note");
        } finally {
            setSubmittingNote(false);
        }
    };

    const handleUpdateNote = async (noteId) => {
        if (!editingNoteText.trim()) {
            showErrorToast("Note content cannot be empty");
            return;
        }

        setUpdatingNoteId(noteId);
        try {
            let res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/vendor/${vId}/internalNote/${noteId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        note: editingNoteText.trim(),
                    }),
                }
            );

            if (res.status === 404 || res.status === 405) {
                res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/vendor/${vId}/internalNote/${noteId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            note: editingNoteText.trim(),
                        }),
                    }
                );
            }

            const json = await res.json();
            if (!res.ok || !json.success) {
                throw new Error(json.message || "Failed to update internal note");
            }

            setInternalNotes((prev) =>
                prev.map((n) => {
                    const id = n._id || n.id;
                    if (id === noteId) {
                        return typeof n === "object" ? { ...n, note: editingNoteText.trim() } : editingNoteText.trim();
                    }
                    return n;
                })
            );

            setEditingNoteId(null);
            setEditingNoteText("");
            showSuccessToast("Internal note updated successfully");
            await fetchVendor(true);
        } catch (err) {
            showErrorToast(err.message || "Failed to update internal note");
        } finally {
            setUpdatingNoteId(null);
        }
    };

    const handleDeleteNote = async (noteId) => {
        if (!confirm("Are you sure you want to delete this internal note?")) return;

        setDeletingNoteId(noteId);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/vendor/${vId}/internalNote/${noteId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const json = await res.json();
            if (!res.ok || !json.success) {
                throw new Error(json.message || "Failed to delete internal note");
            }

            setInternalNotes((prev) => prev.filter((n, idx) => (n._id || n.id || idx) !== noteId));
            showSuccessToast("Internal note deleted successfully");
            await fetchVendor(true);
        } catch (err) {
            showErrorToast(err.message || "Failed to delete internal note");
        } finally {
            setDeletingNoteId(null);
        }
    };

    const toggleVendorApproval = async () => {
        if (!vendor?._id) return;

        const newStatus = !vendor.isVerified;

        try {
            setApprovalUpdating(true);

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/vendor/${vendor._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
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

            setVendor((prev) =>
                prev ? { ...prev, isVerified: newStatus } : prev
            );

            showSuccessToast(
                newStatus
                    ? "Vendor approved successfully"
                    : "Vendor marked as pending successfully"
            );

        } catch (err) {
            showErrorToast(err.message || "Failed to update vendor status");
        } finally {
            setApprovalUpdating(false);
        }
    };

    /* ===================== LOAD MORE HELPERS ===================== */
    const loadMore = async (type, cursor, setList, setCursor, setHasMore, setLoadingState) => {
        if (!cursor) return;
        setLoadingState(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/vendor/${vId}?type=${type}&cursor=${cursor}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const json = await res.json();
            if (!json.success) throw new Error(json.message || "Failed to load more");

            const nextCursor = json.nextCursor !== undefined ? json.nextCursor : null;
            const hasMore = json.hasMore !== undefined ? json.hasMore : false;

            if (type === "appointment") {
                const list = json.appointments || json.vendor?.appointments || [];
                const finalCursor = nextCursor !== null ? nextCursor : (json.vendor?.appointmentPagination?.nextCursor || null);
                const finalHasMore = json.hasMore !== undefined ? hasMore : (json.vendor?.appointmentPagination?.hasMore ?? false);

                setList(prev => [...prev, ...list]);
                setCursor(finalCursor);
                setHasMore(finalHasMore);
            } else if (type === "rating") {
                const list = json.ratings || json.vendor?.ratings || [];
                const finalCursor = nextCursor !== null ? nextCursor : (json.vendor?.ratingPagination?.nextCursor || null);
                const finalHasMore = json.hasMore !== undefined ? hasMore : (json.vendor?.ratingPagination?.hasMore ?? false);

                setList(prev => [...prev, ...list]);
                setCursor(finalCursor);
                setHasMore(finalHasMore);
            } else if (type === "abuse_flag") {
                const list = json.abuseFlags || json.flags || json.vendor?.abuseFlags || [];
                const finalCursor = nextCursor !== null ? nextCursor : (json.vendor?.abuseFlagPagination?.nextCursor || null);
                const finalHasMore = json.hasMore !== undefined ? hasMore : (json.vendor?.abuseFlagPagination?.hasMore ?? false);

                setList(prev => [...prev, ...list]);
                setCursor(finalCursor);
                setHasMore(finalHasMore);
            }
        } catch (err) {
            showErrorToast(err.message || "Failed to load more");
        } finally {
            setLoadingState(false);
        }
    };

    const loadMoreAppointments = () => loadMore("appointment", appointmentCursor, setAppointments, setAppointmentCursor, setAppointmentHasMore, setAppointmentLoading);
    const loadMoreRatings = () => loadMore("rating", ratingCursor, setRatings, setRatingCursor, setRatingHasMore, setRatingLoading);
    const loadMoreAbuseFlags = () => loadMore("abuse_flag", abuseFlagCursor, setAbuseFlags, setAbuseFlagCursor, setAbuseFlagHasMore, setAbuseFlagLoading);

    /* ===================== UPDATE ABUSE FLAG STATUS ===================== */
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
                    body: JSON.stringify({
                        status: abuseFlagUpdateForm.status,
                        adminNotes: abuseFlagUpdateForm.adminNotes
                    })
                }
            );

            const json = await res.json();
            if (!res.ok || !json.success) {
                throw new Error(json.message || "Failed to update abuse flag status");
            }

            showSuccessToast("Abuse Flag Status updated successfully");

            // Update in localized list
            setAbuseFlags(prev => prev.map(flag =>
                flag._id === selectedAbuseFlag._id
                    ? { ...flag, status: abuseFlagUpdateForm.status, adminNotes: abuseFlagUpdateForm.adminNotes }
                    : flag
            ));

            setSelectedAbuseFlag(null);
        } catch (err) {
            showErrorToast(err.message || "Failed to update abuse flag status");
        } finally {
            setUpdatingAbuseFlag(false);
            fetchVendor();
        }
    };
    // Status badge style
    const getStatusBadge = (status) => {
        const s = (status || "").toLowerCase();
        let bg = "#e2e8f0";
        let color = "#334155";
        // let icon = <FaInfoCircle style={{ marginRight: "4px" }} />;

        if (s === "completed") {
            bg = "#dcfce7";
            color = "#15803d";
            // icon = <FaCheckCircle style={{ marginRight: "4px" }} />;
        } else if (s === "confirmed") {
            bg = "#dbeafe";
            color = "#1d4ed8";
            // icon = <FaCheckCircle style={{ marginRight: "4px" }} />;
        } else if (s === "canceled" || s === "cancelled") {
            bg = "#fee2e2";
            color = "#b91c1c";
            // icon = <FaTimesCircle style={{ marginRight: "4px" }} />;
        } else if (s === "rescheduled" || s === "in_progress") {
            bg = "#fef3c7";
            color = "#b45309";
            // icon = <FaExchangeAlt style={{ marginRight: "4px" }} />;
        }

        return (
            <span
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: 600,
                    backgroundColor: bg,
                    color: color,
                    textTransform: "capitalize",
                }}
            >
                {/* {icon} */}
                {status || "Unknown"}
            </span>
        );
    };
    /* ===================== STATES ===================== */
    if (loading) return <p className="m-4">Loading vendor…</p>;
    if (error) return <p className="m-4 text-danger">{error}</p>;
    if (!vendor) return <p className="m-4">Vendor not found</p>;

    /* ===================== UI ===================== */
    return (
        <div className="page vendor-detail-page">
            <div className="dashboard_panel_inner">
                <div className="d-flex justify-content-between align-items-center mt-3 mb-4">
                    <button className="back-btn my-0" onClick={() => router.back()}>
                        ← Back to Vendors
                    </button>
                    {/* <div>
                        <span
                            style={{
                                padding: "6px 12px",
                                borderRadius: "20px",
                                fontSize: "12px",
                                fontWeight: 600,
                                backgroundColor: vendor?.isVerified ? "#e6f4ea" : "#f1f3f5",
                                color: vendor?.isVerified ? "#1e7e34" : "#6c757d"
                            }}
                        >
                            {vendor?.isVerified ? "Approved" : "Pending"}
                        </span>
                    </div> */}
                    <div className="d-flex align-items-center gap-3">
                        {vendor?.createdAt && (
                            <span className="badge bg-white text-secondary border px-3 py-2 d-flex align-items-center gap-2" style={{ fontSize: "13px", fontWeight: "500", borderRadius: "20px" }}>
                                <FaRegCalendarAlt size={14} className="text-primary" />
                                <span>Registered: <strong className="text-dark">{new Date(vendor.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</strong></span>
                            </span>
                        )}

                        <div className="form-check form-switch vendor-form-switch d-flex align-items-center ps-0 gap-2 m-0">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                checked={Boolean(vendor?.isVerified)}
                                disabled={approvalUpdating}
                                onChange={toggleVendorApproval}
                            />

                            <span
                                style={{
                                    padding: "6px 12px",
                                    borderRadius: "20px",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    backgroundColor: vendor?.isVerified ? "#e6f4ea" : "#f1f3f5",
                                    color: vendor?.isVerified ? "#1e7e34" : "#6c757d"
                                }}
                            >
                                {approvalUpdating
                                    ? "Updating..."
                                    : vendor?.isVerified
                                        ? "Approved"
                                        : "Pending"}
                            </span>
                        </div>
                        {vendor?.isFlaggedForAbuse && (
                            <div
                                className="cursor-pointer animate-pulse"
                                style={{
                                    padding: "6px 16px",
                                    borderRadius: "50px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    background: "rgba(255, 75, 75, 0.15)",
                                    border: "1px solid rgba(255, 75, 75, 0.3)",
                                    backdropFilter: "blur(10px)",
                                    color: "rgb(255, 75, 75)",
                                    fontWeight: "500",
                                    fontSize: "13px"
                                }}
                                onClick={() => {
                                    document.getElementById("abuse-flags-section")?.scrollIntoView({ behavior: "smooth" });
                                }}
                            >
                                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgb(255, 75, 75)", boxShadow: "0 0 0 3px rgba(255, 75, 75, 0.12)" }}></div>
                                Review Warning
                            </div>
                        )}
                    </div>
                </div>
                {/* STATS */}
                <div className="vendor-stats" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                    <StatBox
                        title="Daily Revenue"
                        value={`$${revenueStats?.dailyRevenue.toFixed(2) ?? 0}`}
                        color="green"
                        icon={<HiTrendingUp size={22} className="text-success opacity-50" />}
                    />
                    <StatBox
                        title="Weekly Revenue"
                        value={`$${revenueStats?.weeklyRevenue.toFixed(2) ?? 0}`}
                        color="green"
                        icon={<FaChartLine size={20} className="text-success opacity-50" />}
                    />
                    <StatBox
                        title="Monthly Revenue"
                        value={`$${revenueStats?.monthlyRevenue.toFixed(2) ?? 0}`}
                        color="green"
                        icon={<MdAttachMoney size={24} className="text-success opacity-50" />}
                    />
                    <StatBox
                        title="Nail Warz Commission"
                        value={`$${revenueSummary?.platformFee.toFixed(2)}`}
                        color="purple"
                        icon={<MdAttachMoney size={24} className="text-purple opacity-50" style={{ color: "#7b2cbf" }} />}
                    />
                    <StatBox
                        title="App Charges"
                        value={`$${revenueSummary?.appCharges.toFixed(2)}`}
                        color="purple"
                        icon={<MdAttachMoney size={24} className="text-purple opacity-50" style={{ color: "#7b2cbf" }} />}
                    />
                    <StatBox
                        title="Payable Balance"
                        value={`$${revenueSummary?.payableBalance.toFixed(2)}`}
                        color="red"
                        icon={<FaWallet size={20} className="text-purple opacity-50" style={{ color: "#dc3545" }} />}
                    />
                    <StatBox
                        title="Total Bookings"
                        value={vendor.totalBooking ?? 0}
                        color="blue"
                        icon={<FaCalendarCheck size={20} className="text-primary opacity-50" />}
                    />
                    <StatBox
                        title="Cancelled Bookings"
                        value={vendor.cancelCount ?? 0}
                        color="red"
                        icon={<FaCalendarTimes size={20} className="text-danger opacity-50" />}
                    />
                </div>
                {/* HEADER */}
                <div className="vendor-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
                    <div className="card-box">
                        <h6>Bussiness Info</h6>
                        {vendor.salonName && <h5 className="d-flex align-items-center gap-2 mb-2"><span><FaUser size={14} /></span>{vendor.salonName}</h5>}
                        {vendor.createdAt && (
                            <p className="d-flex align-items-center gap-2 mb-2 text-muted" style={{ fontSize: "13px" }}>
                                <span><FaRegCalendarAlt size={15} /></span>
                                <span>Registered Date: <strong className="text-dark">{new Date(vendor.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</strong></span>
                            </p>
                        )}
                        {vendor.bussinessEmail && <p className="d-flex align-items-center gap-2 mb-2"><span><IoIosMail size={17} /></span>{vendor.bussinessEmail}</p>}
                        {vendor.bussinessPhoneNumber && <p className="d-flex align-items-center gap-2 mb-2"><span><FaPhoneAlt size={17} /></span>{vendor.bussinessPhoneNumber}</p>}
                        {vendor.bussinessWebsite && <a href={`https://${vendor.bussinessWebsite}`} target="_blank" className="d-flex align-items-center gap-2 text-decoration-none mb-2"><span><GiWorld size={17} /></span>{vendor.bussinessWebsite}</a>}
                        {vendor.locationName && <p className="d-flex align-items-center gap-2 mb-2"><span><IoLocationSharp size={17} /></span>{vendor.locationName}</p>}
                        {vendor.description && <p className="d-flex align-items-center gap-2 mb-2"><span><MdDescription size={17} /></span>{vendor.description}</p>}
                    </div>
                    <div className="card-box">
                        <h6>Owner Info</h6>
                        {vendor.name && <h5 className="d-flex align-items-center gap-2 mb-3"><span><FaUser size={14} /></span>{vendor.name}</h5>}
                        {vendor.email && <p className="d-flex align-items-center gap-2"><span><IoIosMail size={17} /></span>{vendor.email}</p>}
                        {vendor.city && <p className="d-flex align-items-center gap-2"><span><IoLocationSharp size={17} /></span>{vendor.city}</p>}
                    </div>
                    {vendor.workingDays && vendor.workingDays.length > 0 && (
                        <div className="card-box">
                            <h6 className="d-flex align-items-center gap-2"><span><MdOutlineAccessTime size={18} /></span>Working Hours</h6>
                            <div className="mt-2">
                                {vendor.workingDays.map((wd, i) => (
                                    <div key={i} className="d-flex justify-content-between align-items-center mb-1 py-1 border-bottom border-light">
                                        <span style={{ fontSize: "14px", fontWeight: 500, color: wd.isActive ? "#333" : "#999" }}>{wd.day}</span>
                                        <span style={{ fontSize: "13px", color: wd.isActive ? "#0aa84f" : "#dc3545" }}>
                                            {wd.isActive ? `${wd.startTime} - ${wd.endTime}` : "Closed"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                {/* <div className="vendor-header">
                    <div className="d-flex align-items-center gap-4">
                    </div>
                    <span className="status-badge text-capitalize active">Active</span>
                    <span
                            style={{
                                padding: "6px 12px",
                                borderRadius: "20px",
                                fontSize: "12px",
                                fontWeight: 600,
                                backgroundColor: !vendor?.isDeleted ? "#e6f4ea" : "#f1f3f5",
                                color: !vendor?.isDeleted ? "#1e7e34" : "#6c757d"
                            }}
                        >
                            {!vendor?.isDeleted ? "Active" : "Inactive"}
                        </span>

                    <button className="delete-btn" onClick={deleteVendor}>
                        <span className="trash">🗑</span>
                        Delete Vendor
                    </button>
                </div> */}



                {/* INTERNAL NOTE */}
                <div className="card-box mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0 d-flex align-items-center gap-2">
                            <FaStickyNote style={{ color: "#7b2cbf" }} size={18} />
                            <span>Internal Note</span>
                        </h6>
                    </div>

                    {!currentNote ? (
                        /* New Note Form when no note exists */
                        <form onSubmit={handleAddNote}>
                            <div className="d-flex flex-column gap-2">
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    placeholder="Add an internal note about this vendor (e.g. documentation status, verification notes, call logs)..."
                                    value={newNoteText}
                                    onChange={(e) => setNewNoteText(e.target.value)}
                                    disabled={submittingNote}
                                    style={{ resize: "vertical", fontSize: "14px", borderRadius: "8px" }}
                                />
                                <div className="d-flex justify-content-end">
                                    <button
                                        type="submit"
                                        className="btn btn-dark d-flex align-items-center gap-2 px-3 py-2"
                                        disabled={submittingNote || !newNoteText.trim()}
                                        style={{ fontSize: "13px", borderRadius: "6px" }}
                                    >
                                        <FaPlus size={11} />
                                        <span>{submittingNote ? "Adding Note..." : "Add Note"}</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        /* Display existing single note */
                        (() => {
                            const noteId = currentNote._id || currentNote.id || "single-note";
                            const isEditing = editingNoteId === noteId;
                            const noteText = typeof currentNote === "string" ? currentNote : (currentNote.note || "");
                            const noteDate = currentNote.createdAt || currentNote.updatedAt || currentNote.date;

                            return (
                                <div
                                    className="p-3 border rounded"
                                    style={{ backgroundColor: "#fafbfc" }}
                                >
                                    {isEditing ? (
                                        <div>
                                            <textarea
                                                className="form-control mb-2"
                                                rows={3}
                                                value={editingNoteText}
                                                onChange={(e) => setEditingNoteText(e.target.value)}
                                                disabled={updatingNoteId === noteId}
                                                style={{ fontSize: "14px" }}
                                            />
                                            <div className="d-flex justify-content-end gap-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => {
                                                        setEditingNoteId(null);
                                                        setEditingNoteText("");
                                                    }}
                                                    disabled={updatingNoteId === noteId}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => handleUpdateNote(noteId)}
                                                    disabled={updatingNoteId === noteId || !editingNoteText.trim()}
                                                >
                                                    {updatingNoteId === noteId ? "Saving..." : "Save Changes"}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                                                <div className="text-muted small d-flex align-items-center gap-2" style={{ fontSize: "12px" }}>
                                                    <FaRegCalendarAlt size={12} />
                                                    <span>
                                                        {noteDate
                                                            ? new Date(noteDate).toLocaleString("en-GB", {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })
                                                            : "Internal Note"}
                                                    </span>
                                                </div>
                                                <div className="d-flex align-items-center gap-1">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-secondary p-1"
                                                        onClick={() => {
                                                            setEditingNoteId(noteId);
                                                            setEditingNoteText(noteText);
                                                        }}
                                                        title="Edit Note"
                                                        style={{ lineHeight: 1 }}
                                                    >
                                                        <MdModeEdit size={15} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger p-1"
                                                        onClick={() => handleDeleteNote(noteId)}
                                                        disabled={deletingNoteId === noteId}
                                                        title="Delete Note"
                                                        style={{ lineHeight: 1 }}
                                                    >
                                                        <FaTrash size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="mb-0" style={{ fontSize: "14px", whiteSpace: "pre-wrap", color: "#212529" }}>
                                                {noteText}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })()
                    )}
                </div>

                {/* PAYOUT + SUMMARY */}
                <div className="vendor-grid mt-4">

                    <div className="card-box">
                        <h6>Process Payout</h6>

                        <div className="label">Remaining Balance</div>
                        <div className="amount purple">${availableBalance.toFixed(2)}</div>
                        <input
                            className="input"
                            type="number"
                            step="0.01"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            disabled={availableBalance <= 0}
                        />

                        <input
                            className="input"
                            placeholder="Remarks / Payment method"
                            value={remarks}
                            onChange={e => setRemarks(e.target.value)}
                            disabled={availableBalance <= 0}
                        />

                        <button
                            className="payout-btn"
                            disabled={paying || availableBalance <= 0}
                            onClick={handlePayout}
                        >
                            {paying ? "Processing..." : "$ Process Payout"}
                        </button>
                    </div>

                    <div className="card-box">
                        <h6>Total Revenue Summary</h6>

                        <div className="summary-row">
                            <span>Total Revenue</span>
                            <span>${(revenueSummary?.totalRevenue ?? 0).toFixed(2)}</span>
                        </div>
                        <div className="summary-row red">
                            <span>Nail Warz Commission</span>
                            <span>${(revenueSummary?.platformFee ?? 0).toFixed(2)}</span>
                        </div>
                        <div className="summary-row red">
                            <span>App Charges</span>
                            <span>${(revenueSummary?.appCharges ?? 0).toFixed(2)}</span>
                        </div>
                        <div className="summary-row green">
                            <span>Vendor Share</span>
                            <span>${(revenueSummary?.totalPayableAmount ?? 0).toFixed(2)}</span>
                        </div>

                        <div className="summary-row purple">
                            <span>Total Paid Out</span>
                            <span>${(revenueSummary?.totalPaid ?? 0).toFixed(2)}</span>
                        </div>
                        {/* <div className="summary-row purple">
                            <span>Remaining Revenue</span>
                            <span>${revenueSummary?.payableBalance.toFixed(2)}</span>
                        </div> */}
                        <div className="summary-row">
                            <span><strong>Remaining Balance</strong></span>
                            <span>${(revenueSummary?.payableBalance ?? 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* APPOINTMENTS */}
                <div className="card-box mt-4">
                    <h6>Appointments ({vendor?.appointmentPagination?.totalRecords ?? appointments.length})</h6>

                    {appointments.length === 0 ? (
                        <p className="text-muted">No appointments yet</p>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="history-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Services</th>
                                            <th>Total Amount</th>
                                            <th>Nail Warz Commission</th>
                                            <th>Vendor Share</th>
                                            <th>App Charges</th>
                                            <th>Discount</th>
                                            <th>Payment</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.map((apt, i) => (
                                            <tr key={apt._id || i} onClick={() => setSelectedAppointment(apt)} style={{ cursor: "pointer" }} title="Click to view appointment details">
                                                <td>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                        <img
                                                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL || ""}/${apt?.userId?.image || ""}`}
                                                            alt="user"
                                                            onError={(e) => (e.currentTarget.style.display = "none")}
                                                            style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", border: "1px solid #eee" }}
                                                        />
                                                        <div style={{ fontSize: 13 }}>{apt?.userId?.email || "Unknown"}</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                                        {apt?.servicesDetail?.map((s, si) => (
                                                            <span key={si} style={{ fontSize: 13 }}>
                                                                {s.serviceName} (${s.price})
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td style={{ fontWeight: 600 }}>${Number(apt.totalAmount ?? 0).toFixed(2)}</td>
                                                <td style={{ fontWeight: 600 }}>${Number(apt.platformCommission ?? 0).toFixed(2)}</td>
                                                <td style={{ fontWeight: 600 }}>${Number(apt.vendorCommission ?? apt.vendorPayableAmount ?? 0).toFixed(2)}</td>
                                                <td style={{ fontWeight: 600 }}>${Number(apt.appCharges ?? 0).toFixed(2)}</td>
                                                <td>
                                                    {(() => {
                                                        const amt = apt.discountDetails?.amount ?? apt.chargesBreakdown?.discount?.amount ?? 0;
                                                        const fType = apt.discountDetails?.fundingType || apt.chargesBreakdown?.discount?.fundingType || apt.chargesBreakdown?.discount?.borneBy;
                                                        if (!amt) return <span style={{ fontWeight: 600 }}>$0.00</span>;
                                                        return (
                                                            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                                                <span style={{ fontWeight: 600 }}>${Number(amt).toFixed(2)}</span>
                                                                {fType && (
                                                                    <span
                                                                        style={{
                                                                            fontSize: 10,
                                                                            padding: "1px 6px",
                                                                            borderRadius: 4,
                                                                            width: "fit-content",
                                                                            backgroundColor: fType === "Vendor" ? "#fff7ed" : "#faf5ff",
                                                                            color: fType === "Vendor" ? "#c2410c" : "#7e22ce",
                                                                            border: fType === "Vendor" ? "1px solid #ffedd5" : "1px solid #f3e8ff",
                                                                            fontWeight: 700,
                                                                        }}
                                                                    >
                                                                        {fType}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}
                                                </td>
                                                <td>
                                                    <div style={{ display: "flex", flexDirection: "column", gap: 2, fontSize: 13 }}>
                                                        <span>{apt.paymentMethod}</span>
                                                        <span className={`${apt.paymentStatus === "Success" ? "text-success" : "text-warning"}`} style={{ fontSize: 11 }}>
                                                            {apt.paymentStatus}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>

                                                    {getStatusBadge(apt.status)}

                                                </td>
                                                <td style={{ fontSize: 13, whiteSpace: "nowrap" }}>
                                                    {apt.createdAt ? new Date(apt.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
                                                </td>
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

                <div className="card-box mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0">Payout History</h6>
                        <input
                            type="text"
                            className="form-control w-25"
                            placeholder="Search by ID or Date..."
                            value={payoutSearch}
                            onChange={(e) => setPayoutSearch(e.target.value)}
                            style={{ maxWidth: "250px" }}
                        />
                    </div>

                    {payouts.length === 0 ? (
                        <p className="text-muted">No payouts yet</p>
                    ) : (
                        <div className="table-responsive" style={{ height: "400px", overflowY: "scroll" }}>
                            <table className="history-table">
                                <thead>
                                    <tr>
                                        <th>TransactionId</th>
                                        <th>Payment Method</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Payment Method</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPayouts.map((p, i) => (
                                        <tr key={i}>
                                            <td>{p.transactionId}</td>
                                            <td>{p.payoutMethod}</td>
                                            <td>
                                                {new Date(p.payoutDate).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td>${p.amount}</td>
                                            <td>{p.remarks}</td>
                                            <td>
                                                <span className={`status-badge text-capitalize bg-success text-white `}>
                                                    Paid
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* RATINGS / REVIEWS */}
                <div className="card-box mt-4">
                    <h6>Ratings & Reviews</h6>

                    <div className="d-flex align-items-center gap-3 mb-3" style={{ flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ fontSize: 22, fontWeight: 700 }}>
                                {(vendor?.avgRating ?? 0).toFixed(1)}
                            </div>

                            <Stars value={vendor?.avgRating ?? 0} />

                            <div className="text-muted" style={{ fontSize: 13 }}>
                                ({vendor?.totalReviews ?? 0} reviews)
                            </div>
                        </div>
                    </div>

                    {ratings.length === 0 ? (
                        <p className="text-muted">No reviews yet</p>
                    ) : (
                        <>
                            <table className="history-table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Stars</th>
                                        <th>Message</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ratings.map((r, i) => (
                                        <tr key={r?._id || i}>
                                            <td>
                                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                    <img
                                                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL || ""}/${r?.userId?.image || ""}`}
                                                        alt="user"
                                                        onError={(e) => (e.currentTarget.style.display = "none")}
                                                        style={{
                                                            width: 36,
                                                            height: 36,
                                                            borderRadius: "50%",
                                                            objectFit: "cover",
                                                            border: "1px solid #eee",
                                                        }}
                                                    />
                                                    <div>
                                                        <div style={{ fontWeight: 600 }}>
                                                            {r?.userId?.username || "Unknown"}
                                                        </div>
                                                        <div className="text-muted" style={{ fontSize: 12 }}>
                                                            {r?.userId?.email || ""}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <Stars value={r?.stars ?? 0} size={16} />
                                                <span className="text-muted" style={{ marginLeft: 8, fontSize: 12 }}>
                                                    ({r?.stars ?? 0}/5)
                                                </span>
                                            </td>

                                            <td style={{ maxWidth: 380 }}>
                                                {r?.message || "-"}
                                            </td>

                                            <td>
                                                {r?.createdAt
                                                    ? new Date(r.createdAt).toLocaleDateString("en-GB", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    })
                                                    : "-"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {ratingHasMore && (
                                <div className="d-flex justify-content-center mt-3">
                                    <button className="vd-see-more-btn" onClick={loadMoreRatings} disabled={ratingLoading}>
                                        {ratingLoading ? "Loading..." : "See More Reviews"}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* ABUSE FLAGS */}
                <div id="abuse-flags-section" className="card-box mt-4">
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <h6 className="mb-0">Abuse Flags ({vendor?.abuseFlagPagination?.totalRecords ?? abuseFlags.length})</h6>
                        {vendor?.isFlaggedForAbuse && (
                            <span style={{
                                padding: "3px 10px",
                                borderRadius: "20px",
                                fontSize: "11px",
                                fontWeight: 600,
                                backgroundColor: "#fde8ea",
                                color: "#ef3a4d",
                                marginLeft: "4px"
                            }}>
                                Flagged
                            </span>
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
                                    {abuseFlags.map((flag, i) => (
                                        <tr key={flag._id || i}>
                                            <td>
                                                <span style={{
                                                    padding: "4px 10px",
                                                    borderRadius: "20px",
                                                    fontSize: "12px",
                                                    fontWeight: 600,
                                                    backgroundColor: "#fff3e0",
                                                    color: "#e65100",
                                                    whiteSpace: "nowrap"
                                                }}>
                                                    {flag.triggerType?.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || "Unknown"}
                                                </span>
                                            </td>
                                            <td style={{ maxWidth: 400, fontSize: 13 }}>
                                                {flag.reason || "-"}
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className={`status-badge text-capitalize m-0 ${flag.status === "Resolved" ? "bg-success text-white" :
                                                        flag.status === "Dismissed" ? "bg-secondary text-white" :
                                                            "bg-warning text-dark"
                                                        }`}>
                                                        {flag.status || "Pending"}
                                                    </span>
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary py-1 px-1 "
                                                        onClick={() => {
                                                            setSelectedAbuseFlag(flag);
                                                            setAbuseFlagUpdateForm({
                                                                status: flag.status || "Pending",
                                                                adminNotes: flag.adminNotes || ""
                                                            });
                                                        }}
                                                        style={{ fontSize: 20, cursor: "pointer" }}
                                                        title="Update Status"
                                                    >
                                                        <MdModeEdit />
                                                    </button>
                                                </div>
                                            </td>
                                            <td style={{ fontSize: 13, whiteSpace: "nowrap" }}>
                                                {flag.createdAt ? new Date(flag.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
                                            </td>
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

            {/* ABUSE FLAG STATUS UPDATE MODAL */}
            <Modal isOpen={!!selectedAbuseFlag} onClose={() => setSelectedAbuseFlag(null)}>
                <div className="p-4" style={{ minWidth: "320px" }}>
                    <h4 className="fw-bold mb-4 text-center">Update Abuse Flag Status</h4>
                    <form onSubmit={handleUpdateAbuseFlagStatus}>
                        <div className="mb-3">
                            <label className="form-label text-muted small fw-bold mb-1">STATUS</label>
                            <select
                                className="form-select border border-secondary border-opacity-25"
                                value={abuseFlagUpdateForm.status}
                                onChange={e => setAbuseFlagUpdateForm(prev => ({ ...prev, status: e.target.value }))}
                                style={{ borderRadius: "8px", padding: "8px 12px" }}
                                required
                            >
                                <option value="Pending">Pending</option>
                                <option value="Resolved">Resolved</option>
                                <option value="Dismissed">Dismissed</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-muted small fw-bold mb-1">ADMIN NOTES</label>
                            <textarea
                                className="form-control border border-secondary border-opacity-25"
                                rows="4"
                                placeholder="Enter admin notes / resolution details..."
                                value={abuseFlagUpdateForm.adminNotes}
                                onChange={e => setAbuseFlagUpdateForm(prev => ({ ...prev, adminNotes: e.target.value }))}
                                style={{ borderRadius: "8px", padding: "10px" }}
                            />
                        </div>
                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <button
                                type="button"
                                className="btn btn-light"
                                onClick={() => setSelectedAbuseFlag(null)}
                                style={{ borderRadius: "8px", padding: "8px 20px" }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={updatingAbuseFlag}
                                style={{ borderRadius: "8px", padding: "8px 20px", background: "linear-gradient(135deg, #ff6b6b, #ee5a24)", border: "none" }}
                            >
                                {updatingAbuseFlag ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* APPOINTMENT DETAIL MODAL */}
            <AdminAppointmentDetailModal
                isOpen={!!selectedAppointment}
                onClose={() => setSelectedAppointment(null)}
                appointment={selectedAppointment}
                currentVendor={vendor}
            />
        </div>
    );
}

/* ===================== COMPONENT ===================== */
const StatBox = ({ title, value, color, icon }) => (
    <div className="stat-box d-flex justify-content-between align-items-start">
        <div>
            <p>{title}</p>
            <h5 className={color}>{value}</h5>
        </div>
        {icon && <div>{icon}</div>}
    </div>
);

const Stars = ({ value = 0, size = 18 }) => {
    const full = Math.floor(value);
    const hasHalf = value - full >= 0.5;

    return (
        <span style={{ display: "inline-flex", gap: 2, lineHeight: 1 }}>
            {[1, 2, 3, 4, 5].map((i) => {
                let star = "☆";
                if (i <= full) star = "★";
                else if (i === full + 1 && hasHalf) star = "★"; // simple half-look; optional advanced half below

                return (
                    <span
                        key={i}
                        style={{
                            fontSize: size,
                            color: i <= full ? "#f5b301" : "#c7c7c7",
                        }}
                    >
                        {star}
                    </span>
                );
            })}
        </span>
    );
};