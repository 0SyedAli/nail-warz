"use client";

import { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import { useRouter, useParams } from "next/navigation";
import { FaPhoneAlt, FaUser } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { GiWorld } from "react-icons/gi";
import { IoLocationSharp } from "react-icons/io5";

export default function VendorDetail() {
    const { vId } = useParams();
    const router = useRouter();

    const token = Cookies.get("token");

    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [amount, setAmount] = useState("");
    const [remarks, setRemarks] = useState("");
    const [paying, setPaying] = useState(false);
    const [revenueSummary, setRevenueSummary] = useState(null);
    const [revenueStats, setRevenueStats] = useState(null);
    const [payouts, setPayouts] = useState([]);
    const [payoutSearch, setPayoutSearch] = useState("");

    /* ===================== FETCH VENDOR ===================== */
    useEffect(() => {
        if (!token) {
            router.push("/admin/auth/login");
            return;
        }

        const fetchVendor = async () => {
            try {
                setLoading(true);

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/vendor/${vId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (!res.ok) throw new Error("Failed to fetch vendor");

                const json = await res.json();
                if (!json.success || !json.vendor) {
                    throw new Error(json.message || "Invalid vendor response");
                }
                setVendor(json.vendor);
                setRevenueSummary(json.revenueSummary);
                setRevenueStats(json.revenueStats);
                setPayouts(json.revenueSummary?.payoutHistory || []);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVendor();
    }, [vId, token, router]);

    /* ===================== DERIVED VALUES ===================== */
    const totalRevenue = revenueSummary?.totalRevenue ?? 0;
    const platformFee = revenueSummary?.platformFee?.amount ?? 0;
    const vendorShare = revenueSummary?.vendorShare?.amount ?? 0;
    const availableBalance = revenueSummary?.totalPayoutPending ?? 0;

    /* ===================== DELETE ===================== */
    const deleteVendor = async () => {
        if (!confirm("Are you sure you want to delete this vendor?")) return;

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/vendor/${vId}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (!res.ok) throw new Error("Delete failed");

            router.push("/admin/dashboard/vendors");
        } catch (err) {
            alert(err.message || "Failed to delete vendor");
        }
    };

    /* ===================== PAYOUT ===================== */
    const handlePayout = async () => {
        const payoutAmount = Number(amount);

        if (!payoutAmount || payoutAmount <= 0) {
            alert("Enter a valid payout amount");
            return;
        }

        if (payoutAmount > availableBalance) {
            alert("Amount exceeds available balance");
            return;
        }

        setPaying(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/payout`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        vendor: vendor._id,
                        amount: payoutAmount,
                        remarks: remarks?.trim() || "Vendor payout",
                    }),
                }
            );

            const json = await res.json();
            if (!res.ok || !json.success) {
                throw new Error(json.message || "Payout failed");
            }

            setAmount("");
            setRemarks("");

            alert("Payout processed successfully");
        } catch (err) {
            alert(err.message || "Payout error");
        } finally {
            setPaying(false);
        }
    };

    /* ===================== FILTERED PAYOUTS ===================== */
    const filteredPayouts = useMemo(() => {
        if (!payoutSearch.trim()) return payouts;
        const q = payoutSearch.toLowerCase();
        return payouts.filter((p) => {
            const dateStr = new Date(p.payoutDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }).toLowerCase();
            return (
                p.transactionId?.toLowerCase().includes(q) ||
                dateStr.includes(q)
            );
        });
    }, [payouts, payoutSearch]);

    /* ===================== STATES ===================== */
    if (loading) return <p className="m-4">Loading vendor…</p>;
    if (error) return <p className="m-4 text-danger">{error}</p>;
    if (!vendor) return <p className="m-4">Vendor not found</p>;

    /* ===================== UI ===================== */
    return (
        <div className="page vendor-detail-page">
            <div className="dashboard_panel_inner">

                <button className="back-btn" onClick={() => router.back()}>
                    ← Back to Vendors
                </button>
                {/* STATS */}
                <div className="vendor-stats">
                    <StatBox
                        title="Daily Revenue"
                        value={`$${revenueStats?.dailyRevenue ?? 0}`}
                        color="green"
                    />
                    <StatBox
                        title="Weekly Revenue"
                        value={`$${revenueStats?.weeklyRevenue ?? 0}`}
                        color="green"
                    />
                    <StatBox
                        title="Monthly Revenue"
                        value={`$${revenueStats?.monthlyRevenue ?? 0}`}
                        color="green"
                    />
                    <StatBox
                        title="Vendor Share (85%)"
                        value={`$${vendorShare}`}
                        color="purple"
                    />
                </div>
                {/* HEADER */}
                <div className="vendor-grid">
                    <div className="card-box">
                        <h6>Bussiness Info</h6>
                        {vendor.salonName && <h5 className="d-flex align-items-center gap-2"><span><FaUser size={14} /></span>{vendor.salonName}</h5>}
                        {vendor.bussinessEmail && <p className="d-flex align-items-center gap-2"><span><IoIosMail size={17} /></span>{vendor.bussinessEmail}</p>}
                        {vendor.bussinessPhoneNumber && <p className="d-flex align-items-center gap-2"><span><FaPhoneAlt size={17} /></span>{vendor.bussinessPhoneNumber}</p>}
                        {vendor.bussinessWebsite && <p className="d-flex align-items-center gap-2"><span><GiWorld size={17} /></span>{vendor.bussinessWebsite}</p>}
                        {vendor.locationName && <p className="d-flex align-items-center gap-2"><span><IoLocationSharp size={17} /></span>{vendor.locationName}</p>}
                    </div>
                    <div className="card-box">
                        <h6>Owner Info</h6>
                        {vendor.name && <h5 className="d-flex align-items-center gap-2 mb-3"><span><FaUser size={14} /></span>{vendor.name}</h5>}
                        {vendor.email && <p className="d-flex align-items-center gap-2"><span><IoIosMail size={17} /></span>{vendor.email}</p>}
                        {vendor.city && <p className="d-flex align-items-center gap-2"><span><IoLocationSharp size={17} /></span>{vendor.city}</p>}
                    </div>
                </div>
                {/* <div className="vendor-header">
                    <div className="d-flex align-items-center gap-4">
                    </div>
                    <span className="status-badge text-capitalize active">Active</span>
                    <span
                            style={{
                                padding: "6px 12px",
                                borderRadius: "20px",
                                fontSize: "12px",
                                fontWeight: 600,
                                backgroundColor: !vendor?.isDeleted ? "#e6f4ea" : "#f1f3f5",
                                color: !vendor?.isDeleted ? "#1e7e34" : "#6c757d"
                            }}
                        >
                            {!vendor?.isDeleted ? "Active" : "Inactive"}
                        </span>

                    <button className="delete-btn" onClick={deleteVendor}>
                        <span className="trash">🗑</span>
                        Delete Vendor
                    </button>
                </div> */}



                {/* PAYOUT + SUMMARY */}
                <div className="vendor-grid">

                    <div className="card-box">
                        <h6>Process Payout</h6>

                        <div className="label">Remaining Balance</div>
                        <div className="amount purple">${availableBalance}</div>

                        <input
                            className="input"
                            type="number"
                            step="0.01"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                        />

                        <input
                            className="input"
                            placeholder="Remarks / Payment method"
                            value={remarks}
                            onChange={e => setRemarks(e.target.value)}
                        />

                        <button
                            className="payout-btn"
                            disabled={paying}
                            onClick={handlePayout}
                        >
                            {paying ? "Processing..." : "$ Process Payout"}
                        </button>
                    </div>

                    <div className="card-box">
                        <h6>Total Revenue Summary</h6>

                        <div className="summary-row">
                            <span>Total Revenue</span>
                            <span>${revenueSummary?.totalRevenue}</span>
                        </div>
                        <div className="summary-row purple">
                            <span>Total Paid Out</span>
                            <span>${revenueSummary?.totalPaidAmount}</span>
                        </div>
                        <div className="summary-row purple">
                            <span>Remaining Revenue</span>
                            <span>${revenueSummary?.remainingRevenue}</span>
                        </div>

                        <div className="summary-row red">
                            <span>Platform Fee (15%)</span>
                            <span>${revenueSummary?.platformFee?.amount}</span>
                        </div>

                        <div className="summary-row green">
                            <span>Vendor Share (85%)</span>
                            <span>${revenueSummary?.vendorShare?.amount}</span>
                        </div>
                        <div className="summary-row">
                            <span><strong>Remaining Balance</strong></span>
                            <span>${revenueSummary?.totalPayoutPending}</span>
                        </div>
                    </div>
                </div>

                <div className="card-box mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0">Payout History</h6>
                        <input
                            type="text"
                            className="form-control w-25"
                            placeholder="Search by ID or Date..."
                            value={payoutSearch}
                            onChange={(e) => setPayoutSearch(e.target.value)}
                            style={{ maxWidth: "250px" }}
                        />
                    </div>

                    {payouts.length === 0 ? (
                        <p className="text-muted">No payouts yet</p>
                    ) : (
                        <div className="table-responsive" style={{ height: "400px", overflowY: "scroll" }}>
                            <table className="history-table">
                                <thead>
                                    <tr>
                                        <th>TransactionId</th>
                                        <th>Payment Method</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Payment Method</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPayouts.map((p, i) => (
                                        <tr key={i}>
                                            <td>{p.transactionId}</td>
                                            <td>{p.payoutMethod}</td>
                                            <td>
                                                {new Date(p.payoutDate).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td>${p.amount}</td>
                                            <td>{p.remarks}</td>
                                            <td>
                                                <span className={`status-badge text-capitalize bg-success ${p.status === "Paid" ? "completed" : ""}`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* RATINGS / REVIEWS */}
                <div className="card-box mt-4">
                    <h6>Ratings & Reviews</h6>

                    <div className="d-flex align-items-center gap-3 mb-3" style={{ flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ fontSize: 22, fontWeight: 700 }}>
                                {(vendor?.avgRating ?? 0).toFixed(1)}
                            </div>

                            <Stars value={vendor?.avgRating ?? 0} />

                            <div className="text-muted" style={{ fontSize: 13 }}>
                                ({vendor?.totalReviews ?? 0} reviews)
                            </div>
                        </div>
                    </div>

                    {(!vendor?.ratings || vendor.ratings.length === 0) ? (
                        <p className="text-muted">No reviews yet</p>
                    ) : (
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Stars</th>
                                    <th>Message</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vendor.ratings.map((r, i) => (
                                    <tr key={r?._id || i}>
                                        <td>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                <img
                                                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL || ""}/${r?.userId?.image || ""}`}
                                                    alt="user"
                                                    onError={(e) => (e.currentTarget.style.display = "none")}
                                                    style={{
                                                        width: 36,
                                                        height: 36,
                                                        borderRadius: "50%",
                                                        objectFit: "cover",
                                                        border: "1px solid #eee",
                                                    }}
                                                />
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>
                                                        {r?.userId?.username || "Unknown"}
                                                    </div>
                                                    <div className="text-muted" style={{ fontSize: 12 }}>
                                                        {r?.userId?.email || ""}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <Stars value={r?.stars ?? 0} size={16} />
                                            <span className="text-muted" style={{ marginLeft: 8, fontSize: 12 }}>
                                                ({r?.stars ?? 0}/5)
                                            </span>
                                        </td>

                                        <td style={{ maxWidth: 380 }}>
                                            {r?.message || "-"}
                                        </td>

                                        <td>
                                            {r?.createdAt
                                                ? new Date(r.createdAt).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })
                                                : "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ===================== COMPONENT ===================== */
const StatBox = ({ title, value, color }) => (
    <div className="stat-box">
        <p>{title}</p>
        <h5 className={color}>{value}</h5>
    </div>
);

const Stars = ({ value = 0, size = 18 }) => {
    const full = Math.floor(value);
    const hasHalf = value - full >= 0.5;

    return (
        <span style={{ display: "inline-flex", gap: 2, lineHeight: 1 }}>
            {[1, 2, 3, 4, 5].map((i) => {
                let star = "☆";
                if (i <= full) star = "★";
                else if (i === full + 1 && hasHalf) star = "★"; // simple half-look; optional advanced half below

                return (
                    <span
                        key={i}
                        style={{
                            fontSize: size,
                            color: i <= full ? "#f5b301" : "#c7c7c7",
                        }}
                    >
                        {star}
                    </span>
                );
            })}
        </span>
    );
};