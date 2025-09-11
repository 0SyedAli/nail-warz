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

export default function EditTechnician({ isOpen, onClose, techId }) {
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
      fullName: "",
      phoneNumber: "",
      email: "",
      description: "",
      designation: "",
      workingDays: [],
      startTime: "",
      endTime: "",
      breakStart: "",
      breakEnd: "",
      image: null,
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

        setOriginalData(result);

        // populate form
        reset({
          fullName: result.fullName || "",
          phoneNumber: result.phoneNumber || "",
          email: result.email || "",
          description: result.description || "",
          designation: result.designation || "",
          workingDays: result.workingDays
            ? result.workingDays.filter((d) => d.isActive).map((d) => d.day)
            : [],
          startTime:
            result.workingDays && result.workingDays[0]?.startTime
              ? convertTo24Hour(result.workingDays[0].startTime)
              : "",
          endTime:
            result.workingDays && result.workingDays[0]?.endTime
              ? convertTo24Hour(result.workingDays[0].endTime)
              : "",
          breakStart:
            result.workingDays && result.workingDays[0]?.breakStart
              ? convertTo24Hour(result.workingDays[0].breakStart)
              : "",
          breakEnd:
            result.workingDays && result.workingDays[0]?.breakEnd
              ? convertTo24Hour(result.workingDays[0].breakEnd)
              : "",
          image: null,
        });

        if (result.imageUrl) setPreview(result.imageUrl);
        setLoading(false);
      } catch (err) {
        alert(err.message);
        onClose();
      }
    };

    fetchTechnician();
  }, [techId, reset, isOpen, onClose, convertTo24Hour]);

  /* ---------- Handle image preview ---------- */
  useEffect(() => {
    if (imageFile && imageFile instanceof File) {
      const url = URL.createObjectURL(imageFile);
      setPreview(url);
      setImageChanged(true);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  /* ---------- Submit ---------- */
  const onSubmit = async (data) => {
    try {
      const fd = new FormData();
      fd.append("id", techId);

      if (dirtyFields.fullName) fd.append("fullName", data.fullName);
      if (dirtyFields.email) fd.append("email", data.email);
      if (dirtyFields.phoneNumber) {
        const cleanedPhoneNumber = data.phoneNumber.replace(/\D/g, "");
        fd.append("phoneNumber", cleanedPhoneNumber);
      }
      if (dirtyFields.description) fd.append("description", data.description);
      if (dirtyFields.designation) fd.append("designation", data.designation);

      if (
        dirtyFields.workingDays ||
        dirtyFields.startTime ||
        dirtyFields.endTime ||
        dirtyFields.breakStart ||
        dirtyFields.breakEnd
      ) {
        const dayPayload = ALL_DAYS.map((day) => ({
          day,
          isActive: data.workingDays.includes(day),
          startTime: convertTo12Hour(data.startTime),
          endTime: convertTo12Hour(data.endTime),
          breakStart: convertTo12Hour(data.breakStart),
          breakEnd: convertTo12Hour(data.breakEnd),
        }));

        fd.append("workingDays", JSON.stringify(dayPayload));
      }

      if (imageChanged && data.image) {
        fd.append("image", data.image);
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

      onClose();
      router.refresh();
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <InputField {...register("fullName")} placeholder="Full name" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <InputField {...register("email")} placeholder="abc@gmail.com" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <InputField
              {...register("phoneNumber")}
              placeholder="+1 555 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Designation</label>
            <InputField {...register("designation")} placeholder="Stylist" />
          </div>
          <div className="edit_textarea">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              {...register("description")}
              placeholder="Description"
              className="w-full p-2 border rounded-md"
              rows={3}
            />
          </div>
        </div>

        {/* Working Days */}
        <div>
          <label className="block text-sm font-medium mb-1">Working Days</label>
          <div className="d-flex mt-1 mb-2 workDays">
            {ALL_DAYS.map((d) => (
              <div key={d} className="calender_item">
                <input type="checkbox" value={d} {...register("workingDays")} />
                <label>{d.slice(0, 3)}</label>
                <div className="calender_spot"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Working Hours */}
        <div className="row gy-4 py-3 time_fields">
          <div className="col-md-6">
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <input
              type="time"
              {...register("startTime")}
              className="ms-3 w-full p-2 border rounded-md"
            />
          </div>

          <div className="col-md-6">
            <label className="block text-sm font-medium mb-1">End Time</label>
            <input
              type="time"
              {...register("endTime")}
              className="ms-3 w-full p-2 border rounded-md"
            />
          </div>

          <div className="col-md-6">
            <label className="block text-sm font-medium mb-1">
              Break Start
            </label>
            <input
              type="time"
              {...register("breakStart")}
              className="ms-3 w-full p-2 border rounded-md"
            />
          </div>

          <div className="col-md-6">
            <label className="block text-sm font-medium mb-1">
              Break End
            </label>
            <input
              type="time"
              {...register("breakEnd")}
              className="ms-3 w-full p-2 border rounded-md"
            />
          </div>
        </div>

        {/* Upload Image */}
        <Controller
          control={control}
          name="image"
          render={({ field }) => (
            <>
              <label>Upload Image</label>
              <div className="input_file mt-1">
                <p>Choose image</p>
                <span>
                  <FiPlusCircle />
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0] || null;
                    field.onChange(file);
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setPreview(url);
                    }
                    e.target.value = "";
                  }}
                />
              </div>
              {preview && (
                <div
                  className="my-3"
                  style={{ position: "relative", width: "fit-content" }}
                >
                  <Image
                    src={preview}
                    alt="preview"
                    width={100}
                    height={100}
                    className="rounded border object-fit-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      field.onChange(null);
                      setPreview(null);
                    }}
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      background: "#fff",
                      border: "1px solid #ccc",
                      borderRadius: "50%",
                      padding: "2px 5px",
                      cursor: "pointer",
                      lineHeight: 1,
                    }}
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              )}
            </>
          )}
        />

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
