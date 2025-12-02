// "use client";
// import Image from "next/image";
// import styles from "../../../styles/Appoint.module.css";
// import { BiDotsHorizontalRounded } from "react-icons/bi";
// import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
// import { useState, useEffect, useMemo } from "react";
// import Cookies from "js-cookie";
// import AppointmentDetail from "@/components/Modal/AppointmentDetail";
// import { useDisclosure } from "@chakra-ui/react";
// import { useRouter } from "next/navigation";
// import BallsLoading from "@/components/Spinner/BallsLoading";

// const fallbackImg = "/images/avatar.png"; // used if service has no image

// const Appointments = () => {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [activeTab, setActiveTab] = useState("previous");
//   const [rawBookings, setRawBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [salonId, setSalonId] = useState("");
//   const [bookingDetail, setBookingDetail] = useState(null);
//   const router = useRouter();

//   /* ─────────────── Get salonId from cookie ─────────────── */
//   useEffect(() => {
//     const cookie = Cookies.get("user");
//     if (!cookie) return router.push("/auth/login");
//     try {
//       const u = JSON.parse(cookie);
//       if (u?._id) setSalonId(u._id);
//       else router.push("/auth/login");
//     } catch {
//       router.push("/auth/login");
//     }
//   }, [router]);

//   /* ─────────────── Fetch bookings ─────────────── */
//   const fetchBookings = async () => {
//     if (!salonId) return;
//     try {
//       setLoading(true);
//       setError(null);

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/getBookingsBySalonId?salonId=${salonId}`
//       );
//       const json = await res.json();

//       if (!res.ok) throw new Error(json.message || "Network error");

//       if (!json.success) {
//         if (json.message === "No bookings found for this salon") {
//           setRawBookings([]);
//           return;
//         }
//         throw new Error(json.message || "Unexpected API response");
//       }

//       if (!Array.isArray(json.data))
//         throw new Error("Unexpected data format");

//       setRawBookings(json.data || []);
//     } catch (e) {
//       console.error(e);
//       setError(e.message || "Unknown error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // initial fetch
//   useEffect(() => {
//     fetchBookings();
//   }, [salonId]);
//   /* ─────────────── Helper: Only keep completed & accepted ─────────────── */
//   const splitTab = (status) => {
//     if (!status) return null;
//     const normalized = status.toLowerCase();
//     if (normalized === "completed") return "previous";
//     if (normalized === "accepted") return "upcoming";
//     return null; // ignore others
//   };

//   /* ─────────────── Transform into grouped format ─────────────── */
//   const grouped = useMemo(() => {
//     const data = { previous: {}, upcoming: {} };

//     rawBookings.forEach((b) => {
//       const tab = splitTab(b.status || "");
//       if (!tab) return; // skip ignored statuses

//       const [dd, MM, yyyy] = b.date.split("-");
//       const [hh = "00", mi = "00"] = (b.time || "").split(":");
//       const when = new Date(yyyy, MM - 1, dd, hh, mi);

//       const item = {
//         bookingId: b._id,
//         clientName: b?.userId?.username || "Unknown",
//         serviceName: b?.serviceId?.serviceName || "-",
//         serviceImage: b?.serviceId?.images?.[0] || fallbackImg,
//         time: b.time ? `${b.time} (${b.date})` : b.date,
//         status: (b.status || "pending").toLowerCase(),
//       };

//       const label = when.toLocaleDateString("en-GB", {
//         weekday: "short",
//         day: "2-digit",
//         month: "short",
//       });

//       if (!data[tab][label]) {
//         data[tab][label] = { label, ts: when.getTime(), items: [] };
//       }
//       data[tab][label].items.push(item);
//     });

//     return data;
//   }, [rawBookings]);

//   /* ─────────────── Fetch booking detail ─────────────── */
//   const fetchBookingDetail = async (id) => {
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/getBookingById?bookingId=${id}`
//       );
//       const json = await res.json();
//       if (!json.success) throw new Error("Failed to load booking");
//       setBookingDetail(json.data);
//       onOpen();
//     } catch (e) {
//       console.error("Booking Detail Error:", e.message);
//     }
//   };

