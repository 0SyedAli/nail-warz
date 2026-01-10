"use client";
import { useState, useEffect } from "react";
import { BsSearch, BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { FaCalendarAlt } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "@/styles/refund.css";
import { useRouter, useSearchParams } from "next/navigation";
import SpinnerLoading from "./Spinner/SpinnerLoading";
import AppointmentDetail from "./Modal/AppointmentDetail";
import Cookies from "js-cookie";
import { useDisclosure } from "@chakra-ui/react";

export default function ManageAppointments() {
    const searchParams = useSearchParams();
    const timing = searchParams.get("timing");  // "09:30AM"
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [bookingDetail, setBookingDetail] = useState(null);
    const [salonId, setSalonId] = useState(null);
    const router = useRouter();
    //   /* ─────────────── Get salonId from cookie ─────────────── */
    useEffect(() => {
        const cookie = Cookies.get("user");
        if (!cookie) return router.push("/auth/login");
        try {
            const u = JSON.parse(cookie);
            if (u?._id) setSalonId(u._id);
            else router.push("/auth/login");
        } catch {
            router.push("/auth/login");
        }
    }, [router]);
    const [stats, setStats] = useState({
        all: 0,
        canceled: 0,
        completed: 0,
        pending: 0,
        accepted: 0,
    });

    const fetchAppointments = async (date = null) => {
        try {
            setLoading(true);
            setError(null);

            // let url = `${process.env.NEXT_PUBLIC_API_URL}/getBookingsBySalonId?salonId=${salonId}&timing=${timing}`;

            if (!salonId) return;

            let url = `${process.env.NEXT_PUBLIC_API_URL}/getBookingsBySalonId?salonId=${salonId}`;

            // Add timing if available
            if (timing) {
                url += `&time=${timing}`;
            }

            if (date) {
                // Convert JS Date object → "dd-mm-yyyy"
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();
                const formattedDate = `${day}-${month}-${year}`;

                url += `&date=${formattedDate}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch appointments");

            const result = await response.json();
            if (result.success) {
                // setAppointments(result.data);
                const parseDateTime = (dateStr, timeStr) => {
                    // Convert "13-10-2025" → "2025-10-13"
                    const [day, month, year] = dateStr.split("-");
                    return new Date(`${year}-${month}-${day} ${timeStr}`);
                };

                const sortedData = [...result.data].sort((a, b) => {
                    const dateA = parseDateTime(a.date, a.time);
                    const dateB = parseDateTime(b.date, b.time);
                    return dateB - dateA; // newest → oldest
                });
                setAppointments(sortedData);
                calculateStats(sortedData);
            } else if (result.message === "No bookings found for this salon") {
                // Show empty state instead of error
                setAppointments([]);
                calculateStats([]);
            } else {
                throw new Error(result.message || "No appointments found");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data) => {
        const stats = data.reduce(
            (acc, appt) => {
                acc.all++;
                switch (appt.status.toLowerCase()) {
                    case "pending":
                    case "accepted":
                        acc.new++;
                        break;
                    case "canceled":
                        acc.canceled++;
                        break;
                    case "completed":
                        acc.completed++;
                        break;
                }
                return acc;
            },
            { all: 0, new: 0, canceled: 0, completed: 0 }
        );
        setStats(stats);
    };


    useEffect(() => {
        if (!salonId) return;
        fetchAppointments();
    }, [salonId, timing]);

    const getStatusBadge = (status) => {
        switch (status.toLowerCase()) {
            case "completed":
                return <span className="badge py-2 bg-success">Completed</span>;
            case "pending":
            case "accepted":
                return <span className="badge py-2 bg-primary">New</span>;
            case "canceled":
                return <span className="badge py-2 bg-danger">Canceled</span>;
            default:
                return <span className="badge py-2 bg-secondary">{status}</span>;
        }
    };
    const formatDateTimeUS = (dateStr, timeStr) => {
        try {
            // Convert "10-10-2025" → "2025-10-10"
            const [day, month, year] = dateStr.split("-");
            const formatted = `${year}-${month}-${day} ${timeStr}`;
            const date = new Date(formatted);

            return date.toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
        } catch {
            return `${dateStr} ${timeStr}`;
        }
    };


    const viewAppointmentDetails = (id) => {
        router.push(`/super-admin/dashboard/manage-appointments/${id}`);
    };

    const filteredAppointments = appointments.filter((appt) => {
        const name = (appt.userId?.username || "").toLowerCase();
        const tech = (appt.technicianId?.fullName || "").toLowerCase();
        const service = (appt.serviceId?.serviceName || "").toLowerCase();
        const status = (appt.status || "").toLowerCase();
        const search = searchTerm.toLowerCase();

        return (
            name.includes(search) ||
            tech.includes(search) ||
            service.includes(search) ||
            status.includes(search)
        );
    });

    const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentAppointments = filteredAppointments.slice(startIndex, endIndex);
    //   /* ─────────────── Fetch bookings ─────────────── */

    const fetchBookingDetail = async (id) => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/getBookingById?bookingId=${id}`
            );
            const json = await res.json();
            if (!json.success) throw new Error("Failed to load booking");
            setBookingDetail(json.data);
            onOpen();
        } catch (e) {
            console.error("Booking Detail Error:", e.message);
        }
    };

    if (loading) {
        return (
            <div className="page pt-4 px-0">
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: "400px" }}
                >
                    <SpinnerLoading />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page pt-4">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Error!</h4>
                    <p>{error}</p>
                    <button className="btn btn-outline-danger" onClick={() => fetchAppointments()}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="page pt-4">
            {/* Stats Cards */}

            <div className="text-end mb-3">
                <button
                    className="btn btn-outline-danger btn-sm px-4 py-2 fs-6 rounded-3"
                    onClick={()=> router.push("/dashboard/appointments")}
                >
                    Calender View
                </button>
            </div>
            <div className="row g-2 g-sm-3 mb-4">
                {["All", "Accepted", "Completed", "Canceled"].map((label, i) => (
                    <div className="col" key={i}>
                        <div
                            className={`card border-start border-${["primary", "warning", "success", "danger"][i]
                                } border-4`}
                        >
                            <div className="card-body py-3">
                                <h5>{label}</h5>
                                <h4 className="fw-bold mb-0">
                                    {stats[label.toLowerCase()] ?? 0}
                                </h4>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="card">
                <div className="card-header bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <h5 className="fw-bolder mb-0">Customer Appointments</h5>
                    <div className="d-flex align-items-center gap-2 position-relative">
                        {/* Calendar button */}
                        <button
                            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                            onClick={() => setShowCalendar(!showCalendar)}
                        >
                            <FaCalendarAlt />
                            {selectedDate
                                ? selectedDate.toLocaleDateString()
                                : "Select Date"}
                        </button>

                        {showCalendar && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "120%",
                                    right: 0,
                                    zIndex: 20,
                                    background: "#fff",
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    padding: "10px",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                }}
                            >
                                <Calendar
                                    onChange={(date) => {
                                        setSelectedDate(date);
                                        setShowCalendar(false);
                                        fetchAppointments(date);
                                    }}
                                    value={selectedDate}
                                />
                            </div>
                        )}

                        <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => fetchAppointments()}
                            disabled={loading}
                        >
                            Refresh
                        </button>

                        <div className="position-relative">
                            <BsSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                            <input
                                type="text"
                                className="form-control ps-5"
                                placeholder="Search by name, service, or status..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: "380px" }}
                            />
                        </div>
                    </div>
                </div>

                <div className="card-body p-0 appointments_table">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Customer</th>
                                    <th>Service</th>
                                    <th>Technician</th>
                                    <th>Date & Time</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentAppointments.length > 0 ? (
                                    currentAppointments.map((appt) => (
                                        <tr key={appt._id} >
                                            <td>{appt.userId?.username || "Unknown"}</td>
                                            <td>{appt.serviceId?.serviceName || "-"}</td>
                                            <td>{appt.technicianId?.fullName || "-"}</td>
                                            <td>{formatDateTimeUS(appt.date, appt.time)}</td>
                                            <td>${appt.totalAmount}</td>
                                            <td>{getStatusBadge(appt.status)}</td>
                                            <td>
                                                <button
                                                    className="btn btn-outline-dark btn-sm"
                                                    onClick={() => fetchBookingDetail(appt._id)}
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center text-muted py-4">
                                            No Appointments Found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="d-flex justify-content-between align-items-start p-3 border-top flex-wrap gap-3">
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                            <select
                                className="form-select form-select-sm"
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                style={{ width: "auto" }}
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                            <small className="text-muted">
                                {startIndex + 1}-{Math.min(endIndex, filteredAppointments.length)}{" "}
                                of {filteredAppointments.length}
                            </small>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                            >
                                <BsChevronLeft />
                            </button>
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                            >
                                <BsChevronRight />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <AppointmentDetail
                isOpen={isOpen}
                onClose={onClose}
                modalClass="appoint_detail_container"
                booking={bookingDetail}
            />
        </div>
    );
}
