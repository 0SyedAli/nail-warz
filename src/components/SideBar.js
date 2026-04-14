"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import LogoutButton from "./Logout";
import { RxCross2 } from "react-icons/rx";

const SideBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigationRouters = [
    {
      href: "/dashboard",
      icon: "/images/dash.png",
      text: "Dashboard",
      related: ["/dashboard"], // exact only
    },
    {
      href: "/dashboard/appointments",
      icon: "/images/cal.png",
      text: "Appointments",
      related: [
        "/dashboard/appointments",
        "/dashboard/appointmentslist",
      ],
    },
    {
      href: "/dashboard/technicians",
      icon: "/images/dash.png",
      text: "Technicians",
      related: [
        "/dashboard/technicians",
        "/dashboard/addnewtechnician",
      ],
    },
    {
      href: "/dashboard/services",
      icon: "/images/serv.png",
      text: "Services",
      related: [
        "/dashboard/services",
        "/dashboard/addnewservice"
      ],
    },
    // {
    //   href: "/dashboard/categories",
    //   icon: "/images/layer-icon.png",
    //   text: "Service Categories",
    //   related: ["/dashboard/categories"],
    // },
    {
      href: "/dashboard/categoryrequest",
      icon: "/images/report-data.png", // Using an appropriate icon
      text: "Category Requests",
      related: ["/dashboard/categoryrequest"],
    },
    {
      href: "/dashboard/payouthistory",
      icon: "/images/payout-icon.png",
      text: "Payout History",
      related: ["/dashboard/payouthistory"],
    },
    {
      href: "/dashboard/disputes",
      icon: "/images/dispute.png",
      text: "Disputes",
      related: ["/dashboard/disputes"],
    },
    {
      href: "/dashboard/accountsettings",
      icon: "/images/act.png",
      text: "Account Settings",
      related: ["/dashboard/accountsettings"],
    },
  ];

  const isActive = (item) => {
    if (item.href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return item.related.some((route) =>
      pathname.startsWith(route)
    );
  };

  const handleHover = (href) => {
    router.prefetch(href);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="sidebar_container">
      <div className="sidebar_header">
        <Image src="/images/logo.png" alt="Logo" width={134} height={162} />
        <button className="hamburger" onClick={toggleSidebar}>
          ☰
        </button>
      </div>

      <div className={`sidebar_menu ${isSidebarOpen ? "open" : ""}`}>
        <Image
          src="/images/logo.png"
          className="sm_logo"
          alt="Logo"
          width={134}
          height={162}
        />
        <button
          className="hamburger"
          style={{ margin: "20px auto 0" }}
          onClick={toggleSidebar}
        >
          <RxCross2 />
        </button>

        <ul>
          {navigationRouters.map((item, index) => (
            <li
              key={index}
              className={isActive(item) ? "active" : ""}
              onMouseEnter={() => handleHover(item.href)}
            >
              <Link
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
              >
                <span>
                  {item.icon && (
                    <Image
                      src={item.icon}
                      alt={`${item.text} Icon`}
                      width={18}
                      height={18}
                    />
                  )}
                </span>
                {item.text}
              </Link>
            </li>
          ))}

          <li className="sc2_sid">
            <LogoutButton path="/auth/login" />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
