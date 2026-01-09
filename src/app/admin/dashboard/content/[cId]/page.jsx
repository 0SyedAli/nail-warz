"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
import { FaRegCircleCheck } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import AddToBattleModal from "@/components/Modal/AddToBattleModal";

export default function ContentDetail() {
  const { cId } = useParams();
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [battleModalOpen, setBattleModalOpen] = useState(false);

  useEffect(() => {
    const fetchOne = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/content/${cId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      const json = await res.json();
      if (json.success) setItem(json.content);
      setLoading(false);
    };

    fetchOne();
  }, [cId]);

  const updateStatus = async (status, goBack = true) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/content/${cId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    if (goBack) router.back();
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
          borderRadius: "10px",
          objectFit: "cover",
          width: "100%",
          height: "500px"
        }}
        onError={() => setImgSrc("/images/profile-avatar.jpg")}
      />
    );
  }
  if (loading) return <p className="m-4">Loading…</p>;

  const handleApprove = async () => {
    // 1️⃣ update status first
    await updateStatus("selected", false);

    // 2️⃣ update UI instantly
    setItem(prev => ({ ...prev, status: "selected" }));

    // 3️⃣ open battle modal
    setBattleModalOpen(true);
  };

  const openBattleModal = () => {
    setBattleModalOpen(true);
  };
  return (
    <div className="page">
      <div className="dashboard_panel_inner pt-4">
        <button className="btn btn-link mb-3" onClick={() => router.back()}>
          ← Back to Submissions
        </button>

        <div className="row">
          {/* LEFT */}
          <div className="col-lg-8">
            <div className="card p-3">
              <Avatar
                src={
                  item.images && item.images?.[0]
                    ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${item.images[0]}`
                    : "/images/profile-avatar.jpg"
                }
                alt={item.name}
              />
              <p className="mt-3 mb-1 text-muted">Description</p>
              <p className="mb-3">{item.description}</p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-lg-4">
            <div className="participant-sidebar">

              {/* ===== PARTICIPANT INFO ===== */}
              <div className="card sidebar-card mb-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-semibold mb-0">Participant Info</h6>
                  <span className={`badge status-badge ${item.status} p-2`}>
                    {item.status}
                  </span>
                </div>

                <InfoRow label="Name" value={item.name} />
                <InfoRow label="Phone" value={item.phone} />
                <InfoRow label="Email" value={item.email} />
                <InfoRow label="Business Address" value={item.address} />

                <div className="info-row">
                  <span className="label">Social Media</span>
                  <a
                    href="#"
                    className="value social-link"
                  >
                    @{item.social?.name}
                  </a>
                </div>

                <InfoRow
                  label="Submitted"
                  value={new Date(item.createdAt).toLocaleString()}
                />

                <InfoRow label="Consent Given" value="Yes" />
              </div>

              {/* ===== REVIEW ACTIONS ===== */}
              <div className="card sidebar-card">
                <h6 className="fw-semibold mb-3">Review Actions</h6>

                {/* PENDING */}
                {item.status === "pending" && (
                  <>
                    <button
                      className="btn btn-dark w-100 mb-2 action-btn d-flex align-items-center gap-2 justify-content-center"
                      onClick={handleApprove}
                    >
                      <IoMdCheckmarkCircleOutline size={20} />
                      Approve & Add to Battle
                    </button>

                    <button
                      className="btn btn-danger w-100 action-btn d-flex align-items-center gap-2 justify-content-center"
                      onClick={() => updateStatus("rejected")}
                    >
                      <FaRegCircleCheck size={15} />
                      Reject Submission
                    </button>
                  </>
                )}

                {/* SELECTED */}
                {item.status === "selected" && (
                  <button
                    className="btn btn-dark w-100 action-btn d-flex align-items-center gap-2 justify-content-center"
                    onClick={openBattleModal}
                  >
                    <IoMdCheckmarkCircleOutline size={20} />
                    Add to Battle
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
      <AddToBattleModal
        isOpen={battleModalOpen}
        onClose={() => setBattleModalOpen(false)}
        contentId={item._id}
      />
    </div>
  );
}
const InfoRow = ({ label, value }) => (
  <div className="info-row">
    <span className="label">{label}</span>
    <span className="value">{value || "-"}</span>
  </div>
);
