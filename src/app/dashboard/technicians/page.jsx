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
      _id: "#4FE21",
      employeeName: "Safa Jafarova",
      birthDate: "11.05.2002",
      startDate: "27.11.2023",
      telefon: "+994 51 123 4567",
      addNew: "Daha çox",
    },
    {
      _id: "#4FE21",
      employeeName: "Safa Jafarova",
      birthDate: "11.05.2002",
      startDate: "27.11.2023",
      telefon: "+994 51 123 4567",
      addNew: "Daha çox",
    },
    {
      _id: "#4FE21",
      employeeName: "Safa Jafarova",
      birthDate: "11.05.2002",
      startDate: "27.11.2023",
      telefon: "+994 51 123 4567",
      addNew: "Daha çox",
    },
    {
      _id: "#4FE21",
      employeeName: "Safa Jafarova",
      birthDate: "11.05.2002",
      startDate: "27.11.2023",
      telefon: "+994 51 123 4567",
      addNew: "Daha çox",
    },
    {
      _id: "#4FE21",
      employeeName: "Safa Jafarova",
      birthDate: "11.05.2002",
      startDate: "27.11.2023",
      telefon: "+994 51 123 4567",
      addNew: "Daha çox",
    },
    {
      _id: "#4FE21",
      employeeName: "Safa Jafarova",
      birthDate: "11.05.2002",
      startDate: "27.11.2023",
      telefon: "+994 51 123 4567",
      addNew: "Daha çox",
    },
    {
      _id: "#4FE21",
      employeeName: "Safa Jafarova",
      birthDate: "11.05.2002",
      startDate: "27.11.2023",
      telefon: "+994 51 123 4567",
      addNew: "Daha çox",
    },
    {
      _id: "#4FE21",
      employeeName: "Safa Jafarova",
      birthDate: "11.05.2002",
      startDate: "27.11.2023",
      telefon: "+994 51 123 4567",
      addNew: "Daha çox",
    },
    {
      _id: "#4FE21",
      employeeName: "Safa Jafarova",
      birthDate: "11.05.2002",
      startDate: "27.11.2023",
      telefon: "+994 51 123 4567",
      addNew: "Daha çox",
    },
    {
      _id: "#4FE21",
      employeeName: "Safa Jafarova",
      birthDate: "11.05.2002",
      startDate: "27.11.2023",
      telefon: "+994 51 123 4567",
      addNew: "Daha çox",
    },
    {
      _id: "#4FE21",
      employeeName: "Safa Jafarova",
      birthDate: "11.05.2002",
      startDate: "27.11.2023",
      telefon: "+994 51 123 4567",
      addNew: "Daha çox",
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
        <div className="py-4 dash_list">
          <div className="table-responsive">
            <table className="table caption-top">
              <thead>
                <tr>
                  <th scope="col"># ID</th>
                  <th scope="col">Employee Name</th>
                  <th scope="col">Birth date</th>
                  <th scope="col">Start date</th>
                  <th scope="col">Telefon</th>
                  <th scope="col">Add new</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr key={index}>
                    <td scope="row">{order._id}</td>
                    <td>{order.employeeName}</td>
                    <td>{order.birthDate}</td>
                    {/* <td
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
                    </td> */}
                    <td>{order.startDate}</td>
                    <td>{order.telefon}</td>
                    <td>{order.addNew}</td>
                    {/* <td className={`status_td ${order.status.toLowerCase()}`}>
                      <span>{order.status}</span>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination justify-content-end mt-4">
              <button className="active">1</button>
              <button>2</button>
              <button>3</button>
              <button>4</button>
              <button>&gt;&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPanel;
