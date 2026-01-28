"use client"
import { useEffect, useState } from "react";
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";

const Cookies = () => {
    const [cookiePolicy, setCookiePolicy] = useState(null);

    // Fetch cookie policy data from the API
    useEffect(() => {
        fetch("https://apiforapp.link/NailWarz/api/cookiePolicy")
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setCookiePolicy(data.html); // Set the HTML content from the API
                } else {
                    console.error("Failed to fetch cookie policy");
                }
            })
            .catch(error => console.error("Error fetching cookie policy:", error));
    }, []);

    return (
        <>
            {/* <Header /> */}
            {/* <WebBanner bannerTitle="Cookie Policy" /> */}
            <div className="container">
                <div className="privacy-body privacy-body-mobile ">
                    {/* Render the fetched HTML content */}
                    {cookiePolicy ? (
                        <div dangerouslySetInnerHTML={{ __html: cookiePolicy }} />
                    ) : (
                        <p>Loading....</p>
                    )}
                </div>
            </div>
            {/* <AppCTASection />
            <Footer /> */}
        </>
    );
};

export default Cookies;
