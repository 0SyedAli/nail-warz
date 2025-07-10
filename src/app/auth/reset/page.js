"use client";
import { useState } from "react";
import InputField from "@/components/Form/InputField";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import Link from "next/link";
import { useRouter } from "next/navigation";
const emailImage = "/images/email.png";
const passImage = "/images/lock.png";

export default function LoginPage() {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const router = useRouter();

  const handleLogin = () => {
    router.push("");
  };

  return (
    <form>
      <label htmlFor="email">Email:</label>
      <InputField type="email" id="email" imageSrc={emailImage} />
      <label htmlFor="password">Password:</label>
      <InputField
        type={show ? "text" : "password"}
        id="password"
        imageSrc={passImage}
        show={show}
        handleClick={handleClick}
      />
      
      <AuthBtn title="Login" type="button" onClick={handleLogin} />{" "}
    </form>
  );
}
