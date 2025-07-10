"use client"
import Image from "next/image";
import styles from "../../../styles/Appoint.module.css";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
const img2 = "/images/avatar.png"
const DashboardPanel = ({ activeTab }) => {
  // Sample order data
  // data/appointments.js
  const appointments = [
    {
      date: "2025-06-10",
      day: "10 B.e.",
      appointments: [
        {
          clientName: "John Doe",
          serviceName: "Haircut",
          serviceImage: img2,
          time: "10:00 - 10:30",
          status: "done", // could be: done, canceled, upcoming
        },
        {
          clientName: "Jane Smith",
          serviceName: "Facial",
          serviceImage: img2,
          time: "10:00 - 10:30",
          status: "done",
        },
        {
          clientName: "Jane Smith",
          serviceName: "Facial",
          serviceImage: img2,
          time: "10:00 - 10:30",
          status: "done",
        },
        {
          clientName: "Jane Smith",
          serviceName: "Facial",
          serviceImage: img2,
          time: "10:00 - 10:30",
          status: "done",
        },
      ],
    },
    {
      date: "2025-06-11",
      day: "11 Ç.a.",
      appointments: [
        {
          clientName: "Alice",
          serviceName: "Massage",
          serviceImage: img2,
          time: "10:00 - 10:30",
          status: "done",
        },
      ],
    },
    {
      date: "2025-06-10",
      day: "12 Ç.",
      appointments: [
        {
          clientName: "John Doe",
          serviceName: "Haircut",
          serviceImage: img2,
          time: "10:00 - 10:30",
          status: "done", // could be: done, canceled, upcoming
        },
        {
          clientName: "Jane Smith",
          serviceName: "Facial",
          serviceImage: img2,
          time: "10:00 - 10:30",
          status: "done",
        },
        {
          clientName: "Jane Smith",
          serviceName: "Facial",
          serviceImage: img2,
          time: "10:00 - 10:30",
          status: "done",
        },
        {
          clientName: "Jane Smith",
          serviceName: "Facial",
          serviceImage: img2,
          time: "10:00 - 10:30",
          status: "done",
        },
      ],
    },
  ];

  return (
    <div className="page">
      <div className="dashboard_panel_inner">
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.childHeader1}>
              <div className={styles.monthNav}>
                <span className={styles.arrow}><IoIosArrowBack /></span>
                <h2 className={styles.monthText}>June, 2025</h2>
                <span className={styles.arrow}><IoIosArrowForward /></span>
              </div>
              <div className={styles.legend}>
                <span><span className={styles.dotGreen}></span> Done</span>
                <span><span className={styles.dotRed}></span> Canceled</span>
              </div>
            </div>
            <input type="text" placeholder="Axtar" className={styles.search} />
          </div>

          <div className={styles.tabs}>
            <button className={`${styles.tab} ${styles.active}`}>Previous Appointments</button>
            <button className={styles.tab}>Upcoming Appointments</button>
          </div>

          {appointments.map((day, index) => (
            <div key={index}>
              <div className={styles.dateLabel}>
                <span>{day.day}</span>
              </div>
              <div className={styles.grid}>
                {day.appointments.map((item, idx) => (
                  <div key={idx} className={styles.card}>
                    <div className={styles.statusBar}></div>
                    <div className={styles.cardContent}>
                      <h4>{item.clientName}</h4>
                      <p>{item.serviceName}</p>
                      <div className={styles.time}>{item.time}</div>
                    </div>
                    <div className={styles.icon}>
                      <BiDotsHorizontalRounded />
                      <Image
                        src={item.serviceImage}
                        width={35}
                        height={35}
                        alt=""
                      /></div>
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

export default DashboardPanel;
