"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
import api from "@/lib/axios";

export default function OrderDetailsPage() {
    const { oId } = useParams();
    const router = useRouter();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);

    // 🔐 Auth Guard
    useEffect(() => {
        if (!Cookies.get("token")) router.push("/admin/auth/login");
    }, []);

    // 🔁 Fetch Order
    const fetchOrder = async () => {
        try {
            const res = await api.get(`/order/${oId}`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`,
                },
            });

            if (!res.data.success) throw new Error(res.data.message);
            setOrder(res.data.order);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (oId) fetchOrder();
    }, [oId]);

    // ✅ Update Status
    const markAsCompleted = async () => {
        setUpdating(true);
        try {
            await api.patch(
                `/order/${oId}`,
                { status: "completed" },
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    },
                }
            );
            fetchOrder();
        } catch (e) {
            alert("Failed to update order");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <p className="m-4">Loading order…</p>;
    if (error) return <p className="m-4 text-danger">{error}</p>;
    if (!order) return null;

    return (
        <div className="page">
            <div className="dashboard_panel_inner pt-4">

                {/* ===== BACK ===== */}
                <button className="btn btn-link text-dark mb-3" onClick={() => router.back()}>
                    ← Back to Orders
                </button>

                {/* ===== HEADER ===== */}
                <div className="card mb-4">
                    <div className="card-body d-flex justify-content-between align-items-start">
                        <div className="d-flex flex-column gap-2">
                            <h5 className="fw-bold mb-1">{order.orderNumber}</h5>
                            <p className="text-muted">
                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            {order.status !== "completed" && (
                                <button
                                    className="btn btn-dark fw-normal"
                                    disabled={updating}
                                    onClick={markAsCompleted}
                                >
                                    {updating ? "Updating…" : "Mark as Complete"}
                                </button>
                            )}
                        </div>

                        <div className="d-flex align-items-center gap-3">
                            <OrderStatusBadge status={order.status} />

                        </div>
                    </div>
                </div>

                <div className="row g-4">

                    {/* ===== ORDER ITEMS ===== */}
                    <div className="col-lg-8">
                        <div className="card">
                            <div className="card-body">
                                <h6 className="fw-bold mb-4">Order Items</h6>

                                {order.products.map((p) => (
                                    <div
                                        key={p._id}
                                        className="d-flex justify-content-between align-items-center mb-3"
                                    >
                                        <div className="d-flex gap-3 align-items-center">
                                            <Image
                                                src={
                                                    p.images && p.images?.length
                                                        ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${p.images[0]}`
                                                        : "/images/warz-dummy.png"
                                                }
                                                width={60}
                                                height={60}
                                                alt={p.name}
                                                className="rounded"
                                            />
                                            <div>
                                                <div className="fw-semibold">{p.name}</div>
                                                <small className="text-muted">Qty: {p.qty}</small>
                                            </div>
                                        </div>
                                        <div className="fw-semibold">
                                            ${(p.price * p.qty).toFixed(2)}
                                        </div>
                                    </div>
                                ))}

                                <hr />

                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Subtotal</span>
                                    <span className="text-muted">${order.total.toFixed(2)}</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between fw-bold mt-2">
                                    <span>Total</span>
                                    <span>${order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ===== RIGHT SIDEBAR ===== */}
                    <div className="col-lg-4">

                        {/* CUSTOMER */}
                        <div className="card mb-3">
                            <div className="card-body">
                                <h6 className="fw-bold mb-2">Customer Information</h6>

                                <small className="mb-0 text-muted">Name</small>
                                <p className="mb-1">{order.customer.name}</p>
                                <small className="mb-0 text-muted">Email</small>
                                <p className="mb-1">{order.customer.email}</p>
                                <small className="mb-0 text-muted">Phone</small>
                                <p className="mb-0">{order.customer.phone}</p>
                            </div>
                        </div>

                        {/* PAYMENT */}
                        <div className="card mb-3">
                            <div className="card-body">
                                <h6 className="fw-bold mb-2">Payment Details</h6>
                                <div className="d-flex align-items-center gap-2">
                                    <div style={{
                                        width: "40px",
                                        height: "40px",
                                        backgroundColor: "#FAF5FF",
                                        borderRadius: "4px"
                                    }} className="d-flex align-items-center justify-content-center">
                                        <Image
                                            src="/images/card-icon.png"
                                            width={20}
                                            height={20}
                                            alt=""
                                        />
                                    </div>
                                    <div>
                                        <p className="mb-0">
                                            {order.payment.paymentMethod.toUpperCase()}
                                        </p>
                                        <small className="text-muted">
                                            {order.payment.status === "succeeded" ? "Payment received" : "Payment pending"}
                                        </small>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* NOTES */}
                        {order.notes && (
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="fw-bold mb-2">Order Notes</h6>
                                    <small className="mb-0 text-muted">{order.notes}</small>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
}

/* ===== COMPONENT ===== */

const OrderStatusBadge = ({ status }) => {
    const map = {
        pending: "bg-secondary2 text-dark",
        completed: "bg-dark",
        cancelled: "bg-danger",
    };

    return (
        <span className={`badge ${map[status] || "bg-secondary "} p-2`} style={{fontSize:"14px"}}>
            {status}
        </span>
    );
};
