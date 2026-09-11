"use client"
import { useEffect, useState } from "react";
import AppCTASection from "@/components/Home/AppCTASection";
import Footer from "@/components/Home/Footer";
import Header from "@/components/Home/Header";
import WebBanner from "@/components/Home/WebBanner";
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";

const WarzoneRules = () => {
    const [warzone, setWarzone] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/warzone-rules.html")
            .then((res) => {
                if (!res.ok) {
                    throw new Error("warzone-rules.html not found");
                }
                return res.text();
            })
            .then((html) => {
                setWarzone(html);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error loading warzone-rules.html:", error);
                setWarzone("<p>Failed to load warzone rules.</p>");
                setLoading(false);
            });
    }, []);

    return (
        <>
            <Header />
            <WebBanner bannerTitle="Warzone Rules" />
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
                            dangerouslySetInnerHTML={{ __html: warzone }}
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

export default WarzoneRules;
