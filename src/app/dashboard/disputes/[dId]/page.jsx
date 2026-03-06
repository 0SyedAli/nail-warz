"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter, useParams } from "next/navigation";
import { BsArrowLeft, BsSend, BsX } from "react-icons/bs";
import api from "@/lib/axios";
import { showSuccessToast, showErrorToast } from "@/lib/toast";
import Image from "next/image";

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
        <a href={url} target="_blank" rel="noreferrer">
            <Image
                src={url}
                width={size}
                height={size}
                alt="attachment"
                className="object-fit-cover rounded-2"
                onError={() => setError(true)}
            />
        </a>
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

    // 🔐 Auth Guard
    useEffect(() => {
        if (!Cookies.get("token")) router.push("/admin/auth/login");
    }, []);

    // 🔁 Fetch Dispute Data
    const fetchDispute = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/dispute/${dId}`);
            if (res.data.success) {
                setDispute(res.data.dispute);
            }
        } catch (error) {
            console.error("Error fetching dispute details:", error);
            showErrorToast("Failed to load dispute details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDispute();
    }, [dId]);

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
                fetchDispute(); // Refresh data to show new response
            }
        } catch (error) {
            console.error("Error sending response:", error);
            showErrorToast("Failed to send response");
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
                                                    <Image src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${dispute.vendorId.image[0]}`} width={48} height={48} alt="vendor" className="object-fit-cover" />
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
                                    <div className="p-3 border rounded-3 text-secondary">
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
                                                            <a href={fileUrl} target="_blank" rel="noreferrer" className="btn btn-light d-flex align-items-center justify-content-center w-100 h-100 overflow-hidden">
                                                                <div className="text-center small p-2">View Video</div>
                                                            </a>
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
                                <div className="chat-container">
                                    {dispute.responses?.length > 0 ? dispute.responses.map((res, idx) => (
                                        <div key={idx} className={`d-flex flex-column mb-4 ${res.respondent === 'Admin' ? 'align-items-end' : 'align-items-start'}`}>
                                            <div className="small text-muted mb-1 px-2">{res.respondent} • {new Date(res.createdAt).toLocaleString()}</div>
                                            <div className={`p-3 rounded-4 shadow-sm ${res.respondent === 'Admin' ? 'bg-primary text-white' : 'bg-white'}`} style={{ maxWidth: '85%' }}>
                                                <div>{res.message}</div>
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
                                </div>
                            </div>
                        </div>

                        {/* RESPONSE FORM */}
                        <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-5">
                            <div className="card-body p-4">
                                <form onSubmit={handleSubmitResponse}>
                                    <div className="mb-3">
                                        <textarea
                                            className="form-control border-0 bg-light p-3"
                                            placeholder="Write your response here..."
                                            rows="4"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            style={{ borderRadius: '15px' }}
                                        ></textarea>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex flex-column gap-3">
                                            <div className="d-flex align-items-center gap-2 position-relative">
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    className="form-control form-control-sm opacity-0 position-absolute top-0 start-0 w-100 h-100"
                                                    style={{ cursor: 'pointer' }}
                                                    onChange={handleFileUpload}
                                                    disabled={images.length >= 3}
                                                />
                                                <label className={`btn ${images.length >= 3 ? 'btn-secondary' : 'btn-primary'} px-4 py-2 rounded-pill d-flex align-items-center gap-2 shadow-sm mb-0`}>
                                                    {images.length >= 3 ? "Limit Reached" : "Upload Images"}
                                                </label>
                                            </div>

                                            {images.length > 0 && (
                                                <div className="d-flex flex-wrap gap-3">
                                                    {images.map((img, idx) => (
                                                        <div key={idx} className="position-relative">
                                                            <div className="preview-container rounded-3 overflow-hidden border shadow-sm" style={{ width: 60, height: 60 }}>
                                                                <Image
                                                                    src={URL.createObjectURL(img)}
                                                                    alt="preview"
                                                                    width={60}
                                                                    height={60}
                                                                    className="object-fit-cover w-100 h-100"
                                                                />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger btn-sm rounded-circle position-absolute top-0 start-100 translate-middle p-0 d-flex align-items-center justify-content-center border border-white"
                                                                style={{ width: 22, height: 22 }}
                                                                onClick={() => removeImage(idx)}
                                                            >
                                                                <BsX size={18} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-primary px-4 py-2 rounded-pill d-flex align-items-center gap-2 shadow-sm"
                                            disabled={submitting || dispute.status === 'Completed' || dispute.status === 'Refunded'}
                                        >
                                            {submitting ? "Sending..." : <>Send Response <BsSend /></>}
                                        </button>
                                    </div>
                                </form>
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
                                            <div className={`badge py-2 px-3 fs-6 rounded-pill ${dispute.status === 'Refunded' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                Status: {dispute.status}
                                            </div>
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
        </div>
    );
}
