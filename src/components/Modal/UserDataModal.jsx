"use client";

import Image from "next/image";
import Modal from "./layout";

export default function UserDataModal({ isOpen, onClose, user }) {
    if (!user) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <div className="px-3">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold mb-0">App User Details</h2>
                    <button className="btn-close" onClick={onClose}></button>
                </div>
                {/* HEADER */}
                {/* <div className="d-flex justify-content-between align-items-start mb-4">
                    <div className="d-flex align-items-center gap-3">

                       
                    </div>

                </div> */}


                {/* ACCOUNT INFO */}
                <SectionTitle title="Account Information" />
                <div className="d-flex align-items-center justify-content-between mb-3  ">
                    <div
                        style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "10px",
                            background: "#f1f3f5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 600,
                            fontSize: "20px",
                            color: "#333",
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
                                    borderRadius: "10px",
                                    objectFit: "cover"
                                }}
                            />
                        ) : (
                            user?.username?.charAt(0) || "U"
                        )}
                    </div>
                    <div className="">Status:
                        <span
                            style={{
                                padding: "6px 12px",
                                borderRadius: "20px",
                                fontSize: "12px",
                                fontWeight: 600,
                                marginLeft: "5px",
                                backgroundColor: user?.isActive ? "#e6f4ea" : "#f1f3f5",
                                color: user?.isActive ? "#1e7e34" : "#6c757d"
                            }}
                        >
                            {user?.isActive ? "Active" : "Inactive"}
                        </span>
                    </div>
                </div>

                <div className="row g-3 mb-4">
                    <Info label="First Name" value={user?.firstName || "-"} />
                    <Info label="Last Name" value={user?.lastName || "-"} />
                    <Info label="Email" value={user?.email || "-"} />
                    <Info label="Phone Number" value={user?.phone || "-"} />
                    <Info label="Device Type" value={user.deviceType || "-"} />
                    {/* <Info label="Stripe ID" value={user.stripeCustomerId || "-"} /> */}
                    <Info label="Joined" value={new Date(user.createdAt).toLocaleDateString()} />
                    <Info
                        label="Last Active"
                        value={
                            user.daysSinceLastActive === 0
                                ? "Today"
                                : user.daysSinceLastActive
                                    ? `${user.daysSinceLastActive} days ago`
                                    : "-"
                        }
                    />
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
                    {/* <Info label="Total Orders" value={user.purchaseCount ?? 0} /> */}
                    <Info label="Total Appointment" value={user.appointmentCount ?? 0} />
                    <Info label="Last Appointment" value={user.lastAppointmentDate ? new Date(user.lastAppointmentDate).toLocaleDateString() : "-"} />
                </div>

                {/* FAVOURITES */}
                <SectionTitle title="Favorite Salons" />

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
                    <div className="text-muted small">No favorite salons added</div>
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