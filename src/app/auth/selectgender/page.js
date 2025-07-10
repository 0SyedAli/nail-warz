"use client";
import { useState } from "react";
import InputField from "@/components/Form/InputField";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import { useRouter } from "next/navigation";
import Textarea from "@/components/Form/TextArea";
const emailImage = "/images/email.png";
const mailGen = "/images/profile.png";
const femaleGen = "/images/profile.png";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/auth/addlocation");
  };

  return (
    <form>
      <fieldset>
        <div>
          <div className="gender_container d-flex justify-content-center gap-3 align-items-center mb-5">
            <div className="text-center">
              <label className="select_gender">
                <input type="radio"  defaultChecked id="radio201" name="gender1" />
                <div className="gender_btn">
                  <img src={mailGen} alt="gender icon" />
                </div>
                Male
              </label>
            </div>
            <div className="text-center">
              <label className="select_gender">
                <input type="radio"  id="radio202" name="gender1" />
                <div className="gender_btn">
                  <img src={mailGen} alt="gender icon" />
                </div>
                Female
              </label>
            </div>
          </div>
          {/* <input type="radio" /> */}
        </div>
        <label htmlFor="email">Phone Number:</label>
        <InputField
          type="tel"
          id="phone"
          placeholder="(0) 123 456 789"
          classInput="classInput"
        />
        <Textarea title="Bio" />
        <AuthBtn title="Next" type="button" onClick={handleLogin} />
      </fieldset>
    </form>
  );
}
