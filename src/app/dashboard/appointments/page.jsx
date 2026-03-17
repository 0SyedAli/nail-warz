"use client";

import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

// FullCalendar v7 CSS:
// import "@fullcalendar/style/main.css";
// import "@fullcalendar/timegrid/main.css";
import moment from "moment";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { groupAppointments } from "@/utils/appointmentToEvents";
import BallsLoading from "@/components/Spinner/BallsLoading";

moment.locale("en-GB");

export default function WeeklyCalendar() {
    const [events, setEvents] = useState([]);
    const [salonId, setSalonId] = useState(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const calendarRef = useRef(null);

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
                    // reuse your existing helper – it should return { title, start, end, time, old? }
                    const grouped = groupAppointments(res.data);

                    // FullCalendar accepts the same structure: { title, start, end, extendedProps }
                    const mapped = grouped.map((g) => ({
                        ...g,
                        extendedProps: {
                            time: g.time,
                            old: g.old,
                        },
                    }));

                    setEvents(mapped);
                }
            })
            .finally(() => setLoading(false));
    }, [salonId]);

    // ----------------------------- CLICK ON EVENT -----------------------------
    const handleEventClick = (info) => {
        const timing = info.event.extendedProps.time;
        if (timing) {
            router.push(`appointmentslist?timing=${timing.replace(/\s+/g, "")}`);
        } else {
            router.push(`appointmentslist`);
        }
    };

    // ----------------------------- CUSTOM BUTTON HANDLERS -----------------------------
    const handlePrev = () => {
        const api = calendarRef.current?.getApi();
        api?.prev();
    };

    const handleNext = () => {
        const api = calendarRef.current?.getApi();
        api?.next();
    };

    const handleViewAppointments = () => {
        router.push("appointmentslist");
    };

    if (loading) {
        return (
            <div className="page pt-4 px-0">
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: "400px" }}
                >
                    <BallsLoading />
                </div>
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
            className="appointment-calendere-container"
        >
            <FullCalendar
                ref={calendarRef}
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                    left: "myPrev,myNext",
                    center: "title",
                    right: "viewAppointments",
                }}
                customButtons={{
                    myPrev: {
                        text: "⬅",
                        click: handlePrev,
                    },
                    myNext: {
                        text: "➡",
                        click: handleNext,
                    },
                    viewAppointments: {
                        text: "List View",
                        click: handleViewAppointments,
                    },
                }}
                allDaySlot={false}
                slotLabelInterval="00:30"
                slotDuration="00:30:00"
                /* ⭐ THIS MAKES LABELS SHOW AS 12:00, 12:30, 01:00, 01:30 */
                slotLabelFormat={{
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                }}

                events={events}
                eventClick={handleEventClick}
                height="100%"
                eventClassNames={(arg) => {
                    const isOld = arg.event.extendedProps?.old;
                    return isOld ? ["fc-event-old"] : ["fc-event-new"];
                }}
            />
        </div>
    );
}
