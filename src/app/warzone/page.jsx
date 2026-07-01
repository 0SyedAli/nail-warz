"use client";

import { useEffect, useState } from "react";

const Warzone = () => {
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
        <div className="container">
            <div className="privacy-body privacy-body-mobile">
                {loading ? (
                    <p>Loading....</p>
                ) : (
                    <div
                        dangerouslySetInnerHTML={{ __html: warzone }}
                        style={{ fontFamily: "inherit", lineHeight: "1.6" }}
                    />
                )}
            </div>
        </div>
    );
};

export default Warzone;