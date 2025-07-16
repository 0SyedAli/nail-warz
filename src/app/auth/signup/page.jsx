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
import Cookies from "js-cookie"; // ✅ Import js-cookie
import api from "../../../lib/axios";
import Link from "next/link";
// ✅ Yup validation schema
const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Min 6 characters").required("Password is required"),
});

export default function LoginPage() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post("/signUpAdmin", data);
      const result = res.data; // Axios auto-parses response

      if (!result?.success) {
        throw new Error(result?.message || "Signup failed");
      }

      // ✅ Save token and user data in cookies
      Cookies.set("token", result.token, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      Cookies.set("user", JSON.stringify(result.data), {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      showSuccessToast(result?.message || "Signup Successful");

      // ✅ Redirect to business profile
      router.push("/auth/bussinessprofile");
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Signup error";
      showErrorToast(message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="d-flex align-items-center justify-content-center mb-3">
        <Image src="/images/logo.png" width={120} height={150} alt="Logo" />
      </div>

      <label htmlFor="email">Enter your email</label>
      <InputField
        id="email"
        type="email"
        classInput="classInput"
        placeholder="you@example.com"
        {...register("email")}
      />
      {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}

      <label htmlFor="password">Enter your password</label>
      <InputField
        id="password"
        type={show ? "text" : "password"}
        classInput="classInput"
        placeholder="Enter password"
        show={show}
        handleClick={() => setShow(!show)}
        {...register("password")}
      />
      {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}

      <AuthBtn title={"Signup"} type="submit" disabled={loading} />
      <div className="register_link">
        <h5>
          {"Already have an account? "}
          <Link href="login">Login</Link>
        </h5>
      </div>
    </form>
  );
}
