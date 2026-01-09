"use client";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";

export default function LogoutButton({path}) {
  const router = useRouter();

  const handleLogout = () => {
    // Clear all cookies
    Object.keys(Cookies.get()).forEach((cookieName) => {
      Cookies.remove(cookieName);
    });

    // Optional: clear localStorage/sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Redirect to login
    router.push(`${path}`);
  };

  return (
    <button className="logout_btn" onClick={handleLogout}>
      <span>
        <Image
          src="/images/logout.png"
          alt="icon"
          width={18}
          height={18}
        />
      </span>
      Logout
    </button>
  );
}
