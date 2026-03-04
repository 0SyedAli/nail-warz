"use client";

import Image from "next/image";
import Modal from "./layout";

export default function UserDataModal({ isOpen, onClose, user }) {
    if (!user) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <div className="px-3">

                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-start mb-4">
                    <div className="d-flex align-items-center gap-3">

                        {/* Avatar */}
                        <div
                            style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                background: "#f1f3f5",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 600,
                                fontSize: "20px",
                                color: "#333"
                            }}
                        >

                            {user?.image ? (
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${user.image}`}
                                    width={60}
                                    height={60}
                                    alt="User"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        borderRadius: "50%",
                                        objectFit: "cover"
                                    }}
                                />
                            ) : (
                                user?.username?.charAt(0) || "U"
                            )}
                        </div>

                        <div>
                            <h5 className="mb-1">{user.username || "Unnamed User"}</h5>
                            <div className="text-muted small">{user.email}</div>

                            <span
                                style={{
                                    padding: "6px 12px",
                                    borderRadius: "20px",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    backgroundColor: user?.isActive ? "#e6f4ea" : "#f1f3f5",
                                    color: user?.isActive ? "#1e7e34" : "#6c757d"
                                }}
                            >
                                {user?.isActive ? "Active" : "Inactive"}
                            </span>
                        </div>
                    </div>

                    <button className="btn-close" onClick={onClose}></button>
                </div>

                {/* ACCOUNT INFO */}
                <SectionTitle title="Account Information" />

                <div className="row g-3 mb-4">
                    <Info label="Phone Number" value={user?.phone || "-"} />
                    <Info label="Device Type" value={user.deviceType || "-"} />
                    <Info label="Stripe ID" value={user.stripeCustomerId || "-"} />
                    <Info label="Joined" value={new Date(user.createdAt).toLocaleString()} />
                </div>

                {/* FINANCIAL */}
                <SectionTitle title="Financial Overview" />

                <div className="row g-3 mb-4">
                    <Info label="Wallet Balance" value={`$${user.walletBalance ?? 0}`} highlight />
                    <Info label="Total Spend" value={`$${user.totalSpend ?? 0}`} highlight />
                </div>

                {/* ACTIVITY */}
                <SectionTitle title="Activity Summary" />

                <div className="row g-3 mb-4">
                    <Info label="Total Orders" value={user.purchaseCount ?? 0} />
                    <Info label="Total Appointment" value={user.appointmentCount ?? 0} />
                </div>

                {/* FAVOURITES */}
                <SectionTitle title="Favourite Salons" />

                {user.favourite?.length > 0 ? (
                    user.favourite.map((salon) => (
                        <div
                            key={salon._id}
                            className="border rounded p-3 mb-2 d-flex align-items-start gap-3"
                            style={{ background: "#fafafa" }}
                        >
                            <Image
                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${salon.image[0]}`}
                                width={60}
                                height={60}
                                alt="User"
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    borderRadius: "50%",
                                    objectFit: "cover"
                                }}
                            />
                            <div>
                                <div className="fw-semibold">{salon.salonName}</div>
                                <div className="text-muted small">{salon.description}</div>
                                <div className="small mt-2"><strong>Phone Number:</strong> {salon.phoneNumber}</div>
                            </div>
                        </div>

                    ))
                ) : (
                    <div className="text-muted small">No favourite salons added</div>
                )}

            </div>
        </Modal>
    );
}

/* Section Title */
const SectionTitle = ({ title }) => (
    <div className="mb-3">
        <h6 className="fw-bold mb-0">{title}</h6>
        <div
            style={{
                width: 40,
                height: 3,
                background: "#FE0000",
                marginTop: 6,
                borderRadius: 2
            }}
        />
    </div>
);

/* Info Card */
const Info = ({ label, value, highlight }) => (
    <div className="col-md-6">
        <div
            className="p-3 rounded border"
            style={{
                background: highlight ? "#f8f9ff" : "#ffffff",
                transition: "all 0.2s ease"
            }}
        >
            <div className="text-muted small">{label}</div>
            <div className={`fw-semibold ${highlight ? "fs-5" : ""}`}>
                {value}
            </div>
        </div>
    </div>
);