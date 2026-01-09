"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Modal from "./layout";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { useRouter } from "next/navigation";

export default function AddToBattleModal({
    isOpen,
    onClose,
    contentId,
}) {
    const [battles, setBattles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [selectedBattle, setSelectedBattle] = useState(null);
    const router = useRouter();
    // Fetch battles
    useEffect(() => {
        if (!isOpen) return;

        const fetchBattles = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/battle`,
                    {
                        headers: {
                            Authorization: `Bearer ${Cookies.get("token")}`,
                        },
                    }
                );
                const json = await res.json();
                if (json.success) setBattles(json.data || []);
            } catch (err) {
                console.error("Failed to load battles", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBattles();
    }, [isOpen]);

    const handleAdd = async () => {
        if (!selectedBattle) {
            showErrorToast("Please select a battle first");
            return;
        }

        try {
            setSubmitting(true);

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/updateBattleParticipants/${selectedBattle}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        addParticipants: [contentId],
                    }),
                }
            );

            if (!res.ok) {
                const errorData = await res.json();
                showErrorToast(errorData?.message || "Something went wrong");
                return;
            }
            router.push("/admin/dashboard/content")
            showSuccessToast("Participant added to battle successfully");
            onClose();
        } catch (err) {
            console.error("Failed to add participant", err);
            showErrorToast(err.message || "Failed to add participant to battle");
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="product_modal_body">

                {/* HEADER */}
                <div className="modal-header">
                    <h5>Add Participant to Battle</h5>
                    <button onClick={onClose}>×</button>
                </div>

                <p className="text-muted mb-3">
                    Select an active or upcoming battle to add this participant.
                </p>

                {/* BODY */}
                {loading ? (
                    <p className="text-center py-4">Loading battles…</p>
                ) : (
                    <div className="battle-select-list">

                        {battles
                            .filter(b => ["upcoming"].includes(b.status))
                            .map(battle => (
                                <div
                                    key={battle._id}
                                    className={`battle-select-card ${selectedBattle === battle._id ? "active" : ""
                                        }`}
                                    onClick={() => setSelectedBattle(battle._id)}
                                >
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="mb-1">{battle.name}</h6>
                                            <small className="text-muted">
                                                {new Date(battle.startDate).toLocaleDateString()} →
                                                {new Date(battle.endDate).toLocaleDateString()}
                                            </small>
                                        </div>

                                        <span className={`badge status-badge ${battle.status}`}>
                                            {battle.status}
                                        </span>
                                    </div>
                                </div>
                            ))}

                        {!battles.filter(b => b.status !== "completed").length && (
                            <p className="text-muted text-center py-3">
                                No active or upcoming battles available
                            </p>
                        )}
                    </div>
                )}

                {/* FOOTER */}
                <button
                    className="btn btn-dark w-100 mt-3"
                    disabled={!selectedBattle || submitting}
                    onClick={handleAdd}
                >
                    {submitting ? "Adding…" : "Add to Battle"}
                </button>

            </div>
        </Modal>
    );
}
