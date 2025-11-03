"use client";
import { Suspense, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import InputField from "@/components/Form/InputField";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import { FiPlusCircle } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import Image from "next/image";
import { showErrorToast, showSuccessToast } from "src/lib/toast";
import api from "../../../lib/axios";
import SuccessModal from "@/components/Modal/SuccessModal";
import { useDisclosure } from "@chakra-ui/react";

const MAX_IMAGES = 3;

const schema = Yup.object({
  serviceName: Yup.string().required("Service name is required"),
  servicePrice: Yup.number().typeError("Enter a number").positive().required(),
  description: Yup.string().required("Description is required"),
  technicians: Yup.array().of(Yup.string()).min(1, "Select at least 1 technician"),
  images: Yup.array()
    .of(
      Yup.mixed()
        .test("size", "Max 2 MB", (f) => f && f.size <= 2 * 1024 * 1024)
        .test("type", "Unsupported type", (f) =>
          f && ["image/jpeg", "image/png", "image/webp"].includes(f.type)
        )
    )
    .max(MAX_IMAGES, `Max ${MAX_IMAGES} images`)
    .required("At least one image is required"),
});

function UploadService() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const salonId = searchParams.get("salonId");
  const { isOpen, onOpen, onClose } = useDisclosure();

  /* technicians pulled from API */
  const [technicianList, setTechnicianList] = useState([]);

  /* RHF */
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
      technicians: [],
      category: "",
      images: [],
    },
  });

  /* previews */
  const images = watch("images");
  const [previews, setPreviews] = useState([]);
  useEffect(() => {
    const urls = images.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [images]);

  /* fetch technicians once salonId exists */
  useEffect(() => {
    if (!salonId) return router.push("/auth/login");
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

  const addChip = (field, value) => {
    if (!value) return;

    // ensure we always get an array
    const arr = watch(field) || [];

    if (arr.includes(value)) return;
    setValue(field, [...arr, value], { shouldValidate: true });
  };

  const removeChip = (field, idx) => {
    const arr = [...(watch(field) || [])];
    arr.splice(idx, 1);
    setValue(field, arr, { shouldValidate: true });
  };

  /* submit */
  const onSubmit = async (data) => {
  try {
    const fd = new FormData();
    fd.append("salonId", salonId);
    fd.append("serviceName", data.serviceName);
    fd.append("price", data.servicePrice);
    fd.append("description", data.description);
    fd.append("technicianId", JSON.stringify(data.technicians));
    data.images.forEach((file) => fd.append("images", file));

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/createService`, {
      method: "POST",
      body: fd,
    });

    const result = await res.json();
    if (!res.ok || !result.success) throw new Error(result.message);

    // ✅ Clear cookies before redirect
    Cookies.remove("token");
    Cookies.remove("user");

    // ✅ Redirect to login
    router.push("/login");
  } catch (e) {
    showErrorToast(e.message ?? "Failed to create service");
  }
};

  /* ------------- UI ------------- */
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>Upload Service</h3>

        {/* basic fields */}
        <label>Service Name</label>
        <InputField {...register("serviceName")} placeholder="Haircut Basic" />
        {errors.serviceName && <p className="text-danger">{errors.serviceName.message}</p>}

        <label>Service Price</label>
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

        {/* image upload */}
        <label>Upload Images (max 3)</label>
        <div className="input_file">
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
      <SuccessModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}


export default function WrappedAddTechnician() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UploadService />
    </Suspense>
  );
}