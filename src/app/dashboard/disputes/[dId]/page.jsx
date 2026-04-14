"use client";

import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { useRouter, useParams } from "next/navigation";
import { BsArrowLeft, BsSend, BsX } from "react-icons/bs";
import api from "@/lib/axios";
import { showSuccessToast, showErrorToast } from "@/lib/toast";
import Image from "next/image";
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
    // const chatEndRef = useRef(null);
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

    // useEffect(() => {
    //     if (dispute?.responses) {
    //         chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    //     }
    // }, [dispute?.responses]);

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

    if (loading) return <div className="page pt-4 px-0">
        <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "400px" }}
        >
            <BallsLoading />
        </div>
    </div>

    if (!dispute) return <p className="m-5 text-center">Dispute not found</p>;

    const vendorResponded = dispute.responses?.some(r => r.respondent === "Vendor");
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
                    <div className={`badge py-2 px-4 rounded-pill shadow-sm ${dispute.status === 'Refunded' ? 'bg-success' : 'bg-warning text-dark'}`} style={{ fontSize: '0.9rem' }}>
                        {dispute.status.replace('_', ' ')}
                    </div>
                </div>

                <div className="row g-4">
                    {/* LEFT COLUMN: PRIMARY INFO */}
                    <div className="col-lg-8">
                        {/* DISPUTE REQUEST BOX */}
                        <div className="card shadow-sm border-0 rounded-4 mb-4" style={{ borderRadius: '24px' }}>
                            <div className="card-body p-4">
                                <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                    <span className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary"><BsX size={24} /></span>
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
                                        <label className="text-muted small text-uppercase fw-bold mb-2">Attachments</label>
                                        <div className="d-flex flex-wrap gap-3">
                                            {dispute.attachments.map((file, idx) => {
                                                const isImage = file?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                                                const fileUrl = file ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${file}` : null;
                                                return (
                                                    <div key={idx} className="attachment-box shadow-sm rounded-4 overflow-hidden position-relative" style={{ width: 120, height: 120 }}>
                                                        {isImage && file ? (
                                                            <AttachmentWithFallback url={fileUrl} fallbackText="IMAGE" size={120} />
                                                        ) : (
                                                            <a href={fileUrl} target="_blank" rel="noreferrer" className="w-100 h-100 bg-dark d-flex align-items-center justify-content-center text-white text-decoration-none">
                                                                <small className="fw-bold">VIEW VIDEO</small>
                                                            </a>
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
                        {firstResponse && (
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
                        )}

                        {/* RESPONSE FORM - ONLY SHOW IF VENDOR HASN'T RESPONDED */}
                        {!vendorResponded && dispute.status !== "Refunded" && dispute.status !== "Completed" && (
                            <div className="card shadow-sm border-0 rounded-4" style={{ borderRadius: '24px' }}>
                                <div className="card-header bg-white pt-4 border-0">
                                    <h5 className="fw-bold mb-0">Submit Your Response</h5>
                                    <p className="text-muted small">You can only send one response to this dispute.</p>
                                </div>
                                <div className="card-body p-4">
                                    <form onSubmit={handleSubmitResponse}>
                                        <div className="mb-4">
                                            <textarea
                                                className="form-control border-0 bg-light p-4 rounded-4 shadow-inner"
                                                placeholder="Detail your perspective on this situation..."
                                                rows="5"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                            ></textarea>
                                        </div>

                                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-4">
                                            <div className="d-flex flex-column gap-2">
                                                <div className="position-relative">
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        className="form-control opacity-0 position-absolute top-0 start-0 w-100 h-100"
                                                        style={{ cursor: 'pointer' }}
                                                        onChange={handleFileUpload}
                                                        disabled={images.length >= 3}
                                                    />
                                                    <button type="button" className={`btn btn-outline-dark rounded-pill px-4 ${images.length >= 3 ? 'disabled' : ''}`}>
                                                        {images.length >= 3 ? "Max Images Reached" : "Attach Images (Max 3)"}
                                                    </button>
                                                </div>

                                                {images.length > 0 && (
                                                    <div className="d-flex gap-2 mt-2">
                                                        {images.map((img, idx) => (
                                                            <div key={idx} className="position-relative">
                                                                <Image src={URL.createObjectURL(img)} width={50} height={50} className="rounded border shadow-sm object-fit-cover" alt="preview" />
                                                                <button type="button" className="btn btn-danger btn-sm rounded-circle position-absolute translate-middle p-0" style={{ top: 0, right: -15, width: 20, height: 20 }} onClick={() => removeImage(idx)}><BsX size={14} /></button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                type="submit"
                                                className="btn btn-primary btn-lg rounded-pill px-5 shadow-sm d-flex align-items-center gap-2"
                                                disabled={submitting}
                                            >
                                                {submitting ? "Sending..." : <>Send Final Response <BsSend /></>}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {vendorResponded && (
                            <div className="alert alert-info rounded-4 border-0 p-4 shadow-sm" style={{ borderLeft: '6px solid var(--bs-info)' }}>
                                <div className="d-flex align-items-center gap-3 text-info fw-bold fs-5">
                                    <BsSend /> Response Submitted
                                </div>
                                <p className="mb-0 mt-2 text-dark opacity-75">You have already provided your response to this dispute. Further updates will be handled by the administrator.</p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: APPOINTMENT & PARTIES */}
                    <div className="col-lg-4">
                        <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4" style={{ borderRadius: '24px' }}>
                            <div className="card-header bg-dark py-3 border-0">
                                <h6 className="mb-0 text-white fw-bold">Involved Parties</h6>
                            </div>
                            <div className="card-body p-4">
                                <div className="mb-4">
                                    <label className="text-muted small text-uppercase fw-bold mb-2">Customer</label>
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
                                    <label className="text-muted small text-uppercase fw-bold mb-2">Vendor / Salon</label>
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
                                            <label className="text-success small text-uppercase fw-bold mb-1 d-block">Total Paid</label>
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
        </div>
    );
}
