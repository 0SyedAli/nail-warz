"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import InputField from "@/components/Form/InputField";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { showErrorToast, showSuccessToast } from "src/lib/toast";
import Link from "next/link";
import api from "@/lib/axios";
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";
import BallsLoading from "@/components/Spinner/BallsLoading";

// ✅ Validation schema
const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setSuccess(false);
    setLoading(true);
    try {
      const res = await api.post("/forgetPasswordOtp", data);

      const result = res.data;
      if (!result?.success) {
        throw new Error(result?.message || "Failed to send OTP");
      }
      sessionStorage.setItem("email", result?.data?.email );
      showSuccessToast(result?.message || "OTP sent to your email");

      // ✅ Navigate to OTP verification page
      router.push("/auth/otp");
      setSuccess(true);
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Error sending OTP";
      showErrorToast(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {success ? (
        <BallsLoading borderWidth="mx-auto" />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="d-flex align-items-center justify-content-center mb-3">
            <Image src="/images/logo.png" width={120} height={150} alt="Logo" />
          </div>

          <h3 className="text-center mb-3">Forgot Password</h3>

          <label htmlFor="email">Email</label>
          <InputField
            id="email"
            type="email"
            classInput="classInput"
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}

          <AuthBtn title={"Send OTP"} type="submit" disabled={loading} />

          <div className="register_link d-flex align-items-center justify-content-center mt-3">
            <h5 style={{ fontSize: "15px" }}>
              <Link href="/auth/login" style={{ fontSize: "15px" }}>Back to Login</Link>
            </h5>
          </div>
        </form>
      )}
    </>
  );
}
