"use client";

import { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { BsSearch, BsEye } from "react-icons/bs";

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

  // 🔐 Auth Guard
  useEffect(() => {
    if (!Cookies.get("token")) router.push("/admin/auth/login");
  }, []);

  // 🔁 Fetch Orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

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
    fetchOrders();
  }, []);

  // 🔎 Search (order number or customer)
  useEffect(() => {
    const f = orders.filter(o =>
      `${o.orderNumber} ${o.customer?.name}`
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

  if (loading) return <p className="m-4">Loading orders…</p>;
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
            <StatCard title="Pending Orders" value={stats.pendingOrders} valueClass="text-warning" />
            <StatCard title="Completed Orders" value={stats.completedOrders} valueClass="text-success" />
            <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} valueClass="text-primary2" />
          </div>
        )}

        {/* ===== TABLE ===== */}
        <div className="card">
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <div className="position-relative">
              <BsSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <input
                className="form-control ps-5"
                style={{ width: 320 }}
                placeholder="Search by order number or customer…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
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
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {currentOrders.map(order => (
                    <tr key={order._id}>
                      <td className="fw-semibold">{order.orderNumber}</td>
                      <td>{order.customer?.name || "-"}</td>
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
                  ))}
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
    completed: "bg-dark",
    cancelled: "bg-danger",
  };

  return (
    <span className={`badge ${map[status] || "bg-secondary"} py-2`}>
      {status}
    </span>
  );
};
