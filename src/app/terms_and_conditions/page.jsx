"use client";

import { useEffect, useState } from "react";

const TermsCondition = () => {
    const [termsCondition, setTermsCondition] = useState("");
    const [loading, setLoading] = useState(true);

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
        <div className="container">
            <div className="privacy-body privacy-body-mobile">
                {loading ? (
                    <p>Loading....</p>
                ) : (
                    <div
                        dangerouslySetInnerHTML={{ __html: termsCondition }}
                        style={{ fontFamily: "inherit", lineHeight: "1.6" }}
                    />
                )}
            </div>
        </div>
    );
};

export default TermsCondition;