"use client";
import Image from "next/image";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const TopBar = ({ header }) => {
  const router = useRouter();
  const [salonName, setSalonName] = useState();
  const [location, setLocation] = useState();
  useEffect(() => {
    const cookie = Cookies.get("user");
    if (!cookie) return router.push("/auth/login");
    try {
      const u = JSON.parse(cookie);
      if (u?.salonName) setSalonName(u?.salonName);
      if (u?.location?.locationName) setLocation(u?.location?.locationName);
      else router.push("/auth/login");
    } catch {
      router.push("/auth/login");
    }
  }, []);


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
            <h4>{salonName || ""}</h4>
            <h5>{location || ""}</h5>
          </div>
          <Image
            src="/images/avatar.png"
            width={50}
            height={50}
            alt=""
          />
        </div>
      </div>
    </>
  );
};

export default TopBar;
