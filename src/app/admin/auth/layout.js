"use client";

import { Suspense } from "react";
import AuthLayout from "@/components/AuthLayout"; // adjust path if your AuthLayout is not in components

export default function AuthLayoutWrapper({ children }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthLayout>{children}</AuthLayout>
    </Suspense>
  );
}