"use client";
import { useState, useEffect, useCallback } from "react";
import { BsSearch, BsChevronLeft, BsChevronRight, BsXCircle } from "react-icons/bs";
import { FaCalendarAlt } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "@/styles/refund.css";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import SpinnerLoading from "./Spinner/SpinnerLoading";
import AppointmentDetail from "./Modal/AppointmentDetail";
import Cookies from "js-cookie";
import { useDisclosure } from "@chakra-ui/react";
import BallsLoading from "./Spinner/BallsLoading";

export const APPOINTMENT_STATUS = {
    // PAYMENT_PENDING: "PaymentPending",
    CONFIRMED: "Confirmed",
    RESCHEDULED: "Rescheduled",  // Both parties agreed to a new time
    IN_PROGRESS: "In_Progress",  // started the service
    COMPLETED: "Completed",
    CANCELED: "Canceled",
    EXPIRED: "Expired",
};

const STATUS_TABS = [
    { key: "All", label: "All", statusValue: "", activeClass: "bg-dark text-white", badgeClass: "bg-dark text-white" },
    { key: APPOINTMENT_STATUS.CONFIRMED, label: "Confirmed", statusValue: APPOINTMENT_STATUS.CONFIRMED, activeClass: "bg-primary text-white", badgeClass: "bg-primary text-white" },
    { key: APPOINTMENT_STATUS.RESCHEDULED, label: "Rescheduled", statusValue: APPOINTMENT_STATUS.RESCHEDULED, activeClass: "bg-info text-dark", badgeClass: "bg-info text-dark" },
    { key: APPOINTMENT_STATUS.IN_PROGRESS, label: "In Progress", statusValue: APPOINTMENT_STATUS.IN_PROGRESS, activeClass: "bg-secondary text-white", badgeClass: "bg-secondary text-white" },
    { key: APPOINTMENT_STATUS.COMPLETED, label: "Completed", statusValue: APPOINTMENT_STATUS.COMPLETED, activeClass: "bg-success text-white", badgeClass: "bg-success text-white" },
    { key: APPOINTMENT_STATUS.CANCELED, label: "Canceled", statusValue: APPOINTMENT_STATUS.CANCELED, activeClass: "bg-danger text-white", badgeClass: "bg-danger text-white" },
    { key: APPOINTMENT_STATUS.EXPIRED, label: "Expired", statusValue: APPOINTMENT_STATUS.EXPIRED, activeClass: "bg-dark text-white", badgeClass: "bg-dark text-white" },
];

