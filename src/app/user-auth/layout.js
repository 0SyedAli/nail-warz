"use client";

import { Suspense } from "react";
import AuthLayout from "@/components/AuthLayout";

export default function AuthLayoutWrapper({ children }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthLayout>{children}</AuthLayout>
        </Suspense>
    );
}
