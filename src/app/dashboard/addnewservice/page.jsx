"use client";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import InputField from "@/components/Form/InputField";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import { FiPlusCircle } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import Image from "next/image";
import { showErrorToast, showSuccessToast } from "src/lib/toast";
import api from "../../../lib/axios";
import Cookies from "js-cookie";

const MAX_IMAGES = 3;
const CategoryId = "6850659a42574e73b13e4090";

const schema = Yup.object({
  serviceName: Yup.string().required("Service name is required"),
  servicePrice: Yup.number().typeError("Enter a number").positive().required(),
  description: Yup.string().required("Description is required"),
  technicians: Yup.array().of(Yup.string()).min(1, "Select at least 1 technician"),
  images: Yup.array()
    .of(
      Yup.mixed()
        // .test("size", "Max 2 MB", (f) => f && f.size <= 2 * 1024 * 1024)
        .test("type", "Unsupported type", (f) =>
          f && ["image/jpeg", "image/png", "image/webp"].includes(f.type)
        )
    )
    // .max(MAX_IMAGES, `Max ${MAX_IMAGES} images`)
    .required("At least one image is required"),
});

export default function AddNewService() {
  const router = useRouter();
  const [technicianList, setTechnicianList] = useState([]);
  const [salonId, setSalonId] = useState(null);   // null = not checked yet
  const [isReady, setIsReady] = useState(false);
  const [categoryList, setCategoryList] = useState("");
  /* -------- Check cookie / auth -------- */
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

  /* -------- Fetch technicians (only when we have a salonId) -------- */
  useEffect(() => {
    if (!salonId) return;                    // 👈 guard
    (async () => {
      try {
        const res = await api.get(`/getAllTechniciansBySalonId?salonId=${salonId}`);
        if (res.data.success) {
          setTechnicianList(res.data.data || []);
        } else {
          showErrorToast("Failed to fetch technicians");
        }
      } catch {
        showErrorToast("Failed to fetch technicians");
      }
    })();
  }, [salonId]);

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

  /* -------- React‑Hook‑Form setup -------- */
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { technicians: [], category: "", images: [] },
  });

  /* -------- Image previews -------- */
  const images = watch("images");
  const [previews, setPreviews] = useState([]);
  useEffect(() => {
    const urls = images.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [images]);

  /* -------- Chip helpers (unchanged except for nullish guards) -------- */
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

  /* -------- Submit -------- */
  const onSubmit = async (data) => {
    try {
      const fd = new FormData();
      fd.append("salonId", salonId);
      fd.append("serviceName", data.serviceName);
      fd.append("price", data.servicePrice);
      fd.append("description", data.description);
      fd.append("technicianId", JSON.stringify(data.technicians));
      fd.append("categoryId", CategoryId);
      data.images.forEach((file) => fd.append("images", file));

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/createService`,
        { method: "POST", body: fd }
      );
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message);
      showSuccessToast(result.success && "Service created successful!");

      // Reset form fields after successful submission
      setValue("serviceName", "");
      setValue("servicePrice", "");
      setValue("description", "");
      setValue("technicians", []);
      setValue("category", "");
      setValue("images", []);
      setPreviews([]);
    } catch (e) {
      showErrorToast(e.message ?? "Failed to create service");
    }
  };

  /* -------- Don’t render form until auth check complete -------- */
  if (!isReady) return null;

  /* ------------- UI ------------- */
  return (
    <>
      <div className="page">
        <div className="addNewService">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* basic fields */}
            <label>Service Name</label>
            <InputField {...register("serviceName")} placeholder="Haircut Basic" />
            {errors.serviceName && <p className="text-danger">{errors.serviceName.message}</p>}

            <label>Service Price (PKR)</label>
            <InputField {...register("servicePrice")} placeholder="1500" type="number" />
            {errors.servicePrice && <p className="text-danger">{errors.servicePrice.message}</p>}

            <label>Description</label>
            <InputField {...register("description")} placeholder="Describe the service..." />
            {errors.description && <p className="text-danger">{errors.description.message}</p>}

            {/* technicians select */}
            <label>Assign Technicians</label>
            <select
              defaultValue=""
              className="form-select input_field2 mt-1"
              onChange={(e) => {
                addChip("technicians", e.target.value);
                e.target.value = "";        // reset so same tech can be re‑selected later
              }}
            >
              <option value="">-- choose --</option>
              {technicianList.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.fullName}
                </option>
              ))}
            </select>
            {/* {errors.technicians && <p className="text-danger">{errors.technicians.message}</p>} */}
            <div className="d-flex flex-wrap my-2 gap-2">
              {watch("technicians").map((id, idx) => (
                <span key={id} className="tags_category" onClick={() => removeChip("technicians", idx)}>
                  {technicianList.find((t) => t._id === id)?.fullName || id}
                  <RxCross2 />
                </span>
              ))}
            </div>
            <label className="mt-0">Assign Category</label>
            <select
              className="form-select input_field2 mt-1"
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
                  {
                    // match against _id, then show categoryName
                    categoryList?.find(c => String(c._id) === String(watch("category")))?.categoryName
                    || "Unknown"
                  }
                  <RxCross2 />
                </span>
              )}
            </div>
            {/* Category select */}
            {/* Category select */}
            {/* <label>Assign Category</label>
        <select
          className="form-select input_field2"
          {...register("category")}
        >
          <option value="">-- choose --</option>
          {CATEGORY_OPTIONS.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
        {errors.category && <p className="text-danger">{errors.category.message}</p>}

        <div className="d-flex flex-wrap my-2 gap-2">
          {watch("category") && (
            <span
              className="tags_category"
              onClick={() => setValue("category", "", { shouldValidate: true })}
            >
              {CATEGORY_OPTIONS.find((c) => c.id === watch("category"))?.label || "Unknown"}
              <RxCross2 />
            </span>
          )}
        </div> */}

            {/* image upload */}
            <label className="mt-0">Upload Images (max 3)</label>
            <div className="input_file mt-1 mb-4">
              <p>Upload image(s)</p>
              <span><FiPlusCircle /></span>
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
                    <Image src={src} alt="" width={100} height={100} className="rounded border object-fit-cover" />
                    <button
                      type="button"
                      onClick={() => removeChip("images", i)}
                      style={{ position: "absolute", top: 2, right: 2, background: "white", borderRadius: "50%" }}
                    >
                      <RxCross2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <AuthBtn title="Create Service" type="submit" disabled={isSubmitting} />
            {/* <button type="sumbit">
          create service
        </button> */}
          </form>
        </div>
      </div>

    </>
  );
}
