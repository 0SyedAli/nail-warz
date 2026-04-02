"use client";

import { Suspense } from "react";
import DashboardLayout from "@/components/DashboardLayoutAdmin"; // adjust path if your AuthLayout is not in components
import BallsLoading from "@/components/Spinner/BallsLoading";
// import AuthRedirectHandler from "@/utils/AuthHandler";

export default function DashboardLayoutWrapper({ children }) {
  return (
    <Suspense fallback={
      <div style={{ height: "100vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <BallsLoading />
      </div>
    }>
      {/* <AuthRedirectHandler /> */}
      <DashboardLayout>{children}</DashboardLayout>
    </Suspense>
  );
}