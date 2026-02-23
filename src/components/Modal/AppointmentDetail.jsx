"use client"
import Modal from "./layout";
import Image from "next/image";
import { useDisclosure } from "@chakra-ui/react";
import { ImCross } from "react-icons/im";
import { useState } from "react";
import { Spinner } from "react-bootstrap";


function AppointmentDetail({ isOpen, onClose, modalClass, booking, onUpdated }) {
  const cancelDisc = useDisclosure();
  const rescheduleDisc = useDisclosure();
  const completedDisc = useDisclosure(); // ✅ new for completed

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  if (!booking) return null;

  const { serviceId, userId, technicianId, date, time } = booking;

  /* ───── API Call ───── */
  const handleReschedule = async () => {
    if (!booking) return;
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rescheduleByAdmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          salonId: booking?.salonId?._id,
          bookingId: booking?._id,
          userId: booking?.userId?._id,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to reschedule");
      }

      setMessage("Reschedule successful ✅");
      if (onUpdated) onUpdated();
      rescheduleDisc.onClose(); // close modal
    } catch (err) {
      console.error("Reschedule Error:", err);
      setMessage(err.message || "Something went wrong");
    } finally {
      setLoading(false);
      onClose();
    }
  };
  /* ───── API Call for Completed ───── */
  const handleUpdateStatus = async (newStatus) => {
    if (!booking) return;
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/updateBookingStatus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking?._id,
          status: newStatus, // ✅ dynamic
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || `Failed to update status to ${newStatus}`);
      }

      setMessage(`Booking marked as ${newStatus} ✅`);

      if (onUpdated) onUpdated(); // refresh list
      onClose(); // close modal
    } catch (err) {
      console.error("Update Status Error:", err);
      setMessage(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ───── Main Appointment Detail Modal ───── */}
      <Modal isOpen={isOpen} onClose={onClose} modalClass={modalClass}>
        <button type="button" onClick={onClose} className="close_tech">
          x
        </button>
        <div className="aus_dialog appoint_detail">
          <h3>Appointment Information</h3>
          <div className="row align-items-end gy-2 mb-4">
            <div className="col-12">
              <h5><strong>Service:</strong> {serviceId?.serviceName}</h5>
            </div>
            <div className="col-6">
              <h5><strong>Employee Name:</strong> {technicianId?.fullName}</h5>
            </div>
            <div className="col-6">
              <h5><strong>Date:</strong> {date}</h5>
            </div>
            <div className="col-6">
              <h5><strong>Time:</strong> {time}</h5>
            </div>
            <div className="col-6">
              <h5><strong>Price:</strong> ${serviceId?.price}</h5>
            </div>
          </div>

          <h3>Customer Information</h3>
          <div className="customer_card">
            <div className="cc_leftBorder"></div>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h4 className="mb-2">{userId?.username}</h4>
                <h5 className="mb-0"><strong>ID:</strong>#{userId?._id?.slice(-6)}</h5>
              </div>
              {userId?.image &&
                <Image
                  className="rounded"
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${userId?.image || "/images/avatar.png"}`}
                  width={60}
                  height={60}
                  style={{ width: "60px", height: "60px", objectFit: "cover" }}
                  alt="User"
                  unoptimized

                />
              }
            </div>
            <div className="mt-4 row">
              <h5 className="mb-3 col-12"><strong>Email:</strong> {userId?.email}</h5>
              <h5 className="mb-3 col-6"><strong>Salon Name:</strong> {booking?.salonId?.salonName}</h5>
              <h5 className="mb-3 col-6"><strong>Phone:</strong> {booking?.salonId?.phoneNumber}</h5>
            </div>
          </div>

          {/* ───── Action Buttons ───── */}
          {booking?.status && (
            <div className="mt-4 d-flex align-items-center gap-2 flex-wrap">

              {/* ✅ If Booking is Accepted */}
              {booking.status.toLowerCase() === "accepted" && (
                booking?.rescheduleStatus === "Pending" ? (
                  <p className="text-warning fw-bold mb-0">
                    Reschedule request is pending approval…
                  </p>
                ) : (
                  <>
                    <button className="appoint_btn" onClick={cancelDisc.onOpen}>
                      Cancel Booking
                    </button>

                    <button
                      className="appoint_btn reschedule"
                      onClick={rescheduleDisc.onOpen}
                    >
                      Reschedule
                    </button>

                    <button
                      className="appoint_btn completed"
                      onClick={completedDisc.onOpen}
                    >
                      Completed
                    </button>
                  </>
                )
              )}

              {/* ✅ If Booking is Completed */}
              {booking.status.toLowerCase() === "completed" && (
                <button className="appoint_btn completed" disabled>
                  Booking Completed
                </button>
              )}

              {/* ✅ If Booking is Canceled */}
              {booking.status.toLowerCase() === "canceled" && (
                <button className="appoint_btn cancel" disabled>
                  Booking Canceled
                </button>
              )}

            </div>
          )}

        </div>
      </Modal>

      {/* ───── Nested Cancel Modal ───── */}
      <Modal isOpen={cancelDisc.isOpen} onClose={cancelDisc.onClose} modalClass="cancel_booking">
        <button type="button" onClick={cancelDisc.onClose} className="close_tech">
          x
        </button>
        <div className="aus_dialog appoint_detail">
          <div className="cross_icon">
            <ImCross />
          </div>
          <h3>Cancel Booking</h3>
          <p>Cancel your booking anytime.</p>
          <div className="mt-4 d-flex align-items-center gap-2 flex-wrap justify-content-center">
            <button
              className="appoint_btn px-5"
              onClick={() => handleUpdateStatus("Cancelled")}
              disabled={loading}
            >
              {loading ? <Spinner /> : "Confirm"}
            </button>
            <button className="appoint_btn px-5" onClick={cancelDisc.onClose}>Cancel</button>
          </div>
        </div>
      </Modal>

      {/* ───── Nested Reschedule Modal ───── */}
      <Modal isOpen={rescheduleDisc.isOpen} onClose={rescheduleDisc.onClose} modalClass="cancel_booking">
        <button type="button" onClick={rescheduleDisc.onClose} className="close_tech">x</button>
        <div className="aus_dialog appoint_detail">
          <div className="cross_icon"><ImCross /></div>
          <h3>Reschedule</h3>
          <p>Reschedule this booking for the user.</p>

          {message && <p className="mt-2 text-danger">{message}</p>}

          <div className="mt-4 d-flex align-items-center gap-2 flex-wrap justify-content-center">
            <button
              className="appoint_btn px-5"
              onClick={handleReschedule}
              disabled={loading}
            >
              {loading ? <Spinner /> : "Confirm"}
            </button>
            <button className="appoint_btn px-5" onClick={rescheduleDisc.onClose}>Cancel</button>
          </div>
        </div>
      </Modal>


      {/* ───── Nested Completed Modal ───── */}
      <Modal isOpen={completedDisc.isOpen} onClose={completedDisc.onClose} modalClass="cancel_booking">
        <button type="button" onClick={completedDisc.onClose} className="close_tech">x</button>
        <div className="aus_dialog appoint_detail">
          <div className="cross_icon"><ImCross /></div>
          <h3>Mark as Completed</h3>
          <p>Are you sure you want to mark this booking as completed?</p>

          {message && <p className="mt-2 text-danger">{message}</p>}

          <div className="mt-4 d-flex align-items-center gap-2 flex-wrap justify-content-center">
            <button
              className="appoint_btn px-5"
              onClick={() => handleUpdateStatus("Completed")}
              disabled={loading}
            >
              {loading ? <Spinner /> : "Confirm"}
            </button>
            <button className="appoint_btn px-5" onClick={completedDisc.onClose}>Cancel</button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default AppointmentDetail;
