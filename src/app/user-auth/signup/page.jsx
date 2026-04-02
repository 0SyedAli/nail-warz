"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import InputField from "@/components/Form/InputField";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { showErrorToast, showSuccessToast } from "src/lib/toast";
import Cookies from "js-cookie";
import api from "@/lib/axios";
import Link from "next/link";
// import AuthRedirectHandler from "@/utils/AuthHandler";
import BallsLoading from "@/components/Spinner/BallsLoading";

// ✅ Yup schema
const schema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    password: Yup.string().min(8, "Min 8 characters").required("Password is required"),
});

export default function UserSignupPage() {
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

    // ✅ Handle normal signup
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // User Signup Endpoint Payload
            const payload = {
                ...data,
                deviceType: "desktop", // Hardcoded per requirements
                phone: Number(data.phone) // Ensure it's passed as a number if needed
            };

            const res = await api.post("/SignupWithEmailOrPhoneandPassword", payload);
            const result = res.data;

            if (!result?.success) throw new Error(result?.message || "Signup failed");

            sessionStorage.setItem("token", result?.token);
            setSuccess(true);
            showSuccessToast(result?.message || "Signup Successful");

            // Navigate to user OTP page
            router.push("/user-auth/otp");
        } catch (err) {
            const message = err?.response?.data?.message || err.message || "Signup error";
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
            // Decode Google JWT credential
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

            const res = await api.post("/signUpOrLoginWithGoogle", payloadData);
            const result = res.data;

            if (!result?.success) throw new Error(result?.message || "Google signup failed");

            // Save tokens
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
            router.push("/"); // Direct to user homepage 
        } catch (error) {
            showErrorToast(error.message || "Google Sign-in error");
        }
    };

    return (
        <>
            {/* <AuthRedirectHandler /> */}
            {success ? (
                <BallsLoading borderWidth="mx-auto" />
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* <div className="d-flex align-items-center justify-content-center mb-3">
                        <Image src="/images/logo.png" width={120} height={150} alt="Logo" />
                    </div> */}
                    <h2 className="text-center mb-2 fw-bold">Signup</h2>
                    <p className="text-center mb-4">
                        Please enter your details to signup
                    </p>
                    <label htmlFor="username">Enter your Username</label>
                    <InputField
                        id="username"
                        type="text"
                        placeholder="Username"
                        {...register("username")}
                    />
                    {errors.username && <p style={{ color: "red" }}>{errors.username.message}</p>}

                    <label htmlFor="email">Enter your Email</label>
                    <InputField
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        {...register("email")}
                    />
                    {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}

                    <label htmlFor="phone">Enter your Phone Number</label>
                    <InputField
                        id="phone"
                        type="number"
                        placeholder="e.g. 12404313894"
                        {...register("phone")}
                    />
                    {errors.phone && <p style={{ color: "red" }}>{errors.phone.message}</p>}

                    <label htmlFor="password">Enter your Password</label>
                    <InputField
                        id="password"
                        type={show ? "text" : "password"}
                        placeholder="Enter password"
                        show={show}
                        handleClick={() => setShow(!show)}
                        {...register("password")}
                    />
                    {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}

                    <AuthBtn title={"Signup"} location_btn="mt-3" type="submit" disabled={loading} />

                    {/* ✅ Google Signup/Login Button */}
                    <div id="googleSignInDiv" className="mt-3 text-center d-flex justify-content-center"></div>

                    <div className="register_link text-center mt-3">
                        <h5 style={{ fontSize: "15px" }}>
                            Already have an account? <Link href="/user-auth/login">Login</Link>
                        </h5>
                    </div>
                </form>
            )}
        </>
    );
}
