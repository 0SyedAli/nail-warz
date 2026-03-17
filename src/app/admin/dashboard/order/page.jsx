"use client";

import { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { BsSearch, BsEye } from "react-icons/bs";
import { Skeleton } from "@chakra-ui/react";

const PAGE_SIZE = 10;

export default function SuperAdminOrders() {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);

  // 🔐 Auth Guard
  useEffect(() => {
    if (!Cookies.get("token")) router.push("/admin/auth/login");
  }, []);

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setSearch("");
    setPage(1);
    fetchOrders(status);
  };

  // 🔁 Fetch Orders
  const fetchOrders = async (status = null) => {
    setLoading(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/order`;

      if (status) {
        url += `?status=${status}`;
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      setOrders(json.orders);
      setFiltered(json.orders);
      setStats(json.stats);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(statusFilter);
  }, []);

  // 🔎 Search (order number or customer)
  useEffect(() => {
    const f = orders.filter(o =>
      `${o.orderNumber} ${o.customer?.username}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFiltered(f);
    setPage(1);
  }, [search, orders]);

  // 📄 Pagination
  const currentOrders = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  if (error) return <p className="m-4 text-danger">{error}</p>;

  return (
    <div className="page">
      <div className="dashboard_panel_inner pt-4">

        {/* ===== HEADER ===== */}
        <div className="mb-4">
          <h4 className="fw-bold">Order Management</h4>
          <p className="text-muted">Track and manage all e-store orders</p>
        </div>

        {/* ===== STATS ===== */}
        {stats && (
          <div className="row g-3 mb-4">
            <StatCard title="Total Orders" value={stats.totalOrders} />
            <StatCard title="Pending" value={stats.pendingOrders || 0} valueClass="text-warning" />
            {/* <StatCard title="Processing" value={stats.processingOrders || 0} valueClass="text-info" />
            <StatCard title="Shipped" value={stats.shippedOrders || 0} valueClass="text-primary" /> */}
            <StatCard title="Completed" value={stats.completedOrders || 0} valueClass="text-success" />
            <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} valueClass="text-primary2" />
          </div>
        )}

        {/* ===== TABLE ===== */}
        <div className="card">
          <div className="card-header bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <div className="position-relative" style={{ width: 350 }}>
                <BsSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <input
                  className="form-control w-100 ps-5"

                  placeholder="Search by order number or customer…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="d-flex flex-wrap gap-2 my-2">
                <button
                  className={`btn btn-sm ${statusFilter === null ? "btn-dark" : "btn-outline-dark"}`}
                  onClick={() => handleStatusFilter(null)}
                >
                  All Orders
                </button>

                <button
                  className={`btn btn-sm ${statusFilter === "pending" ? "btn-dark" : "btn-outline-dark"}`}
                  onClick={() => handleStatusFilter("pending")}
                >
                  Pending
                </button>

                <button
                  className={`btn btn-sm ${statusFilter === "processing" ? "btn-dark" : "btn-outline-dark"}`}
                  onClick={() => handleStatusFilter("processing")}
                >
                  Processing
                </button>

                <button
                  className={`btn btn-sm ${statusFilter === "shipped" ? "btn-dark" : "btn-outline-dark"}`}
                  onClick={() => handleStatusFilter("shipped")}
                >
                  Shipped
                </button>

                <button
                  className={`btn btn-sm ${statusFilter === "completed" ? "btn-dark" : "btn-outline-dark"}`}
                  onClick={() => handleStatusFilter("completed")}
                >
                  Completed
                </button>
              </div>
            </div>


          </div>

          <div className="dash_list card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Order Number</th>
                    <th>Customer</th>
                    <th>Products</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Fulfillment Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    Array.from({ length: 7 }).map((_, index) => (
                      <tr key={index}>
                        <td><Skeleton height="20px" width="120px" /></td>
                        <td><Skeleton height="20px" width="100px" /></td>
                        <td><Skeleton height="20px" width="70px" /></td>
                        <td><Skeleton height="20px" width="60px" /></td>
                        <td><Skeleton height="20px" width="90px" /></td>
                        <td><Skeleton height="20px" width="70px" /></td>
                        <td><Skeleton height="30px" width="60px" /></td>
                      </tr>
                    ))
                  ) : (
                    currentOrders.map(order => (
                      <tr key={order._id}>
                        <td className="fw-semibold">{order.orderNumber}</td>
                        <td>{order.customer?.username || "-"}</td>
                        <td>{order.products?.length || 0} items</td>
                        <td>${order.total.toFixed(2)}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>
                          <OrderStatusBadge status={order.status} />
                        </td>
                        <td>
                          <button
                            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                            onClick={() => router.push(`/admin/dashboard/order/${order._id}`)}
                          >
                            <BsEye /> View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

            </div>
          </div>
        </div>
        {totalPages > 1 && (
          <div className="pagination justify-content-end mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={n === page ? "active" : ""}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              &gt;
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

/* ===== COMPONENTS ===== */

const StatCard = ({ title, value, valueClass = "" }) => (
  <div className="col-md-3">
    <div className="card h-100">
      <div className="card-body">
        <p className="text-muted mb-1">{title}</p>
        <h5 className={`fw-bold ${valueClass}`}>{value}</h5>
      </div>
    </div>
  </div>
);

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
    <span className={`badge text-capitalize ${map[currentStatus] || "bg-secondary"} py-2`}>
      {currentStatus}
    </span>
  );
};
