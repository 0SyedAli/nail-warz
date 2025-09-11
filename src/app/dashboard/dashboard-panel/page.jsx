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
          /* normal data path */
          const mapped = json.data.map(item => ({
            employeeName: item?.technicianId?.fullName || "N/A",
            category: item?.serviceId?.serviceName || "N/A",
            date: `${item?.date} ${item?.time}`,
            price: `$ ${item?.serviceId?.price ?? 0}`,
            salesRevenue: `${item?.serviceId?.price ?? 0} AZN`,
            status: item?.status || "Pending",
          }));
          setOrders(mapped);
          setEmpty(mapped.length === 0);
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
        <div className="py-4 dash_list">
          <h2 className="mb-3">Activity</h2>

          {loading ? (
            <SpinnerLoading />
          ) : error ? (
            <p className="text-danger">Error: {error}</p>
          ) : empty ? (
            <p>No bookings found for this salon.</p>
          ) : (
            <div className="table-responsive">
              <table className="table caption-top">
                <thead>
                  <tr>
                    <th scope="col">Employee Name</th>
                    <th scope="col">Category</th>
                    <th scope="col">Date</th>
                    <th scope="col">Price</th>
                    <th scope="col">Sales Revenue</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.slice(0, 4).map((order, index) => (
                    <tr key={index}>
                      <td>{order.employeeName}</td>
                      <td className="user_td">{order.category}</td>
                      <td>{order.date}</td>
                      <td
                        className={`dollar_td ${parseFloat(order.price.replace(/[^\d.-]/g, "")) < 0
                          ? "loss"
                          : ""
                          }`}
                      >
                        {order.price}
                      </td>
                      <td>{order.salesRevenue}</td>
                      <td className={`status_td ${order.status.toLowerCase()}`}>
                        <span>{order.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPanel;
