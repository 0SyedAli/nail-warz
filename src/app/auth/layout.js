"use client";
import { useEffect, useState } from "react";
import "../../styles/auth.module.css";
import styles from "../../styles/auth.module.css";
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function AuthLayout({ children }) {
  const pathname = usePathname() 
  const searchParams = useSearchParams()
  const [header, setHeader] = useState();
  const content = {
    login: {
      title: "Login",
      description: "Enter your account details to login",
    },
    forget: {
      title: "Forgot password",
      description: "Please enter your email to reset password",
    },
    otp: {
      title: "OTP",
      description:
        "We have sent you an email containing 6 verification code. Please enter the code to verify your identity",
    },
    reset: {
      title: "Reset Password",
      description: "Please enter your new password to reset password",
    },
    createprofile: {
      title: "Create Profile",
      description: "Enter your details to register yourself",
    },
    locationdetails: {
      title: "",
      description: "",
    },
    createbussinessprofile: {
      title: "Create A Business Profile",
      description: "Enter your details to register yourself",
    },
    createbussinessprofile2: {
      title: "Create A Business Profile",
      description: "Enter your details to register yourself",
    },
    createbussinessprofile3: {
      title: "Create A Business Profile",
      description: "Enter your details to register yourself",
    },
    selectgender: {
      title: "select Gender",
    },
    addlocation: {
      title: "Add Location",
      description: "Enter your details to register yourself",
    },
  };

  useEffect(() => {
    const key = window.location.href.split("/").pop();
    setHeader(content[key]);
  }, [pathname, searchParams]);
  return (
    <div className={styles.auth_container}>
      <div className={styles.auth_image}></div>
      <div className={styles.auth_form_container}>
        <div className={styles.auth_form}>
          {/* {!header ? <SpinnerLoading /> : children} */}
          {children}
        </div>
      </div>
    </div>
  );
}
