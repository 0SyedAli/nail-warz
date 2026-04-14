"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
import { BsArrowLeft, BsCalendar, BsPeople, BsStar, BsPlus, BsTrash, BsInfoCircle, BsCheckCircleFill } from "react-icons/bs";
import { HiTrendingUp } from "react-icons/hi";

import api from "@/lib/axios";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import AddParticipantToBattleModal from "@/components/Modal/AddParticipantToBattleModal";
import ParticipantDetailModal from "@/components/Modal/ParticipantDetailModal";
import SelectWinnerModal from "@/components/Modal/SelectWinnerModal";

export default function BattleDetail() {
    const { bId } = useParams();
    const router = useRouter();
    const token = Cookies.get("token");

    const [battle, setBattle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedWinner, setSelectedWinner] = useState(null);

    // Modal States
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [winnerModalOpen, setWinnerModalOpen] = useState(false);
    const [selectedParticipant, setSelectedParticipant] = useState(null);

    const fetchBattle = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/battle/${bId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = res.data.data;
            setBattle(data);
            setSelectedStatus(data.status);
            if (data.status === "completed" && data.winner) {
                setSelectedWinner(data.winner);
            }
        } catch (err) {
            console.error("Failed to fetch battle", err);
            showErrorToast("Failed to load battle details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (bId) fetchBattle();
    }, [bId]);

    const handleUpdateStatus = async (statusOverride) => {
        const targetStatus = statusOverride || selectedStatus;
        if (!targetStatus) return;

        // If completed, check for winner logic
        if (targetStatus === "completed") {
            setWinnerModalOpen(true);
            return;
        }

        try {
            setUpdating(true);
            const payload = {
                battleId: bId,
                status: targetStatus,
            };

            const res = await api.post("/updateBattleStatus", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.success) {
                showSuccessToast("Battle status updated successfully");
                fetchBattle(); // Refresh
            } else {
                showErrorToast(res.data.message || "Failed to update status");
            }
        } catch (err) {
            console.error(err);
            showErrorToast(err.response?.data?.message || "Failed to update battle status");
        } finally {
            setUpdating(false);
        }
    };

    const handleRemoveParticipant = async (email) => {
        if (!confirm("Are you sure you want to remove this participant?")) return;

        try {
            const res = await api.patch(
                `/updateBattleParticipants/${bId}`,
                { removeParticipants: [email] },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                showSuccessToast("Participant removed successfully");
                fetchBattle();
            }
        } catch (err) {
            console.error(err);
            showErrorToast(err.response?.message || "Failed to remove participant");
        }
    };

    const openParticipantDetail = (p) => {
        setSelectedParticipant(p);
        setDetailModalOpen(true);
    };

    if (loading) return <div className="page p-5 text-center"><div className="spinner-border"></div></div>;
    if (!battle) return <div className="page p-5 text-center mt-5"><h4>Battle not found</h4><button className="btn btn-dark mt-3" onClick={() => router.back()}>Go Back</button></div>;

    const participants = battle.participants || [];

    return (
        <div className="page">
            <div className="dashboard_panel_inner pt-4">
                {/* HEADER */}
                <div className="d-flex align-items-center gap-3 mb-4">
                    <button className="btn btn-outline-dark btn-sm rounded-circle p-2" onClick={() => router.back()}>
                        <BsArrowLeft size={18} />
                    </button>
                    <div>
                        <h4 className="fw-bold mb-0">{battle.name}</h4>
                        <p className="text-muted mb-0 small">Battle Management & Details</p>
                    </div>
                </div>

                <div className="row g-4">
                    {/* LEFT CONTENT: Battle Info & Selection */}
                    <div className="col-lg-8">
                        {/* INFO CARD */}
                        <div className="card mb-4 border-0 p-4" style={{ boxShadow: "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px" }}>
                            <div className="d-flex justify-content-between align-items-start mb-4">
                                <div className="flex-grow-1 pe-4 me-4">
                                    <h6 className="fw-bolder text-dark text-uppercase mb-3 small">Battle Overview</h6>
                                    <p className="mb-4 text-muted">{battle.description}</p>
                                    <div className="row g-3">
                                        <div className="col-sm-6">
                                            <div className="d-flex align-items-center gap-2 text-muted">
                                                <BsCalendar />
                                                <span className="small">Start: {new Date(battle.startDate).toLocaleDateString("en-US", { dateStyle: "medium" })}</span>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="d-flex align-items-center gap-2 text-muted">
                                                <BsCalendar />
                                                <span className="small">End: {new Date(battle.endDate).toLocaleDateString("en-US", { dateStyle: "medium" })}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ minWidth: "150px" }}>
                                    <h6 className="fw-bolder text-dark text-uppercase mb-3 small">Quick Stats</h6>
                                    <div className="d-flex gap-3">
                                        <div >
                                            <div className="text-muted small">Total Votes</div>
                                            <h4 className="fw-bold mb-0">{battle.totalVotes}</h4>
                                        </div>
                                        <div className="border-start ps-3">
                                            <div className="text-muted small">Participants</div>
                                            <h4 className="fw-bold mb-0">{participants.length}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr />

                            {/* STATUS DROPDOWN */}
                            <div className="mt-3 d-flex align-items-center justify-content-between">
                                <div>
                                    <label className="form-label fw-bold small text-dark text-uppercase">Battle Status control</label>
                                    <div className="d-flex gap-3 align-items-center">
                                        <select
                                            className="form-select w-auto py-2"
                                            value={selectedStatus}
                                            onChange={(e) => {
                                                const newStatus = e.target.value;
                                                setSelectedStatus(newStatus);
                                                if (newStatus === "completed") {
                                                    setWinnerModalOpen(true);
                                                }
                                            }}
                                        >
                                            <option value="upcoming">Upcoming</option>
                                            <option value="active">Active</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                        {(selectedStatus !== battle.status && selectedStatus !== "completed") && (
                                            <button
                                                className="btn btn-dark px-4"
                                                onClick={() => handleUpdateStatus()}
                                                disabled={updating}
                                            >
                                                {updating ? "Updating..." : "Update Status"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="label">
                                    <span className={`badge px-3 p-2 fs-6 text-capitalize ${battle.status === "completed" ? "bg-success" : battle.status === "active" ? "bg-primary" : "bg-warning"}`}>{battle.status}</span>
                                </div>
                            </div>
                        </div>

                        {/* PARTICIPANTS LIST */}
                        <div className="card border-0 overflow-hidden" style={{ boxShadow: "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px" }}>
                            <div className="card-header bg-white d-flex justify-content-between align-items-center py-3 px-4">
                                <h6 className="fw-bold mb-0">Participants List</h6>
                                <button
                                    className="btn btn-dark btn-sm d-flex align-items-center gap-1"
                                    onClick={() => setAddModalOpen(true)}
                                    disabled={battle.status === "completed"}
                                >
                                    <BsPlus size={20} /> Add Participant
                                </button>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="ps-4">Rank</th>
                                                <th>Participant</th>
                                                <th>Social Handle</th>
                                                <th>Vote Count</th>
                                                <th className="pe-4 text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[...participants]
                                                .sort((a, b) => (b.vote?.length || 0) - (a.vote?.length || 0))
                                                .map((p, idx) => (
                                                    <tr key={p.participant._id}>
                                                        <td className="ps-4">
                                                            <div className={`rounded-circle d-flex align-items-center justify-content-center shadow-sm fw-bold ${idx === 0 ? "bg-warning text-dark" : "bg-light text-muted"}`} style={{ width: 30, height: 30, fontSize: 12 }}>
                                                                #{idx + 1}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <div className="rounded overflow-hidden" style={{ width: 40, height: 40, position: "relative" }}>
                                                                    <Image src={p.participant.images?.[0] ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${p.participant.images[0]}` : "/images/profile-avatar.jpg"} alt={p.participant.name} fill style={{ objectFit: "cover" }} />
                                                                </div>
                                                                <span className="fw-semibold">{p.participant.name}</span>
                                                                {battle.winner?._id === p.participant._id && <span className="ms-2 badge bg-success small">Winner</span>}
                                                            </div>
                                                        </td>
                                                        <td>{p.participant.social?.platform}: {p.participant.social?.name}</td>
                                                        <td className="fw-bold text-dark">{p.vote?.length || 0}</td>
                                                        <td className="pe-4 text-end">
                                                            <div className="d-flex gap-2 justify-content-end">
                                                                <button
                                                                    className="btn btn-outline-dark btn-sm"
                                                                    onClick={() => openParticipantDetail(p.participant)}
                                                                >
                                                                    <BsInfoCircle />
                                                                </button>
                                                                <button
                                                                    className="btn btn-outline-danger btn-sm"
                                                                    onClick={() => handleRemoveParticipant(p.participant.email)}
                                                                    disabled={battle.status === "completed"}
                                                                >
                                                                    <BsTrash />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            {participants.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="text-center py-4 text-muted small">No participants added to this battle yet.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR: Guidelines/History */}
                    <div className="col-lg-4">
                        <div className="card border-0 p-4 mb-4" style={{ boxShadow: "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px" }}>
                            <h6 className="fw-bold mb-3 small text-dark text-uppercase">Management Tips</h6>
                            <ul className="small text-muted ps-3 mb-0">
                                <li className="mb-2">Updates status to <b>Active</b> when the battle starts.</li>
                                <li className="mb-2">Only <b>Selected</b> participants from the Content module can be added.</li>
                                {/* <li className="mb-2">A <b>Winner</b> must be selected when closing a battle.</li> */}
                                {/* <li className="mb-0">Completed battles are <b>Read-Only</b> for management.</li> */}
                            </ul>
                        </div>

                        {battle.winner && (
                            <div className="card border-0 shadow-sm p-4 bg-success text-white">
                                <div className="text-center">
                                    <div className="mb-3">
                                        <Image className="d-inline" src="/images/reward-head.png" alt="Winner" width={100} height={100} />
                                    </div>
                                    <h5 className="fw-bold mb-1">CONGRATULATIONS!</h5>
                                    <p className="small mb-3 opacity-75">Winner of this Battle</p>
                                    <div className="rounded-circle overflow-hidden mx-auto shadow mb-3" style={{ width: 100, height: 100, position: "relative" }}>
                                        <Image
                                            src={battle.winner.images?.[0] ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${battle.winner.images[0]}` : "/images/profile-avatar.jpg"}
                                            alt={battle.winner.name}
                                            fill
                                            style={{ objectFit: "cover" }}
                                        />
                                    </div>
                                    <h6 className="fw-bold mb-0">{battle.winner.name}</h6>
                                    <small className="opacity-75">@{battle.winner.social?.name}</small>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODALS */}
            <AddParticipantToBattleModal
                isOpen={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                battleId={bId}
                onSuccess={fetchBattle}
            />
            <ParticipantDetailModal
                isOpen={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                participant={selectedParticipant}
            />
            <SelectWinnerModal
                isOpen={winnerModalOpen}
                onClose={() => {
                    setWinnerModalOpen(false);
                    setSelectedStatus(battle.status); // Reset on cancel
                }}
                participants={participants}
                battleId={bId}
                onSuccess={fetchBattle}
            />
        </div>
    );
}
