"use client";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import InputField from "@/components/Form/InputField";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import { FiPlusCircle } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import Image from "next/image";
import { showErrorToast, showSuccessToast } from "src/lib/toast";
import api from "../../../../lib/axios";
import Cookies from "js-cookie";

const MAX_IMAGES = 3;

export default function EditService() {
  const router = useRouter();
  const { serviceId } = useParams();

  /* -------- React‑Hook‑Form setup -------- */
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      technicians: [],
      category: "",
      images: [],
      serviceName: "",
      servicePrice: "",
      description: ""
    },
  });

  const [technicianList, setTechnicianList] = useState([]);
  const [salonId, setSalonId] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [initialValues, setInitialValues] = useState(null);
  const IMG_BASE = process.env.NEXT_PUBLIC_IMAGE_URL;
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

  /* -------- Fetch service data -------- */
  useEffect(() => {
    if (!serviceId || !salonId) return;

    const fetchServiceData = async () => {
      try {
        const [serviceRes, techniciansRes, categoriesRes] = await Promise.all([
          api.get(`/getServiceById?id=${serviceId}`),
          api.get(`/getAllTechniciansBySalonId?salonId=${salonId}`),
          api.get(`/getAllCategories`)
        ]);

        if (serviceRes.data.success) {
          const serviceData = serviceRes.data.data;
          setExistingImages(serviceData.images || []);

          // Store initial values for comparison
          const initialData = {
            serviceName: serviceData.serviceName,
            servicePrice: serviceData.price,
            description: serviceData.description,
            technicians: Array.isArray(serviceData.technicianId)
              ? serviceData.technicianId
              : [],
            category: serviceData.categoryId,
            images: serviceData.images.map(img => ({
              name: img,
              preview: `${process.env.NEXT_PUBLIC_IMAGE_URL}/${img}`
            }))
          };

          setInitialValues(initialData);
          reset(initialData);
        }

        if (techniciansRes.data.success) {
          setTechnicianList(techniciansRes.data.data || []);
        }

        if (categoriesRes?.data?.success) {
          setCategoryList(categoriesRes?.data?.data || []);
        }
      } catch (error) {
        showErrorToast("Failed to fetch service data");
      }
    };

    fetchServiceData();
  }, [serviceId, salonId, reset]);

  /* -------- Image previews -------- */
  const images = watch("images");
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const newPreviews = images
      .filter(img => img instanceof File)
      .map((f) => URL.createObjectURL(f));

    const existingPreviews = images
      .filter(img => img.preview)
      .map(img => img.preview);

    setPreviews([...existingPreviews, ...newPreviews]);

    return () => {
      newPreviews.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [images]);

  /* -------- Chip helpers -------- */
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

  /* -------- Submit - Only send changed fields -------- */
  const onSubmit = async (data) => {
    try {
      const fd = new FormData();
      fd.append("id", serviceId);

      // Compare each field with initial values and only append if changed
      if (data.serviceName !== initialValues.serviceName) {
        fd.append("serviceName", data.serviceName);
      }

      if (data.servicePrice !== initialValues.servicePrice) {
        fd.append("price", data.servicePrice);
      }

      if (data.description !== initialValues.description) {
        fd.append("description", data.description);
      }

      if (JSON.stringify(data.technicians) !== JSON.stringify(initialValues.technicians)) {
        fd.append("technicianId", JSON.stringify(data.technicians));
      }

      if (data.category !== initialValues.category) {
        fd.append("categoryId", data.category);
      }

      // Handle images - only send new ones
      const newImages = data.images
        .filter(img => img instanceof File);

      newImages.forEach((file) => fd.append("images", file));

      // Add names of existing images to keep
      // const existingImageNames = data.images
      //   .filter(img => img.name && !(img instanceof File))
      //   .map(img => img.name);
      // fd.append("existingImages", JSON.stringify(existingImageNames));

      const res = await api.post("/updateService", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        showSuccessToast("Service updated successfully!");
        router.push("/dashboard/services");
      } else {
        throw new Error(res.data.message || "Failed to update service");
      }
    } catch (e) {
      showErrorToast(e.message ?? "Failed to update service");
    }
  };

  /* -------- Don't render form until auth check complete -------- */
  if (!isReady || !initialValues) return null;

  /* -------- Handle image removal -------- */
  const removeImage = (index) => {
    const currentImages = [...watch("images")];
    currentImages.splice(index, 1);
    setValue("images", currentImages, { shouldValidate: true });
  };

  return (
    <div className="page">
      <div className="addNewService">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* basic fields */}
          <label>Service Name</label>
          <InputField {...register("serviceName")} placeholder="Haircut Basic" />

          <label>Service Price</label>
          <InputField {...register("servicePrice")} placeholder="1500" type="number" />

          <label>Description</label>
          <InputField {...register("description")} placeholder="Describe the service..." />

          {/* technicians select */}
          <label>Assign Technicians</label>
          <select
            defaultValue=""
            className="form-select input_field2 mt-1"
            onChange={(e) => {
              addChip("technicians", e.target.value);
              e.target.value = "";
            }}
          >
            <option value="">-- choose --</option>
            {technicianList.map((t) => (
              <option key={t._id} value={t._id}>
                {t.fullName}
              </option>
            ))}
          </select>
          <div className="d-flex flex-wrap my-2 gap-2">
            {watch("technicians").map((tech, idx) => {
              const technicianId = typeof tech === 'string' ? tech : tech?._id;
              const technician = technicianList.find(t => t._id === technicianId);

              return (
                <span
                  key={technicianId}
                  className="tags_category"
                  onClick={() => removeChip("technicians", idx)}
                >
                  {technician?.fullName || technicianId}
                  <RxCross2 />
                </span>
              );
            })}
          </div>

          <label className="mt-0">Assign Category</label>
          <select
            className="form-select input_field2 mt-1"
            {...register("category")}
          >
            <option value="">-- choose --</option>
            {categoryList.map((cat) => (
              <option key={cat?._id} value={cat?._id}>
                {cat?.categoryName}
              </option>
            ))}
          </select>

          {/* Selected category pill */}
          <div className="d-flex flex-wrap my-2 gap-2">
            {watch("category") && (
              <span
                className="tags_category"
                onClick={() => setValue("category", "", { shouldValidate: true })}
              >
                {categoryList?.find(c => String(c._id) === String(watch("category")))?.categoryName || "Unknown"}
                <RxCross2 />
              </span>
            )}
          </div>

          {/* image upload */}
          <label className="mt-0">Upload Images (max 3)</label>
          <div className="input_file mt-1 mb-2">
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
                    const currentImages = field.value || [];
                    const newFiles = Array.from(e.target.files || [])
                      .slice(0, MAX_IMAGES - currentImages.length);
                    field.onChange([...currentImages, ...newFiles]);
                    e.target.value = "";
                  }}
                />
              )}
            />
          </div>

          {/* previews */}

          {previews.length > 0 && (
            <div className="mb-3 d-flex gap-2 flex-wrap">
              {previews.map((src, i) => (
                <div key={i} style={{ position: "relative" }}>
                  {console.log(`${src}`)}
                  <Image
                    src={`${src}`}
                    alt=""
                    width={100}
                    height={100}
                    style={{ width: "100px", height: "100px" }}
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
                      borderRadius: "50%"
                    }}
                  >
                    <RxCross2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="d-flex align-items-center gap-4 mt-4">
            <AuthBtn title="Back" type="button" location_btn={"back_btn"} onClick={() => router.back()} />

            <AuthBtn
              title="Update Service"
              type="submit"
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
}