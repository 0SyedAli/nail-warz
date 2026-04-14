"use client"
import '@/styles/dashboard.css';
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import TopBar from "./TopBarAdmin";
import SideBar from './SideBarAdmin';

export default function Dashboard({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [header, setHeader] = useState();

  const content = {
    dashboard: { title: "Admin Dashboard" },
    users: { title: "Application Users Management" },
    usersDetails: { title: "Application User Details" },
    vendors: { title: "Vendors Management" },
    vendorsDetails: { title: "Vendor Details" },
    inventory: { title: "Inventory Management" },
    order: { title: "Order Management" },
    orderDetails: { title: "Order Details" },
    battles: { title: "Battles Management" },
    battlesDetails: { title: "Battles Details" },
    content: { title: "Participant Requests" },
    contentDetails: { title: "Participant Details" },
    categories: { title: "Category Management" },
    categoryrequest: { title: "Category Request" },
    pushnotification: { title: "Push Notification" },
    disputes: { title: "Disputes Management" },
    disputesDetails: { title: "Dispute Details" },
    discount: { title: "Discount Management" },
  };
  useEffect(() => {
    const parts = pathname.split("/").filter(Boolean);
    let headerKey = parts[parts.length - 1];

    if (parts[2] === "users" && parts.length > 3) {
      headerKey = "usersDetails";
    }
    if (parts[2] === "vendors" && parts.length > 3) {
      headerKey = "vendorsDetails";
    }
    if (parts[2] === "order" && parts.length > 3) {
      headerKey = "orderDetails";
    }
    if (parts[2] === "battles" && parts.length > 3) {
      headerKey = "battlesDetails";
    }
    if (parts[2] === "content" && parts.length > 3) {
      headerKey = "contentDetails";
    }
    if (parts[2] === "disputes" && parts.length > 3) {
      headerKey = "disputesDetails";
    }

    setHeader(content[headerKey]);
  }, [pathname, searchParams]);

  return (
    <div className="dashboard_container">
      <SideBar />
      <div className="dashboard_panel">
        <TopBar header={header?.title} />
        {children}
      </div>
    </div>
  );
}
