"use client"

import { useState, useEffect, use } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import { FaCheck, FaChevronLeft, FaChevronRight } from "react-icons/fa"

export default function ManageAvailabilityPage({ params }) {
    const { tId } = use(params);

  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [currentStartDate, setCurrentStartDate] = useState(new Date())
  const [weekStartDate, setWeekStartDate] = useState(new Date())
  const [availability, setAvailability] = useState({})
  const [selectedRange, setSelectedRange] = useState({
    start: null,
    end: null,
  })
  const [technicianData, setTechnicianData] = useState(null)
  const [workingDays, setWorkingDays] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const generateTimeSlots = (startTime, endTime) => {
    const slots = []
    const start = convertTo24Hour(startTime)
    const end = convertTo24Hour(endTime)

    let current = start
    while (current <= end) {
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
          setWorkingDays(result.data.technician.workingDays || [])

          const today = new Date()
          const dayOfWeek = today.getDay()
          const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
          const mondayOfWeek = new Date(today)
          mondayOfWeek.setDate(today.getDate() - daysToMonday)
          mondayOfWeek.setHours(0, 0, 0, 0)

          const timeSlots =
            result.data.technician.workingDays.length > 0
              ? generateTimeSlots(
                  result.data.technician.workingDays[0].startTime,
                  result.data.technician.workingDays[0].endTime,
                )
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

          const existingAvailability = {}
          if (result.data.technician.notAvailable) {
            result.data.technician.notAvailable.forEach((slot) => {
              const [day, month, year] = slot.date.split("-")
              const fullYear = year.length === 2 ? `20${year}` : year
              const slotDate = new Date(`${fullYear}-${month}-${day}`)
              slotDate.setHours(0, 0, 0, 0)

              const today = new Date()
              today.setHours(0, 0, 0, 0)
              const dayIndex = Math.floor((slotDate - today) / (1000 * 60 * 60 * 24))

              console.log("[v0] Processing slot - Date:", slot.date, "Parsed:", slotDate, "DayIndex:", dayIndex)

              if (dayIndex >= 0 && dayIndex < 7) {
                const startTimeIndex = timeSlots.indexOf(slot.startTime)
                const endTimeIndex = timeSlots.indexOf(slot.endTime)

                console.log("[v0] Start index:", startTimeIndex, "End index:", endTimeIndex)

                for (let i = startTimeIndex; i <= endTimeIndex; i++) {
                  if (i >= 0 && i < timeSlots.length) {
                    const slotKey = `${dayIndex}-${timeSlots[i]}`
                    existingAvailability[slotKey] = true
                    console.log("[v0] Marked slot as unavailable:", slotKey)
                  }
                }
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
  }, [tId])

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
    const labels = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStartDate)
      date.setDate(weekStartDate.getDate() + i)
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()
      labels.push(dayName)
    }
    return labels
  }

  const getWeekDates = () => {
    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStartDate)
      date.setDate(weekStartDate.getDate() + i)
      weekDates.push(date.getDate())
    }
    return weekDates
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

    const dayOfWeek = startDate.getDay()
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    const mondayOfWeek = new Date(startDate)
    mondayOfWeek.setDate(startDate.getDate() - daysToMonday)

    if (mondayOfWeek >= todayDate) {
      setCurrentStartDate(mondayOfWeek)
      setWeekStartDate(mondayOfWeek)
    } else {
      setCurrentStartDate(todayDate)
      setWeekStartDate(todayDate)
    }
  }

  const navigateWeek = (direction) => {
    const newWeekStartDate = new Date(weekStartDate)
    if (direction === "prev") {
      newWeekStartDate.setDate(weekStartDate.getDate() - 7)
    } else {
      newWeekStartDate.setDate(weekStartDate.getDate() + 7)
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (newWeekStartDate < today) {
      return
    }

    setWeekStartDate(newWeekStartDate)
    setCurrentMonth(new Date(newWeekStartDate))
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
    const weekStart = new Date(weekStartDate)
    weekStart.setHours(0, 0, 0, 0)

    const currentDate = new Date(weekStart)
    currentDate.setDate(weekStart.getDate() + dayIndex)
    const date = currentDate.getDate()
    const month = String(currentDate.getMonth() + 1).padStart(2, "0")
    const year = currentDate.getFullYear()
    return `${String(date).padStart(2, "0")}-${month}-${year}`
  }

  const handleUpdate = async () => {
    if (selectedRange.start && selectedRange.end) {
      const newSlot = {
        date: formatDate(selectedRange.start.dayIndex),
        startTime: selectedRange.start.timeSlot,
        endTime: selectedRange.end.timeSlot,
      }

      const notAvailableSlots = [newSlot]

      try {
        const result = await updateTechnicianAvailability(notAvailableSlots)

        if (result.success || result.message === "success") {
          alert("Availability updated successfully!")
          setTechnicianData((prev) => ({
            ...prev,
            notAvailable: [...(prev.notAvailable || []), newSlot],
          }))
          setSelectedRange({ start: null, end: null })
          setAvailability({})
        } else {
          alert(`Error: ${result.message || "Failed to update availability"}`)
        }
      } catch (error) {
        console.error("API Error:", error)
        alert("Error updating availability. Please try again.")
      }
    } else {
      alert("Please select both start and end time")
    }
  }

  const isDayActive = (dayIndex) => {
    if (!workingDays || workingDays.length === 0) return true

    const weekStart = new Date(weekStartDate)
    weekStart.setHours(0, 0, 0, 0)

    const currentDate = new Date(weekStart)
    currentDate.setDate(weekStart.getDate() + dayIndex)
    const dayName = currentDate.toLocaleDateString("en-US", { weekday: "long" })

    const workingDay = workingDays.find((wd) => wd.day === dayName)
    return workingDay ? workingDay.isActive : false
  }

  const handleDayToggle = (dayIndex) => {
    const weekStart = new Date(weekStartDate)
    weekStart.setHours(0, 0, 0, 0)

    const currentDate = new Date(weekStart)
    currentDate.setDate(weekStart.getDate() + dayIndex)
    const dayName = currentDate.toLocaleDateString("en-US", { weekday: "long" })

    const updatedWorkingDays = workingDays.map((wd) => {
      if (wd.day === dayName) {
        return { ...wd, isActive: !wd.isActive }
      }
      return wd
    })

    setWorkingDays(updatedWorkingDays)
  }

  const updateWorkingDays = async (updatedDays) => {
    try {
      const formData = new FormData()
      formData.append("id", tId)
      formData.append("workingDays", JSON.stringify(updatedDays))

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/updateTechnician`, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error updating working days:", error)
      throw error
    }
  }

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
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
          <div className="col-12 col-lg-10">
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
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          {technicianData && (
            <div className="card shadow-sm mb-4">
              <div className="card-body p-3">
                <div className="d-flex align-items-center" >
                  <div className="me-3">
                    <img
                      src={
                        technicianData.image
                          ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${technicianData.image}`
                          : "/diverse-technician-team.png"
                      }
                      alt={technicianData.fullName}
                      className="rounded-circle"
                      style={{ width: "60px", height: "60px", objectFit: "cover" }}
                    />
                  </div>
                  <div>
                    <h5 className="mb-1">{technicianData.fullName}</h5>
                    <p className="text-muted mb-1">{technicianData.designation}</p>
                    <small className="text-muted">{technicianData.email}</small>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="card shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-4" style={{width:"fitContent"}}>
                <button className="btn btn-outline-danger btn-sm" onClick={() => navigateMonth("prev")}>
                  <FaChevronLeft />
                </button>
                <h4 className="mb-0">{currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h4>
                <button className="btn btn-outline-danger btn-sm" onClick={() => navigateMonth("next")}>
                  <FaChevronRight />
                </button>
              </div>

              <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
                <button className="btn btn-sm btn-outline-secondary" onClick={() => navigateWeek("prev")}>
                  <FaChevronLeft className="me-1" />
                  Previous Week
                </button>
                <div className="text-center flex-grow-1">
                  <span className="text-muted small">
                    {weekStartDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {(() => {
                      const endDate = new Date(weekStartDate)
                      endDate.setDate(weekStartDate.getDate() + 6)
                      return endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    })()}
                  </span>
                </div>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => navigateWeek("next")}>
                  Next Week
                  <FaChevronRight className="ms-1" />
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
                          <div className="d-flex flex-column align-items-center gap-2">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`day-${index}`}
                                checked={isDayActive(index)}
                                onChange={() => handleDayToggle(index)}
                              />
                              <label className="form-check-label small fw-bold" htmlFor={`day-${index}`}>
                                {day}
                              </label>
                            </div>
                            <small className="text-muted">{getWeekDates()[index]}</small>
                            {!isDayActive(index) && <small className="text-danger">(Day Off)</small>}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((timeSlot) => (
                      <tr key={timeSlot}>
                        <td className="text-center fw-bold align-middle bg-light">{timeSlot}</td>
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

              <div className="d-flex justify-content-end gap-3 mt-4">
                <button
                  className="btn btn-outline-secondary px-4"
                  onClick={async () => {
                    try {
                      const result = await updateWorkingDays(workingDays)
                      if (result.success || result.message === "success") {
                        alert("Working days updated successfully!")
                      } else {
                        alert(`Error: ${result.message || "Failed to update working days"}`)
                      }
                    } catch (error) {
                      alert("Error updating working days")
                    }
                  }}
                >
                  Save Days
                </button>
                <button
                  className="btn btn-danger px-4"
                  onClick={handleUpdate}
                  disabled={!selectedRange.start || !selectedRange.end}
                >
                  Update Availability
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
