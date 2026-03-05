"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginModal({ show, onClose }) {
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    if (!show) return null;

    return (
        <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
            tabIndex="-1"
            aria-labelledby="loginModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header border-0">
                        <h5 className="modal-title" id="loginModalLabel">
                            Authentication Required
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body text-center py-4">
                        <p className="mb-4">
                            You must be logged in to add items to your cart.
                        </p>
                        <div className="d-flex justify-content-center gap-3">
                            <button className="btn btn-secondary px-4" onClick={onClose}>
                                Cancel
                            </button>
                            <button onClick={() => {
                                onClose();
                                router.push("/user-auth/login")
                            }} className="btn btn-danger px-4">
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
