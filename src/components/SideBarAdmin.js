"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import LogoutButton from "./Logout";
import { RxCross2 } from "react-icons/rx";

const SideBar = () => {
  const pathname = usePathname();
  const router = useRouter(); // Initialize the useRouter hook
  const [activeTab, setActiveTab] = useState(pathname);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state
  const navigationRouters = [
    {
      href: "/admin/dashboard",
      icon: "/images/dash.png",
      text: "Dashboard",
    },
    {
      href: "/admin/dashboard/users",
      icon: "/images/users.svg",
      text: "Users Management",
    },
    {
      href: "/admin/dashboard/vendors",
      icon: "/images/inventory-management.png",
      text: "Vendors Management",
    },
    {
      href: "/admin/dashboard/inventory",
      icon: "/images/invent-icon.png",
      text: "Inventory Management",
    },
    {
      href: "/admin/dashboard/order",
      icon: "/images/cart-2.png",
      text: "Order Management",
    },
    {
      href: "/admin/dashboard/battles",
      icon: "/images/warz-icon.png",
      text: "Battles Management",
    },
    {
      href: "/admin/dashboard/content",
      icon: "/images/report-data.png",
      text: "Content Management",
    },
    {
      href: "/admin/dashboard/pushnotification",
      icon: "/images/notification.png",
      text: "Push Notification",
    },
   
  ];
  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

  const handleHover = (href) => {
    router.prefetch(href); // Prefetch on hover
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
      {/* <div className="d-flex align-items-center justify-content-center">
        <Image src="/images/logo.png" alt="Logo" width={134} height={162} />
        <button className="hamburger" onClick={toggleSidebar}>
          ☰
        </button>
      </div> */}
      <div className={`sidebar_menu ${isSidebarOpen ? "open" : ""}`}>
        <Image src="/images/logo.png" className="sm_logo" alt="Logo" width={134} height={162} />
        <button className="hamburger" style={{ margin: "20px auto 0" }} onClick={toggleSidebar}>
          <RxCross2 />
        </button>
        <ul className="sma-ul">
          {navigationRouters.map((item, index) => (
            // <li
            //   key={index}
            //   className={activeTab === item?.href ? "active" : ""}
            //   onClick={() => handleTabClick(item?.href)} // Trigger navigation and loading
            //   onMouseEnter={() => handleHover(item?.href)} // Prefetch on hover
            // >
            //   <Link href={item?.href}>
            //     <span>
            //       <Image
            //         src={item.icon}
            //         alt={`${item.text} Icon`}
            //         width={18}
            //         height={18}
            //       />
            //     </span>
            //     {item.text}
            //   </Link>
            // </li>
            <li
              key={index}
              className={activeTab === item?.href ? "active" : ""}
              onMouseEnter={() => handleHover(item?.href)}
            >
              <Link href={item?.href} onClick={() => setIsSidebarOpen(false)}>
                <span>
                  {item?.icon &&
                    <Image src={item?.icon} alt={`${item?.text} Icon`} width={18} height={18} />
                  }
                </span>
                {item.text}
              </Link>
            </li>
          ))}
          <li className="sc2_sid">
            <LogoutButton path="/admin/auth/login"/>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
