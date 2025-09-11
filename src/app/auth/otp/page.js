"use client";
import OtpInput from "react-otp-input";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { showErrorToast, showSuccessToast } from "src/lib/toast";
import api from "../../../lib/axios";
import BallsLoading from "@/components/Spinner/BallsLoading";
import Cookies from "js-cookie"; // ✅ Import js-cookie
export default function VerifyOtpPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [flow, setFlow] = useState(null); // "signup" or "forgot"
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // ✅ Detect flow (signup or forgot)
  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    const storedEmail = sessionStorage.getItem("email");

    if (storedToken) {
      setToken(storedToken);
      setFlow("signup");
    } else if (storedEmail) {
      setEmail(storedEmail);
      setFlow("forgot");
    } else {
      router.push("/auth/login"); // no context → go back
    }
  }, [router]);

  const handleChange = (otp) => {
    if (/^\d*$/.test(otp)) {
      setCode(otp);
    }
  };

  const verifyOTP = async () => {
    setIsLoading(true);
    setError("");

    try {
      let payload = {};
      let endpoint = "";

      if (flow === "signup") {
        endpoint = "/verifyOtp";
        payload = { token, Otp: code };
      } else if (flow === "forgot") {
        endpoint = "/verifyOtp";
        payload = { email, Otp: code };
      }

      const res = await api.post(endpoint, payload);

      if (!res?.data?.success) {
        throw new Error(res?.data?.message || "Invalid OTP");
      }

      showSuccessToast(res?.data?.message || "OTP verified successfully!");
      setSuccess(true);

      if (flow === "forgot") {
        sessionStorage.setItem("resetEmail", email);
        router.push("/auth/reset");
      } else {
        sessionStorage.clear();

        // ✅ Save token and user data in cookies
        Cookies.set("token", res?.data?.token, {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
        });

        Cookies.set("user", JSON.stringify(res?.data?.data), {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
        });
        router.push("/auth/bussinessprofile");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        "OTP verification failed";
      showErrorToast(msg);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.length === 4) {
      verifyOTP();
    } else {
      setError("Please enter a valid 4-digit OTP.");
    }
  };

  if (!flow) return null; // wait until flow detected

  return (
    <>
      {success ? (
        <BallsLoading borderWidth="mx-auto" />
      ) : (
        <form className="auth_otp" onSubmit={handleSubmit}>
          <h3 className="text-center mb-3">Verify OTP</h3>
          <p className="text-center mb-4">
            Please enter the 4-digit code sent to your email
          </p>

          <OtpInput
            value={code}
            onChange={handleChange}
            numInputs={4}
            shouldAutoFocus
            isInputNum
            separator={<span style={{ width: "8px" }}></span>}
            renderInput={(props) => (
              <input
                {...props}
                onKeyDown={(e) => {
                  if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
                    e.preventDefault();
                  }
                }}
              />
            )}
            inputStyle={{
              border: "1px solid #7843AA",
              borderRadius: "8px",
              width: "64px",
              height: "64px",
              fontSize: "25px",
              textAlign: "center",
              color: "#000000bd",
            }}
            focusStyle={{
              border: "1px solid #CFD3DB",
              outline: "none",
            }}
          />

          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

          <AuthBtn title="Verify OTP" type="submit" disabled={isLoading} />

          <div className="resend_code text-center mt-3">
            <p>{`Didn't receive the code?`}</p>
            <h5
              style={{ cursor: "pointer", color: "#7843AA" }}
              onClick={() => {
                if (flow === "signup") {
                  router.push("/auth/signup");
                } else {
                  router.push("/auth/forgot");
                }
              }}
            >
              Resend Code
            </h5>
          </div>
        </form>
      )}
    </>
  );
}
