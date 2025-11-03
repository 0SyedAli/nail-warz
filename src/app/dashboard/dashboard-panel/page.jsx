"use client"

import MyChart2 from "@/components/dashChart/MyChart2";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";
const DashboardPanel = ({ activeTab }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salonId, setSalonId] = useState("");
  const [empty, setEmpty] = useState(false);   // <- NEW
  const router = useRouter();
  // Sample order data
  const pieData = [
    { id: "Expenses", label: "Expenses", value: 40 },
    { id: "Comes", label: "Comes", value: 25 },
  ];
  // Filter orders based on the active tab
  useEffect(() => {
    const cookie = Cookies.get("user");

    if (!cookie) return router.push("/auth/login");

    try {
      const u = JSON.parse(cookie);

      if (u?._id) {
        // setSalonId(u._id);
        setSalonId(u._id);

      } else {
        console.warn("User has no _id:", u);
        router.push("/auth/login");
      }
    } catch (err) {
      console.error("Cookie parse error:", err);
      router.push("/auth/login");
    }
  }, []);
  useEffect(() => {
    if (!salonId) return;

    (async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/getBookingsBySalonId?salonId=${salonId}`
        );
        const json = await res.json();      // always parse the body

        if (!res.ok) throw new Error(json.message || "Network error");

        if (json.success) {
          // already sorted like in manage page
          const parseDateTime = (dateStr, timeStr) => {
            const [day, month, year] = dateStr.split("-");
            return new Date(`${year}-${month}-${day} ${timeStr}`);
          };

          const sortedData = [...json.data].sort((a, b) => {
            const dateA = parseDateTime(a.date, a.time);
            const dateB = parseDateTime(b.date, b.time);
            return dateB - dateA;
          });

          setOrders(sortedData);
          setEmpty(sortedData.length === 0);
          setError(null);
        } else {
          /* success=false → treat as empty, not fatal */
          setOrders([]);
          setEmpty(true);
          setError(null);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
        setOrders([]);
        setEmpty(false);
      } finally {
        setLoading(false);
      }
    })();
  }, [salonId]);

  // Filter orders based on the active tab (e.g., Done, Pending, Accepted)
  const filteredOrders = orders.filter((order) =>
    activeTab
      ? order.status.toLowerCase().includes(activeTab.toLowerCase())
      : true
  );
  const formatDateTimeUS = (dateStr, timeStr) => {
    try {
      // Convert "10-10-2025" → "2025-10-10"
      const [day, month, year] = dateStr.split("-");
      const formatted = `${year}-${month}-${day} ${timeStr}`;
      const date = new Date(formatted);

      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return `${dateStr} ${timeStr}`;
    }
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <span className="badge py-2 bg-success">Completed</span>;
      case "pending":
        return <span className="badge py-2 bg-secondary">Pending</span>;
      case "canceled":
        return <span className="badge py-2 bg-danger">Canceled</span>;
      case "accepted":
        return <span className="badge py-2 bg-warning text-dark">Accepted</span>;
      default:
        return <span className="badge py-2 bg-secondary">{status}</span>;
    }
  };
  return (
    <div className="page">
      <div className="dashboard_panel_inner">
        <div className="my-4 d-flex mb-0">
          {/* <div className="dp_chart1" style={{ width: "60%" }}>
            <CardLineChart />
          </div>
          <div className="dp_chart2" style={{ width: "40%" }}>
            <MyPie data={pieData} />
            <div className="dc2_bottom">
              <div>
                <h2>Total customers</h2>
                <h5>5.000</h5>
              </div>
              <div>
                <h2>This month</h2>
                <h5>500</h5>
              </div>
            </div>
          </div> */}
          <MyChart2 />
        </div>

        {/* Booking List */}

        <div className="card dash_list">
          <div className="card-header bg-white d-flex justify-content-between align-items-center flex-wrap gap-2 py-3">
            <h5 className="fw-bolder mb-0">Activity</h5>
          </div>
          {loading ? (
            <SpinnerLoading />
          ) : error ? (
            <p className="text-danger">Error: {error}</p>
          ) : empty ? (
            <p>No bookings found for this salon.</p>
          ) : (
            <div className="dash_list card-body p-0">
              <div className="table-responsive">
                <table className="table caption-top table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Customer</th>
                      <th>Service</th>
                      <th>Technician</th>
                      <th>Date & Time</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.slice(0, 4).map((order, index) => (
                      <tr key={index}>
                        <td>{order.userId?.username || "Unknown"}</td>
                        <td>{order.serviceId?.serviceName || "-"}</td>
                        <td>{order.technicianId?.fullName || "-"}</td>
                        <td>{formatDateTimeUS(order.date, order.time)}</td>
                        <td>${order.totalAmount}</td>
                        <td>{getStatusBadge(order.status)}</td>
                        <td>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => router.push(`/super-admin/dashboard/manage-appointments/${order._id}`)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPanel;
