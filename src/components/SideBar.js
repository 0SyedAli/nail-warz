"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const SideBar = () => {
  const pathname = usePathname();
  const router = useRouter(); // Initialize the useRouter hook
  const [activeTab, setActiveTab] = useState(pathname);
  const [loading, setLoading] = useState(false); // New loading state
  const navigationRouters = [
    {
      href: "/dashboard",
      icon: "/images/dash.png",
      text: "Dashboard",
    },
    {
      href: "/dashboard/appointments",
      icon: "/images/cal.png",
      text: "Appointments",
    },
    {
      href: "/dashboard/technicians",
      icon: "/images/dash.png",
      text: "Technicians",
    },
    {
      href: "/dashboard/services",
      icon: "/images/serv.png",
      text: "Services",
    },
    {
      href: "/dashboard/accountsettings",
      icon: "/images/act.png",
      text: "Account Settings",
    }
  ];
  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

  const handleTabClick = (tab) => {
    setLoading(true); // Start loading
    setActiveTab(tab);
    router.push(tab); // Navigate to the selected tab
  };

  const handleHover = (href) => {
    router.prefetch(href); // Prefetch on hover
  };

  return (
    <div className="sidebar_container">
      <div className="d-flex align-items-center justify-content-center">
        <Image src="/images/logo.png" alt="Logo" width={134} height={162} />
      </div>
      <div>
        <ul>
          {navigationRouters.map((item, index) => (
            <li
              key={index}
              className={activeTab === item?.href ? "active" : ""}
              onClick={() => handleTabClick(item?.href)} // Trigger navigation and loading
              onMouseEnter={() => handleHover(item?.href)} // Prefetch on hover
            >
              <Link href={item?.href}>
                <span>
                  <Image
                    src={item.icon}
                    alt={`${item.text} Icon`}
                    width={18}
                    height={18}
                  />
                </span>
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
        <div className="sc2_sid">
          <Link href="">
            <span>
              <Image
                src="/images/logout.png"
                alt="icon"
                width={24}
                height={24}
              />
            </span>
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
