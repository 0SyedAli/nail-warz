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
import Cookies from "js-cookie";
import api from "@/lib/axios";
import AuthRedirectHandler from "@/utils/AuthHandler";
import BallsLoading from "@/components/Spinner/BallsLoading";

// ✅ Validation schema using Yup
const schema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Min 6 characters").required("Password is required"),
});

export default function UserLoginPage() {
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
        setSuccess(false);
        setLoading(true);
        try {
            // Using user login endpoint
            const res = await api.post("/loginWitheEmailAndPassword", data);
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

            Cookies.set("role", "user", {
                expires: 7,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict",
            });

            showSuccessToast(result?.message || "Login Successful");
            setSuccess(true);
            router.push("/"); // Directing to home page for users
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
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
        });

        window.google.accounts.id.renderButton(
            document.getElementById("googleSignInDiv"),
            { theme: "outline", size: "large", width: 330 }
        );
    };

    const handleGoogleResponse = async (response) => {
        try {
            // Decode Google JWT credential to get email and name
            const payload = JSON.parse(atob(response.credential.split(".")[1]));
            const email = payload.email;
            const username = payload.name || "GoogleUser";

            if (!email) throw new Error("Unable to get email from Google");

            const payloadData = {
                email: email,
                username: username,
                FCMToken: "FCMToken", // Sending a placeholder per the prompt's data structure
                deviceType: "desktop" // Hardcoded to match requirements
            };

            // Using user Google signup endpoint
            const res = await api.post("/signUpOrLoginWithGoogle", payloadData);
            const result = res.data;

            if (!result?.success) throw new Error(result?.message || "Google signup failed");

            // Save token and user data
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

            Cookies.set("role", "user", {
                expires: 7,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict",
            });

            showSuccessToast("Signed in with Google successfully!");
            router.push("/"); // Navigate to user home
        } catch (error) {
            showErrorToast(error.message || "Google Sign-in error");
        }
    };

    return (
        <>
            {/* <AuthRedirectHandler /> */}
            {success ? <BallsLoading borderWidth="mx-auto" /> : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* <div className="d-flex align-items-center justify-content-center mb-3">
                        <Image
                            src="/images/logo.png"
                            width={120}
                            height={150}
                            alt="Logo"
                            className="logo-img"
                        />
                    </div> */}
                    <h2 className="text-center mb-2 fw-bold">Login</h2>
                    <p className="text-center mb-4">
                        Please enter your details to login
                    </p>
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
                        location_btn="mt-3"
                        disabled={loading}
                    />

                    {/* Google Signup/Login Button */}
                    <div id="googleSignInDiv" className="mt-3 text-center d-flex justify-content-center"></div>

                    <div className="register_link d-flex align-items-center justify-content-between">
                        <h5 style={{ fontSize: "15px" }}>
                            {"Don't have an account? "}
                            <Link href="/user-auth/signup" style={{ fontSize: "15px" }}>Sign Up</Link>
                        </h5>
                        <h5 style={{ fontSize: "15px" }}>
                            <Link href="/user-auth/forgot" style={{ fontSize: "15px" }}>Forgot password?</Link>
                        </h5>
                    </div>
                </form>
            )}
        </>
    );
}
