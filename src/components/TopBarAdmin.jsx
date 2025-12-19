"use client";
import Image from "next/image";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const TopBar = ({ header }) => {
  const router = useRouter();

  const [salonId, setSalonId] = useState(null);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState("");

  // STEP 1: get cookie only once
  useEffect(() => {
    const cookie = Cookies.get("user");
    const token = Cookies.get("token");

    if (!cookie || !token) return router.push("/admin/auth/login");

    try {
      const u = JSON.parse(cookie);

      // if (!u?._id) return router.push("/auth/login");

      setSalonId(u._id);
      setToken(token);  // <-- correct
      setEmail(u.email || "");
    } catch (e) {
      // router.push("/auth/login");
    }
  }, []);



  return (
    <div className="topbar_container">
      <div>
        <h1>{header}</h1>
      </div>
      <div className="tc_profile">

        <div>
          <h4>{email || ""}</h4>
        </div>
       
      </div>

    </div>
  );
};

export default TopBar;
