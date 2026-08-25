"use client";

import React from "react";
import Modal from "./layout";
import { FaUser, FaStore, FaCalendarAlt, FaClock, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaTag, FaCreditCard } from "react-icons/fa";
import { MdAttachMoney, MdOutlineReceiptLong } from "react-icons/md";
import { IoClose } from "react-icons/io5";

export default function AdminAppointmentDetailModal({ isOpen, onClose, appointment, currentUser, currentVendor }) {
    if (!appointment) return null;

    const apt = appointment;

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
    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            return d.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        } catch {
            return dateStr;
        }
    };

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

    // User details resolution
    const userObj = typeof apt.userId === "object" && apt.userId !== null ? apt.userId : currentUser || {};
    const userEmail = userObj.email || (typeof apt.userId === "string" ? apt.userId : "N/A");
    const userName = userObj.username || userObj.fullName || (userObj.firstName ? `${userObj.firstName} ${userObj.lastName || ""}` : null) || "Customer";
    const userImg = getImageUrl(userObj.image);

    // Salon details resolution
    const salonObj = typeof apt.salonId === "object" && apt.salonId !== null ? apt.salonId : currentVendor || {};
    const salonName = salonObj.salonName || salonObj.name || "Salon";
    const salonPhone = salonObj.phoneNumber || salonObj.phone || "N/A";
    const salonImg = getImageUrl(salonObj.image);

    // Financial calculations / fallbacks
    const charges = apt.chargesBreakdown || {};
    const subtotal = apt.subtotal ?? charges.appointmentPrice ?? charges.vendorGrossRevenue ?? 0;
    const appCharges = apt.appCharges ?? charges.appCharges ?? 0;
    const discountAmount = apt.discountDetails?.amount ?? charges.discount?.amount ?? 0;
    const discountCode = apt.discountDetails?.code ?? charges.discount?.code ?? null;
    const totalAmount = apt.totalAmount ?? charges.customerTotalPaid ?? 0;
    const platformCommission = apt.platformCommission ?? charges.platformCommission ?? 0;
    const vendorCommission = apt.vendorCommission ?? apt.vendorPayableAmount ?? charges.vendorCommission ?? charges.vendorPayableAmount ?? 0;

    // Status badge style
    const getStatusBadge = (status) => {
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

    return (
        <Modal isOpen={isOpen} onClose={onClose} modalClass="admin-apt-modal-content">
            <div style={{ padding: "8px 4px", fontFamily: "inherit" }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "16px", marginBottom: "20px" }} className="d-flex justify-content-between align-items-center">
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <h4 style={{ margin: 0, fontWeight: 700, fontSize: "20px", color: "#0f172a" }}>
                                Appointment Details
                            </h4>
                            {getStatusBadge(apt.status)}
                        </div>
                        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748b" }}>
                            {/* ID: <code style={{ backgroundColor: "#f1f5f9", padding: "2px 6px", borderRadius: "4px", color: "#334155" }}>{apt._id}</code> */}
                            {apt.createdAt && <span>Booked on: {formatDateTime(apt.createdAt)}</span>}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            border: "none",
                            background: "#f1f5f9",
                            borderRadius: "50%",
                            width: "34px",
                            height: "34px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "#475569",
                            fontSize: "18px",
                            transition: "all 0.2s ease",
                        }}
                        title="Close"
                    >
                        <IoClose />
                    </button>
                </div>

                {/* User & Salon Cards */}
                <div className="row g-3 mb-4">
                    {/* User Card */}
                    <div className="col-md-6">
                        <div style={{ backgroundColor: "#f8fafc", borderRadius: "12px", padding: "14px", border: "1px solid #e2e8f0", height: "100%" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", color: "#475569", fontWeight: 600, fontSize: "13px" }}>
                                <FaUser style={{ color: "#6366f1" }} /> Customer Information
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                {userImg ? (
                                    <img
                                        src={userImg}
                                        alt="User"
                                        style={{ width: "46px", height: "46px", borderRadius: "50%", objectFit: "cover", border: "2px solid #fff", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
                                        onError={(e) => (e.currentTarget.style.display = "none")}
                                    />
                                ) : (
                                    <div style={{ width: "46px", height: "46px", borderRadius: "50%", backgroundColor: "#e0e7ff", color: "#4338ca", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "18px" }}>
                                        {userName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: "14px", color: "#1e293b" }}>{userName}</div>
                                    <div style={{ fontSize: "12px", color: "#64748b" }}>{userEmail}</div>
                                    {userObj.phone && <div style={{ fontSize: "12px", color: "#64748b" }}>Phone: {userObj.phone}</div>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Salon Card */}
                    <div className="col-md-6">
                        <div style={{ backgroundColor: "#f8fafc", borderRadius: "12px", padding: "14px", border: "1px solid #e2e8f0", height: "100%" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", color: "#475569", fontWeight: 600, fontSize: "13px" }}>
                                <FaStore style={{ color: "#ec4899" }} /> Salon / Vendor Information
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                {salonImg ? (
                                    <img
                                        src={salonImg}
                                        alt="Salon"
                                        style={{ width: "46px", height: "46px", borderRadius: "10px", objectFit: "cover", border: "2px solid #fff", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
                                        onError={(e) => (e.currentTarget.style.display = "none")}
                                    />
                                ) : (
                                    <div style={{ width: "46px", height: "46px", borderRadius: "10px", backgroundColor: "#fce7f3", color: "#be185d", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "18px" }}>
                                        {salonName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: "14px", color: "#1e293b" }}>{salonName}</div>
                                    <div style={{ fontSize: "12px", color: "#64748b" }}>Phone: {salonPhone}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Services Section */}
                <div style={{ marginBottom: "20px" }}>
                    <h6 style={{ fontSize: "14px", fontWeight: 700, color: "#334155", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                        <MdOutlineReceiptLong style={{ fontSize: "18px", color: "#3b82f6" }} /> Services Details ({apt.servicesDetail?.length || 0})
                    </h6>

                    {(!apt.servicesDetail || apt.servicesDetail.length === 0) ? (
                        <p style={{ fontSize: "13px", color: "#94a3b8" }}>No service details available</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {apt.servicesDetail.map((s, index) => {
                                const techObj = s.technician || {};
                                const techName = techObj.fullName || techObj.name || "Unassigned";
                                const techImg = getImageUrl(techObj.image);

                                return (
                                    <div
                                        key={s._id || index}
                                        style={{
                                            backgroundColor: "#fff",
                                            border: "1px solid #e2e8f0",
                                            borderRadius: "10px",
                                            padding: "12px 14px",
                                            boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }} className="d-flex justify-content-between">
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: "14px", color: "#0f172a" }}>
                                                    {s.serviceName || s.service?.serviceName || "Service"}
                                                </div>
                                                {s.description && (
                                                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                                                        {s.description}
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ fontWeight: 700, fontSize: "15px", color: "#0f172a" }}>
                                                ${Number(s.price || 0).toFixed(2)}
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "10px", paddingTop: "10px", borderTop: "1px dashed #f1f5f9", flexWrap: "wrap", fontSize: "12px", color: "#475569" }}>
                                            {/* Scheduled Date */}
                                            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                                <FaCalendarAlt style={{ color: "#3b82f6" }} />
                                                <span>{formatDateTime(s.scheduledAt)}</span>
                                            </div>

                                            {/* Technician */}
                                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                {techImg ? (
                                                    <img
                                                        src={techImg}
                                                        alt={techName}
                                                        style={{ width: "20px", height: "20px", borderRadius: "50%", objectFit: "cover" }}
                                                        onError={(e) => (e.currentTarget.style.display = "none")}
                                                    />
                                                ) : (
                                                    <FaUser style={{ color: "#8b5cf6" }} />
                                                )}
                                                <span>Technician: <strong>{techName}</strong></span>
                                            </div>

                                            {/* Service Status if different */}
                                            {s.status && s.status !== apt.status && (
                                                <span style={{ backgroundColor: "#f1f5f9", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 600 }}>
                                                    Status: {s.status}
                                                </span>
                                            )}
                                        </div>

                                        {/* Service Images thumbnails if any */}
                                        {Array.isArray(s.images) && s.images.length > 0 && (
                                            <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                                                {s.images.map((img, imgIdx) => {
                                                    const imgUrl = getImageUrl(img);
                                                    if (!imgUrl) return null;
                                                    return (
                                                        <img
                                                            key={imgIdx}
                                                            src={imgUrl}
                                                            alt="Service preview"
                                                            style={{ width: "40px", height: "40px", borderRadius: "6px", objectFit: "cover", border: "1px solid #e2e8f0" }}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Charges & Revenue Breakdown */}
                <div style={{ backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "16px", marginBottom: "16px" }}>
                    <h6 style={{ fontSize: "14px", fontWeight: 700, color: "#334155", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                        <MdAttachMoney style={{ fontSize: "20px", color: "#10b981" }} /> Financial & Revenue Breakdown
                    </h6>

                    <div className="row g-3">
                        {/* Customer Charges Side */}
                        <div className="col-md-6" style={{ borderRight: "1px solid #e2e8f0" }}>
                            <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: "8px" }}>
                                Customer Payment Breakdown
                            </div>
                            <div style={{ display: "flex", justifyContent: "between", fontSize: "13px", marginBottom: "4px" }} className="d-flex justify-content-between">
                                <span style={{ color: "#64748b" }}>Subtotal / Services:</span>
                                <span style={{ fontWeight: 600 }}>${Number(subtotal).toFixed(2)}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "between", fontSize: "13px", marginBottom: "4px" }} className="d-flex justify-content-between">
                                <span style={{ color: "#64748b" }}>App Charges:</span>
                                <span style={{ fontWeight: 600 }}>${Number(appCharges).toFixed(2)}</span>
                            </div>
                            {discountAmount > 0 && (
                                <div style={{ display: "flex", justifyContent: "between", fontSize: "13px", marginBottom: "4px", color: "#dc2626" }} className="d-flex justify-content-between">
                                    <span>Discount {discountCode ? `(${discountCode})` : ""}:</span>
                                    <span style={{ fontWeight: 600 }}>-${Number(discountAmount).toFixed(2)}</span>
                                </div>
                            )}
                            <div style={{ display: "flex", justifyContent: "between", fontSize: "14px", marginTop: "8px", paddingTop: "8px", borderTop: "1px solid #e2e8f0" }} className="d-flex justify-content-between">
                                <span style={{ fontWeight: 700, color: "#0f172a" }}>Customer Total Paid:</span>
                                <span style={{ fontWeight: 700, color: "#2563eb", fontSize: "15px" }}>${Number(totalAmount).toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Commission & Vendor Share Side */}
                        <div className="col-md-6">
                            <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: "8px" }}>
                                Revenue Split
                            </div>
                            <div style={{ display: "flex", justifyContent: "between", fontSize: "13px", marginBottom: "4px" }} className="d-flex justify-content-between">
                                <span style={{ color: "#64748b" }}>Nail Warz Commission:</span>
                                <span style={{ fontWeight: 600, color: "#ef4444" }}>${Number(platformCommission).toFixed(2)}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "between", fontSize: "13px", marginBottom: "4px" }} className="d-flex justify-content-between">
                                <span style={{ color: "#64748b" }}>Vendor Share:</span>
                                <span style={{ fontWeight: 700, color: "#16a34a" }}>${Number(vendorCommission).toFixed(2)}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "between", fontSize: "12px", marginTop: "12px", paddingTop: "8px", borderTop: "1px solid #e2e8f0" }} className="d-flex justify-content-between">
                                <span style={{ color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                                    <FaCreditCard /> Payment Method:
                                </span>
                                <span style={{ fontWeight: 600, color: "#334155" }}>
                                    {apt.paymentMethod || "N/A"} {apt.paymentStatus ? `(${apt.paymentStatus})` : ""}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info if Canceled or Disputed */}
                {(apt.canceledBy || apt.cancelReason || apt.disputeId) && (
                    <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "12px 14px", marginBottom: "16px", fontSize: "13px", color: "#991b1b" }}>
                        <div style={{ fontWeight: 700, marginBottom: "4px" }}>Cancellation / Dispute Notice</div>
                        {apt.canceledBy && <div>Canceled By: {apt.canceledBy}</div>}
                        {apt.cancelReason && <div>Reason: {apt.cancelReason}</div>}
                        {apt.disputeId && <div>Dispute ID: {apt.disputeId}</div>}
                    </div>
                )}

                {/* Modal Footer / Close button */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                    <button
                        onClick={onClose}
                        className="btn btn-secondary px-4"
                        style={{ borderRadius: "8px", fontWeight: 500, fontSize: "14px" }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}
