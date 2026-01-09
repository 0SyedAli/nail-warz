"use client"
import { useState } from "react";
import ViewResultModal from "../Modal/ViewResultModal";

export default function BattleCard({ title, battles, onEdit }) {
  const [resultOpen, setResultOpen] = useState(false);
  const [selectedBattleId, setSelectedBattleId] = useState(null);
  const [modalMode, setModalMode] = useState("result"); // "result" | "participants"

  return (
    <div className="col-lg-4">
      <h6 className="fw-bold mb-3">{title}</h6>

      {battles.map(b => (
        <div key={b._id} className="card mb-3">
          <div className="card-body">
            <div className="d-flex justify-content-between mb-2">
              <h6 className="fw-semibold">{b.name}</h6>
              <span className={`badge bg-${b.status === "completed" ? "secondary" : "success"} d-flex align-items-center justify-content-center`}>
                {b.status}
              </span>
            </div>

            <p className="text-muted small">{b.description}</p>

            <div className="small text-muted mb-2">
              {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}
            </div>

            <div className="small mb-2">
              👥 {b.participants.length} participants <br />
              ⭐ {b.totalVotes} votes
            </div>

            {/* {!completed ? (
              <div className="d-flex gap-2">
                <button
                  className="btn btn-dark btn-sm"
                  onClick={() => onEdit(b)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm"
                >
                  Manage
                </button>
              </div>
            ) : (
              <p className="small text-success">
                Winner: {b.winner?.name || "N/A"}
              </p>
            )} */}
            {b.status === "completed" && (
              <p className="small text-success mt-2">
                Winner: {b.winner?.name || "N/A"}
              </p>
            )}
            {/* ===== ACTIONS ===== */}
            {b.status === "upcoming" && (
              <div className="d-flex gap-2">
                <button
                  className="btn btn-dark btn-sm"
                  onClick={() => onEdit(b)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    setSelectedBattleId(b._id);
                    setModalMode("participants");
                    setResultOpen(true);
                  }}
                >
                  View Participants
                </button>
              </div>
            )}
            {(b.status === "active" || b.status === "completed") && (
              <button
                className="btn btn-outline-dark btn-sm"
                onClick={() => {
                  if (!b.participants || b.participants.length === 0) return;
                  setSelectedBattleId(b._id);
                  setModalMode("result");
                  setResultOpen(true);
                }}
              >
                View Result
              </button>
            )}


          </div>
        </div>
      ))}
      <ViewResultModal
        isOpen={resultOpen}
        onClose={() => setResultOpen(false)}
        battleId={selectedBattleId}
        mode={modalMode}
      />
    </div>
  );
}
