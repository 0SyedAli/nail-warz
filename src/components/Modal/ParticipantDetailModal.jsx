"use client";
import Image from "next/image";
import Modal from "./layout";
import { FaInstagram, FaFacebook, FaTwitter, FaGlobe } from "react-icons/fa";

export default function ParticipantDetailModal({ isOpen, onClose, participant }) {
    if (!participant) return null;

    const getSocialIcon = (platform) => {
        switch (platform?.toLowerCase()) {
            case "instagram": return <FaInstagram className="text-danger" />;
            case "facebook": return <FaFacebook className="text-primary" />;
            case "twitter": return <FaTwitter className="text-info" />;
            default: return <FaGlobe className="text-secondary" />;
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <div className="product_modal_body p-3">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0">Participant Details</h5>
                    <button className="btn-close" onClick={onClose}></button>
                </div>

                <div className="row">
                    {/* LEFT: Participant Image */}
                    <div className="col-md-5 mb-3">
                        <div className="rounded overflow-hidden border" style={{ height: "300px", position: "relative" }}>
                            {participant.images && participant.images.length > 0 ? (
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${participant.images[0]}`}
                                    alt={participant.name}
                                    fill
                                    style={{ objectFit: "cover" }}
                                />
                            ) : (
                                <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-light text-muted">
                                    No Image
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Participant Info */}
                    <div className="col-md-7">
                        <div className="mb-3">
                            <h4 className="fw-bold mb-1">{participant.name}</h4>
                            <div className="d-flex align-items-center gap-2 text-muted small">
                                {getSocialIcon(participant.social?.platform)}
                                <span>{participant.social?.name || "No social handle"}</span>
                            </div>
                        </div>

                        <hr />

                        <div className="row g-3">
                            <InfoItem label="Email" value={participant.email} />
                            <InfoItem label="Phone" value={participant.phone} />
                            <div className="col-12">
                                <InfoItem label="Address" value={participant.address} />
                            </div>
                            <div className="col-12">
                                <label className="text-muted small mb-1 d-block">Description</label>
                                <p className="mb-0 small" style={{ whiteSpace: "pre-wrap" }}>
                                    {participant.description || "No description provided."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

const InfoItem = ({ label, value }) => (
    <div className="col-6">
        <label className="text-muted small mb-1 d-block">{label}</label>
        <div className="fw-semibold small">{value || "N/A"}</div>
    </div>
);
