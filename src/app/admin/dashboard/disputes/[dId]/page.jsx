"use client";

import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { useRouter, useParams } from "next/navigation";
import { BsArrowLeft, BsSend, BsX } from "react-icons/bs";
import api from "@/lib/axios";
import { showSuccessToast, showErrorToast } from "@/lib/toast";
import Image from "next/image";
import Link from "next/link";

const AttachmentWithFallback = ({ url, fallbackText, size = 100 }) => {
    const [error, setError] = useState(false);

    if (error || !url) {
        return (
            <div className="rounded-2 bg-light d-flex align-items-center justify-content-center text-muted fw-bold" style={{ width: "100%", height: "100%", fontSize: size > 60 ? '14px' : '10px' }}>
                {fallbackText}
            </div>
        );
    }

    return (
        <Link href={url} target="_blank" rel="noreferrer">
            <Image
                src={url}
                width={size}
                height={size}
                alt="attachment"
                className="object-fit-cover rounded-2 w-100 h-100"
                onError={() => setError(true)}
            />
        </Link>
    );
};

export default function DisputeDetails() {
    const { dId } = useParams();
    const router = useRouter();

    const [dispute, setDispute] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [images, setImages] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [updateForm, setUpdateForm] = useState({
        status: "",
        adminNote: "",
        resolvedInFavorOf: "User"
    });
    const chatEndRef = useRef(null);


    // 🔁 Fetch Dispute Data
    const fetchDispute = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const res = await api.get(`/dispute/${dId}`);
            if (res.data.success) {
                setDispute(res.data.dispute);
            }
        } catch (error) {
            console.error("Error fetching dispute details:", error);
            showErrorToast("Failed to load dispute details");
        } finally {
            if (!silent) setLoading(false);
        }
    };

    useEffect(() => {
        fetchDispute();
    }, [dId]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [dispute?.responses]);

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 3) {
            showErrorToast("Maximum 3 images allowed");
            return;
        }
        setImages([...images, ...files]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmitResponse = async (e) => {
        e.preventDefault();
        if (!message && images.length === 0) {
            showErrorToast("Please enter a message or attach images");
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("respondent", "Vendor");
            formData.append("message", message);
            images.forEach((img) => {
                formData.append("images", img);
            });

            const res = await api.patch(`/dispute/response/${dId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${Cookies.get("token")}`,
                },
            });

            if (res.data.success) {
                showSuccessToast("Response sent successfully");
                setMessage("");
                setImages([]);
                fetchDispute(true); // Refresh data to show new response
            }
        } catch (error) {
            console.error("Error sending response:", error);
            showErrorToast("Failed to send response");
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await api.patch(`/dispute/admin/${dId}/status`, updateForm, {
                headers: {
                    "Authorization": `Bearer ${Cookies.get("token")}`,
                },
            });

            if (res.data.success) {
                showSuccessToast("Status updated successfully");
                setShowStatusModal(false);
                fetchDispute();
            }
        } catch (error) {
            console.error("Error updating status:", error);
            showErrorToast(error.response?.data?.message || "Failed to update status");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <p className="m-5 text-center">Loading dispute details...</p>;
    if (!dispute) return <p className="m-5 text-center">Dispute not found</p>;

    return (
        <div className="page  min-vh-100">
            <div className="dashboard_panel_inner pt-4 container-fluid">
                <button
                    className="btn btn-link text-dark p-0 mb-4 d-flex align-items-center gap-2 text-decoration-none "
                    onClick={() => router.back()}
                >
                    <BsArrowLeft /> Back to Disputes
                </button>

                <div className="row g-4">
                    {/* LEFT COLUMN: INFO & HISTORY */}
                    <div className="col-lg-8">
                        {/* MAIN INFO CARD */}
                        <div className="card shadow-sm border-0 mb-4 rounded-4 overflow-hidden">
                            <div className="card-header bg-white py-3 border-bottom-0">
                                <h5 className="mb-0 fw-bold">Dispute Information</h5>
                            </div>
                            <div className="card-body">
                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <label className="text-muted small text-uppercase fw-bold mb-2">User</label>
                                        <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3">
                                            <div className="avatar2 rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
                                                {dispute.userId?.username?.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="fw-bold">{dispute.userId?.username}</div>
                                                <div className="small text-muted">{dispute.userId?.email}</div>
                                                <div className="small text-muted">{dispute.userId?.phone}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="text-muted small text-uppercase fw-bold mb-2">Vendor</label>
                                        <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3">
                                            <div className="avatar2 rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center overflow-hidden" style={{ width: 48, height: 48 }}>
                                                {dispute.vendorId?.image?.[0] ? (
                                                    <Image src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${dispute.vendorId.image[0]}`} width={48} height={48} alt="vendor" className="object-fit-cover w-100 h-100" />
                                                ) : (
                                                    dispute.vendorId?.salonName?.charAt(0)
                                                )}
                                            </div>
                                            <div>
                                                <div className="fw-bold">{dispute.vendorId?.salonName}</div>
                                                <div className="small text-muted">{dispute.vendorId?.email}</div>
                                                <div className="small text-muted">{dispute.vendorId?.bussinessAddress}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="text-muted small text-uppercase fw-bold mb-2">Reason</label>
                                    <div className="p-3 bg-light rounded-3 fw-medium">
                                        {dispute.reason}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="text-muted small text-uppercase fw-bold mb-2">Description</label>
                                    <div className="p-3 bg-light rounded-3 fw-medium">
                                        {dispute.description || "No description provided."}
                                    </div>
                                </div>

                                {dispute.attachments?.length > 0 && (
                                    <div className="mb-4">
                                        <label className="text-muted small text-uppercase fw-bold mb-2">Initial Attachments</label>
                                        <div className="d-flex flex-wrap gap-2">
                                            {dispute.attachments.map((file, idx) => {
                                                const isImage = file?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                                                const fileUrl = file ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${file}` : null;

                                                return (
                                                    <div key={idx} className="attachment-item border rounded-3 p-1 position-relative" style={{ width: 100, height: 100 }}>
                                                        {isImage && file ? (
                                                            <AttachmentWithFallback url={fileUrl} fallbackText="IMG" />
                                                        ) : !isImage && file ? (
                                                            <Link href={fileUrl} target="_blank" rel="noreferrer" className="btn btn-light d-flex align-items-center justify-content-center w-100 h-100 overflow-hidden">
                                                                <div className="text-center small p-2">View Video</div>
                                                            </Link>
                                                        ) : (
                                                            <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center text-muted fw-bold rounded-2">
                                                                {isImage ? "IMG" : "VID"}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RESPONSE HISTORY */}
                        <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
                            <div className="card-header bg-white py-3 border-bottom-0">
                                <h5 className="mb-0 fw-bold">Response History</h5>
                            </div>
                            <div className="card-body bg-light-subtle">
                                <div className="chat-container" style={{ maxHeight: "450px", overflowY: "auto", paddingRight: "20px" }}>
                                    {dispute.responses?.length > 0 ? dispute.responses.map((res, idx) => (
                                        <div key={idx} className={`d-flex flex-column mb-4 ${res.respondent === 'User' || res.respondent === 'Admin' ? 'align-items-end' : 'align-items-start'}`}>
                                            <div className="small text-muted mb-1 px-2">{res.respondent} • {new Date(res.createdAt).toLocaleString()}</div>
                                            <div className={`p-3 border rounded-3  ${res.respondent === 'User' || res.respondent === 'Admin' ? 'bg-light text-dark' : 'bg-white'}`} style={{ maxWidth: '85%' }}>
                                                <div className="fw-medium">{res.message}</div>
                                                {res.attachments?.length > 0 && (
                                                    <div className="mt-2 pt-2 border-top border-opacity-10 d-flex flex-wrap gap-1">
                                                        {res.attachments.map((file, i) => {
                                                            const fileUrl = file ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${file}` : null;
                                                            return (
                                                                <div key={i} style={{ width: 50, height: 50 }}>
                                                                    <AttachmentWithFallback url={fileUrl} fallbackText="IMG" size={50} />
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-5 text-muted">No responses yet.</div>
                                    )}
                                    <div ref={chatEndRef} />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: APPOINTMENT INFO */}
                    <div className="col-lg-4">
                        <div className="card shadow-sm border-0 rounded-4 overflow-hidden position-sticky" style={{ top: '2rem' }}>
                            <div className="card-header bg-dark text-white py-3 border-0">
                                <h5 className="mb-0 fw-bold">Appointment Context</h5>
                            </div>
                            <div className="card-body">
                                {dispute.appointmentId ? (
                                    <>
                                        <div className="mb-4">
                                            <label className="text-muted small text-uppercase fw-bold mb-1">Service</label>
                                            <h6 className="fw-bold text-primary mb-0">{dispute.appointmentId.serviceId?.serviceName}</h6>
                                        </div>
                                        <div className="row mb-4">
                                            <div className="col-6">
                                                <label className="text-muted small text-uppercase fw-bold mb-1">Date</label>
                                                <div className="fw-semibold">{dispute.appointmentId.date}</div>
                                            </div>
                                            <div className="col-6">
                                                <label className="text-muted small text-uppercase fw-bold mb-1">Time</label>
                                                <div className="fw-semibold">{dispute.appointmentId.time}</div>
                                            </div>
                                        </div>
                                        <div className="row mb-4">
                                            <div className="col-6">
                                                <label className="text-muted small text-uppercase fw-bold mb-1">Price</label>
                                                <div className="fw-bold text-success fs-5">${dispute.appointmentId.totalAmount}</div>
                                            </div>
                                            <div className="col-6">
                                                <label className="text-muted small text-uppercase fw-bold mb-1">Status</label>
                                                <div><span className="badge bg-light text-dark border">{dispute.appointmentId.status}</span></div>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="mb-0 text-center">
                                            <div className={`badge py-2 px-3 fs-6 rounded-pill mb-3 ${dispute.status === 'Refunded' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                Status: {dispute.status}
                                            </div>
                                            <button
                                                className="btn btn-primary w-100 rounded-pill shadow-sm py-2 fw-bold"
                                                onClick={() => {
                                                    setUpdateForm({
                                                        status: dispute.status,
                                                        adminNote: dispute.adminNote || "",
                                                        resolvedInFavorOf: dispute.resolvedInFavorOf || "User"
                                                    });
                                                    setShowStatusModal(true);
                                                }}
                                            >
                                                Update Status
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-muted text-center py-4">No appointment linked</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* STATUS UPDATE MODAL */}
            {showStatusModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 shadow">
                            <div className="modal-header border-bottom-0 pb-0">
                                <h5 className="modal-title fw-bold">Update Dispute Status</h5>
                                <button type="button" className="btn-close" onClick={() => setShowStatusModal(false)}></button>
                            </div>
                            <form onSubmit={handleUpdateStatus}>
                                <div className="modal-body py-4">
                                    <div className="mb-4">
                                        <label className="form-label text-muted small text-uppercase fw-bold">Select Status</label>
                                        <select
                                            className="form-select border-0 bg-light p-3 rounded-3"
                                            value={updateForm.status}
                                            onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Status</option>
                                            <option value="Under_Review">Under Review</option>
                                            <option value="Resolved">Resolved</option>
                                            <option value="Rejected">Rejected</option>
                                            <option value="Refunded">Refunded (Charge Vendor)</option>
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label text-muted small text-uppercase fw-bold">Admin Note</label>
                                        <textarea
                                            className="form-control border-0 bg-light p-3 rounded-3"
                                            rows="4"
                                            placeholder="Add a note about this decision..."
                                            value={updateForm.adminNote}
                                            onChange={(e) => setUpdateForm({ ...updateForm, adminNote: e.target.value })}
                                        ></textarea>
                                    </div>

                                    <div className="mb-0">
                                        <label className="form-label text-muted small text-uppercase fw-bold mb-3">Resolved In Favor Of</label>
                                        <div className="d-flex gap-3 bg-light p-2 rounded-pill">
                                            <button
                                                type="button"
                                                className={`btn flex-grow-1 rounded-pill py-2 fw-bold border-0 ${updateForm.resolvedInFavorOf === 'User' ? 'bg-white shadow-sm text-primary' : 'text-muted'}`}
                                                onClick={() => setUpdateForm({ ...updateForm, resolvedInFavorOf: 'User' })}
                                            >
                                                User
                                            </button>
                                            <button
                                                type="button"
                                                className={`btn flex-grow-1 rounded-pill py-2 fw-bold border-0 ${updateForm.resolvedInFavorOf === 'Vendor' ? 'bg-white shadow-sm text-primary' : 'text-muted'}`}
                                                onClick={() => setUpdateForm({ ...updateForm, resolvedInFavorOf: 'Vendor' })}
                                            >
                                                Vendor
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-top-0 pt-0 pb-4 px-4">
                                    <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowStatusModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary rounded-pill px-4 shadow-sm" disabled={submitting}>
                                        {submitting ? "Updating..." : "Update Dispute"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
