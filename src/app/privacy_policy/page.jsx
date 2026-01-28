"use client"
import { useEffect, useState } from "react";
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";

const PrivacyPolicy = () => {
    const [privacyPolicy, setPrivacyPolicy] = useState(null);

    // Fetch cookie policy data from the API
    useEffect(() => {
        fetch("https://apiforapp.link/NailWarz/api/privacyPolicy")
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
            <div className="container  my-2">
                <div className="privacy-body privacy-body-mobile">
                    {/* Render the fetched HTML content */}
                    {privacyPolicy ? (
                        <div dangerouslySetInnerHTML={{ __html: privacyPolicy }} />
                    ) : (
                        <p>Loading....</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default PrivacyPolicy;