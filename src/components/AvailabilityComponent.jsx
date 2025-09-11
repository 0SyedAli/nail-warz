"use client"

import { useState } from "react"

export default function AvailabilityCalendar({ onAvailabilityChange }) {
  const [availability, setAvailability] = useState({})

  const timeSlots = ["8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "01 PM", "02 PM", "03 PM", "04 PM", "05 PM", "06 PM"]

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

  const handleSlotToggle = (day, time) => {
    const key = `${day}-${time}`
    const newAvailability = {
      ...availability,
      [key]: !availability[key],
    }
    setAvailability(newAvailability)
    onAvailabilityChange?.(newAvailability)
  }

  const handleDayToggle = (day) => {
    const newAvailability = { ...availability }
    const daySlots = timeSlots.map((time) => `${day}-${time}`)
    const allSelected = daySlots.every((slot) => availability[slot])

    daySlots.forEach((slot) => {
      newAvailability[slot] = !allSelected
    })

    setAvailability(newAvailability)
    onAvailabilityChange?.(newAvailability)
  }

  return (
    <div className="availability-calendar">
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th></th>
              {daysOfWeek.map((day) => (
                <th key={day} className="text-center">
                  <button className="btn btn-link p-0 text-decoration-none" onClick={() => handleDayToggle(day)}>
                    {day}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time) => (
              <tr key={time}>
                <td className="fw-bold">{time}</td>
                {daysOfWeek.map((day) => {
                  const key = `${day}-${time}`
                  const isSelected = availability[key]

                  return (
                    <td key={day} className="text-center">
                      <div
                        className={`availability-slot ${isSelected ? "selected" : ""}`}
                        onClick={() => handleSlotToggle(day, time)}
                      >
                        <div className={`slot-circle ${isSelected ? "checked" : ""}`}>{isSelected && "✓"}</div>
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
