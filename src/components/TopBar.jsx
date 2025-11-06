"use client";
import Image from "next/image";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const TopBar = ({ header }) => {
  const router = useRouter();

  const [salonId, setSalonId] = useState(null);
  const [token, setToken] = useState(null);

  const [salonName, setSalonName] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");

  // STEP 1: get cookie only once
  useEffect(() => {
    const cookie = Cookies.get("user");
    const token = Cookies.get("token");

    if (!cookie || !token) return router.push("/auth/login");

    try {
      const u = JSON.parse(cookie);

      if (!u?._id) return router.push("/auth/login");

      setSalonId(u._id);
      setToken(token);  // <-- correct

    } catch (e) {
      router.push("/auth/login");
    }
  }, []);


  // STEP 2: call API only after salonId & token exist
  useEffect(() => {
    if (!salonId || !token) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/getAdminById?salonId=${salonId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const json = await res.json();

        if (!json.success) return router.push("/auth/login");

        setSalonName(json.data.salonName || "");
        setLocation(json.data.location?.locationName || json.data.locationName || "");
        setImage(json.data.image?.[0] || "");
      } catch {
        router.push("/auth/login");
      }
    };

    fetchData();
  }, [salonId, token]); // <-- will run only when both available


  return (
    <div className="topbar_container">
      <div>
        <h1>{header}</h1>
      </div>
      <div className="tc_profile">
        <div>
          <h4>{salonName}</h4>
          <h5>{location}</h5>
        </div>
        <Image
          src={image ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${image}` : "/images/avatar.png"}
          width={50}
          height={50}
          style={{ borderRadius: "100%", minWidth: "50px", minHeight: "50px" }}
          alt=""
        />
      </div>
    </div>
  );
};

export default TopBar;
