"use client"
import { useState, useEffect, use } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import { FaCheck, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { showErrorToast, showSuccessToast } from "src/lib/toast";
import { useRouter } from "next/navigation";

export default function ManageAvailabilityPage({ params }) {
    const { tId } = use(params);
    const router = useRouter();
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [currentStartDate, setCurrentStartDate] = useState(new Date())
    const [availability, setAvailability] = useState({})
    const [selectedRange, setSelectedRange] = useState({
        start: null,
        end: null,
    })
    const [technicianData, setTechnicianData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loading2, setLoading2] = useState(false)
    const [error, setError] = useState(null)

    const generateTimeSlots = (startTime, endTime) => {
        const slots = []
        const start = convertTo24Hour(startTime)
        const end = convertTo24Hour(endTime)

        let current = start
        while (current < end) {
            slots.push(convertTo12Hour(current))
            current += 100 // Add 1 hour (100 in HHMM format)
            if (current % 100 >= 60) {
                current += 40 // Convert minutes overflow to next hour
            }
        }
        return slots
    }

    const convertTo24Hour = (time12h) => {
        const [time, modifier] = time12h.split(" ")
        let [hours, minutes] = time.split(":")
        if (hours === "12") {
            hours = "00"
        }
        if (modifier === "PM") {
            hours = Number.parseInt(hours, 10) + 12
        }
        return Number.parseInt(hours) * 100 + Number.parseInt(minutes)
    }

    const convertTo12Hour = (time24h) => {
        const hours = Math.floor(time24h / 100)
        const minutes = time24h % 100
        const period = hours >= 12 ? "PM" : "AM"
        const displayHours = hours % 12 || 12
        return `${displayHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`
    }

    useEffect(() => {
        const fetchTechnicianData = async () => {
            try {
                setLoading(true)
                console.log("[v0] Fetching technician data for ID:", tId)
                console.log("[v0] API URL:", process.env.NEXT_PUBLIC_API_URL)

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getTechnicianById?id=${tId}`)

                console.log("[v0] Response status:", response.status)
                console.log("[v0] Response headers:", response.headers.get("content-type"))

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const result = await response.json()
                console.log("[v0] API Response:", result)

                if (result.success && result.data.technician) {
                    setTechnicianData(result.data.technician)

                    const existingAvailability = {}
                    if (result.data.technician.notAvailable) {
                        result.data.technician.notAvailable.forEach((slot) => {
                            // Convert date format from DD-MM-YY to match our format
                            const [day, month, year] = slot.date.split("-")
                            const fullYear = year.length === 2 ? `20${year}` : year
                            const slotDate = new Date(`${fullYear}-${month}-${day}`)

                            // Find which day index this date corresponds to in our current view
                            const dayIndex = Math.floor((slotDate - currentStartDate) / (1000 * 60 * 60 * 24))

                            if (dayIndex >= 0 && dayIndex < 7) {
                                const slotKey = `${dayIndex}-${slot.startTime}`
                                existingAvailability[slotKey] = true
                            }
                        })
                    }
                    setAvailability(existingAvailability)
                } else {
                    setError("Failed to load technician data")
                }
            } catch (error) {
                console.error("[v0] Error fetching technician data:", error)
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        if (tId) {
            fetchTechnicianData()
        }
    }, [tId, currentStartDate])

    const timeSlots =
        technicianData && technicianData.workingDays.length > 0
            ? generateTimeSlots(technicianData.workingDays[0].startTime, technicianData.workingDays[0].endTime)
            : [
                "08:00 AM",
                "09:00 AM",
                "10:00 AM",
                "11:00 AM",
                "12:00 PM",
                "01:00 PM",
                "02:00 PM",
                "03:00 PM",
                "04:00 PM",
                "05:00 PM",
                "06:00 PM",
            ]

    const getDayLabels = () => {
        return ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
    }

    const getWeekDates = () => {
        const weekDates = []

        // Find the Monday of the current week
        const today = new Date()
        const dayOfWeek = today.getDay()
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Sunday = 6 days back, others = dayOfWeek - 1
        const mondayOfWeek = new Date(today)
        mondayOfWeek.setDate(today.getDate() - daysToMonday)

        // Generate dates for MON, TUE, WED, THU, FRI, SAT, SUN
        for (let i = 0; i < 7; i++) {
            const date = new Date(mondayOfWeek)
            date.setDate(mondayOfWeek.getDate() + i)
            weekDates.push(date.getDate())
        }
        return weekDates
    }

    const navigateDays = (direction) => {
        const newStartDate = new Date(currentStartDate)
        if (direction === "prev") {
            newStartDate.setDate(currentStartDate.getDate() - 7)
        } else {
            newStartDate.setDate(currentStartDate.getDate() + 7)
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        newStartDate.setHours(0, 0, 0, 0)

        if (newStartDate >= today) {
            setCurrentStartDate(newStartDate)
            setCurrentMonth(new Date(newStartDate.getFullYear(), newStartDate.getMonth(), 1))
        }
    }

    const navigateMonth = (direction) => {
        const newMonth = new Date(currentMonth)
        if (direction === "prev") {
            newMonth.setMonth(currentMonth.getMonth() - 1)
        } else {
            newMonth.setMonth(currentMonth.getMonth() + 1)
        }
        const today = new Date()
        if (
            newMonth.getFullYear() < today.getFullYear() ||
            (newMonth.getFullYear() === today.getFullYear() && newMonth.getMonth() < today.getMonth())
        ) {
            return
        }
        setCurrentMonth(newMonth)

        const firstDayOfMonth = new Date(newMonth.getFullYear(), newMonth.getMonth(), 1)
        const todayDate = new Date()
        todayDate.setHours(0, 0, 0, 0)
        firstDayOfMonth.setHours(0, 0, 0, 0)

        const startDate = firstDayOfMonth >= todayDate ? firstDayOfMonth : todayDate

        // Find the Monday of the week containing startDate
        const dayOfWeek = startDate.getDay()
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Sunday = 6 days back, others = dayOfWeek - 1
        const mondayOfWeek = new Date(startDate)
        mondayOfWeek.setDate(startDate.getDate() - daysToMonday)

        // Don't go before today
        if (mondayOfWeek >= todayDate) {
            setCurrentStartDate(mondayOfWeek)
        } else {
            setCurrentStartDate(todayDate)
        }
    }

    const getSlotKey = (dayIndex, timeSlot) => {
        return `${dayIndex}-${timeSlot}`
    }

    const isTimeAfter = (timeA, timeB) => {
        const timeAIndex = timeSlots.indexOf(timeA)
        const timeBIndex = timeSlots.indexOf(timeB)
        return timeAIndex > timeBIndex
    }

    const handleSlotClick = (dayIndex, timeSlot) => {
        if (!isDayActive(dayIndex)) {
            alert("This day is not available for booking")
            return
        }

        const slotKey = getSlotKey(dayIndex, timeSlot)

        if (availability[slotKey]) {
            setAvailability((prev) => {
                const newAvailability = { ...prev }
                delete newAvailability[slotKey]
                return newAvailability
            })

            if (
                selectedRange.start &&
                selectedRange.start.dayIndex === dayIndex &&
                selectedRange.start.timeSlot === timeSlot
            ) {
                if (selectedRange.end) {
                    const endSlotKey = getSlotKey(selectedRange.end.dayIndex, selectedRange.end.timeSlot)
                    setAvailability((prev) => {
                        const newAvailability = { ...prev }
                        delete newAvailability[endSlotKey]
                        return newAvailability
                    })
                }
                setSelectedRange({ start: null, end: null })
            } else if (
                selectedRange.end &&
                selectedRange.end.dayIndex === dayIndex &&
                selectedRange.end.timeSlot === timeSlot
            ) {
                setSelectedRange((prev) => ({ ...prev, end: null }))
            }
            return
        }

        if (!selectedRange.start) {
            setSelectedRange({ start: { dayIndex, timeSlot }, end: null })
            setAvailability((prev) => ({ ...prev, [slotKey]: true }))
        } else if (selectedRange.start && !selectedRange.end) {
            if (dayIndex === selectedRange.start.dayIndex && isTimeAfter(timeSlot, selectedRange.start.timeSlot)) {
                setSelectedRange((prev) => ({ ...prev, end: { dayIndex, timeSlot } }))
                setAvailability((prev) => ({ ...prev, [slotKey]: true }))
            } else if (dayIndex !== selectedRange.start.dayIndex) {
                alert("Please select end time on the same day and after the start time")
            } else {
                alert("End time must be after start time")
            }
        } else {
            setSelectedRange({ start: { dayIndex, timeSlot }, end: null })
            setAvailability({ [slotKey]: true })
        }
    }

    const updateTechnicianAvailability = async (notAvailableSlots) => {
        setLoading2(true);
        try {
            const formData = new FormData()
            formData.append("id", tId)
            formData.append("notAvailable", JSON.stringify(notAvailableSlots))

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/updateTechnician`, {
                method: "POST",
                body: formData,
            })

            const data = await response.json()
            return data
        } catch (error) {
            console.error("Error updating technician availability:", error)
            throw error
        }
    }

    const formatDate = (dayIndex) => {
        const today = new Date()
        const dayOfWeek = today.getDay()
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
        const mondayOfWeek = new Date(today)
        mondayOfWeek.setDate(today.getDate() - daysToMonday)

        const currentDate = new Date(mondayOfWeek)
        currentDate.setDate(mondayOfWeek.getDate() + dayIndex)
        const date = currentDate.getDate()
        const month = String(currentDate.getMonth() + 1).padStart(2, "0")
        const year = currentDate.getFullYear()
        return `${String(date).padStart(2, "0")}-${month}-${year}`
    }

    const handleUpdate = async () => {
        if (selectedRange.start && selectedRange.end) {
            const notAvailableSlots = [
                {
                    date: formatDate(selectedRange.start.dayIndex),
                    startTime: selectedRange.start.timeSlot,
                    endTime: selectedRange.end.timeSlot,
                },
            ]

            try {
                const result = await updateTechnicianAvailability(notAvailableSlots)

                if (result.success || result.message === "success") {
                    showSuccessToast("Availability updated successfully!")
                    setSelectedRange({ start: null, end: null })
                    setAvailability({})
                    setLoading2(false)
                    router.push(`/dashboard/technicians/${tId}`)
                } else {
                    showErrorToast(`Error: ${result.message || "Failed to update availability"}`)
                }
            } catch (error) {
                console.error("API Error:", error)
                showErrorToast("Error updating availability. Please try again.")
            }
        } else {
            showErrorToast("Please select both start and end time")
        }
    }

    // Modified to use Monday-based calculation for day activity check
    const isDayActive = (dayIndex) => {
        if (!technicianData || !technicianData.workingDays) return true

        // Calculate the actual date for this day index (0=Monday, 6=Sunday)
        const today = new Date()
        const dayOfWeek = today.getDay()
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
        const mondayOfWeek = new Date(today)
        mondayOfWeek.setDate(today.getDate() - daysToMonday)

        const currentDate = new Date(mondayOfWeek)
        currentDate.setDate(mondayOfWeek.getDate() + dayIndex)
        const dayName = currentDate.toLocaleDateString("en-US", { weekday: "long" })

        const workingDay = technicianData.workingDays.find((wd) => wd.day === dayName)
        return workingDay ? workingDay.isActive : false
    }

    useEffect(() => {
        // This useEffect is no longer needed as we calculate Monday-based dates directly
    }, [])

    if (loading) {
        return (
            <div className="container-fluid py-4">
                <div className="row justify-content-center">
                    <div className="col-12 col-xxl-10 px-0">
                        <div className="card shadow-sm">
                            <div className="card-body p-4 text-center">
                                <div className="spinner-border text-danger" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-3">Loading technician data...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container-fluid py-4">
                <div className="row justify-content-center">
                    <div className="col-12 col-xxl-10 px-0">
                        <div className="card shadow-sm">
                            <div className="card-body p-4 text-center">
                                <div className="alert alert-danger">
                                    <h5>Error Loading Data</h5>
                                    <p>{error}</p>
                                    <button className="btn btn-danger" onClick={() => window.location.reload()}>
                                        Retry
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container-fluid px-0 px-sm-3 py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-xxl-10 px-0">
                    {/* {technicianData && (
                        <div className="card shadow-sm mb-4">
                            <div className="card-body p-3">
                                <div className="d-flex align-items-center">
                                    <div className="me-3">
                                        <img
                                            src={
                                                technicianData.image
                                                    ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${technicianData.image}`
                                                    : "/images/profile-avatar.jpg"
                                            }
                                            alt={technicianData.fullName && technicianData.fullName}
                                            className="rounded-circle"
                                            style={{ width: "80px", height: "80px", objectFit: "cover", border: "2px solid #ccc" }}
                                        />
                                    </div>
                                    <div>
                                        <h5 className="mb-1">{technicianData.fullName && technicianData.fullName}</h5>
                                        <p className="text-muted mb-1">{technicianData.designation && technicianData.designation}</p>
                                        <small className="text-muted">{technicianData.email && technicianData.email}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )} */}

                    <div className="card shadow-sm">
                        <div className="card-body px-2 py-4 p-sm-4">
                            <div className="d-flex align-items-center justify-content-center mb-4 change_month">
                                <button className="btn btn-outline-danger btn-sm me-3" onClick={() => navigateMonth("prev")}>
                                    <FaChevronLeft />
                                </button>
                                <h4 className="mb-0 mx-2 mx-sm-4">
                                    {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                                </h4>
                                <button className="btn btn-outline-danger btn-sm ms-3" onClick={() => navigateMonth("next")}>
                                    <FaChevronRight />
                                </button>
                            </div>

                            <div className="d-flex align-items-center justify-content-center mb-3 change_week">
                                <button
                                    className="btn btn-outline-secondary btn-sm me-3 d-flex align-items-center gap-2"
                                    onClick={() => navigateDays("prev")}
                                    disabled={(() => {
                                        const prevWeekStart = new Date(currentStartDate)
                                        prevWeekStart.setDate(currentStartDate.getDate() - 7)
                                        const today = new Date()
                                        today.setHours(0, 0, 0, 0)
                                        prevWeekStart.setHours(0, 0, 0, 0)
                                        return prevWeekStart < today
                                    })()}
                                >
                                    <FaChevronLeft /> <span>Previous Week</span>
                                </button>
                                <span className="text-muted small">
                                    {currentStartDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {(() => {
                                        const endDate = new Date(currentStartDate)
                                        endDate.setDate(currentStartDate.getDate() + 6)
                                        return endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                                    })()}
                                </span>
                                <button
                                    className="btn btn-outline-secondary btn-sm ms-3 d-flex align-items-center gap-2"
                                    onClick={() => navigateDays("next")}
                                >
                                    <span>
                                        Next Week
                                    </span>
                                    <FaChevronRight />
                                </button>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th className="text-center" style={{ width: "100px" }}></th>
                                            {getDayLabels().map((day, index) => (
                                                <th
                                                    key={day}
                                                    className={`text-center position-relative ${!isDayActive(index) ? "bg-light text-muted" : ""}`}
                                                >
                                                    <div className="d-flex flex-column align-items-center">
                                                        <button
                                                            className={`btn btn-link p-0 text-decoration-none fw-bold ${!isDayActive(index) ? "text-muted" : "text-dark"}`}
                                                            disabled={!isDayActive(index)}
                                                        >
                                                            {day}
                                                            {!isDayActive(index) && <small className="d-block">(Inactive)</small>}
                                                        </button>
                                                        {/* <small className="text-muted mt-1">{getWeekDates()[index]}</small> */}
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {timeSlots.map((timeSlot) => (
                                            <tr key={timeSlot}>
                                                <td className="text-center fw-bold align-middle bg-light text-nowrap">{timeSlot}</td>
                                                {getDayLabels().map((_, dayIndex) => {
                                                    const slotKey = getSlotKey(dayIndex, timeSlot)
                                                    const isSelected = availability[slotKey] || false
                                                    const dayActive = isDayActive(dayIndex)

                                                    return (
                                                        <td
                                                            key={dayIndex}
                                                            className={`text-center align-middle p-3 ${!dayActive ? "bg-light" : ""}`}
                                                        >
                                                            <div
                                                                className={`availability-slot ${isSelected ? "selected" : ""} ${!dayActive ? "disabled" : ""}`}
                                                                onClick={() => dayActive && handleSlotClick(dayIndex, timeSlot)}
                                                                role="button"
                                                                tabIndex={dayActive ? 0 : -1}
                                                                onKeyDown={(e) => {
                                                                    if (dayActive && (e.key === "Enter" || e.key === " ")) {
                                                                        handleSlotClick(dayIndex, timeSlot)
                                                                    }
                                                                }}
                                                            >
                                                                <div
                                                                    className={`slot-circle ${isSelected ? "checked" : ""} ${!dayActive ? "disabled" : ""}`}
                                                                >
                                                                    {isSelected && <FaCheck />}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    )
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {(selectedRange.start || selectedRange.end) && (
                                <div className="alert alert-info mt-3">
                                    <strong>Selection:</strong>
                                    {selectedRange.start && (
                                        <span className="ms-2">
                                            Start: {selectedRange.start.timeSlot} on {getDayLabels()[selectedRange.start.dayIndex]}{" "}
                                            {getWeekDates()[selectedRange.start.dayIndex]}
                                        </span>
                                    )}
                                    {selectedRange.end && <span className="ms-2">End: {selectedRange.end.timeSlot}</span>}
                                    {selectedRange.start && !selectedRange.end && (
                                        <div className="mt-2 text-muted">
                                            <small>
                                                Now select an end time (must be after {selectedRange.start.timeSlot} on the same day)
                                            </small>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="d-flex justify-content-end mt-4">
                                <button
                                    className="btn btn-danger px-4"
                                    onClick={handleUpdate}
                                    disabled={!selectedRange.start || !selectedRange.end}
                                >
                                    {loading2 ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                                role="status"
                                                aria-hidden="true"
                                            ></span>
                                            Updating...
                                        </>
                                    ) : (
                                        "Update"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .availability-slot {
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .availability-slot.disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
        
        .slot-circle {
          width: 24px;
          height: 24px;
          border: 2px solid #dee2e6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          transition: all 0.2s ease;
          background-color: white;
        }
        
        .slot-circle:hover:not(.disabled) {
          border-color: #dc3545;
          transform: scale(1.1);
        }
        
        .slot-circle.checked {
          background-color: #dc3545;
          border-color: #dc3545;
          color: white;
        }
        
        .slot-circle.disabled {
          background-color: #f8f9fa;
          border-color: #dee2e6;
          cursor: not-allowed;
        }
        
        .availability-slot:hover:not(.disabled) .slot-circle {
          border-color: #dc3545;
        }
        
        th {
          background-color: #f8f9fa;
          font-weight: 600;
        }
        
        .table td {
          vertical-align: middle;
        }
        
        .btn-outline-danger:hover {
          background-color: #dc3545;
          border-color: #dc3545;
        }
      `}</style>
        </div>
    )
}
