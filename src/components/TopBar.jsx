"use client";
import Link from "next/link";
import NotificationModal from "./notificationModalCont/NotificationModal";
import Image from "next/image";

const TopBar = ({header}) => {
  return (
    <>
      <div className="topbar_container">
        <div>
          <h1>
            {header}
          </h1>
        </div>
        <div className="tc_profile">
          <div>
            <h4>Name Surname</h4>
            <h5>Manager</h5>
          </div>
          <Image
            src="/images/avatar.png"
            width={50}
            height={50}
            alt=""
          />
        </div>
      </div>
      <NotificationModal />
    </>
  );
};

export default TopBar;
