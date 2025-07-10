"use client";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import { useRouter } from "next/navigation";
import { HStack, PinInput, PinInputField } from "@chakra-ui/react";

export default function Otp() {
  const router = useRouter(); // Initialize router for navigation

  const handleLogin = () => {
    router.push("/auth/reset"); // Navigate to OTP page on click
  };

  return (
    <form>
      <HStack className="pinCode mb-5">
        <PinInput placeholder="">
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
        </PinInput>
      </HStack>
      <AuthBtn title="Next" type="button" onClick={handleLogin} />
      <div className="resend_code">
        <p>Code didn't receive?</p>
        <h5>Resend Code</h5>
      </div>
    </form>
  );
}
