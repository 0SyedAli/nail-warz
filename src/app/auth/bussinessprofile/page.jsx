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
import { showErrorToast, showSuccessToast } from "src/lib/toast";
import api from "../../../lib/axios";
import AuthRedirectHandler from "@/utils/AuthHandler";
import { Spinner } from "@chakra-ui/react";
import TermAndConditionModal from "@/components/Modal/TermAndConditionModal";
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";
import BallsLoading from "@/components/Spinner/BallsLoading";

const MAX_IMAGES = 3;

/* ----------------------- Yup schema ----------------------- */
const schema = Yup.object({
  salonName: Yup.string().required("Salon name is required"),
  phoneNumber: Yup.string()
    .min(6, "Min 6 characters")
    .matches(/^[+\d][\d\s\-()]+$/, "Invalid phone number format")
    .required("Phone number is required"),
  locationName: Yup.string().required("Location is required"),
  bussinessAddress: Yup.string().required("Address is required"),
  description: Yup.string().required("Description is required"),
  workingDays: Yup.array().of(Yup.string()).min(1, "Select at least one working day"),
  startTime: Yup.string().required("Start time is required"),
  endTime: Yup.string().required("End time is required"),
  categories: Yup.array().of(Yup.string()).min(1, "Select at least one category"),
  images: Yup.array()
    .of(
      Yup.mixed()
        .test("fileSize", "Max 2 MB", (f) => f && f.size <= 2 * 1024 * 1024)
        .test("fileType", "Unsupported type", (f) =>
          f && ["image/jpeg", "image/png", "image/webp"].includes(f.type)
        )
    )
    .max(MAX_IMAGES, `Max ${MAX_IMAGES} images`)
    .required("Image is required"),
});
export const clearAllCookies = () => {
  Object.keys(Cookies.get()).forEach((cookie) => {
    Cookies.remove(cookie);
  });
  sessionStorage.clear();
  localStorage.clear();
};
/* ----------------------- Component ----------------------- */
export default function BussinessProfile() {
  const router = useRouter();
  const [adminId, setAdminId] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [pendingData, setPendingData] = useState(null); // hold form data
  const [agree, setAgree] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

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
      categories: [],
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

  /* fetch categories */
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/getAllCategories`);
        if (res?.data?.success) {
          setCategoryList(res?.data?.data || []);
        } else {
          showErrorToast("Failed to fetch categories");
        }
      } catch {
        showErrorToast("Failed to fetch categories");
      }
    })();
  }, []);

  /* step 1 → save form data & open terms */
  const onSubmit = (data) => {
    setPendingData(data);
    setIsTermsOpen(true);
  };

  /* step 2 → final submit after terms accepted */
  const handleFinalSubmit = async () => {
    if (!pendingData) return;
    try {
      setLoading(true);
      const data = pendingData;
      const formData = new FormData();

      formData.append("id", adminId);
      formData.append("salonName", data.salonName);
      const cleanedPhoneNumber = data.phoneNumber.replace(/\D/g, "");
      formData.append("phoneNumber", cleanedPhoneNumber);
      formData.append("bussinessAddress", data.bussinessAddress);
      formData.append("description", data.description);
      formData.append("locationName", data.locationName);
      formData.append("latitude", "37.0802");
      formData.append("longitude", "95.7029");

      /* working days */
      const days = data.workingDays.map((d) => ({
        day: d,
        isActive: true,
        startTime: data.startTime,
        endTime: data.endTime,
      }));
      formData.append("workingDays", JSON.stringify(days));

      /* categories */
      formData.append("categoryId", JSON.stringify(data.categories || []));

      /* images */
      data.images.forEach((f) => formData.append("image", f));

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/updateAdminProfile`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Profile update failed");
      }
      clearAllCookies();
      router.push("/auth/login");
      showSuccessToast(result?.message || "Profile updated successfully");
    } catch (error) {
      showErrorToast(error.message || "Profile update failed");
    } finally {
      setLoading(false);
      setPendingData(null);
      setAgree(false);
      setIsTermsOpen(false);
    }
  };

  /* remove image helper */
  const addChip = (field, value) => {
    if (!value) return;
    const arr = watch(field) ?? [];
    if (arr.includes(value)) return;
    setValue(field, [...arr, value], { shouldValidate: true });
  };
  const removeChip = (field, idx) => {
    const arr = [...(watch(field) ?? [])];
    arr.splice(idx, 1);
    setValue(field, arr, { shouldValidate: true });
  };
  const removeImage = (idx) => {
    const arr = [...(watch("images") ?? [])];
    arr.splice(idx, 1);
    setValue("images", arr, { shouldValidate: true });
  };

  /* ----------------------- UI ----------------------- */
  return (
    <>
      <AuthRedirectHandler />
      {loading ? (
        <BallsLoading borderWidth="mx-auto" />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3>Business Profile Setup</h3>

          {/* basic fields */}
          {[
            { label: "Salon Name", name: "salonName", ph: "Enter name" },
            { label: "Location", name: "locationName", ph: "New York" },
            { label: "Business Address", name: "bussinessAddress", ph: "123 Main St." },
            { label: "Description/Bio", name: "description", ph: "Describe your business..." },
          ].map(({ label, name, ph }) => (
            <div key={name}>
              <label>{label}</label>
              <InputField {...register(name)} placeholder={ph} />
              {errors[name] && <p className="text-danger">{errors[name].message}</p>}
            </div>
          ))}

          {/* phone */}
          <label>Phone Number</label>
          <InputField {...register("phoneNumber")} placeholder="+1 (175) 959-5268" />

          {/* working days */}
          <label>Select Working Days</label>
          <div className="d-flex mt-1 mb-2 workDays">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
              <div key={d} className="calender_item">
                <input type="checkbox" value={d} {...register("workingDays")} />
                <label>{d.slice(0, 3)}</label>
                <div className="calender_spot"></div>
              </div>
            ))}
          </div>
          {errors.workingDays && <p className="text-danger">{errors.workingDays.message}</p>}

          {/* operating hours */}
          <label>Operating Hours</label>
          <div className="cs-form time_picker mt-1 mb-2 d-flex gap-3 align-items-center">
            <input type="time" className="form-control" {...register("startTime")} />
            <span>To</span>
            <input type="time" className="form-control" {...register("endTime")} />
          </div>
          {(errors.startTime || errors.endTime) && (
            <p className="text-danger">
              {errors.startTime?.message || errors.endTime?.message}
            </p>
          )}

          {/* categories */}
          <label>Assign Categories</label>
          <select
            defaultValue=""
            className="form-select input_field2 mt-1"
            onChange={(e) => {
              addChip("categories", e.target.value);
              e.target.value = "";
            }}
          >
            <option value="">-- choose --</option>
            {categoryList.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.categoryName}
              </option>
            ))}
          </select>
          <div className="d-flex flex-wrap my-2 gap-2">
            {watch("categories").map((id, idx) => (
              <span
                key={id}
                className="tags_category"
                onClick={() => removeChip("categories", idx)}
              >
                {categoryList.find((cat) => cat._id === id)?.categoryName || id}
                <RxCross2 />
              </span>
            ))}
          </div>

          {/* images */}
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
                    const files = Array.from(e.target.files || []).slice(0, MAX_IMAGES);
                    field.onChange(files);
                    e.target.value = "";
                  }}
                />
              )}
            />
          </div>
          {errors.images && <p className="text-danger">{errors.images.message}</p>}

          {/* previews */}
          {previews.length > 0 && (
            <div className="my-3 d-flex gap-2 flex-wrap">
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
      )}

      {/* terms modal */}
      <TermAndConditionModal
        isOpen={isTermsOpen}
        onClose={() => {
          setPendingData(null);
          setAgree(false);
          setIsTermsOpen(false);
        }}
        onAgree={handleFinalSubmit}
        agree={agree}
        setAgree={setAgree}
      />
    </>
  );
}
