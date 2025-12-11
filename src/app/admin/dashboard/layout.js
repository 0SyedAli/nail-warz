"use client";

import { Suspense } from "react";
import DashboardLayout from "@/components/DashboardLayout"; // adjust path if your AuthLayout is not in components
import BallsLoading from "@/components/Spinner/BallsLoading";

export default function DashboardLayoutWrapper({ children }) {
  return (
    <Suspense fallback={
    <div style={{height:"100vh", width:"100%", display:"flex", alignItems:"center",justifyContent:"center"}}>
      <BallsLoading />
    </div>
    }>
      <DashboardLayout>{children}</DashboardLayout>
    </Suspense>
  );
}