"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Spinner } from "react-bootstrap";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { FaUser, FaStore, FaCalendarAlt, FaClock, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaTag, FaExchangeAlt, FaArrowLeft, FaPlay, FaCheck } from "react-icons/fa";
import { MdAttachMoney, MdOutlineReceiptLong } from "react-icons/md";

export default function AppointmentDetailPage() {
    const params = useParams();
    const router = useRouter();

    const id = params.id;

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [showCancel, setShowCancel] = useState(false);

    const API = process.env.NEXT_PUBLIC_API_URL;

    // Helper for image formatting
    const getImageUrl = (img) => {
        if (!img) return null;
        let path = Array.isArray(img) ? img[0] : img;
        if (typeof path !== "string" || !path) return null;
        if (path.startsWith("http://") || path.startsWith("https://")) return path;
        const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "";
        return `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
    };

    // Date formatting helpers
    const formatDateTime = (dateStr) => {
        if (!dateStr) return "-";
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            return d.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
        } catch {
            return dateStr;
        }
    };

    // =========================
    // Fetch Booking
    // =========================
    const fetchBooking = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API}/getBookingById?bookingId=${id}`);
            const json = await res.json();
            if (json.success) {
                setBooking(json.data);
            } else {
                showErrorToast(json.message || "Failed to load appointment details");
            }
        } catch (err) {
            console.error(err);
            showErrorToast(err.message || "Failed to load appointment details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchBooking();
    }, [id]);

    // =========================
    // Booking Status Update
    // =========================
    const updateBookingStatus = async (status) => {
        try {
            setUpdating(true);
            const body = {
                bookingId: booking._id,
                status,
            };
            if (status === "Canceled") {
                body.reason = cancelReason;
            }

            const res = await fetch(`${API}/updateBookingStatus`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const json = await res.json();
            if (json.success) {
                setShowCancel(false);
                setCancelReason("");
                showSuccessToast(`Booking status updated to ${status}`);
                fetchBooking();
            } else {
                showErrorToast(json.message || "Failed to update status");
            }
        } catch (err) {
            console.error(err);
            showErrorToast(err.message || "Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    // =========================
    // Service Status Update
    // =========================
    const updateServiceStatus = async (slotId, status) => {
        try {
            setUpdating(true);
            const res = await fetch(`${API}/updateServiceSlotStatus`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    bookingId: booking._id,
                    slotId,
                    status,
                }),
            });

            const json = await res.json();
            if (json.success) {
                fetchBooking();
                showSuccessToast("Service status updated successfully");
            } else {
                showErrorToast(json.message || "Failed to update status");
            }
        } catch (err) {
            console.error(err);
            showErrorToast(err.message || "Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    // Status badge style
    const getStatusBadge = (status = "") => {
        const s = (status || "").toLowerCase();
        let bg = "#e2e8f0";
        let color = "#334155";
        let icon = <FaInfoCircle style={{ marginRight: "4px" }} />;

        if (s === "completed") {
            bg = "#dcfce7";
            color = "#15803d";
            icon = <FaCheckCircle style={{ marginRight: "4px" }} />;
        } else if (s === "confirmed") {
            bg = "#dbeafe";
            color = "#1d4ed8";
            icon = <FaCheckCircle style={{ marginRight: "4px" }} />;
        } else if (s === "canceled" || s === "cancelled") {
            bg = "#fee2e2";
            color = "#b91c1c";
            icon = <FaTimesCircle style={{ marginRight: "4px" }} />;
        } else if (s === "rescheduled" || s === "in_progress") {
            bg = "#fef3c7";
            color = "#b45309";
            icon = <FaExchangeAlt style={{ marginRight: "4px" }} />;
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
                {icon} {status || "Unknown"}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="page pt-4 text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Loading appointment details...</p>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="page pt-4">
                <div className="alert alert-danger">Appointment not found</div>
                <button className="btn btn-outline-secondary" onClick={() => router.back()}>
                    ← Back to Appointments
                </button>
            </div>
        );
    }

    // Customer resolution
    const userObj = typeof booking.userId === "object" && booking.userId !== null ? booking.userId : {};
    const userName = userObj.username || (userObj.firstName ? `${userObj.firstName} ${userObj.lastName || ""}`.trim() : null) || "Customer";
    const userEmail = userObj.email || "N/A";
    const userPhone = userObj.phone || "N/A";
    const userImg = getImageUrl(userObj.image);
    const userAddress = [userObj.street, userObj.city, userObj.state, userObj.zipCode].filter(Boolean).join(", ");

    // Salon resolution
    const salonObj = typeof booking.salonId === "object" && booking.salonId !== null ? booking.salonId : {};
    const salonName = salonObj.salonName || salonObj.name || "Salon";
    const salonImg = getImageUrl(salonObj.image);

    // Financial calculations
    const charges = booking.chargesBreakdown || {};
    const discountObj = charges.discount || booking.discountDetails || {};
    const subtotal = booking.subtotal ?? charges.appointmentPrice ?? 0;
    const appCharges = booking.appCharges ?? charges.appCharges ?? 0;

    const discountAmount = discountObj.amount ?? booking.discountDetails?.amount ?? 0;
    const discountCode = discountObj.code ?? booking.discountDetails?.code ?? null;
    const discountType = discountObj.type ?? booking.discountDetails?.type ?? null;
    const discountValue = discountObj.value ?? booking.discountDetails?.value ?? 0;
    const fundingType = discountObj.fundingType || discountObj.borneBy || booking.discountDetails?.fundingType || null;

    const totalAmount = booking.totalAmount ?? charges.customerTotalPaid ?? 0;
    const vendorGrossRevenue = charges.vendorGrossRevenue ?? (fundingType === "Vendor" ? (subtotal - discountAmount) : subtotal);
    const platformCommission = booking.platformCommission ?? charges.platformCommission ?? 0;
    const vendorCommission = booking.vendorCommission ?? booking.vendorPayableAmount ?? charges.vendorCommission ?? charges.vendorPayableAmount ?? 0;

    const paymentId = booking.paymentId || null;
    const paymentMethod = booking.paymentMethod || "N/A";
    const paymentStatus = booking.paymentStatus || null;

    return (
        <div className="page pt-4 pb-5">
            {/* Top Bar Navigation */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={() => router.back()}>
                    <FaArrowLeft /> Back to Appointments
                </button>
                <div className="d-flex align-items-center gap-2">
                    {getStatusBadge(booking.status)}
                    {booking.status !== "Completed" && booking.status !== "Canceled" && booking.status !== "Cancelled" && (
                        <button className="btn btn-outline-danger btn-sm px-3" onClick={() => setShowCancel(!showCancel)}>
                            Cancel Booking
                        </button>
                    )}
                </div>
            </div>

            {/* Cancel Box */}
            {showCancel && (
                <div className="card mb-4 border-danger shadow-sm">
                    <div className="card-body">
                        <h5 className="text-danger fw-bold mb-2">Cancel Appointment</h5>
                        <p className="text-muted small mb-3">Please state the reason for canceling this booking:</p>
                        <textarea
                            className="form-control mb-3"
                            rows="3"
                            placeholder="Enter cancellation reason..."
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                        />
                        <div className="d-flex gap-2">
                            <button className="btn btn-danger" onClick={() => updateBookingStatus("Canceled")} disabled={updating}>
                                {updating ? <Spinner size="sm" /> : "Confirm Cancel"}
                            </button>
                            <button className="btn btn-light" onClick={() => setShowCancel(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Header Info Card */}
            <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: "12px" }}>
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div>
                            <h4 className="fw-bold mb-1 text-dark">Appointment</h4>
                            <p className="text-muted small mb-0">
                                Booked on: {formatDateTime(booking.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Customer & Salon Information Cards */}
            <div className="row g-3 mb-4">
                {/* Customer Card */}
                <div className="col-md-6">
                    <div className="card shadow-sm border-0 h-100" style={{ borderRadius: "12px" }}>
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center gap-2 mb-3 text-secondary fw-bold small">
                                <FaUser className="text-primary" /> CUSTOMER INFORMATION
                            </div>
                            <div className="d-flex align-items-start gap-3">
                                {userImg ? (
                                    <img
                                        src={userImg}
                                        alt="Customer"
                                        style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover", border: "2px solid #e0e7ff" }}
                                        onError={(e) => (e.currentTarget.style.display = "none")}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: "50%",
                                            backgroundColor: "#e0e7ff",
                                            color: "#4338ca",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: 700,
                                            fontSize: 20,
                                        }}
                                    >
                                        {userName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <h5 className="fw-bold mb-1">{userName}</h5>
                                    <p className="text-muted small mb-0">{userEmail}</p>
                                    {userPhone !== "N/A" && <p className="text-muted small mb-0">Phone: {userPhone}</p>}
                                    {userAddress && <p className="text-muted small mb-0 mt-1">{userAddress}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Salon Card */}
                <div className="col-md-6">
                    <div className="card shadow-sm border-0 h-100" style={{ borderRadius: "12px" }}>
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center gap-2 mb-3 text-secondary fw-bold small">
                                <FaStore className="text-danger" /> SALON / VENDOR DETAILS
                            </div>
                            <div className="d-flex align-items-start gap-3">
                                {salonImg ? (
                                    <img
                                        src={salonImg}
                                        alt="Salon"
                                        style={{ width: 50, height: 50, borderRadius: "10px", objectFit: "cover", border: "2px solid #fce7f3" }}
                                        onError={(e) => (e.currentTarget.style.display = "none")}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: "10px",
                                            backgroundColor: "#fce7f3",
                                            color: "#be185d",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: 700,
                                            fontSize: 20,
                                        }}
                                    >
                                        {salonName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <h5 className="fw-bold mb-1">{salonName}</h5>
                                    {salonObj.phoneNumber && <p className="text-muted small mb-0">Phone: {salonObj.phoneNumber}</p>}
                                    {salonObj.locationName && <p className="text-muted small mb-0 mt-1">{salonObj.locationName}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Services Detail List */}
            <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: "12px" }}>
                <div className="card-header bg-white py-3 border-0">
                    <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                        <MdOutlineReceiptLong className="text-primary" /> Services Details ({booking.servicesDetail?.length || 0})
                    </h5>
                </div>
                <div className="card-body p-4 pt-0">
                    {(!booking.servicesDetail || booking.servicesDetail.length === 0) ? (
                        <p className="text-muted">No service details found</p>
                    ) : (
                        <div className="d-flex flex-column gap-3">
                            {booking.servicesDetail.map((item) => {
                                const techObj = item.technician || {};
                                const techName = techObj.fullName || techObj.name || "Unassigned";
                                const techImg = getImageUrl(techObj.image);
                                const isRescheduled = item.reschedule || item.status === "Rescheduled" || Boolean(item.previousScheduledAt);

                                return (
                                    <div
                                        key={item._id}
                                        className="p-3 rounded-3 border"
                                        style={{
                                            backgroundColor: isRescheduled ? "#fffbeb" : "#fff",
                                            borderColor: isRescheduled ? "#fde68a" : "#e2e8f0",
                                        }}
                                    >
                                        <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                                            <div>
                                                <div className="d-flex align-items-center gap-2">
                                                    <h5 className="fw-bold mb-0">{item.serviceName}</h5>
                                                    {isRescheduled && (
                                                        <span className="badge bg-warning text-dark d-inline-flex align-items-center gap-1">
                                                            <FaExchangeAlt size={10} /> Rescheduled
                                                        </span>
                                                    )}
                                                </div>
                                                {item.description && (
                                                    <p className="text-muted small mb-0 mt-1">{item.description}</p>
                                                )}
                                            </div>
                                            <div className="fw-bold fs-5 text-dark">${Number(item.price || 0).toFixed(2)}</div>
                                        </div>

                                        <div className="d-flex align-items-center gap-4 flex-wrap mt-3 pt-2 border-top border-light text-muted small">
                                            <div className="d-flex align-items-center gap-1">
                                                <FaCalendarAlt className="text-primary" />
                                                <span>Scheduled: <strong>{formatDateTime(item.scheduledAt)}</strong></span>
                                            </div>

                                            {item.previousScheduledAt && (
                                                <div className="d-flex align-items-center gap-1 text-warning">
                                                    <span>(Prev: <del>{formatDateTime(item.previousScheduledAt)}</del>)</span>
                                                </div>
                                            )}

                                            <div className="d-flex align-items-center gap-2">
                                                {techImg ? (
                                                    <img
                                                        src={techImg}
                                                        alt={techName}
                                                        style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover" }}
                                                        onError={(e) => (e.currentTarget.style.display = "none")}
                                                    />
                                                ) : (
                                                    <FaUser className="text-purple" />
                                                )}
                                                <span>Tech: <strong>{techName}</strong></span>
                                            </div>

                                            <div>
                                                Status: {getStatusBadge(item.status)}
                                            </div>
                                        </div>

                                        {/* Action buttons per service slot */}
                                        <div className="mt-3 d-flex gap-2">
                                            {(item.status === "Confirmed" || item.status === "Rescheduled") && (
                                                <button
                                                    className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                                                    onClick={() => updateServiceStatus(item._id, "In_Progress")}
                                                    disabled={updating}
                                                >
                                                    <FaPlay size={10} /> Start Service
                                                </button>
                                            )}

                                            {item.status === "In_Progress" && (
                                                <button
                                                    className="btn btn-success btn-sm d-flex align-items-center gap-1"
                                                    onClick={() => updateServiceStatus(item._id, "Completed")}
                                                    disabled={updating}
                                                >
                                                    <FaCheck size={10} /> Complete Service
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Financial Breakdown Card */}
            <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: "12px" }}>
                <div className="card-body p-4">
                    <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                        <MdAttachMoney className="text-success fs-4" /> Financial & Revenue Breakdown
                    </h5>

                    <div className="row g-4">
                        {/* Customer Side */}
                        <div className="col-md-6 border-end">
                            <h6 className="text-muted fw-bold small text-uppercase mb-3">Customer Charges</h6>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Subtotal / Services:</span>
                                <span className="fw-bold">${Number(subtotal).toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">App Charges:</span>
                                <span className="fw-bold">${Number(appCharges).toFixed(2)}</span>
                            </div>

                            {discountAmount > 0 && (
                                <div className="bg-light p-2 rounded border border-danger-subtle mb-2">
                                    <div className="d-flex justify-content-between text-danger fw-bold small">
                                        <span>

                                            Discount {discountCode ? `(${discountCode})` : ""}
                                            {discountValue ? ` - ${discountValue}${discountType === "percentage" ? "%" : "$"}` : ""}:
                                        </span>
                                        <span>-${Number(discountAmount).toFixed(2)}</span>
                                    </div>
                                    {fundingType && (
                                        <div className="d-flex justify-content-between align-items-center mt-1 small" style={{ fontSize: 11 }}>
                                            <span className="text-muted">Funding Source:</span>
                                            <span
                                                className={`badge ${fundingType === "Vendor" ? "bg-warning-subtle text-dark border border-warning" : "bg-purple-subtle text-purple border border-purple"}`}
                                                style={{
                                                    backgroundColor: fundingType === "Vendor" ? "#fff7ed" : "#faf5ff",
                                                    color: fundingType === "Vendor" ? "#c2410c" : "#7e22ce",
                                                }}
                                            >
                                                {fundingType}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="d-flex justify-content-between pt-2 border-top fw-bold fs-5 mt-3">
                                <span>Total Paid:</span>
                                <span className="text-primary">${Number(totalAmount).toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Revenue Split Side */}
                        <div className="col-md-6">
                            <h6 className="text-muted fw-bold small text-uppercase mb-3">Vendor Revenue Breakdown</h6>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Vendor Gross Revenue:</span>
                                <span className="fw-bold">${Number(vendorGrossRevenue).toFixed(2)}</span>
                            </div>

                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Nail Warz Commission:</span>
                                <span className="fw-bold text-danger">-${Number(platformCommission).toFixed(2)}</span>
                            </div>

                            <div className="d-flex justify-content-between pt-2 border-top fw-bold fs-5 mt-3">
                                <span className="text-success">Vendor Net Share:</span>
                                <span className="text-success">${Number(vendorCommission).toFixed(2)}</span>
                            </div>

                            <div className="mt-3 pt-2 border-top small text-muted">
                                <div className="d-flex justify-content-between mb-1">
                                    <span> Payment Method:</span>
                                    <span className="fw-bold text-dark">{paymentMethod} {paymentStatus ? `(${paymentStatus})` : ""}</span>
                                </div>
                                {paymentId && (
                                    <div className="d-flex justify-content-between">
                                        <span>Payment ID:</span>
                                        <code className="bg-light px-2 py-1 rounded text-dark">{paymentId}</code>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancellation Notice if Canceled */}
            {booking.status === "Canceled" && (
                <div className="alert alert-danger shadow-sm border-0" style={{ borderRadius: "12px" }}>
                    <h5 className="fw-bold mb-2">Canceled Appointment Information</h5>
                    <p className="mb-1"><strong>Canceled By:</strong> {booking.canceledBy || "N/A"}</p>
                    <p className="mb-0"><strong>Reason:</strong> {booking.cancelReason || "No reason provided"}</p>
                </div>
            )}
        </div>
    );
}
