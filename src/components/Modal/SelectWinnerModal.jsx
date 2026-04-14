"use client";

import { useState } from "react";
import Image from "next/image";
import Modal from "./layout";
import Cookies from "js-cookie";
import api from "@/lib/axios";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { BsCheckCircleFill, BsStarFill } from "react-icons/bs";

export default function SelectWinnerModal({
    isOpen,
    onClose,
    participants = [],
    battleId,
    onSuccess,
}) {
    const [selectedWinner, setSelectedWinner] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const token = Cookies.get("token");

    const handleComplete = async () => {
        if (!selectedWinner) {
            showErrorToast("Please select a winner first");
            return;
        }

        try {
            setSubmitting(true);
            const payload = {
                battleId,
                status: "completed",
                participant: selectedWinner, // the full participant object as required
            };

            const res = await api.post("/updateBattleStatus", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.success) {
                showSuccessToast("Battle completed successfully!");
                onSuccess?.();
                onClose();
            } else {
                showErrorToast(res.data.message || "Failed to complete battle");
            }
        } catch (err) {
            console.error(err);
            showErrorToast(err.response?.data?.message || "Something went wrong while completing the battle");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <div className="product_modal_body p-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <h5 className="fw-bold mb-0">Select Battle Winner</h5>
                    <button className="btn-close" onClick={onClose}></button>
                </div>
                <p className="text-muted small mb-4">Choose the participant who won this battle to complete it.</p>

                <div className="winner-selection-list" style={{ maxHeight: "450px", overflowY: "auto" }}>
                    {participants.map((p) => {
                        const isSelected = selectedWinner?._id === p.participant._id;
                        return (
                            <div
                                key={p.participant._id}
                                className={`d-flex align-items-center gap-3 p-3 mb-2 rounded border transition-all pointer ${isSelected ? "bg-dark text-white border-dark shadow" : "bg-white"
                                    }`}
                                onClick={() => setSelectedWinner(p.participant)}
                                style={{ cursor: "pointer" }}
                            >
                                <div className="rounded-circle overflow-hidden shadow-sm" style={{ width: 50, height: 50, position: "relative", flexShrink: 0 }}>
                                    <Image
                                        src={p.participant.images?.[0] ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${p.participant.images[0]}` : "/images/profile-avatar.jpg"}
                                        alt={p.participant.name}
                                        fill
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>
                                <div className="flex-grow-1">
                                    <h6 className="mb-0 fw-bold">{p.participant.name}</h6>
                                    <small className={isSelected ? "text-white-50" : "text-muted"}>
                                        Votes Received: <b>{p.vote?.length || 0}</b>
                                    </small>
                                </div>
                                <div className="pe-2">
                                    <div className={`rounded-circle d-flex align-items-center justify-content-center ${isSelected ? "bg-success text-white" : "border"}`} style={{ width: 28, height: 28 }}>
                                        {isSelected && <BsCheckCircleFill size={18} />}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {participants.length === 0 && (
                        <div className="text-center py-5 text-muted">
                            No participants available in this battle.
                        </div>
                    )}
                </div>

                <div className="mt-4 pt-3 border-top d-flex gap-2">
                    <button className="btn btn-outline-secondary w-100 py-2 fw-semibold" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-dark w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
                        disabled={!selectedWinner || submitting || participants.length === 0}
                        onClick={handleComplete}
                    >
                        {submitting ? (
                            <span className="spinner-border spinner-border-sm"></span>
                        ) : (
                            <>
                                <BsStarFill className="text-warning" /> Complete Battle
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
