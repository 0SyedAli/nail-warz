"use client";
import InputField from "@/components/Form/InputField";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import { useRouter } from "next/navigation"; // Use next/navigation for Next.js 13+

const emailImage = "/images/email.png";

export default function Forget() {
  const router = useRouter(); // Initialize router for navigation

  const handleLogin = () => {
    router.push("/auth/otp"); // Navigate to OTP page on click
  };

  return (
    <form>
      <label htmlFor="email">Email Address</label>
      <InputField type="email" id="email" imageSrc={emailImage} />
      <AuthBtn title="Next" type="button" onClick={handleLogin} />
    </form>
  );
}
