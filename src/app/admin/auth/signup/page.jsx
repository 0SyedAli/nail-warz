// "use client";

// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as Yup from "yup";
// import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { showErrorToast, showSuccessToast } from "src/lib/toast";
// import Cookies from "js-cookie";
// import api from "@/lib/axios";
// import Link from "next/link";
// import BallsLoading from "@/components/Spinner/BallsLoading";
// import { FiEye, FiEyeOff } from "react-icons/fi";

// // ✅ Yup schema
// const schema = Yup.object().shape({
//   email: Yup.string().email("Invalid email").required("Email is required"),
//   password: Yup.string().min(6, "Min 6 characters").required("Password is required"),
// });

// export default function SignUp() {
//   const [show, setShow] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const router = useRouter();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//   });

//   const onSubmit = async (data) => {
//     setLoading(true);
//     try {
//       const res = await api.post("/superAdmin/signUp", data);
//       const result = res.data;

//       if (!result?.success) throw new Error(result?.message || "Signup failed");

//       Cookies.set("token", result?.token, {
//         expires: 7,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "Strict",
//       });

//       Cookies.set("user", JSON.stringify(result?.data), {
//         expires: 7,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "Strict",
//       });

//       setSuccess(true);
//       showSuccessToast(result?.message || "Signup Successful");
//       router.push("/admin/dashboard");
//     } catch (err) {
//       showErrorToast(err.message || "Signup error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {success ? (
//         <BallsLoading borderWidth="mx-auto" />
//       ) : (
//         <form className="admin-signup-form" onSubmit={handleSubmit(onSubmit)}>
//           <div className="d-flex align-items-center justify-content-center mb-3">
//             <Image src="/images/logo.png" width={120} height={150} alt="Logo" />
//           </div>

//           {/* EMAIL */}
//           <label htmlFor="email">Enter your email</label>
//           <input
//             id="email"
//             type="email"
//             placeholder="you@example.com"
//             className="form-control mb-2"
//             {...register("email")}
//           />
//           {errors.email && <p className="text-danger">{errors.email.message}</p>}

//           {/* PASSWORD */}
//           <label htmlFor="password">Enter your password</label>
//           <div className="position-relative mb-2">
//             <input
//               id="password"
//               type={show ? "text" : "password"}
//               placeholder="Enter password"
//               className="form-control"
//               {...register("password")}
//             />
//             <span
//               onClick={() => setShow(!show)}
//               className="position-absolute top-50 end-0 translate-middle-y me-3"
//               style={{ cursor: "pointer" }}
//             >
//               {show ? <FiEyeOff /> : <FiEye />}
//             </span>
//           </div>
//           {errors.password && (
//             <p className="text-danger">{errors.password.message}</p>
//           )}

//           <AuthBtn title="Signup" type="submit" disabled={loading} />

//           {/* Google Button */}
//           <div id="googleSignInDiv" className="mt-3 text-center"></div>

//           <div className="register_link mt-3">
//             <h5>
//               Already have an account? <Link href="login">Login</Link>
//             </h5>
//           </div>
//         </form>
//       )}
//     </>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import BallsLoading from "@/components/Spinner/BallsLoading";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import api from "@/lib/axios";

// Schema
const schema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
});

export default function SignUp() {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  if (!mounted) return null; // ✅ prevents hydration mismatch

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post("/superAdmin/signUp", data);
      const result = res.data;

      if (!result?.success) throw new Error(result?.message);

      Cookies.set("token", result.token);
      Cookies.set("user", JSON.stringify(result.data));

      setSuccess(true);
      showSuccessToast("Signup Successful");
      router.push("/admin/dashboard");
    } catch (err) {
      showErrorToast(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return success ? (
    <BallsLoading />
  ) : (
    <form className="admin-signup-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="text-center mb-3">
        <Image src="/images/logo.png" width={120} height={150} alt="Logo" />
      </div>

      <label>Email</label>
      <input {...register("email")} className="form-control mb-2" />
      {errors.email && <p className="text-danger">{errors.email.message}</p>}

      <label>Password</label>
      <div className="position-relative mb-2">
        <input
          type={show ? "text" : "password"}
          {...register("password")}
          className="form-control"
        />
        <span
          onClick={() => setShow(!show)}
          className="position-absolute top-50 end-0 translate-middle-y me-3"
          style={{ cursor: "pointer" }}
        >
          {show ? <FiEyeOff /> : <FiEye />}
        </span>
      </div>
      {errors.password && <p className="text-danger">{errors.password.message}</p>}

      <AuthBtn type="submit" title="Signup" disabled={loading} />

      {/* Google sign-in placeholder */}
      {/* <div id="googleSignInDiv" className="mt-3 text-center" /> */}

      <div className="register_link text-center">
        <h5 style={{ fontSize: "15px" }}>
          Already have an account? <Link href="login">Login</Link>
        </h5>
      </div>
    </form>
  );
}