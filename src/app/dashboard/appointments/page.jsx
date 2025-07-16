"use client";
import Image from "next/image";
import styles from "../../../styles/Appoint.module.css";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";

const fallbackImg = "/images/avatar.png"; // used if service has no image

const Appointments = () => {
  const [activeTab, setActiveTab] = useState("previous");
  const [rawBookings, setRawBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salonId, setSalonId] = useState("");
  
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
  }, []);
  /* ─────────────────────────────────── FETCH ────────────────────────────────── */
  useEffect(() => {
     if (!salonId) return;    
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getBookingsBySalonId?salonId=${salonId}`);
        if (!res.ok) throw new Error("Network error");

        const json = await res.json();
        if (!json.success || !Array.isArray(json.data))
          throw new Error("Unexpected API shape");

        setRawBookings(json.data);
      } catch (e) {
        console.error(e);
        setError(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    })();
  }, [salonId]);

  /* ─────────────────────────── TRANSFORM & GROUP ───────────────────────────── */
  /**
   *  Map API → UI‐ready object and split into previous/upcoming
   *  Keep it inside useMemo so it only recalculates when rawBookings changes
   */
  /* ---------- helper ---------- */
  const splitTab = (dateObj, status) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);                // midnight today
    const past = dateObj < today;
    const finished = ["completed", "canceled", "rejected"].includes(status.toLowerCase());
    return finished ? "previous" : "upcoming";
  };

  /* ---------- inside useMemo ---------- */
  const grouped = useMemo(() => {
    const data = { previous: {}, upcoming: {} };

    rawBookings.forEach((b) => {
      const [dd, MM, yyyy] = b.date.split("-");
      const [hh = "00", mi = "00"] = (b.time || "").split(":");
      const when = new Date(yyyy, MM - 1, dd, hh, mi);

      const tab = splitTab(when, b.status || "");

      const item = {
        clientName: b?.userId?.username || "Unknown",
        serviceName: b?.serviceId?.serviceName || "-",
        serviceImage: b?.serviceId?.images?.[0] || fallbackImg,
        time: b.time ? `${b.time} (${b.date})` : b.date,
        status: (b.status || "pending").toLowerCase(),
      };

      const label = when.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      });

      if (!data[tab][label]) data[tab][label] = { label, ts: when.getTime(), items: [] };
      data[tab][label].items.push(item);
    });

    return data;
  }, [rawBookings]);


  /* ────────────────────────────────── RENDER ────────────────────────────────── */
  if (loading)
    return (
      <div className="page">
        <p className="m-4">Loading appointments…</p>
      </div>
    );
  if (error)
    return (
      <div className="page">
        <p className="m-4 text-danger">Error: {error}</p>
      </div>
    );

  // const appointmentsForTab = grouped[activeTab];
  // const dayKeys = Object.keys(appointmentsForTab).sort(
  //   (a, b) =>
  //     new Date(a.split(" ")[0] + " 2025").getTime() -
  //     new Date(b.split(" ")[0] + " 2025").getTime()
  // );


  const dayGroups = Object.values(grouped[activeTab]);
  // ascending (earliest → latest); reverse() if you need newest first
  dayGroups.sort((a, b) => a.ts - b.ts);


  return (
    <div className="page">
      <div className="dashboard_panel_inner">
        <div className={styles.container}>
          {/* ───── Header (month selector stays static demo) ───── */}
          <div className={styles.header}>
            <div className={styles.childHeader1}>
              <div className={styles.monthNav}>
                <span className={styles.arrow}>
                  <IoIosArrowBack />
                </span>
                <h2 className={styles.monthText}>June, 2025</h2>
                <span className={styles.arrow}>
                  <IoIosArrowForward />
                </span>
              </div>
              <div className={styles.legend}>
                <span>
                  <span className={styles.dotGreen}></span> Done
                </span>
                <span>
                  <span className={styles.dotRed}></span> Canceled
                </span>
              </div>
            </div>
            {/* <input
              type="text"
              placeholder="Axtar"
              className={styles.search}
            /> */}
          </div>

          {/* ───── Tabs ───── */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === "previous" ? styles.active : ""
                }`}
              onClick={() => setActiveTab("previous")}
            >
              Previous Appointments
            </button>
            <button
              className={`${styles.tab} ${activeTab === "upcoming" ? styles.active : ""
                }`}
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming Appointments
            </button>
          </div>

          {/* ───── Content ───── */}
          {dayGroups.length === 0 && (
            <p className="m-4">
              {activeTab === "previous" ? "No past" : "No upcoming"} appointments found.
            </p>
          )}
          {/* if (dayGroups.length === 0) {
    return (
          <p className="m-4">
            {activeTab === "previous" ? "No past" : "No upcoming"} appointments found.
          </p>
          );
  } */}

          {dayGroups.map((group) => (
            <div key={group.label} className="d-flex align-items-center gap-3 py-2">
              <div className={styles.dateLabel}>
                <span>{group.label}</span>
              </div>

              <div className="row w-100">
                {group.items.map((item, idx) => (
                  <div key={idx} className={`${styles.card} col-3`}>
                    <div
                      className={`${styles.statusBar} ${item.status === "canceled" ? styles.red : styles.green
                        }`}
                    ></div>

                    <div className={styles.cardContent}>
                      <h4>{item.clientName}</h4>
                      <p>{item.serviceName}</p>
                      <div className={styles.time}>{item.time}</div>
                    </div>

                    <div className={styles.icon}>
                      <BiDotsHorizontalRounded />
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${item.serviceImage}`}
                        width={35}
                        height={35}
                        alt={item.serviceName}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
