"use client";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import InputField from "@/components/Form/InputField";
import MapDummy from "@/components/MapDummy";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

export default function AddLocation() {
  const [location, setLocation] = useState(false);

  const router = useRouter();

  const handleLogin = () => {
    router.push("/auth/locationdetails");
  };
  return (
    <form>
      {!location ? (
        <button
          type="button"
          className="locationBtn"
          onClick={() => {
            setLocation(true);
          }}
        >
          <span>
            <FaPlus />
          </span>
          Add Location
        </button>
      ) : (
        <>
          <InputField placeholder="Search" classInput="classInput" />
          <MapDummy />
          <div className="mt-4">
            <AuthBtn title="Confirm" type="button" onClick={handleLogin} />
          </div>
        </>
      )}
    </form>
  );
}
