"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export function useSalonId() {
  const router = useRouter();
  const [salonId, setSalonId]   = useState(null);
  const [checked,  setChecked]  = useState(false);   // auth status confirmed

  useEffect(() => {
    const cookie = Cookies.get("user");

    if (!cookie) {
      router.replace("/auth/login");
      return;
    }

    try {
      const user = JSON.parse(cookie);
      if (user?._id) {
        setSalonId(user._id);
      } else {
        router.replace("/auth/login");
      }
    } catch {
      router.replace("/auth/login");
    } finally {
      // mark check complete so component can render
      setChecked(true);
    }
  }, [router]);

  return { salonId, checked };
}