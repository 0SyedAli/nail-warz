"use client";
import { Suspense, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import InputField from "@/components/Form/InputField";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import { useRouter, useSearchParams } from "next/navigation";
import { FiPlusCircle } from "react-icons/fi";
import Image from "next/image";
import Cookies from "js-cookie";
import { showErrorToast, showSuccessToast } from "src/lib/toast";
/* ---------- Days ---------- */
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/* ---------- Yup schema ---------- */
const schema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  phoneNumber: Yup.string()
    .min(6, "Min 6 characters")
    .matches(/^[+\d][\d\s\-()]+$/, "Invalid phone number format")
    .required("Phone number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  description: Yup.string().required("Description is required"),
  designation: Yup.string().required("Designation is required"),

  // workingDays: Yup.array()
  //   .of(Yup.string().oneOf(DAYS))
  //   .min(1, "Select at least one working day"),

  // startTime: Yup.string().required("Start time is required"),
  // endTime: Yup.string()
  //   .required("End time is required")
  //   .test("is-after-start", "End time must be after start time", function (value) {
  //     const { startTime } = this.parent;
  //     return !startTime || !value || value > startTime;
  //   }),

  // breakStart: Yup.string()
  //   .nullable()
  //   .test("break-after-start", "Break must be after work start", function (value) {
  //     const { startTime } = this.parent;
  //     return !value || !startTime || value > startTime;
  //   }),

  // breakEnd: Yup.string()
  //   .nullable()
  //   .test("break-after-breakstart", "Break end must be after break start", function (value) {
  //     const { breakStart } = this.parent;
  //     return !value || !breakStart || value > breakStart;
  //   })
  //   .test("break-before-end", "Break must end before work end", function (value) {
  //     const { endTime } = this.parent;
  //     return !value || !endTime || value < endTime;
  //   }),

  image: Yup.mixed()
    .required("Image is required")
    .test("size", "Max 2 MB", (f) => f && f.size <= 2 * 1024 * 1024)
    .test("type", "Unsupported type", (f) =>
      f && ["image/jpeg", "image/png", "image/webp"].includes(f.type)
    ),
});

