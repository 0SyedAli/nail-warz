"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import InputField from "@/components/Form/InputField";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { showErrorToast, showSuccessToast } from "src/lib/toast";
import Link from "next/link";
import api from "@/lib/axios";
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";
import Cookies from "js-cookie";
import BallsLoading from "@/components/Spinner/BallsLoading";
// ✅ Validation schema
const schema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  // ✅ Ensure email exists
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("resetEmail");
    if (!storedEmail) {
      router.push("/auth/forgot");
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

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
      const res = await api.post("/setNewPassword", {
        email,
        newPassword: data.password,
      });

      const result = res.data;
      if (!result?.success) {
        throw new Error(result?.message || "Failed to reset password");
      }

      showSuccessToast(result?.message || "Password reset successfully");

      // ✅ Clear stored email
      sessionStorage.clear()
      Cookies.remove()

      // ✅ Redirect to login
      router.push("/auth/login");
      setSuccess(true);
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Error resetting password";
      showErrorToast(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {success ?
        <BallsLoading borderWidth="mx-auto" />
        : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="d-flex align-items-center justify-content-center mb-3">
              <Image src="/images/logo.png" width={120} height={150} alt="Logo" />
            </div>

            <h3 className="text-center mb-3">Reset Password</h3>
            <label htmlFor="password">New Password</label>
            <InputField
              id="password"
              type="password"   // ✅ always keep "password"
              classInput="classInput"
              placeholder="Enter password"
              show={show}       // ✅ InputField already switches icon
              handleClick={() => setShow(!show)}
              {...register("password")}
            />
            {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}

            <label htmlFor="confirmPassword">Confirm Password</label>
            <InputField
              id="confirmPassword"
              type="password"   // ✅ always keep "password"
              classInput="classInput"
              placeholder="Confirm password"
              show={show1}
              handleClick={() => setShow1(!show1)}
              {...register("confirmPassword")}  // ✅ correct name here
            />
            {errors.confirmPassword && <p style={{ color: "red" }}>{errors.confirmPassword.message}</p>}

            <AuthBtn title={"Reset Password"} type="submit" disabled={loading} />

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