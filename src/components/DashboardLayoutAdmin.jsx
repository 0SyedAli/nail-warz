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
    dashboard: { title: "Dashboard" },
    users: { title: "Users Management" },
    vendors: { title: "Vendors Management" },
    vendorsDetails: { title: "Vendor Details" }, // ✅ ADD THIS
    inventory: { title: "Inventory Management" },
    accountsettings: { title: "Account Settings" },
    categories: { title: "Manage Vendor Categories" },
  };
  useEffect(() => {
    const parts = pathname.split("/").filter(Boolean);
    let headerKey = parts[parts.length - 1];

    if (parts[2] === "vendors" && parts.length > 3) {
      headerKey = "vendorsDetails";
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