export default function ManageAppointments() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Parse initial params from URL
    const initialStatus = searchParams.get("status") || "All";
    const initialSearch = searchParams.get("search") || "";
    const initialDateStr = searchParams.get("scheduledAt") || searchParams.get("date") || null;
    const initialPage = parseInt(searchParams.get("page") || "1", 10);
    const initialLimit = parseInt(searchParams.get("limit") || "10", 10);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedStatus, setSelectedStatus] = useState(initialStatus);
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [currentPage, setCurrentPage] = useState(isNaN(initialPage) ? 1 : initialPage);
    const [itemsPerPage, setItemsPerPage] = useState(isNaN(initialLimit) ? 10 : initialLimit);
    const [selectedDate, setSelectedDate] = useState(initialDateStr ? new Date(initialDateStr) : null);

    const [appointments, setAppointments] = useState([]);
    const [totalServerCount, setTotalServerCount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [bookingDetail, setBookingDetail] = useState(null);
    const [salonId, setSalonId] = useState(null);

    const [stats, setStats] = useState({
        all: 0,
        // [APPOINTMENT_STATUS.PAYMENT_PENDING]: 0,
        [APPOINTMENT_STATUS.CONFIRMED]: 0,
        [APPOINTMENT_STATUS.RESCHEDULED]: 0,
        [APPOINTMENT_STATUS.IN_PROGRESS]: 0,
        [APPOINTMENT_STATUS.COMPLETED]: 0,
        [APPOINTMENT_STATUS.CANCELED]: 0,
        [APPOINTMENT_STATUS.EXPIRED]: 0,
    });

    /* ─────────────── Get salonId from cookie ─────────────── */
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

    // Function to synchronize state with URL query parameters
    const syncUrlParams = useCallback((newParams) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(newParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "" && value !== "All") {
                params.set(key, String(value));
            } else {
                params.delete(key);
            }
        });

        const queryString = params.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
        router.replace(newUrl, { scroll: false });
    }, [pathname, router, searchParams]);

    const calculateStats = (data) => {
        let statsObj = {
            all: 0,
            [APPOINTMENT_STATUS.CONFIRMED]: 0,
            [APPOINTMENT_STATUS.RESCHEDULED]: 0,
            [APPOINTMENT_STATUS.IN_PROGRESS]: 0,
            [APPOINTMENT_STATUS.COMPLETED]: 0,
            [APPOINTMENT_STATUS.CANCELED]: 0,
            [APPOINTMENT_STATUS.EXPIRED]: 0,
        };

        data.forEach(appt => {
            const status = appt.status || appt.servicesDetail?.[0]?.status;
            if (status === "PaymentPending") return;
            statsObj.all++;
            if (status && statsObj[status] !== undefined) {
                statsObj[status]++;
            }
        });

        setStats(statsObj);
    };

    const fetchAppointments = async () => {
        if (!salonId) return;
        try {
            setLoading(true);
            setError(null);

            const queryObj = { salonId };

            if (selectedStatus && selectedStatus !== "All") {
                queryObj.status = selectedStatus;
            }
            if (searchTerm.trim()) {
                queryObj.search = searchTerm.trim();
            }
            if (selectedDate) {
                const localDate = new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDate(),
                    12, 0, 0
                );
                queryObj.scheduledAt = localDate.toISOString();
            }
            queryObj.page = currentPage;
            queryObj.limit = itemsPerPage;

            const queryParams = new URLSearchParams(queryObj);
            const url = `${process.env.NEXT_PUBLIC_API_URL}/getBookingsBySalonId?${queryParams.toString()}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch appointments");

            const result = await response.json();
            if (result.success) {
                const fetchedData = Array.isArray(result.data) ? result.data : [];
                const sortedData = [...fetchedData].sort((a, b) => {
                    const dateA = new Date(a.servicesDetail?.[0]?.scheduledAt || a.createdAt);
                    const dateB = new Date(b.servicesDetail?.[0]?.scheduledAt || b.createdAt);
                    return dateB - dateA;
                });
                setAppointments(sortedData);

                const totalFromApi = result.pagination?.totalRecords ?? result.pagination?.total ?? result.totalRecords ?? result.totalCount ?? result.total;
                if (totalFromApi !== undefined && totalFromApi !== null) {
                    setTotalServerCount(Number(totalFromApi));
                } else {
                    setTotalServerCount(null);
                }
                calculateStats(sortedData);
            } else if (result.message === "No bookings found for this salon") {
                setAppointments([]);
                setTotalServerCount(0);
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

    useEffect(() => {
        if (salonId) {
            fetchAppointments();
        }
    }, [salonId, selectedStatus, selectedDate, currentPage, itemsPerPage]);

    // Handle search debounce
    useEffect(() => {
        if (!salonId) return;
        const timer = setTimeout(() => {
            fetchAppointments();
        }, 400);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Handler when status tab is clicked
    const handleStatusTabChange = (statusKey) => {
        setSelectedStatus(statusKey);
        setCurrentPage(1);
        syncUrlParams({
            status: statusKey,
            search: searchTerm,
            scheduledAt: selectedDate ? selectedDate.toISOString() : "",
            page: 1,
            limit: itemsPerPage,
        });
    };

    // Handler when search changes
    const handleSearchChange = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
        syncUrlParams({
            status: selectedStatus,
            search: value,
            scheduledAt: selectedDate ? selectedDate.toISOString() : "",
            page: 1,
            limit: itemsPerPage,
        });
    };

    // Handler when date changes
    const handleDateChange = (date) => {
        setSelectedDate(date);
        setShowCalendar(false);
        setCurrentPage(1);
        syncUrlParams({
            status: selectedStatus,
            search: searchTerm,
            scheduledAt: date ? date.toISOString() : "",
            page: 1,
            limit: itemsPerPage,
        });
    };

    const clearDateFilter = () => {
        setSelectedDate(null);
        setCurrentPage(1);
        syncUrlParams({
            status: selectedStatus,
            search: searchTerm,
            scheduledAt: "",
            page: 1,
            limit: itemsPerPage,
        });
    };

    // Handler for page change
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        syncUrlParams({
            status: selectedStatus,
            search: searchTerm,
            scheduledAt: selectedDate ? selectedDate.toISOString() : "",
            page: newPage,
            limit: itemsPerPage,
        });
    };

    // Handler for limit change
    const handleLimitChange = (newLimit) => {
        setItemsPerPage(newLimit);
        setCurrentPage(1);
        syncUrlParams({
            status: selectedStatus,
            search: searchTerm,
            scheduledAt: selectedDate ? selectedDate.toISOString() : "",
            page: 1,
            limit: newLimit,
        });
    };

    // Client side filtering as fallback if API returns full dataset un-filtered
    const filteredAppointments = appointments.filter((appt) => {
        const apptStatus = appt.status || appt.servicesDetail?.[0]?.status;
        if (apptStatus === "PaymentPending") return false;

        // Status filter
        if (selectedStatus && selectedStatus !== "All") {
            if (apptStatus !== selectedStatus) return false;
        }

        // Search term filter
        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase();
            const name = (appt.userId?.username || "").toLowerCase();
            const email = (appt.userId?.email || "").toLowerCase();
            const services = appt.servicesDetail || [];
            const tech = services.map(s => s.technician?.fullName).join(" ").toLowerCase();
            const service = services.map(s => s.serviceName).join(" ").toLowerCase();
            const status = (appt.status || "").toLowerCase();

            const matchesSearch = name.includes(search) ||
                email.includes(search) ||
                tech.includes(search) ||
                service.includes(search) ||
                status.includes(search);

            if (!matchesSearch) return false;
        }

        return true;
    });

    // Pagination calculations (handling server pagination fallback)
    const isServerPaginated = totalServerCount !== null;
    const effectiveTotalCount = isServerPaginated ? totalServerCount : filteredAppointments.length;
    const totalPages = Math.max(1, Math.ceil(effectiveTotalCount / itemsPerPage));
    const currentAppointments = isServerPaginated ? filteredAppointments : filteredAppointments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + currentAppointments.length, effectiveTotalCount);

    const getStatusBadge = (status = "") => {
        switch (status) {
            case "PaymentPending":
                return <span className="badge py-2 bg-warning text-dark">Payment Pending</span>;
            case "Confirmed":
                return <span className="badge py-2 bg-primary">Confirmed</span>;
            case "Rescheduled":
                return <span className="badge py-2 bg-info text-dark">Rescheduled</span>;
            case "In_Progress":
                return <span className="badge py-2 bg-secondary">In Progress</span>;
            case "Completed":
                return <span className="badge py-2 bg-success">Completed</span>;
            case "Canceled":
                return <span className="badge py-2 bg-danger">Canceled</span>;
            case "Expired":
                return <span className="badge py-2 bg-dark">Expired</span>;
            default:
                return <span className="badge py-2 bg-light text-dark">{status || "-"}</span>;
        }
    };

    const formatDateTimeUS = (dateTime) => {
        try {
            if (!dateTime) return "-";
            return new Date(dateTime).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
        } catch {
            return "-";
        }
    };

    const getServiceNames = (services = []) => {
        if (!services.length) return "-";
        if (services.length === 1) return services[0].serviceName;
        return `${services[0].serviceName}, +${services.length - 1}`;
    };

    const getTechnicianNames = (services = []) => {
        if (!services.length) return "-";
        const technicians = services.map(item => item.technician?.fullName).filter(Boolean);
        if (!technicians.length) return "-";
        if (technicians.length === 1) return technicians[0];
        return `${technicians[0]}, +${technicians.length - 1}`;
    };

    if (loading && appointments.length === 0) {
        return (
            <div className="page pt-4 px-0">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
                    <BallsLoading />
                </div>
            </div>
        );
    }

    if (error && appointments.length === 0) {
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
            <div className="d-flex justify-content-center justify-content-sm-between flex-wrap gap-2 align-items-center mb-3">
                <h4 className="fw-bold mb-0">Customer Appointments</h4>
                <button
                    className="btn btn-outline-danger btn-sm px-4 py-2 fs-6 rounded-3"
                    onClick={() => router.push("/dashboard/appointments")}
                >
                    Calendar View
                </button>
            </div>

            {/* Status Navigation Tabs */}
            <div>
                <div className="nav nav-pills flex-nowrap overflow-auto pb-2 gap-2" style={{ scrollbarWidth: "thin" }}>
                    {STATUS_TABS.map((tab) => {
                        const isActive = selectedStatus === tab.key;
                        const count = tab.key === "All" ? stats.all : (stats[tab.key] ?? 0);
                        const activeClass = tab.activeClass || "bg-dark text-white";
                        const activeBadgeClass = activeClass.includes("text-dark") ? "bg-dark text-white" : "bg-white text-dark";

                        return (
                            <button
                                key={tab.key}
                                className={`nav-link text-nowrap d-flex align-items-center gap-2 px-3 py-2 ${isActive ? `${activeClass} fw-bold shadow-sm` : "bg-light text-dark border"
                                    }`}
                                style={{ borderRadius: "20px", cursor: "pointer", transition: "all 0.2s" }}
                                onClick={() => handleStatusTabChange(tab.key)}
                            >
                                <span>{tab.label}</span>
                                <span className={`badge rounded-pill ${isActive ? activeBadgeClass : tab.badgeClass}`} style={{ minWidth: "20px", height: "20px", display: 'flex', justifyContent: "center", alignItems: "center" }}>
                                    {/* {count} */}
                                </span>
                                {/* {count !== undefined && (
                                    <span className={`badge rounded-pill ${isActive ? activeBadgeClass : tab.badgeClass}`} style={{ minWidth: "20px", height: "20px", display: 'flex', justifyContent: "center", alignItems: "center" }}>
                                        {count}
                                    </span>
                                )} */}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Table Card */}
            <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3 d-flex justify-content-center justify-content-sm-between align-items-center flex-wrap gap-2">
                    <h5 className="fw-bolder mb-0">Appointments List</h5>
                    <div className="d-flex align-items-center justify-content-center justify-content-sm-start gap-2 position-relative al-topper flex-wrap flex-md-nowrap">
                        {/* Calendar button */}
                        <div className="position-relative d-flex align-items-center">
                            <button
                                className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                                onClick={() => setShowCalendar(!showCalendar)}
                            >
                                <FaCalendarAlt />
                                {selectedDate ? selectedDate.toLocaleDateString() : "Select Date"}
                            </button>
                            {selectedDate && (
                                <button
                                    className="btn btn-sm btn-link text-danger p-0 ms-1"
                                    title="Clear date"
                                    onClick={clearDateFilter}
                                >
                                    <BsXCircle />
                                </button>
                            )}
                        </div>

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
                                    onChange={handleDateChange}
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

                        <div className="position-relative w-100">
                            <BsSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                            <input
                                type="text"
                                className="form-control ps-5"
                                placeholder="Search by customer, technician, service..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                style={{ minWidth: "260px" }}
                            />
                        </div>
                    </div>
                </div>

                <div className="card-body p-0 appointments_table">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Customer</th>
                                    <th>Service</th>
                                    <th>Technician</th>
                                    <th>Date & Time</th>
                                    <th>Total</th>
                                    <th>Discount</th>
                                    <th>Payment</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="9" className="text-center py-5">
                                            <SpinnerLoading />
                                        </td>
                                    </tr>
                                ) : currentAppointments.length > 0 ? (
                                    currentAppointments.map((appt) => {
                                        const userImg = appt.userId?.image
                                            ? (appt.userId.image.startsWith("http") ? appt.userId.image : `${process.env.NEXT_PUBLIC_IMAGE_URL}/${appt.userId.image}`)
                                            : null;
                                        const discAmt = appt.discountDetails?.amount ?? appt.chargesBreakdown?.discount?.amount ?? 0;
                                        const fType = appt.discountDetails?.fundingType || appt.chargesBreakdown?.discount?.fundingType || appt.chargesBreakdown?.discount?.borneBy;

                                        return (
                                            <tr
                                                key={appt._id}
                                                onClick={() => router.push(`/dashboard/appointmentslist/${appt._id}`)}
                                                style={{ cursor: "pointer" }}
                                                title="Click to view appointment details"
                                            >
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        {userImg ? (
                                                            <img
                                                                src={userImg}
                                                                alt="user"
                                                                onError={(e) => (e.currentTarget.style.display = "none")}
                                                                style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", border: "1px solid #eee" }}
                                                            />
                                                        ) : (
                                                            <div
                                                                style={{
                                                                    width: 34,
                                                                    height: 34,
                                                                    borderRadius: "50%",
                                                                    backgroundColor: "#e0e7ff",
                                                                    color: "#4338ca",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    fontWeight: 700,
                                                                    fontSize: 13,
                                                                }}
                                                            >
                                                                {(appt.userId?.username || "U").charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                        <div className="d-flex flex-column">
                                                            <span className="fw-bold" style={{ fontSize: 13 }}>{appt.userId?.username || `${appt.userId?.firstName || ""} ${appt.userId?.lastName || ""}`.trim() || "Unknown"}</span>
                                                            <span className="text-muted small" style={{ fontSize: 11 }}>{appt.userId?.email || "-"}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ fontSize: 13 }}>{getServiceNames(appt.servicesDetail)}</td>
                                                <td style={{ fontSize: 13 }}>{getTechnicianNames(appt.servicesDetail)}</td>
                                                <td style={{ fontSize: 13, whiteSpace: "nowrap" }}>{formatDateTimeUS(appt.servicesDetail?.[0]?.scheduledAt)}</td>
                                                <td className="fw-bold" style={{ fontSize: 13 }}>${(appt.totalAmount || 0).toFixed(2)}</td>
                                                <td>
                                                    {!discAmt ? (
                                                        <span className="fw-bold" style={{ fontSize: 13 }}>$0.00</span>
                                                    ) : (
                                                        <div className="d-flex flex-column gap-1">
                                                            <span className="fw-bold" style={{ fontSize: 13 }}>${Number(discAmt).toFixed(2)}</span>
                                                            {fType && (
                                                                <span
                                                                    style={{
                                                                        fontSize: 10,
                                                                        padding: "1px 6px",
                                                                        borderRadius: 4,
                                                                        width: "fit-content",
                                                                        backgroundColor: fType === "Vendor" ? "#fff7ed" : "#faf5ff",
                                                                        color: fType === "Vendor" ? "#c2410c" : "#7e22ce",
                                                                        border: fType === "Vendor" ? "1px solid #ffedd5" : "1px solid #f3e8ff",
                                                                        fontWeight: 700,
                                                                    }}
                                                                >
                                                                    {fType}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="d-flex flex-column" style={{ fontSize: 12 }}>
                                                        <span>{appt.paymentMethod || "N/A"}</span>
                                                        {appt.paymentStatus && (
                                                            <span className={`small ${appt.paymentStatus === "Success" ? "text-success" : "text-warning"}`} style={{ fontSize: 11 }}>
                                                                {appt.paymentStatus}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>{getStatusBadge(appt.status || appt.servicesDetail?.[0]?.status)}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-outline-dark btn-sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.push(`/dashboard/appointmentslist/${appt._id}`);
                                                        }}
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="text-center text-muted py-5">
                                            No Appointments Found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    {effectiveTotalCount > 10 && (
                        <div className="d-flex justify-content-between align-items-center p-3 border-top flex-wrap gap-3">
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                <span className="text-muted small">Show</span>
                                <select
                                    className="form-select form-select-sm"
                                    value={itemsPerPage}
                                    onChange={(e) => handleLimitChange(Number(e.target.value))}
                                    style={{ width: "auto" }}
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                                <span className="text-muted small">
                                    {effectiveTotalCount > 0
                                        ? `Showing ${startIndex + 1} to ${endIndex} of ${effectiveTotalCount} entries`
                                        : "0 entries"}
                                </span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <button
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1 || loading}
                                >
                                    <BsChevronLeft />
                                </button>
                                <span className="small text-muted px-2">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage >= totalPages || loading}
                                >
                                    <BsChevronRight />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <AppointmentDetail
                isOpen={isOpen}
                onClose={onClose}
                modalClass="appoint_detail_container"
                booking={bookingDetail}
                onUpdated={() => fetchAppointments()}
            />
        </div>
    );
}
