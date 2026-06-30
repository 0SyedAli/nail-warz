"use client"
import { useEffect, useState } from "react";
import AppCTASection from "@/components/Home/AppCTASection";
import Footer from "@/components/Home/Footer";
import Header from "@/components/Home/Header";
import WebBanner from "@/components/Home/WebBanner";
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";

const PrivacyPolicy = () => {
    const [privacyPolicy, setPrivacyPolicy] = useState(null);

    // Fetch cookie policy data from the API
    useEffect(() => {
        fetch("https://nailwarz.apiforapp.link/api/privacyPolicy")
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setPrivacyPolicy(data.html); // Set the HTML content from the API
                } else {
                    console.error("Failed to fetch cookie policy");
                }
            })
            .catch(error => console.error("Error fetching cookie policy:", error));
    }, []);

    return (
        <>
            <Header />
            <WebBanner bannerTitle="Privacy policy" />
            <div className="container my-5">
                <div className="privacy-body">
                    {/* Render the fetched HTML content */}
                    {privacyPolicy ? (
                        <div dangerouslySetInnerHTML={{ __html: privacyPolicy }} />
                    ) : (
                        <SpinnerLoading />
                    )}
                </div>
            </div>
            <AppCTASection />
            <Footer />
        </>
    );
};

export default PrivacyPolicy;
