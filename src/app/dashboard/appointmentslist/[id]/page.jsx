"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Spinner } from "react-bootstrap";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

export default function AppointmentDetailPage() {
    const params = useParams();
    const router = useRouter();

    const id = params.id;

    const [booking, setBooking] = useState(null);

    const [loading, setLoading] = useState(true);

    const [updating, setUpdating] = useState(false);

    const [cancelReason, setCancelReason] = useState("");

    const [showCancel, setShowCancel] = useState(false);

    const API = process.env.NEXT_PUBLIC_API_URL;

    // =========================
    // Fetch Booking
    // =========================

    const fetchBooking = async () => {
        try {
            setLoading(true);

            const res = await fetch(`${API}/getBookingById?bookingId=${id}`);

            const json = await res.json();

            if (json.success) {
                setBooking(json.data);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchBooking();
    }, [id]);

    // =========================
    // Booking Status Update
    // =========================

    const updateBookingStatus = async (status) => {
        try {
            setUpdating(true);

            const body = {
                bookingId: booking._id,

                status,
            };

            if (status === "Canceled") {
                body.reason = cancelReason;
            }

            const res = await fetch(`${API}/updateBookingStatus`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const json = await res.json();

            if (json.success) {
                setShowCancel(false);

                setCancelReason("");

                fetchBooking();
            }
        } catch (err) {
            console.log(err);
        } finally {
            setUpdating(false);
        }
    };

    // =========================
    // Service Status Update
    // =========================

    const updateServiceStatus = async (slotId, status) => {
        try {
            setUpdating(true);

            const res = await fetch(`${API}/updateServiceSlotStatus`, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    bookingId: booking._id,

                    slotId,

                    status,
                }),
            });

            const json = await res.json();

            if (json.success) {
                fetchBooking();
                showSuccessToast("Status updated successfully");
            }
            else {
                showErrorToast(json.message || "Failed to update status");
            }
        } catch (err) {
            console.log(err);
            showErrorToast(err.message || "Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    const getStatusBadge = (status = "") => {

        switch (status) {

            case "PaymentPending":
                return "bg-warning text-dark";

            case "Confirmed":
                return "bg-primary";

            case "Rescheduled":
                return "bg-info text-dark";

            case "In_Progress":
                return "bg-secondary";

            case "Completed":
                return "bg-success";

            case "Canceled":
                return "bg-danger";

            case "Expired":
                return "bg-dark";

            default:
                return "bg-light text-dark";
        }
    };

    if (loading) {
        return <div className="py-5 text-center">Loading...</div>;
    }

    if (!booking) {
        return <div className="alert alert-danger">Appointment not found</div>;
    }

    return (
        <div className="page pt-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <button
                    className="btn btn-outline-secondary"
                    onClick={() => router.back()}
                >
                    ← Back
                </button>
                {booking.status !== "Completed" && booking.status !== "Canceled" && (
                    <div className="d-flex gap-2">
                        {/* <button
                            className="btn btn-success"
                            onClick={() => updateBookingStatus("Completed")}
                            disabled={updating}
                        >
                            Complete Booking
                        </button> */}

                        <button
                            className="btn btn-danger"
                            onClick={() => setShowCancel(true)}
                        >
                            Cancel Booking
                        </button>
                    </div>
                )}
            </div>
            {showCancel && (
                <div className="card mb-4 border-danger">
                    <div className="card-body">
                        <h5>Cancel Appointment</h5>

                        <textarea
                            className="form-control mb-3"
                            placeholder="Enter cancel reason"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                        />

                        <button
                            className="btn btn-danger me-2"
                            onClick={() => updateBookingStatus("Canceled")}
                            disabled={updating}
                        >
                            {updating ? <Spinner size="sm" /> : "Confirm Cancel"}
                        </button>

                        <button
                            className="btn btn-secondary"
                            onClick={() => setShowCancel(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="d-flex justify-content-between">
                        <div>
                            <h3>Appointment Detail</h3>

                            {/* <p className="text-muted mb-0">#{booking._id}</p> */}
                        </div>

                        <div>
                            {/* <span
                                className={`badge py-2 px-3 ${booking.status === "Completed" ? "bg-success" : booking.status === "Canceled" ? "bg-danger" : "bg-primary"
                                    }`}
                            >
                                {booking.status}
                            </span> */}
                            <span className={`badge py-2 px-3 ${getStatusBadge(booking.status)}`}>
                                {booking.status}
                            </span>
                        </div>
                    </div>

                    <hr />

                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="bg-light p-3 rounded h-100">
                                <h6>Customer</h6>

                                <h5>{booking.userId?.username}</h5>

                                <p>{booking.userId?.email}</p>
                            </div>
                        </div>

                        {/* <div className="col-md-4">
                            <div className="bg-light p-3 rounded h-100">
                                <h6>Payment</h6>

                                <p className={`badge ${booking.paymentStatus === "Success" ? "bg-success" : "bg-danger"} py-2 px-3`}>{booking.paymentStatus}</p>
                            </div>
                        </div> */}

                        <div className="col-md-4">
                            <div className="bg-light p-3 rounded h-100">
                                <h6>Sub Total</h6>

                                <h4>${booking.subtotal}</h4>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="bg-light p-3 rounded h-100">
                                <h6>App Charges</h6>

                                <h4>${booking.appCharges}</h4>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="bg-light p-3 rounded h-100">
                                <h6>Discount</h6>

                                <h4>${booking.discountDetails.amount || 0}</h4>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="bg-light p-3 rounded h-100">
                                <h6>Total</h6>

                                <h4>${booking.totalAmount}</h4>
                            </div>
                        </div>
                    </div>

                    {booking.status === "Canceled" && (
                        <div className="alert alert-danger mt-3">
                            <strong>Canceled Appointment Reason</strong>

                            <p className="mb-1">
                                By: {booking.canceledBy || "-"}
                            </p>

                            <p className="mb-0">
                                Reason: {booking.cancelReason || "-"}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Booking Actions */}



            {/* Cancel Box */}



            {/* Services */}

            <h3 className="mb-3">Services</h3>

            {booking.servicesDetail?.map((item) => (
                <div className="card mb-3" key={item._id}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-8">
                                <h4>{item.serviceName}</h4>

                                <p className="mb-0">
                                    Technician:
                                    <strong> {item.technician?.fullName || "-"}</strong>
                                </p>
                                <p className="mb-0">
                                    Price:
                                    <strong> ${item.price || "-"}</strong>
                                </p>

                                <p className="mb-0">Schedule: {new Date(item.scheduledAt).toLocaleString()}</p>
                            </div>

                            <div className="col-md-4 text-md-end">
                                <span className={`badge py-2 px-3 ${getStatusBadge(item.status)}`}>
                                    {item.status}
                                </span>
                            </div>
                        </div>

                        {/* <div className="mt-3 d-flex gap-2">
                            {item.status !== "Completed" && item.status !== "Cancelled" && item.status !== "Canceled" && (
                                <button
                                    className="btn btn-success btn-sm"
                                    onClick={() => updateServiceStatus(item._id, "Completed")}
                                >
                                    Complete Service
                                </button>
                            )}

                            {item.status === "Confirmed" && item.status !== "Rescheduled" && (
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => updateServiceStatus(item._id, "In_Progress")}
                                >
                                    Start Service
                                </button>
                            )}
                        </div> */}
                        <div className="mt-3 d-flex gap-2">
                            {(item.status === "Confirmed" || item.status === "Rescheduled") && (
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => updateServiceStatus(item._id, "In_Progress")}
                                >
                                    Start Service
                                </button>
                            )}

                            {item.status === "In_Progress" && (
                                <button
                                    className="btn btn-success btn-sm"
                                    onClick={() => updateServiceStatus(item._id, "Completed")}
                                >
                                    Complete Service
                                </button>
                            )}

                            {/* {(item.status === "Confirmed" || item.status === "Rescheduled") && (
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => updateServiceStatus(item._id, "Canceled")}
                                >
                                    Cancel Service
                                </button>
                            )} */}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
