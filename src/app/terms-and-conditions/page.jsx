"use client"
import { useEffect, useState } from "react";
import AppCTASection from "@/components/Home/AppCTASection";
import Footer from "@/components/Home/Footer";
import Header from "@/components/Home/Header";
import WebBanner from "@/components/Home/WebBanner";
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";

const TermsCondition = () => {
    const [termsCondition, setTermsCondition] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch cookie policy data from the API
    useEffect(() => {
        fetch("/terms.html")
            .then((res) => {
                if (!res.ok) {
                    throw new Error("terms.html not found");
                }
                return res.text();
            })
            .then((html) => {
                setTermsCondition(html);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error loading terms.html:", error);
                setTermsCondition("<p>Failed to load terms and conditions.</p>");
                setLoading(false);
            });
    }, []);

    return (
        <>
            <Header />
            <WebBanner bannerTitle="Terms & Condition" />
            <div className="container my-5">
                <div className="privacy-body">
                    {/* Render the fetched HTML content */}
                    {/* {termsCondition ? (
                        <div dangerouslySetInnerHTML={{ __html: termsCondition }} />
                    ) : (
                        <SpinnerLoading />
                    )} */}
                    {loading ? (
                        <SpinnerLoading />
                    ) : (
                        <div
                            dangerouslySetInnerHTML={{ __html: termsCondition }}
                            style={{ fontFamily: "inherit", lineHeight: "1.6" }}
                        />
                    )}
                </div>
            </div>
            <AppCTASection />
            <Footer />
        </>
    );
};

export default TermsCondition;