//   /* ─────────────── Handle loading/error/empty ─────────────── */
//   if (loading)
//     return (
//       <div className="page h-50 d-flex align-items-center">
//         <BallsLoading borderWidth="mx-auto" />
//       </div>
//     );

//   if (error)
//     return (
//       <div className="page">
//         <p className="m-4 text-danger">Error: {error}</p>
//       </div>
//     );

//   if (rawBookings.length === 0)
//     return (
//       <div className="page">
//         <p className="m-4">No appointments found for your salon.</p>
//         <p className="m-4">When you receive bookings, they will be listed here.</p>
//       </div>
//     );

//   /* ─────────────── Sort and render ─────────────── */
//   const dayGroups = Object.values(grouped[activeTab]);
//   dayGroups.sort((a, b) => a.ts - b.ts);

//   return (
//     <div className="page">
//       <div className="dashboard_panel_inner">
//         <div className={styles.container}>
//           {/* Header */}
//           <div className={styles.header}>
//             <div className={styles.childHeader1}>
//               {/* <div className={styles.monthNav}>
//                 <span className={styles.arrow}>
//                   <IoIosArrowBack />
//                 </span>
//                 <h2 className={styles.monthText}>June, 2025</h2>
//                 <span className={styles.arrow}>
//                   <IoIosArrowForward />
//                 </span>
//               </div> */}
//               <div className={styles.legend}>
//                 <span>
//                   <span className={styles.dotGreen}></span> Completed
//                 </span>
//                 <span>
//                   <span className={styles.dotRed}></span> Accepted
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Tabs */}
//           <div className={styles.tabs}>
//             <button
//               className={`${styles.tab} ${styles.green} ${activeTab === "previous" ? styles.active : ""
//                 }`}
//               onClick={() => setActiveTab("previous")}
//             >
//               Previous Appointments
//             </button>
//             <button
//               className={`${styles.tab} ${styles.red} ${activeTab === "upcoming" ? styles.active : ""
//                 }`}
//               onClick={() => setActiveTab("upcoming")}
//             >
//               Upcoming Appointments
//             </button>
//           </div>

//           {/* Content */}
//           {dayGroups.length === 0 && (
//             <p className="m-4">
//               {activeTab === "previous" ? "No past" : "No upcoming"} appointments
//               found.
//             </p>
//           )}

//           {dayGroups.map((group) => (
//             <div
//               key={group.label}
//               className="d-flex align-items-center flex-column flex-md-row gap-3 py-2"
//             >
//               <div className={styles.dateLabel}>
//                 <span>{group.label}</span>
//               </div>

//               <div className="row w-100 g-3">
//                 {group.items.map((item, idx) => (
//                   <div className="col-md-6 col-lg-4 col-xl-3 px-0">
//                     <div
//                       key={idx}
//                       className={`${styles.card}`}
//                       onClick={() => fetchBookingDetail(item.bookingId)}
//                     >
//                       <div
//                         className={`${styles.statusBar} ${activeTab === "previous" ? styles.green : styles.red
//                           }`}
//                       ></div>

//                       <div className={styles.cardContent}>
//                         <h4>{item.clientName}</h4>
//                         <p>{item.serviceName}</p>
//                         <div className={styles.time}>{item.time}</div>
//                       </div>

//                       <div className={styles.icon}>
//                         <BiDotsHorizontalRounded />
//                         <Image
//                           src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${item.serviceImage}` || fallbackImg}
//                           width={35}
//                           height={35}
//                           alt={item.serviceName}
//                           unoptimized
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Detail modal */}
//       <AppointmentDetail
//         isOpen={isOpen}
//         onClose={onClose}
//         modalClass="appoint_detail_container"
//         booking={bookingDetail}
//         onUpdated={fetchBookings}   // ✅ pass callback
//       />
//     </div>
//   );
// };

// export default Appointments;


import MangeOrder from '@/components/MangeOrder'
import React from 'react'

const Appoitment = () => {
  return (
    <MangeOrder />
  )
}

export default Appoitment