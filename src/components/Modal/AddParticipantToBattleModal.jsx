"use client";

import { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import Modal from "./layout";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { BsSearch, BsTable } from "react-icons/bs";
import Image from "next/image";

export default function AddParticipantToBattleModal({
    isOpen,
    onClose,
    battleId,
    onSuccess,
}) {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [search, setSearch] = useState("");

    // Fetch available content (status: selected)
    useEffect(() => {
        if (!isOpen) return;

        const fetchContent = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/content`,
                    {
                        headers: {
                            Authorization: `Bearer ${Cookies.get("token")}`,
                        },
                    }
                );
                const json = await res.json();
                if (json.success) {
                    // Filter for content with status "selected"
                    setContents(json.contents.filter(c => c.status === "selected") || []);
                }
            } catch (err) {
                console.error("Failed to load content", err);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
        setSelectedIds([]); // reset selection
        setSearch(""); // reset search
    }, [isOpen]);

    const filtered = useMemo(() => {
        return contents.filter(c =>
            `${c.name} ${c.social?.name}`.toLowerCase().includes(search.toLowerCase())
        );
    }, [contents, search]);

    const handleToggle = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleAdd = async () => {
        if (selectedIds.length === 0) {
            showErrorToast("Please select at least one participant");
            return;
        }

        try {
            setSubmitting(true);
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/updateBattleParticipants/${battleId}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        addParticipants: selectedIds,
                    }),
                }
            );

            if (!res.ok) {
                const errorData = await res.json();
                showErrorToast(errorData?.message || "Failed to add participants");
                return;
            }

            showSuccessToast("Participants added successfully");
            onSuccess?.(); // refresh battle data
            onClose();
        } catch (err) {
            console.error("Failed to add participants", err);
            showErrorToast(err.message || "Failed to add participants to battle");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <div className="product_modal_body p-3">
                <div className="modal-header border-bottom-0 pb-0">
                    <h5 className="fw-bold mb-0">Add Participants to Battle</h5>
                    <button onClick={onClose} style={{ width: "30px", height: "30px", paddingBottom: "4px", borderRadius: "50%", border: "1px solid #ccc", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                </div>

                <p className="text-muted small mb-3">
                    Available content with status 'selected' will appear here.
                </p>

                {/* SEARCH */}
                <div className="position-relative mb-3">
                    <BsSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                    <input
                        className="form-control ps-5"
                        placeholder="Search participants by name or social handle…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {/* CONTENT LIST */}
                <div className="participant-select-list" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {loading ? (
                        <p className="text-center py-4 text-muted">Loading available content…</p>
                    ) : filtered.length === 0 ? (
                        <p className="text-center py-4 text-muted">No available participants found.</p>
                    ) : (
                        filtered.map(c => (
                            <div
                                key={c._id}
                                className={`d-flex align-items-center gap-3 p-2 mb-2 rounded border pointer ${selectedIds.includes(c._id) ? "bg-light border-dark shadow-sm" : ""
                                    }`}
                                onClick={() => handleToggle(c._id)}
                                style={{ cursor: "pointer", transition: "all 0.2s" }}
                            >
                                <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid #333", background: selectedIds.includes(c._id) ? "#333" : "transparent" }}></div>
                                <div className="rounded overflow-hidden" style={{ width: 45, height: 45, flexShrink: 0, position: "relative" }}>
                                    <Image
                                        src={c.images?.[0] ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${c.images[0]}` : "/images/profile-avatar.jpg"}
                                        alt={c.name}
                                        fill
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>
                                <div className="flex-grow-1">
                                    <h6 className="mb-0 fw-semibold">{c.name}</h6>
                                    <small className="text-muted">@{c.social?.name} ({c.social?.platform})</small>
                                </div>
                                <div className="text-muted small pe-3">{c.address}</div>
                            </div>
                        ))
                    )}
                </div>

                {/* ACTIONS */}
                <div className="mt-4 pt-3 border-top">
                    <button
                        className="btn btn-dark w-100"
                        disabled={selectedIds.length === 0 || submitting}
                        onClick={handleAdd}
                    >
                        {submitting ? "Adding…" : `Add ${selectedIds.length} Participants to Battle`}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
