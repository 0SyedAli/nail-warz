"use client";
import { useState } from "react";
import InputField from "@/components/Form/InputField";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import { useRouter } from "next/navigation";
import UploadPhoto from "@/components/UploadPhoto";
const profleImg = "/images/profile.png";

export default function LoginPage() {
  const router = useRouter();
  const handleLogin = () => {
    router.push("/auth/selectgender");
  };

  return (
    <form>
      <fieldset>
        <UploadPhoto />
        <label htmlFor="email">Full Name</label>
        <InputField type="email" id="email" imageSrc={profleImg} />
        <div className="inputField">
          <label htmlFor="password">Date of birth</label>
          <div className="date_picker py-2 d-flex align-items-center justify-content-between">
            <input type="number" placeholder="dd" />
            <input type="number" placeholder="mm" />
            <input type="number" placeholder="yy" />
          </div>
        </div>
        <AuthBtn title="Next" type="button" onClick={handleLogin} />
      </fieldset>
    </form>
  );
}
