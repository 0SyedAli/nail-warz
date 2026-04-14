"use client";

import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { useRouter, useParams } from "next/navigation";
import { BsArrowLeft, BsSend, BsX } from "react-icons/bs";
import api from "@/lib/axios";
import { showSuccessToast, showErrorToast } from "@/lib/toast";
import Image from "next/image";
import Link from "next/link";
import BallsLoading from "@/components/Spinner/BallsLoading";

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
    const messagesContainerRef = useRef(null);


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
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
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

    if (loading) return <div className="page  min-vh-100"><div className="dashboard_panel_inner pt-4 container-fluid"><div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}><BallsLoading /></div></div></div>;
    if (!dispute) return <p className="m-5 text-center">Dispute not found</p>;

    const firstResponse = dispute.responses?.[0];

    return (
        <div className="page min-vh-100 bg-light-subtle">
            <div className="dashboard_panel_inner pt-4 container-fluid">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <button
                        className="btn btn-link text-dark p-0 d-flex align-items-center gap-2 text-decoration-none fw-semibold"
                        onClick={() => router.back()}
                    >
                        <BsArrowLeft /> Back to Disputes
                    </button>
                    <div className="d-flex align-items-center gap-2">
                        Status:
                        <div className="d-flex gap-2">
                            {(dispute.status === 'Refunded' || dispute.status === 'Resolved') && (
                                <div className="badge py-2 px-3 rounded-pill bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25" style={{ fontSize: '0.85rem' }}>
                                    Resolved In Favor: {dispute.resolvedInFavorOf}
                                </div>
                            )}
                            <div className={`badge py-2 px-4 rounded-pill shadow-sm ${dispute.status === 'Refunded' || dispute.status === 'Resolved' ? 'bg-success' : dispute.status === 'Rejected' ? 'bg-danger' : 'bg-warning text-dark'}`} style={{ fontSize: '0.9rem' }}>
                                {dispute.status.replace('_', ' ')}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    {/* LEFT COLUMN: PRIMARY INFO */}
                    <div className="col-lg-8">
                        {/* DISPUTE REQUEST BOX */}
                        <div className="card shadow-sm border-0 rounded-4 mb-4" style={{ borderRadius: '24px' }}>
                            <div className="card-body p-4">
                                <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                    {/* <span className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary"><BsX size={24} /></span> */}
                                    Dispute Request Details
                                </h4>

                                <div className="row g-4 mb-4">
                                    <div className="col-md-6">
                                        <div className="p-3 bg-light rounded-4 h-100 border border-secondary border-opacity-10">
                                            <label className="text-muted small text-uppercase fw-bold mb-1 d-block">Raised By</label>
                                            <p className="fw-bold mb-0 text-dark fs-5">{dispute.raisedBy}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="p-3 bg-light rounded-4 h-100 border border-secondary border-opacity-10">
                                            <label className="text-muted small text-uppercase fw-bold mb-1 d-block">Reason</label>
                                            <p className="fw-bold mb-0 text-dark fs-5">{dispute.reason}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="text-muted small text-uppercase fw-bold mb-2">Description</label>
                                    <div className="p-3 bg-light rounded-4 border border-secondary border-opacity-10" style={{ minHeight: '80px' }}>
                                        {dispute.description || "No additional description provided."}
                                    </div>
                                </div>

                                {dispute.attachments?.length > 0 && (
                                    <div>
                                        <label className="text-muted small text-uppercase fw-bold mb-2">Initial Attachments</label>
                                        <div className="d-flex flex-wrap gap-3">
                                            {dispute.attachments.map((file, idx) => {
                                                const isImage = file?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                                                const fileUrl = file ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${file}` : null;
                                                return (
                                                    <div key={idx} className="attachment-box shadow-sm rounded-4 overflow-hidden position-relative" style={{ width: 120, height: 120 }}>
                                                        {isImage && file ? (
                                                            <AttachmentWithFallback url={fileUrl} fallbackText="IMAGE" size={120} />
                                                        ) : (
                                                            <Link href={fileUrl || "#"} target="_blank" rel="noreferrer" className="w-100 h-100 bg-dark d-flex align-items-center justify-content-center text-white text-decoration-none">
                                                                <small className="fw-bold">VIEW VIDEO</small>
                                                            </Link>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* FIRST RESPONSE BOX */}
                        {firstResponse ? (
                            <div className="card shadow-sm border-0 rounded-4 mb-4" style={{ borderRadius: '24px', borderLeft: '6px solid var(--bs-primary)' }}>
                                <div className="card-body p-4">
                                    <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                        <BsSend className="text-primary" />
                                        Initial Response
                                    </h5>

                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <div className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                                            Respondent: {firstResponse.respondent}
                                        </div>
                                        <small className="text-muted">{new Date(firstResponse.createdAt).toLocaleString()}</small>
                                    </div>

                                    <div className="p-3 bg-light rounded-4 border border-secondary border-opacity-10 mb-3">
                                        {firstResponse.message}
                                    </div>

                                    {firstResponse.attachments?.length > 0 && (
                                        <div className="d-flex flex-wrap gap-2">
                                            {firstResponse.attachments.map((file, i) => (
                                                <div key={i} className="rounded-3 overflow-hidden shadow-sm" style={{ width: 60, height: 60 }}>
                                                    <AttachmentWithFallback url={file ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${file}` : null} fallbackText="RES" size={60} />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="alert alert-light border-0 rounded-4 p-4 text-center shadow-sm" style={{ borderRadius: '24px' }}>
                                <p className="mb-0 text-muted italic">There are no responses recorded for this dispute yet.</p>
                            </div>
                        )}

                        {/* ADMIN NOTE BOX (IF EXISTS) */}
                        {dispute.adminNote && (
                            <div className="card shadow-sm border-0 rounded-4 mb-4" style={{ borderRadius: '24px', backgroundColor: '#fff9f0' }}>
                                <div className="card-body p-4">
                                    <h6 className="fw-bold mb-2 text-warning">Admin Decision Note</h6>
                                    <div className="text-dark opacity-75">{dispute.adminNote}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: APPOINTMENT & PARTIES */}
                    <div className="col-lg-4">
                        {/* MANAGEMENT BOX */}
                        <div className="card shadow-sm border-0 rounded-4 mb-4 overflow-hidden" style={{ borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)' }}>
                            <div className="card-header bg-primary text-white py-3 border-0">
                                <h6 className="mb-0 fw-bold">Dispute Management</h6>
                            </div>
                            <div className="card-body p-4 text-center">
                                <p className="text-muted small mb-4">Review the details and update the status of this dispute request.</p>
                                <button
                                    className="btn btn-primary w-100 rounded-pill py-3 fw-bold shadow-sm"
                                    onClick={() => {
                                        setUpdateForm({
                                            status: dispute.status,
                                            adminNote: dispute.adminNote || "",
                                            resolvedInFavorOf: dispute.resolvedInFavorOf || "User"
                                        });
                                        setShowStatusModal(true);
                                    }}
                                >
                                    Update Status & Note
                                </button>
                            </div>
                        </div>

                        <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4" style={{ borderRadius: '24px' }}>
                            <div className="card-header bg-dark py-3 border-0">
                                <h6 className="mb-0 text-white fw-bold">Involved Parties</h6>
                            </div>
                            <div className="card-body p-4">
                                <div className="mb-4 pb-3 border-bottom border-secondary border-opacity-10">
                                    <label className="text-muted small text-uppercase fw-bold mb-2 d-block">Customer</label>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="avatar2 rounded-circle bg-primary bg-opacity-10 text-primary fw-bold d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                                            {dispute.userId?.username?.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="fw-bold">{dispute.userId?.username}</div>
                                            <div className="small text-muted">{dispute.userId?.email}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-0">
                                    <label className="text-muted small text-uppercase fw-bold mb-2 d-block">Vendor / Salon</label>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="avatar2 rounded-circle bg-light d-flex align-items-center justify-content-center overflow-hidden" style={{ width: 44, height: 44 }}>
                                            {dispute.vendorId?.image?.[0] ? (
                                                <Image src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${dispute.vendorId.image[0]}`} width={44} height={44} alt="vendor" className="object-fit-cover w-100 h-100" />
                                            ) : (
                                                <span className="text-muted">{dispute.vendorId?.salonName?.charAt(0)}</span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="fw-bold">{dispute.vendorId?.salonName}</div>
                                            <div className="small text-muted">{dispute.vendorId?.bussinessAddress}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card shadow-sm border-0 rounded-4 overflow-hidden position-sticky" style={{ top: '2rem', borderRadius: '24px' }}>
                            <div className="card-header bg-success py-3 border-0">
                                <h6 className="mb-0 text-white fw-bold">Appointment Context</h6>
                            </div>
                            <div className="card-body p-4 text-center">
                                {dispute.appointmentId ? (
                                    <>
                                        <h5 className="fw-bold text-primary mb-1">{dispute.appointmentId.serviceId?.serviceName}</h5>
                                        <div className="text-muted small mb-4">Service Details</div>

                                        <div className="row g-2 mb-4">
                                            <div className="col-6">
                                                <div className="p-3 bg-light rounded-4">
                                                    <label className="text-muted small text-uppercase fw-bold mb-1 d-block">Date</label>
                                                    <span className="fw-bold">{dispute.appointmentId.date}</span>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="p-3 bg-light rounded-4">
                                                    <label className="text-muted small text-uppercase fw-bold mb-1 d-block">Time</label>
                                                    <span className="fw-bold">{dispute.appointmentId.time}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-success bg-opacity-10 p-4 rounded-4 mb-0">
                                            <label className="text-success small text-uppercase fw-bold mb-1 d-block">Total Value</label>
                                            <h2 className="fw-black text-success mb-0">${dispute.appointmentId.totalAmount}</h2>
                                        </div>
                                    </>
                                ) : (
                                    <div className="py-5 text-muted">No appointment linked.</div>
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
                                            onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value, resolvedInFavorOf: e.target.value === "Resolved" ? "User" : "" })}
                                            required
                                        >
                                            <option value="">Select Status</option>
                                            <option value="Under_Review">Under Review</option>
                                            <option value="Resolved">Resolved</option>
                                            <option value="Rejected">Rejected</option>
                                            <option value="Refunded">Refunded (Charge User Wallet)</option>
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
                                    {updateForm.status === "Resolved" && (

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
                                    )}
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