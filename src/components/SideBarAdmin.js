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
      icon: "/images/users.svg",
      text: "Vendors Management",
    },
    // {
    //   href: "/dashboard/categories",
    //   icon: "/images/layer-icon.png",
    //   text: "Categories",
    // },
    // {
    //   href: "/dashboard/accountsettings",
    //   icon: "/images/act.png",
    //   text: "Account Settings",
    // }
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
        <ul>
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
            <LogoutButton />
          </li>
        </ul>
        {/* <div className="sc2_sid">
          <div className="logout_btn" >
            <LogoutButton />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default SideBar;
