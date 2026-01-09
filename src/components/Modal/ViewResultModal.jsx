"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import Modal from "./layout";
import Image from "next/image";

export default function ViewResultModal({
    isOpen,
    onClose,
    battleId,
    mode = "result", // "result" | "participants"
}) {
    const [battle, setBattle] = useState(null);
    const [loading, setLoading] = useState(false);
    const token = Cookies.get("token");

    const fetchBattle = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/battle/${battleId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBattle(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && battleId) fetchBattle();
    }, [isOpen, battleId]);

    // Sorting only for result mode
    const participants =
        mode === "result"
            ? [...(battle?.participants || [])]
                .map(p => ({ ...p, voteCount: p.vote.length }))
                .sort((a, b) => b.voteCount - a.voteCount)
            : battle?.participants || [];

    const handleDelete = async (email) => {
        if (!confirm("Remove this participant?")) return;

        try {
            await api.patch(
                `/updateBattleParticipants/${battleId}`,
                { removeParticipants: [email] },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            fetchBattle(); // refresh list
        } catch (err) {
            console.error(err);
            alert("Failed to remove participant");
        }
    };
    function Avatar({ src, alt }) {
        const [imgSrc, setImgSrc] = useState(src || "/images/profile-avatar.jpg");

        return (
            <Image
                src={imgSrc}
                alt={alt}
                width={40}
                height={40}
                style={{
                    borderRadius: "6px",
                    objectFit: "cover",
                    width: "40px",
                    height: "40px"
                }}
                onError={() => setImgSrc("/images/profile-avatar.jpg")}
            />
        );
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="product_modal_body">
                <div className="modal-header mb-3">
                    <h5>
                        {mode === "result" ? "Live Voting Scores" : "Battle Participants"}
                    </h5>
                    <button onClick={onClose}>×</button>
                </div>

                {loading && <p className="text-center">Loading...</p>}
                {!loading && participants.length === 0 && (
                    <p className="text-center text-muted">
                        No participants found.
                    </p>
                )}
                {!loading && participants.length > 0 && (
                    <div
                        style={{
                            border: "1px solid #ff5c5c",
                            borderRadius: 10,
                            padding: 12,
                        }}
                    >
                        {participants.map((p, index) => {
                            const isWinner =
                                mode === "result" &&
                                battle?.status === "completed" &&
                                battle?.winner?._id === p.participant._id;

                            return (
                                <div
                                    key={p.participant._id}
                                    className="d-flex justify-content-between align-items-center"
                                    style={{
                                        padding: "10px 12px",
                                        borderBottom:
                                            index !== participants.length - 1
                                                ? "1px solid #eaeaea"
                                                : "none",
                                        background: isWinner ? "#e8f7ec" : "transparent",
                                        borderRadius: isWinner ? 6 : 0,
                                        fontWeight: isWinner ? 600 : 400,
                                    }}
                                >
                                    <div className="d-flex align-items-center gap-3">
                                        <Avatar
                                            src={
                                                p.participant.images?.length
                                                    ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${p.participant.images[0]}`
                                                    : "/images/profile-avatar.jpg"
                                            }
                                            alt="avatar"
                                        />
                                        <span>{p.participant.name}</span>
                                    </div>

                                    {/* RIGHT SIDE */}
                                    {mode === "result" ? (
                                        <span>{p.voteCount}</span>
                                    ) : (
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(p.participant.email)}
                                        >
                                            🗑
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </Modal>
    );
}

