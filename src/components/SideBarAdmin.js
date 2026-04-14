"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import LogoutButton from "./Logout";
import { RxCross2 } from "react-icons/rx";

const SideBar = () => {
  const pathname = usePathname();
  const router = useRouter(); // Initialize the useRouter hook
  // const [activeTab, setActiveTab] = useState(pathname);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const [loading, setLoading] = useState(false); // New loading state
  const navigationRouters = [
    {
      href: "/admin/dashboard",
      icon: "/images/dash.png",
      text: "Dashboard",
      related: [
        "/admin/dashboard"
      ],
    },
    {
      href: "/admin/dashboard/users",
      icon: "/images/users.svg",
      text: "App User Management",
      related: [
        "/admin/dashboard/users"
      ],
    },
    {
      href: "/admin/dashboard/vendors",
      icon: "/images/inventory-management.png",
      text: "Vendor Management",
      related: [
        "/admin/dashboard/vendors"
      ],
    },
    {
      href: "/admin/dashboard/inventory",
      icon: "/images/invent-icon.png",
      text: "Inventory Management",
      related: [
        "/admin/dashboard/inventory"
      ],
    },
    {
      href: "/admin/dashboard/order",
      icon: "/images/cart-2.png",
      text: "Order Management",
      related: [
        "/admin/dashboard/order"
      ],
    },
    {
      href: "/admin/dashboard/battles",
      icon: "/images/warz-icon.png",
      text: "Battle Management",
      related: [
        "/admin/dashboard/battles"
      ],
    },
    {
      href: "/admin/dashboard/content",
      icon: "/images/report-data.png",
      text: "Participation Requests",
      related: [
        "/admin/dashboard/content"
      ],
    },
    {
      href: "/admin/dashboard/categories",
      icon: "/images/layer-icon.png",
      text: "Category Management",
      related: [
        "/admin/dashboard/categories"
      ],
    },
    {
      href: "/admin/dashboard/categoryrequest",
      icon: "/images/report-data.png",
      text: "Category Proposals",
      related: ["/admin/dashboard/categoryrequest"],
    },
    {
      href: "/admin/dashboard/disputes",
      icon: "/images/dispute.png",
      text: "Dispute Management",
      related: [
        "/admin/dashboard/disputes"
      ],
    },
    {
      href: "/admin/dashboard/pushnotification",
      icon: "/images/notification.png",
      text: "Push Notification",
      related: [
        "/admin/dashboard/pushnotification"
      ],
    },
    {
      href: "/admin/dashboard/discount",
      icon: "/images/layer-icon.png",
      text: "Discount Management",
      related: [
        "/admin/dashboard/discount"
      ],
    },
  ];
  // useEffect(() => {
  //   setActiveTab(pathname);
  // }, [pathname]);

  const isActive = (item) => {
    if (item.href === "/admin/dashboard") {
      return pathname === "/admin/dashboard";
    }
    return item.related.some((route) =>
      pathname.startsWith(route)
    );
  };
  const handleHover = (href) => {
    router.prefetch(href); // Prefetch on hover
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="sidebar_container">
      <div className="sidebar_header">
        <Image src="/images/logo.png" alt="Logo" width={100} height={162} />
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
              // className={activeTab === item?.href ? "active" : ""}
              className={isActive(item) ? "active" : ""}
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
            <LogoutButton path="/admin/auth/login" />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
