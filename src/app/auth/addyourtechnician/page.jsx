"use client";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import InputField from "@/components/Form/InputField";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import { useRouter } from "next/navigation";
import { FiPlusCircle } from "react-icons/fi";
import Cookies from "js-cookie";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday", "Sunday"];

/* ---------- Yup schema (single image) ---------- */
const schema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  phoneNumber: Yup.string().min(6, "Min 6 characters").required("Phone number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  description: Yup.string().required("Description is required"),
  designation: Yup.string().required("Designation is required"),

  workingDays: Yup.array()
    .of(Yup.string().oneOf(DAYS))
    .min(1, "Select at least one working day"),

  startTime: Yup.string().required("Start time is required"),
  endTime: Yup.string().required("End time is required"),

  image: Yup.mixed()
    .required("Image is required")
    .test("size", "Max 2 MB", (f) => f && f.size <= 2 * 1024 * 1024)
    .test("type", "Unsupported type", (f) =>
      f && ["image/jpeg", "image/png", "image/webp"].includes(f.type)
    ),
});

export default function AddTechnician() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [salonId, setSalonId] = useState("");

  useEffect(() => {
    const id = searchParams.get("salonId");
    if (!id) return router.push("/auth/login");
    setSalonId(id);
  }, [searchParams]);
  /* ---------- RHF ---------- */
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

  /* auth / salonId retrieval */
  /* ---------- submit ---------- */
  const onSubmit = async (data) => {
    try {
      const fd = new FormData();
      fd.append("salonId", salonId);
      fd.append("email", data.email);
      fd.append("fullName", data.fullName);
      fd.append("phoneNumber", data.phoneNumber);
      fd.append("description", data.description);
      fd.append("designation", data.designation);

      const dayPayload = data.workingDays.map((d) => ({
        day: d,
        isActive: true,
        openingTime: data.startTime,
        closeingTime: data.endTime,
      }));
      fd.append("workingDays", JSON.stringify(dayPayload));
      fd.append("image", data.image);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/createTechnician`, {
        method: "POST",
        body: fd,
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || "Creation failed");

      router.push(`/auth/uploadservice?salonId=${salonId}`);
    } catch (err) {
      alert(err.message ?? "Something went wrong");
    }
  };

  /* ---------- UI ---------- */
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3>Add Your Technician</h3>

      {[
        { label: "Full Name", name: "fullName", ph: "Full name" },
        { label: "Phone Number", name: "phoneNumber", ph: "+1 415 555 0132" },
        { label: "Email", name: "email", ph: "abc@gmail.com" },
        { label: "Description/Bio", name: "description", ph: "Description..." },
        { label: "Designation", name: "designation", ph: "Stylist" },
      ].map(({ label, name, ph }) => (
        <div key={name}>
          <label>{label}</label>
          <InputField {...register(name)} placeholder={ph} />
          {errors[name] && <p className="text-danger">{errors[name].message}</p>}
        </div>
      ))}

      <label>Select Working Days</label>
      <div className="d-flex mt-1 mb-2" style={{ gap: 10 }}>
        {DAYS.map((d) => (
          <div key={d} className="calender_item">
            <input type="checkbox" value={d} {...register("workingDays")} />
            <label>{d.slice(0, 3)}</label>
            <div className="calender_spot"></div>
          </div>
        ))}
      </div>
      {errors.workingDays && <p className="text-danger">{errors.workingDays.message}</p>}

      <label>Operating Hours</label>
      <div className="cs-form time_picker mt-1 mb-2 d-flex gap-3 align-items-center">
        <input type="time" className="form-control" {...register("startTime")} />
        <span>to</span>
        <input type="time" className="form-control" {...register("endTime")} />
      </div>
      {(errors.startTime || errors.endTime) && (
        <p className="text-danger">
          {errors.startTime?.message || errors.endTime?.message}
        </p>
      )}

      <label>Upload Image</label>
      <div className="input_file">
        <p>Choose image</p>
        <span><FiPlusCircle /></span>
        <Controller
          control={control}
          name="image"
          render={({ field }) => (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => field.onChange(e.target.files[0] || null)}
            />
          )}
        />
      </div>
      {errors.image && <p className="text-danger">{errors.image.message}</p>}

      {preview && (
        <div className="my-3">
          <Image
            src={preview}
            alt="preview"
            width={120}
            height={120}
            className="rounded border object-fit-cover"
          />
        </div>
      )}

      <AuthBtn title="Continue" type="submit" disabled={isSubmitting} />
    </form>
  );
}
