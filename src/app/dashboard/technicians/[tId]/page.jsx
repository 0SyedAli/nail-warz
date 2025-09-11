"use client";

import { useEffect, useState, use } from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";
import { FaRegClock, FaPhone } from "react-icons/fa6";
import Image from "next/image";
import EditTechnician from "@/components/Modal/EditTechnician";
import { useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function TechnicianPage({ params }) {
    const router = useRouter();
    const { tId } = use(params);
    console.log(tId);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [technicianData, setTechnicianData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const handleContinueClick = () => {
        onOpen(); // Open modal
    };
    // Fetch Technician Data
    useEffect(() => {
        if (!tId) return;

        const fetchTechnician = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getTechnicianById?id=${tId}`, {
                    method: "GET",
                });

                if (!res.ok) throw new Error("Failed to fetch technician details");

                const result = await res.json();
                if (result.success && result.data?.technician) {
                    setTechnicianData(result.data.technician);
                } else {
                    throw new Error("Technician not found");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTechnician();
    }, [tId]);

    if (loading) {
        return (
            <div className=" py-4 text-center">
                <div className="spinner-border text-danger" role="status" />
                <p className="mt-2">Loading technician details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className=" py-4 text-center text-danger">
                <h5>{error}</h5>
            </div>
        );
    }

    if (!technicianData) return null;

    return (
        <>
            <div className="technician_detail py-4 ">
                <div className="card mb-4 border-2">
                    <div className="card-body p-2 py-4 p-sm-4">
                        <div className="d-flex justify-content-around justify-content-lg-between align-items-center flex-wrap gap-2  row-gap-3">
                            <div className="tech_profile d-flex align-items-center">
                                <div className="tech_image">
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${technicianData.image}` || "/images/profile-avatar.jpg"}
                                        alt={technicianData.fullName || "Unknown"}
                                        className="rounded-circle"
                                        width={120}
                                        height={120}
                                    />
                                </div>
                                <div>
                                    <h1 className="h2 fw-bold text-dark mb-1">
                                        {technicianData.fullName || "Unknown"}
                                    </h1>
                                    <p className="text-muted mb-0">{technicianData.designation || "empty description"}</p>
                                </div>
                            </div>

                            <div className="tech_status_container d-flex gap-3 gap-sm-4">
                                <div className="tech_status green">
                                    <h3 className="fw-bolder mb-0">
                                        {technicianData.workingDays && technicianData.workingDays?.filter((d) => d.isActive).length}
                                    </h3>
                                    <div className="small text-muted">Active Days</div>
                                </div>
                                <div className="tech_status purple">
                                    <h3 className="fw-bolder mb-0">
                                        {technicianData.workingDays && technicianData.workingDays?.length}
                                    </h3>
                                    <div className="small text-muted">Total Days</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    {/* Left Sidebar */}
                    <div className="col-lg-4 col-xl-3">
                        <div className="card mb-3">
                            <div className="card-body">
                                <h5 className="card-title fw-bold text-dark mb-3">
                                    Technician Details
                                </h5>
                                <div className="tech_info d-flex flex-column gap-3">
                                    {technicianData.designation &&
                                        <div className="d-flex align-items-center gap-2">
                                            <FaUserCircle color="#C11111" />
                                            <span className="small">{technicianData.designation}</span>
                                        </div>
                                    }
                                    {technicianData.email &&
                                        <div className="d-flex align-items-center gap-2">
                                            <MdEmail color="#C11111" />
                                            <span className="small text-break">{technicianData.email}</span>
                                        </div>
                                    }
                                    {technicianData.createdAt &&
                                        <div className="d-flex align-items-center gap-2">
                                            <IoCalendarOutline color="#C11111" />
                                            <span className="small">{technicianData.createdAt?.split("T")[0]}</span>
                                        </div>
                                    }
                                    {technicianData.workingDays &&
                                        <div className="d-flex align-items-center gap-2">
                                            <FaRegClock color="#C11111" />
                                            <span className="small">Available Days: {technicianData.workingDays?.filter(d => d.isActive).map(d => d.day).join(", ")}</span>
                                        </div>
                                    }
                                    {technicianData.phoneNumber &&
                                        <div className="d-flex align-items-center gap-2">
                                            <FaPhone color="#C11111" />
                                            <span className="small">{technicianData.phoneNumber}</span>
                                        </div>
                                    }
                                </div>
                                <div className="d-grid gap-3 pt-3">
                                    <button className="btn btn_tech" onClick={handleContinueClick} >Edit Profile</button>
                                    <button className="btn btn_tech" onClick={() => {
                                        router.push(`/dashboard/technicians/manage-availability/${tId}`)
                                    }}>Manage Availability</button>

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="col-lg-8 col-xl-9">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title fw-semibold text-dark mb-3">
                                    Description / Bio
                                </h5>
                                <div className="text-muted lh-lg">
                                    {technicianData.description || "No description available."}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <EditTechnician isOpen={isOpen} onClose={onClose} techId={technicianData?._id} />
        </>
    );
}
