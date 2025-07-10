"use client";
import { useState } from "react";
import NewOrder from "@/components/NewOrder";
import Preparing from "@/components/Preparing";

const Page = () => {
  const [activeTab, setActiveTab] = useState("new");
  return (
    <div className="page">
      <div className="manage_order_head">
        <h3>New Orders</h3>
        <div className="tabs mo_tabs">
          <button
            className={activeTab === "new" ? "active" : ""}
            onClick={() => setActiveTab("new")}
          >
            New Orders
          </button>
          <button
            className={activeTab === "preparing" ? "active" : ""}
            onClick={() => setActiveTab("preparing")}
          >
            Preparing
          </button>
          <button
            className={activeTab === "ready" ? "active" : ""}
            onClick={() => setActiveTab("ready")}
          >
            Order Ready
          </button>
          <button
            className={activeTab === "picked" ? "active" : ""}
            onClick={() => setActiveTab("picked")}
          >
            Picked
          </button>
          <button
            className={activeTab === "rejected" ? "active" : ""}
            onClick={() => setActiveTab("rejected")}
          >
            Rejected
          </button>
        </div>
      </div>

      <div className="tab-content">{<NewOrder activeTab={activeTab} />}</div>
    </div>
  );
};

export default Page;
