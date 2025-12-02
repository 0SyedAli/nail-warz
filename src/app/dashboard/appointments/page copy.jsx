"use client";

import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { groupAppointments } from "@/utils/appointmentToEvents";
import CustomToolbar from "@/components/CustomToolbar";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

export default function WeeklyCalendar() {
    const [events, setEvents] = useState([]);
    const [salonId, setSalonId] = useState(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    // ----------------------------- AUTH CHECK -----------------------------
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

    // ----------------------------- FETCH APPOINTMENTS -----------------------------
    useEffect(() => {
        if (!salonId) return;

        fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/getBookingsBySalonId?salonId=${salonId}`
        )
            .then((r) => r.json())
            .then((res) => {
                if (res.success) {
                    const grouped = groupAppointments(res.data);
                    setEvents(grouped);
                }
            })
            .finally(() => setLoading(false));
    }, [salonId]);

    const handleSelectEvent = (event) => {
        const timing = event.time;
        router.push(`/appointmentlist?timing=${encodeURIComponent(timing)}`);
    };

    if (loading) {
        return (
            <div
                style={{
                    height: "85vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    marginTop: "20px",
                }}
            >
                Loading calendar...
            </div>
        );
    }

    if (!loading && events.length === 0) {
        return (
            <div
                style={{
                    height: "85vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    marginTop: "20px",

                }}
            >
                No appointments found
            </div>
        );
    }

    return (
        <div
            style={{
                height: "85vh",
                padding: "20px",
                background: "linear-gradient(to bottom, #000000, #300000, #ff0000)",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid rgba(255, 0, 0, 0.3)",
                marginTop: "20px",

            }}
        >
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultView="week"
                views={["week"]}
                step={60}
                timeslots={1}
                onSelectEvent={handleSelectEvent}
                // toolbar={true}
                components={{
                    toolbar: (props) => <CustomToolbar {...props} router={router} />,
                }}

                dayLayoutAlgorithm="no-overlap"
                eventPropGetter={(event) => ({
                    style: {
                        background: event.old ? "#9ca3af" : "#d5006d",
                        color: "#fff",
                        borderRadius: "8px",
                        padding: "6px",
                        fontSize: "12px",
                        border: "none",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                    },
                })}
                style={{
                    borderRadius: "10px",
                    background: "white",
                    padding: "10px",
                }}
            />
        </div>
    );
}
