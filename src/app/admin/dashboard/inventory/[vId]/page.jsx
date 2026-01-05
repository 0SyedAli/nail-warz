"use client";

import { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import { useRouter, useParams } from "next/navigation";

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
    const availableBalance = revenueSummary?.remainingRevenue ?? 0;

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

                {/* HEADER */}
                <div className="vendor-header">
                    <div>
                        <h4>{vendor.salonName}</h4>
                        <p><strong>Owner:</strong> {vendor.email}</p>
                        <p>{vendor.locationName}</p>
                        <span className="status-badge active">active</span>
                    </div>

                    <button className="delete-btn" onClick={deleteVendor}>
                        <span className="trash">🗑</span>
                        Delete Vendor
                    </button>
                </div>

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

                        <div className="summary-row red">
                            <span>Platform Fee (15%)</span>
                            <span>${revenueSummary?.platformFee?.amount}</span>
                        </div>

                        <div className="summary-row green">
                            <span>Vendor Share (85%)</span>
                            <span>${revenueSummary?.vendorShare?.amount}</span>
                        </div>

                        <div className="summary-row purple">
                            <span>Total Paid Out</span>
                            <span>${revenueSummary?.totalPaidAmount}</span>
                        </div>
                    </div>
                </div>

                {/* PAYOUT HISTORY */}
                <div className="card-box mt-4">
                    <h6>Payout History</h6>

                    {payouts.length === 0 ? (
                        <p className="text-muted">No payouts yet</p>
                    ) : (
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Payment Method</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payouts.map((p, i) => (
                                    <tr key={i}>
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
                                            <span className={`status-badge ${p.status === "Paid" ? "completed" : ""}`}>
                                                {p.status}
                                            </span>
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
