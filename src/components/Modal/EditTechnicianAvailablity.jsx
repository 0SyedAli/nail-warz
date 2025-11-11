"use client";
import { useEffect, useState, useCallback } from "react";
import Modal from "./layout";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { FiPlusCircle } from "react-icons/fi";
import Image from "next/image";

import InputField from "@/components/Form/InputField";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import BallsLoading from "../Spinner/BallsLoading";

/* ---------- Days ---------- */
const ALL_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function EditTechnicianAvailablity({ isOpen, onClose, techId, onSuccess  }) {
  const router = useRouter();
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageChanged, setImageChanged] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting, dirtyFields },
  } = useForm({
    defaultValues: {
      workingDays: [],
      startTime: "",
      endTime: "",
      breakStart: "",
      breakEnd: "",
    },
  });

  // Watch image to handle preview
  const imageFile = watch("image");

  /* ---------- Helpers ---------- */
  const convertTo12Hour = useCallback((timeStr) => {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${period}`;
  }, []);

  const convertTo24Hour = useCallback((timeStr) => {
    if (!timeStr) return "";
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  }, []);

  /* ---------- Fetch technician data ---------- */
  useEffect(() => {
    if (!techId || !isOpen) return;

    const fetchTechnician = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/getTechnicianById?id=${techId}`
        );
        if (!res.ok) throw new Error("Failed to fetch technician");
        const result = await res.json();

        const technician = result.data.technician;

        setOriginalData(technician);


        const workingDaysObj = {};
        ALL_DAYS.forEach(day => {
          const found = technician.workingDays?.find(d => d.day === day);
          workingDaysObj[day] = {
            isActive: !!found?.isActive,
            startTime: found?.startTime ? convertTo24Hour(found.startTime) : "",
            endTime: found?.endTime ? convertTo24Hour(found.endTime) : "",
          };
        });
        reset({
          workingDays: workingDaysObj,
        });


        setLoading(false);
      } catch (err) {
        alert(err.message);
        onClose();
      }
    };

    fetchTechnician();
  }, [techId, reset, isOpen, onClose, convertTo24Hour]);


  /* ---------- Submit ---------- */
  const onSubmit = async (data) => {
    try {
      const fd = new FormData();
      fd.append("id", techId);

      if (dirtyFields.workingDays) {
        const dayPayload = ALL_DAYS.map(day => {
          const d = data.workingDays[day];
          return {
            day,
            isActive: !!d.isActive,
            startTime: convertTo12Hour(d.startTime),
            endTime: convertTo12Hour(d.endTime),
          };
        });
        fd.append("workingDays", JSON.stringify(dayPayload));
      }



      if (fd.entries().next().done) {
        onClose();
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/updateTechnician`,
        {
          method: "POST",
          body: fd,
        }
      );

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Update failed");
      }
      // ✅ Trigger parent refresh
      if (typeof onSuccess === "function") onSuccess();

      onClose();
    } catch (err) {
      alert(err.message ?? "Something went wrong");
    }
  };

  /* ---------- UI ---------- */
  if (loading)
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Edit Technician">
        <div className="flex justify-content-center align-items-center h-50">
          <BallsLoading borderWidth="mx-auto" />
        </div>
      </Modal>
    );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Technician">
      <button type="button" onClick={onClose} className="close_tech">
        x
      </button>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-5">
        <table className="table table-bordered wd_table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Active</th>
              <th style={{ width: 120 }}>Start</th>
              <th style={{ width: 120 }}>End</th>
            </tr>
          </thead>
          <tbody>
            {ALL_DAYS.map(day => {
              const wd = watch(`workingDays.${day}`) || {};
              return (
                <tr key={day}>
                  <td>{day}</td>
                  <td>
                    <input type="checkbox" {...register(`workingDays.${day}.isActive`)} />
                  </td>
                  <td>
                    <input
                      type="time"
                      className="form-control"
                      {...register(`workingDays.${day}.startTime`)}
                      disabled={!wd.isActive}
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      className="form-control"
                      {...register(`workingDays.${day}.endTime`)}
                      disabled={!wd.isActive}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-end gap-3 pt-4">
          <AuthBtn
            title={isSubmitting ? "Updating..." : "Update Technician"}
            type="submit"
            disabled={isSubmitting}
          />
        </div>
      </form>
    </Modal>
  );
}



