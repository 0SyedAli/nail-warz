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
import { RxCross2 } from "react-icons/rx";
import { showErrorToast } from "src/lib/toast";
import api from "../../../lib/axios";

const MAX_IMAGES = 3;

/* -----------------------  Yup schema  ----------------------- */
const schema = Yup.object({
  salonName: Yup.string().required("Salon name is required"),
  phoneNumber: Yup.string()
    .min(6, "Min 6 characters")
    .required("Phone number is required"),
  locationName: Yup.string().required("Location is required"),
  bussinessAddress: Yup.string().required("Address is required"),
  description: Yup.string().required("Description is required"),

  workingDays: Yup.array()
    .of(Yup.string())
    .min(1, "Select at least one working day"),

  startTime: Yup.string().required("Start time is required"),
  endTime: Yup.string().required("End time is required"),

  images: Yup.array()
    .of(
      Yup.mixed()
        .test("fileSize", "Max 2 MB", (f) => f && f.size <= 2 * 1024 * 1024)
        .test("fileType", "Unsupported type", (f) =>
          f && ["image/jpeg", "image/png", "image/webp"].includes(f.type)
        )
    )
    .max(MAX_IMAGES, `Max ${MAX_IMAGES} images`)
    .required("Image is required"),
});

/* -----------------------  Component  ----------------------- */
export default function BussinessProfile() {
  const router = useRouter();
  const [adminId, setAdminId] = useState("");
  const [categoryList, setCategoryList] = useState("");

  /* RHF setup */
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
      images: [],
      category: "",
    },
  });

  /* preview URLs for selected files */
  const images = watch("images");
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const urls = images.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [images]);

  /* user auth check */
  useEffect(() => {
    const cookie = Cookies.get("user");
    if (!cookie) return router.push("/auth/login");
    try {
      const u = JSON.parse(cookie);
      if (u?._id) setAdminId(u._id);
      else router.push("/auth/login");
    } catch {
      router.push("/auth/login");
    }
  }, []);

  /* fetch technicians once salonId exists */
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/getAllCategories`);
        if (res?.data?.success) {
          setCategoryList(res?.data?.data || []);
        } else {
          showErrorToast("Failed to fetch technicians");
        }
      } catch {
        showErrorToast("Failed to fetch technicians");
      }
    })();
  }, []);

  /* submit */
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("id", adminId);
    formData.append("salonName", data.salonName);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("bussinessAddress", data.bussinessAddress);
    formData.append("description", data.description);
    formData.append("locationName", data.locationName);
    formData.append("latitude", "37.0802");
    formData.append("longitude", "95.7029");

    /* working days payload */
    const days = data.workingDays.map((d) => ({
      day: d,
      isActive: true,
      startTime: data.startTime,
      endTime: data.endTime,
    }));
    formData.append("workingDays", JSON.stringify(days));

    /* categoryIds (static here) */
    formData.append(
      "categoryId",
      JSON.stringify([
        "6850659a42574e73b13e4090",
        "685afb96a44654ec3a8f3d74",
      ])
    );

    data.images.forEach((f) => formData.append("image", f));

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/updateAdminProfile`,
      { method: "POST", body: formData }
    );
    const result = await res.json();
    if (!res.ok || !result.success)
      throw new Error(result.message || "Profile update failed");

    router.push(`/auth/addyourtechnician?salonId=${result?.data?._id}`);
  };

  /* remove image helper */
  const removeImage = (idx) => {
    const files = [...images];
    files.splice(idx, 1);
    setValue("images", files, { shouldValidate: true });
  };

  /* -----------------------  UI  ----------------------- */
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3>Business Profile Setup</h3>

      {/* simple text fields */}
      {[
        { label: "Salon Name", name: "salonName", ph: "Enter name" },
        { label: "Phone Number", name: "phoneNumber", ph: "+1 415 555 0132" },
        { label: "Location Name", name: "locationName", ph: "New York" },
        {
          label: "Business Address",
          name: "bussinessAddress",
          ph: "123 Main St.",
        },
        {
          label: "Description/Bio",
          name: "description",
          ph: "Describe your business...",
        },
      ].map(({ label, name, ph }) => (
        <div key={name}>
          <label>{label}</label>
          <InputField {...register(name)} placeholder={ph} />
          {errors[name] && (
            <p className="text-danger">{(errors)[name].message}</p>
          )}
        </div>
      ))}

      {/* working‑day checkboxes */}
      {/* <label>Select Working Days</label>
      <div className="d-flex mt-1 mb-2" style={{ gap: 10 }}>
        {["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday", "Sunday"].map(
          (d) => (
            <div key={d}>
              <input
                type="checkbox"
                value={d}
                {...register("workingDays")}
              />
              <label>{d.slice(0, 3)}</label>
            </div>
          )
        )}
      </div> */}

      <label>Select Working Days</label>
      <div className="d-flex mt-1 mb-2" style={{ gap: 10 }}>
        {["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday", "Sunday"].map(
          (d) => (
            <div key={d} className="calender_item">
              <input
                type="checkbox"
                value={d}
                {...register("workingDays")}
              />
              <label>{d.slice(0, 3)}</label>
              <div className="calender_spot"></div>
            </div>
          )
        )}
      </div>


      {errors.workingDays && (
        <p className="text-danger">{errors.workingDays.message}</p>
      )}

      {/* time inputs */}
      {/* <label>Operating Hours</label>
      <div className="d-flex gap-3 align-items-center mb-3">
        <input type="time" className="form-control" {...register("startTime")} />
        <span>to</span>
        <input type="time" className="form-control" {...register("endTime")} />
      </div> */}

      <label>Operating Hours</label>
      <div className="cs-form time_picker mt-1 mb-2 d-flex gap-3 align-items-center">
        <input
          type="time"
          className="form-control"
          {...register("startTime")}
        />
        <span>To</span>
        <input
          type="time"
          className="form-control"
          {...register("endTime")}
        />
      </div>

      {(errors.startTime || errors.endTime) && (
        <p className="text-danger">
          {errors.startTime?.message || errors.endTime?.message}
        </p>
      )}
      <label>Assign Category</label>
      <select
        className="form-select input_field2 mt-2"
        {...register("category")}
      >
        <option value="">-- choose --</option>
        {categoryList && categoryList.map((cat) => (
          <option key={cat?._id} value={cat?._id}>
            {cat?.categoryName}
          </option>
        ))}
      </select>
      {errors.category && <p className="text-danger">{errors.category.message}</p>}

      {/* Selected category pill */}
      <div className="d-flex flex-wrap my-2 gap-2">
        {watch("category") && (
          <span
            className="tags_category"
            onClick={() => setValue("category", "", { shouldValidate: true })}
          >
            {categoryList && categoryList.find((c) => c.id === watch("category"))?.label || "Unknown"}
            <RxCross2 />
          </span>
        )}
      </div>
      {/* image upload */}
      <label>Upload Images (max 3)</label>
      <div className="input_file">
        <p>Upload image(s)</p>
        <span>
          <FiPlusCircle />
        </span>
        <Controller
          control={control}
          name="images"
          render={({ field }) => (
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []).slice(
                  0,
                  MAX_IMAGES
                );
                field.onChange(files);
                e.target.value = ""; // reset
              }}
            />
          )}
        />
      </div>
      {errors.images && (
        <p className="text-danger">{errors.images.message}</p>
      )}

      {/* previews */}
      {previews.length > 0 && (
        <div className="my-3 d-flex gap-2 flex-wrap" >
          {previews.map((src, i) => (
            <div key={i} style={{ position: "relative" }}>
              <Image
                src={src}
                alt=""
                width={100}
                height={100}
                style={{ height: "100px" }}
                className="rounded border object-fit-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                style={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  background: "white",
                  borderRadius: "50%",
                }}
              >
                <RxCross2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <AuthBtn title="Continue" type="submit" disabled={isSubmitting} />
    </form>
  );
}
