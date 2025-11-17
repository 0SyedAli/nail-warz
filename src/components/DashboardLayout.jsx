"use client"
import SideBar from "@/components/SideBar";
import TopBar from "@/components/TopBar";
import '../styles/dashboard.css';
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CancelBooking from "./CancelBooking";

export default function Dashboard({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [header, setHeader] = useState();

  const content = {
    dashboard: { title: "Dashboard" },
    technicians: { title: "Manage Technicians" },
    technicianDetails: { title: "Technician Availability" },
    services: { title: "Manage Services" },
    serviceDetails: { title: "Edit Service" },
    addnewservice: { title: "Add New Service" },
    addnewtechnician: { title: "Add New Technician" },
    appointments: { title: "Appointment Management" },
    accountsettings: { title: "Account Settings" },
    categories: { title: "Manage Vendor Catagories" },
  };

  useEffect(() => {
    // remove leading/trailing slashes
    const parts = pathname.split("/").filter(Boolean); // ["dashboard","technicians","68b08a1db3c4ec4fb0213cb7"]

    let headerKey = parts[parts.length - 1]; // last segment by default

    // if route looks like /dashboard/technicians/[id]
    if (parts[1] === "technicians" && parts.length > 2) {
      headerKey = "technicianDetails";
    }
    if (parts[1] === "services" && parts.length > 2) {
      headerKey = "serviceDetails";
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
         <CancelBooking
        title="Delete Coupon"
        message="Are you sure you want to delete this coupon?"
      />
    </div>
  );
}
