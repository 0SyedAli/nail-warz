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
import Cookies from "js-cookie"; // ✅ Import js-cookie
import api from "@/lib/axios";
import BallsLoading from "@/components/Spinner/BallsLoading";
// ✅ Validation schema using Yup
const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Min 6 characters").required("Password is required"),
});

export default function LoginPage() {
  const [show, setShow] = useState(false);
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
    setSuccess(false)
    setLoading(true);
    try {
      const res = await api.post("/loginAdmin", data);

      const result = res.data;

      if (!result?.success) {
        throw new Error(result?.message || "Login failed");
      }

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

      showSuccessToast(result?.message || "Login Successful")
      // Success
      if (result?.data?.isUpdated === true) {
        router.push("/admin/dashboard");
        setSuccess(true)

      }
      else {
        router.push("/admin/auth/bussinessprofile");
      }
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Login error";
      showErrorToast(message);
    } finally {
      setLoading(false);
    }
  };
  // ✅ GOOGLE Signup/Login
  useEffect(() => {
    // load Google Identity SDK
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = initializeGoogleSignIn;
    document.body.appendChild(script);
  }, []);

  const initializeGoogleSignIn = () => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID, // ✅ Set in .env.local
      callback: handleGoogleResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleSignInDiv"),
      { theme: "outline", size: "large", width: 330 }
    );
  };

  const handleGoogleResponse = async (response) => {
    try {
      // Decode Google JWT credential to get email
      const payload = JSON.parse(atob(response.credential.split(".")[1]));
      const email = payload.email;

      if (!email) throw new Error("Unable to get email from Google");

      // API call
      const res = await api.post("/salonSignUpOrLoginWithGoogle", { email });
      const result = res.data;

      if (!result?.success) throw new Error(result?.message || "Google signup failed");

      // ✅ Save token and user data
      sessionStorage.setItem("token", result?.token);
      Cookies.set("token", result?.token, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });
      Cookies.set("user", JSON.stringify(result?.data), {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      showSuccessToast("Signed in with Google successfully!");

      // ✅ Redirect based on isUpdated
      if (result?.data?.isUpdated === true) {
        router.push("/dashboard");
      } else {
        router.push("/auth/bussinessprofile");
      }
    } catch (error) {
      showErrorToast(error.message || "Google Sign-in error");
    }
  };

  return (
    <>
      {success ? <BallsLoading borderWidth="mx-auto" /> : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="d-flex align-items-center justify-content-center mb-3">
            <Image
              src="/images/logo.png"
              width={120}
              height={150}
              alt="Logo"
              className="logo-img"
            />
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
          <AuthBtn
            title={"Login"}
            type="submit"
            disabled={loading}
          />
          {/* ✅ Google Signup/Login Button */}
          <div id="googleSignInDiv" className="mt-3 text-center"></div>
          <div className="register_link d-flex align-items-center justify-content-between">
            <h5 style={{ fontSize: "15px" }}>
              {"Don't have an account? "}
              <Link href="signup" style={{ fontSize: "15px" }}>Sign Up</Link>
            </h5>
            <h5 style={{ fontSize: "15px" }}><a href="forgot" style={{ fontSize: "15px" }}>Forgot password?</a></h5>
          </div>
        </form>
      )}
    </>
  );
}