const AddTechnician = () => {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [salonId, setSalonId] = useState(null);   // null = not checked yet

  useEffect(() => {
    const cookie = Cookies.get("user");
    if (!cookie) {
      router.replace("/auth/login");
      return;
    }

    try {
      const user = JSON.parse(cookie);
      if (user?._id) {
        setSalonId(user._id);
        setIsReady(true);
      } else {
        router.replace("/auth/login");
      }
    } catch {
      router.replace("/auth/login");
    }
  }, [router]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      workingDays: [],
      startTime: "",
      endTime: "",
      breakStart: "",
      breakEnd: "",
      image: null,
    },
  });

  /* preview */
  const file = watch("image");
  const [preview, setPreview] = useState(null);
  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  /* ---------- submit ---------- */
  const onSubmit = async (data) => {
    try {
      const fd = new FormData();
      fd.append("salonId", salonId);
      fd.append("email", data.email);
      fd.append("fullName", data.fullName);
      const cleanedPhoneNumber = data.phoneNumber.replace(/\D/g, '');
      fd.append("phoneNumber", cleanedPhoneNumber);
      fd.append("description", data.description);
      fd.append("designation", data.designation);

      // Ensure all 7 days included
      const ALL_DAYS = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      const formatTo12Hour = (timeStr) => {
        if (!timeStr) return "";
        const [h, m] = timeStr.split(":").map(Number);
        const period = h >= 12 ? "PM" : "AM";
        const hour = h % 12 || 12; // convert 0 -> 12
        return `${hour.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${period}`;
      };
      const dayPayload = ALL_DAYS.map((day) => ({
        day,
        isActive: data.workingDays.includes(day),
        startTime: formatTo12Hour(data.startTime),
        endTime: formatTo12Hour(data.endTime),
        breakStart: formatTo12Hour(data.breakStart),
        breakEnd: formatTo12Hour(data.breakEnd),
      }));

      fd.append("workingDays", JSON.stringify(dayPayload));
      fd.append("image", data.image);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/createTechnician`, {
        method: "POST",
        body: fd,
      });

      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || "Creation failed");
      showSuccessToast(result?.message || "Technician Created Successful")
      router.push(`/dashboard/technicians`);
    } catch (err) {
      alert(err.message ?? "Something went wrong");
      showErrorToast(err.message || "Something went wrong")
    }
  };
  if (!isReady) return null;
  /* ---------- UI ---------- */
  return (
    <>
      <div className="page">
        <div className="addNewService add_form">
          <form className="" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <>
                  <label className="form-label mb-1">Upload Profile Image</label>
                  {!preview && (
                    <>
                      <div className="add_upload_image mb-1" style={{ height: "120px", width: "120px" }}>
                        <div className="aui_content">
                          <Image src="/images/upload_icon.png" width={40} height={40} alt="" />
                          <span>Upload Image</span>
                        </div>
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
                    </>
                  )}
                  {/* <div className="input_file mt-1">
                    <p>Choose image</p>
                    <span>
                      <FiPlusCircle />
                    </span>
                    
                  </div> */}
                  {errors.image && <p className="text-danger">{errors.image.message}</p>}
                  {preview && (
                    <div className="mb-1" style={{ position: "relative", width: "120px", height: "120px" }}>
                      <Image
                        src={preview}
                        alt="preview"
                        width={120}
                        height={120}
                        className=" border object-fit-cover h-100 w-100"
                        style={{ borderRadius: "10px" }}

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
            {/* Basic fields */}
            {[
              { label: "Full Name", name: "fullName", ph: "Full name" },
              { label: "Email", name: "email", ph: "abc@gmail.com" },
              { label: "Description/Bio", name: "description", ph: "Description..." },
              { label: "Designation", name: "designation", ph: "Designation" },
            ].map(({ label, name, ph }) => (
              <div key={name}>
                <label className="form-label ">{label}</label>
                <InputField {...register(name)} placeholder={ph} />
                {errors[name] && <p className="text-danger">{errors[name].message}</p>}
              </div>
            ))}

            {/* Phone */}
            <label className="form-label ">Phone Number</label>
            <InputField
              {...register("phoneNumber")}
              placeholder="+1 (175) 959-5268"
              onChange={(e) => {
                // Format as user types
                const value = e.target.value;
                const cleaned = value.replace(/\D/g, '');
                let formatted = cleaned;

                if (cleaned.length > 0) {
                  formatted = `+${cleaned.substring(0, 1)}`;
                  if (cleaned.length > 1) {
                    formatted += ` (${cleaned.substring(1, 4)}`;
                    if (cleaned.length > 4) {
                      formatted += `) ${cleaned.substring(4, 7)}`;
                      if (cleaned.length > 7) {
                        formatted += `-${cleaned.substring(7, 11)}`;
                      }
                    }
                  }
                }

                e.target.value = formatted;
              }}
            />
            {errors.phoneNumber && <p className="text-danger">{errors.phoneNumber.message}</p>}

            {/* Days */}
            <label className="form-label ">Select Working Days</label>
            <div className="d-flex mt-1 mb-2 col-12 col-lg-6 workDays">
              {DAYS.map((d) => (
                <div key={d} className="calender_item">
                  <input type="checkbox" value={d} {...register("workingDays")} />
                  <label>{d.slice(0, 3)}</label>
                  <div className="calender_spot"></div>
                </div>
              ))}
            </div>
            {errors.workingDays && <p className="text-danger">{errors.workingDays.message}</p>}

            <div className="row g-2 gx-3">
              <div className="col-md-6">
                <label htmlFor="startTime" className="form-label ">Start Time</label>
                <input
                  type="time"
                  {...register("startTime")}
                  className="form-control at_time"
                />
                <div className="text-danger small mt-1">
                  {errors.startTime && <p className="text-danger text-sm mt-1">{errors.startTime.message}</p>}
                </div>
              </div>

              <div className="col-md-6">
                <label htmlFor="endTime" className="form-label ">End Time</label>
                <input
                  type="time"
                  {...register("endTime")}
                  className="form-control at_time"
                />
                <div className="text-danger small mt-1">
                  {errors.endTime && <p className="text-danger text-sm mt-1">{errors.endTime.message}</p>}

                </div>
              </div>

              {/* <div className="col-md-6">
                <label htmlFor="breakStart" className="form-label ">Break Start</label>
                <input
                  type="time"
                  {...register("breakStart")}
                  className="form-control"
                />
                <div className="text-danger small mt-1">
                  {errors.breakStart && <p className="text-danger text-sm mt-1">{errors.breakStart.message}</p>}
                </div>
              </div>

              <div className="col-md-6">
                <label htmlFor="breakEnd" className="form-label ">Break End</label>
                <input
                  type="time"
                  {...register("breakEnd")}
                  className="form-control"
                />
                <div className="text-danger small mt-1">
                  {errors.breakEnd && <p className="text-danger text-sm mt-1">{errors.breakEnd.message}</p>}
                </div>
              </div> */}
            </div>

            {/* Image */}
            <div className="d-flex align-items-center gap-4 mt-4" >
              <AuthBtn title="Back" type="button" location_btn={"back_btn"} onClick={() => router.back()} />
              <AuthBtn title="Continue" type="submit" disabled={isSubmitting} />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default function WrappedAddTechnician() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddTechnician />
    </Suspense>
  );
}
