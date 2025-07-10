"use client"
import CardLineChart from "@/components/CardLineChart";
import MyPie from "@/components/MyPie";
import Link from "next/link";
import { useEffect } from "react";

const img1 = "/images/dollar-circle.png";
const img2 = "/images/chart-square.png";
const img3 = "/images/money-send.png";
const img4 = "/images/discount-circle.png";

const image1 = "/images/logo.png";
const image2 = "/images/logo.png";

const DashboardPanel = ({ activeTab }) => {
  // Sample order data
  const orders = [
    {
      employeeName: "Safa Jafarova",
      category: "Saç kəsimi",
      date: "27.11.2023   10.00",
      price: "$ 40.00",
      salesRevenue: "40 AZN",
      status: "Done",
    },
    {
      employeeName: "Safa Jafarova",
      category: "Saç kəsimi",
      date: "27.11.2023   10.00",
      price: "$ 40.00",
      salesRevenue: "40 AZN",
      status: "Done",
    },
    {
      employeeName: "Safa Jafarova",
      category: "Saç kəsimi",
      date: "27.11.2023   10.00",
      price: "$ 40.00",
      salesRevenue: "40 AZN",
      status: "Done",
    },
    {
      employeeName: "Safa Jafarova",
      category: "Saç kəsimi",
      date: "27.11.2023   10.00",
      price: "$ 40.00",
      salesRevenue: "40 AZN",
      status: "Done",
    },
  ];
  const pieData = [
    { id: "Expenses", label: "Expenses", value: 40 },
    { id: "Comes", label: "Comes", value: 25 },
  ];
  // Filter orders based on the active tab
  const filteredOrders = orders.filter((order) =>
    activeTab
      ? order.status.toLowerCase().includes(activeTab.toLowerCase())
      : true
  );

  return (
    <div className="page">
      <div className="dashboard_panel_inner">
        <div className="my-4 d-flex mb-0">
          <div className="dp_chart1" style={{ width: "60%" }}>
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
          </div>
        </div>
        <div className="py-4 dash_list">
          <h2 className="mb-3">Activity</h2>
          <div className="table-responsive">
            <table className="table caption-top">
              <thead>
                <tr >
                  <th scope="col">Employee Name</th>
                  <th scope="col">Category</th>
                  <th scope="col">Date</th>
                  <th scope="col">Price</th>
                  <th scope="col">Sales Revenue</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr key={index}>
                    <td scope="row">{order.employeeName}</td>
                    <td className="user_td">
                      {/* <img src={order.image} alt="User Avatar" /> */}
                      {order.category}
                    </td>
                    <td>{order.date}</td>
                    <td
                      className={`dollar_td ${order.price &&
                        !isNaN(
                          parseFloat(order.price.replace(/[^\d.-]/g, ""))
                        ) &&
                        parseFloat(order.price.replace(/[^\d.-]/g, "")) < 0
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
        </div>
      </div>
    </div>
  );
};

export default DashboardPanel;
