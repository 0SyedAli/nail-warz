"use client"
import { useState } from "react";
import ViewResultModal from "../Modal/ViewResultModal";
import { BsPersonFillAdd } from "react-icons/bs";
import { IoPersonAddSharp } from "react-icons/io5";
import { MdPersonAdd } from "react-icons/md";

export default function BattleCard({ title, battles, onEdit, emptyMessage = "No battles available." }) {
  const [resultOpen, setResultOpen] = useState(false);
  const [selectedBattleId, setSelectedBattleId] = useState(null);
  const [modalMode, setModalMode] = useState("result"); // "result" | "participants"

  return (
    <div className="col-lg-4 ">
      <h5 className="fw-bold mb-3 text-capitalize">{title}</h5>

      {battles.length === 0 ? (
        <div className="text-muted small">
          {emptyMessage}
        </div>
      ) : (
        battles.map(b => (
          <div key={b._id} className="card mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2 align-items-center">
                <h6 className="fw-bold mb-0">{b.name}</h6>
                <span className={`badge bg-${b.status === "completed" ? "secondary" : "success"} py-2 text-capitalize d-flex align-items-center justify-content-center`}>
                  {b.status}
                </span>
              </div>

              <p className="text-muted small">{b.description}</p>

              <div className="small text-muted mb-2">
                {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}
              </div>

              <div className="small mb-2 text-capitalize">
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
                <div className="d-flex align-items-center justify-content-between">
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
                  {/* <span className="add-user">
                    <MdPersonAdd />
                  </span> */}
                </div>
              )}
              {(b.status === "active") && (
                <div className="d-flex align-items-center justify-content-between">
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
                  <span className="add-user">
                    <MdPersonAdd />
                  </span>
                </div>
              )}
              {(b.status === "completed") && (
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
        ))
      )}
      <ViewResultModal
        isOpen={resultOpen}
        onClose={() => setResultOpen(false)}
        battleId={selectedBattleId}
        mode={modalMode}
      />
    </div>
  );
}
