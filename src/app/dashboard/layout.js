"use client"
import SideBar from "@/components/SideBar";
import TopBar from "@/components/TopBar";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard({ children }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [header, setHeader] = useState();
  const content = {
    dashboard: {
      title: "Dashboard",
    },
    technicians: {
      title: "Technicians List",
    },
    services: {
      title: "Manage Services",
    },
    accountsettings: {
      title: "Account Settings",
    },
    addnewservice: {
      title: "Add New Service",
    },
    appointments: {
      title: "Appointment Management",
    },
    accountsettings: {
      title: "Account Settings",
    }
  }
  useEffect(() => {
    const key = window.location.href.split("/").pop();
    setHeader(content[key]);
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
