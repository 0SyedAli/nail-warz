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
    const updateStatus = async (newStatus) => {
        setUpdating(true);
        try {
            await api.patch(
                `/order/${oId}`,
                { status: newStatus },
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
                            <h5 className="fw-bold mb-1">{order?.orderNumber}</h5>
                            <p className="text-muted">
                                Placed on {new Date(order?.createdAt).toLocaleDateString()}
                            </p>
                            <div className="d-flex align-items-center gap-2 mt-2 pt-1 border-top border-light">
                                <div className="small text-muted mb-0 me-1 fw-bold text-uppercase">Update Status:</div>

                                <select
                                    className="form-select form-select-sm border shadow-sm"
                                    style={{ width: "200px", borderRadius: "8px" }}
                                    value={order?.status?.toLowerCase() || ""}
                                    disabled={updating}
                                    onChange={(e) => updateStatus(e.target.value)}
                                >
                                    <option value="">Select Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>

                                {updating && <small className="text-muted ms-1">Updating…</small>}
                            </div>
                        </div>

                        <div className="d-flex align-items-center gap-3">
                            <OrderStatusBadge status={order?.status} />

                        </div>
                    </div>
                </div>

                <div className="row g-4">

                    {/* ===== ORDER ITEMS ===== */}
                    <div className="col-lg-8">
                        <div className="card">
                            <div className="card-body">
                                <h6 className="fw-bold mb-4">Order Items</h6>

                                {order?.products?.map((p) => (
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
                                                style={{ width: "60px", height: "60px" }}
                                                alt={p.name}
                                                className="rounded"
                                            />
                                            <div>
                                                <div className="fw-semibold">{p.name}</div>
                                                <small className="text-muted">Qty: {p.qty} </small>
                                                <br />
                                                <small className="text-muted">SKU: {p?.sku}</small>
                                            </div>
                                        </div>
                                        <div className="fw-semibold">
                                            ${(p.price).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                                <hr />
                                {/* <div className="d-flex justify-content-between">
                                    <span className="text-muted">SKU</span>
                                    <span className="text-muted">{order?.products?.map((p) => p.sku).join(", ")}</span>
                                </div>
                                <hr /> */}
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Subtotal</span>
                                    <span className="text-muted">${order?.subTotal?.toFixed(2)}</span>
                                </div>
                                <hr />
                                {/* <div className="d-flex justify-content-between">
                                    <span className="text-muted">Discount Code</span>
                                    <span className="text-muted">{order?.discountCode?.code}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Discount Type</span>
                                    <span className="text-muted text-capitalize">{order?.discountCode?.type}</span>
                                </div> */}
                                <div className="d-flex justify-content-between text-danger">
                                    <span className="">
                                        Discount (
                                        {order?.discountCode?.code} -{" "}
                                        {order?.discountCode?.type === "fixed"
                                            ? `$${order?.discountCode?.value}`
                                            : order?.discountCode?.type === "percentage"
                                                ? `${order?.discountCode?.value}%`
                                                : order?.discountCode?.value}
                                        )
                                    </span>
                                    <span className="">
                                        -${order?.discountAmount ? order?.discountAmount.toFixed(2) : "0.00"}
                                    </span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Shipping Price</span>
                                    <span className="text-muted">+${order?.shippingCharges?.toFixed(2)}</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between fw-bold mt-2">
                                    <span>Total</span>
                                    <span>${order?.payment?.amount?.toFixed(2)}</span>
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

                                <small className="mb-0 text-muted">First Name:</small>
                                <p className="mb-1">{order?.customer?.firstName || "N/A"}</p>
                                <small className="mb-0 text-muted">Last Name:</small>
                                <p className="mb-1">{order?.customer?.lastName || "N/A"}</p>
                                <small className="mb-0 text-muted">Email:</small>
                                <p className="mb-1">{order?.customer?.email || "N/A"}</p>
                                <small className="mb-0 text-muted">Phone:</small>
                                <p className="mb-0">{order?.customer?.phone || "N/A"}</p>
                                <small className="mb-0 text-muted">Device Type:</small>
                                <p className="mb-0 text-capitalize">{order?.customer?.deviceType || "N/A"}</p>
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
                                            {order?.payment?.paymentMethod?.toUpperCase()}
                                        </p>
                                        <small className="text-muted">
                                            {order?.payment?.status === "succeeded" ? "Payment received" : "Payment pending"}
                                        </small>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* NOTES */}
                        {order?.notes && (
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="fw-bold mb-2">Order Notes</h6>
                                    <p className="mb-0 text-muted">{order?.notes}</p>
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
        processing: "bg-info text-dark",
        shipped: "bg-primary text-white",
        completed: "bg-dark text-white",
        cancelled: "bg-danger text-white",
    };

    const currentStatus = status?.toLowerCase() || "pending";

    return (
        <span className={`badge ${map[currentStatus] || "bg-secondary "} p-2`} style={{ fontSize: "14px" }}>
            {currentStatus}
        </span>
    );
};
