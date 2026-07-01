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
import { showErrorToast } from "@/lib/toast";

/* ---------- Days ---------- */


export default function EditTechnician({ isOpen, onClose, techId, onSuccess }) {
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
      image: null,
      portfolio: [],
    },
  });

  /* portfolio previews */
  const portfolioFiles = watch("portfolio") || [];
  const [portfolioPreviews, setPortfolioPreviews] = useState([]);
  useEffect(() => {
    const newPreviews = portfolioFiles.map(item => {
      if (item instanceof File) {
        return {
          key: item.name + item.size,
          preview: URL.createObjectURL(item),
          isNew: true,
          file: item,
        };
      }
      return {
        key: item.name || item.preview || item,
        preview: item.preview || item,
        isNew: false,
        name: item.name || item,
      };
    });
    setPortfolioPreviews(newPreviews);

    return () => {
      newPreviews.forEach(p => {
        if (p.isNew && p.preview.startsWith("blob:")) {
          URL.revokeObjectURL(p.preview);
        }
      });
    };
  }, [portfolioFiles]);

  const handlePortfolioChange = (e, currentPortfolio, onChange) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 5 - currentPortfolio.length;
    if (remainingSlots <= 0) return;
    const newFiles = files.slice(0, remainingSlots);
    onChange([...currentPortfolio, ...newFiles]);
    e.target.value = "";
  };

  const removePortfolioImage = (index, currentPortfolio, onChange) => {
    const updated = currentPortfolio.filter((_, i) => i !== index);
    onChange(updated);
  };

  // Watch image to handle preview
  const imageFile = watch("image");


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

        // reset({
        //   fullName: technician.fullName || "",
        //   phoneNumber: technician.phoneNumber || "",
        //   email: technician.email || "",
        //   description: technician.description || "",
        //   designation: technician.designation || "",
        //   workingDays: technician.workingDays
        //     ? technician.workingDays.filter((d) => d.isActive).map((d) => d.day)
        //     : [],
        //   startTime: technician.workingDays?.[0]?.startTime
        //     ? convertTo24Hour(technician.workingDays[0].startTime)
        //     : "",
        //   endTime: technician.workingDays?.[0]?.endTime
        //     ? convertTo24Hour(technician.workingDays[0].endTime)
        //     : "",
        //   // same for breakStart / breakEnd if needed
        //   image: null,
        // });

        reset({
          fullName: technician.fullName,
          phoneNumber: technician.phoneNumber,
          email: technician.email,
          description: technician.description,
          image: null,
          portfolio: (technician.portfolio || []).map((img) => ({
            name: img,
            preview: img.startsWith("http") ? img : `${process.env.NEXT_PUBLIC_IMAGE_URL}/${img}`,
          })),
        });

        if (technician.image) {
          setPreview(`${process.env.NEXT_PUBLIC_IMAGE_URL}/${technician.image}`);
        }

        setLoading(false);
      } catch (err) {
        showErrorToast(err.message);
        onClose();
      }
    };

    fetchTechnician();
  }, [techId, reset, isOpen, onClose]);

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

      // if (
      //   dirtyFields.workingDays ||
      //   dirtyFields.startTime ||
      //   dirtyFields.endTime ||
      //   dirtyFields.breakStart ||
      //   dirtyFields.breakEnd
      // ) {
      //   const dayPayload = ALL_DAYS.map((day) => ({
      //     day,
      //     isActive: data.workingDays.includes(day),
      //     startTime: convertTo12Hour(data.startTime),
      //     endTime: convertTo12Hour(data.endTime),
      //     breakStart: convertTo12Hour(data.breakStart),
      //     breakEnd: convertTo12Hour(data.breakEnd),
      //   }));

      //   fd.append("workingDays", JSON.stringify(dayPayload));
      // }



      if (imageChanged && data.image) {
        fd.append("image", data.image);
      }

      // Check if portfolio changed
      const currentPortfolio = data.portfolio || [];
      const originalPortfolio = originalData?.portfolio || [];

      const hasPortfolioChanged =
        currentPortfolio.length !== originalPortfolio.length ||
        currentPortfolio.some((item, idx) => {
          if (item instanceof File) return true;
          const origItem = originalPortfolio[idx];
          return (item.name || item) !== origItem;
        });

      if (hasPortfolioChanged) {
        currentPortfolio.forEach(item => {
          if (item instanceof File) {
            fd.append("portfolio", item);
          }
        });
        const remainingExisting = currentPortfolio
          .filter(item => !(item instanceof File))
          .map(item => item.name || item);
        fd.append("existingPortfolio", JSON.stringify(remainingExisting));
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
      showErrorToast(err.message ?? "Something went wrong");
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
      <div className="d-flex align-items-center justify-content-between">
        <h3 style={{ fontWeight: "700" }}>Update Technician</h3>
        <button type="button" onClick={onClose} className="close_tech">
          x
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Upload Image */}
        <Controller
          control={control}
          name="image"
          render={({ field }) => (
            <>
              <label className="form-label mb-1">Edit Profile Image</label>

              {!preview ? (
                <div className="add_upload_image mb-1" style={{ height: "120px", width: "120px" }}>
                  <div className="aui_content">
                    <Image src="/images/upload_icon.png" width={40} height={40} alt="" />
                    <span>Edit Image</span>
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
              ) : (
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
        {/* Upload Portfolio */}
        <Controller
          control={control}
          name="portfolio"
          render={({ field }) => (
            <div className="mt-3 text-start">
              <label className="form-label mb-3 fw-medium text-dark" >
                Edit Portfolio (Optional, Max 5 images)
              </label>
              <div className="d-flex flex-wrap gap-2 align-items-center">
                {/* Portfolio Previews */}
                {portfolioPreviews.map((item, index) => (
                  <div key={item.key} style={{ position: "relative", width: "100px", height: "100px" }}>
                    <Image
                      src={item.preview}
                      alt={`portfolio-preview-${index}`}
                      width={100}
                      height={100}
                      className="border object-fit-cover h-100 w-100"
                      style={{ borderRadius: "8px" }}
                    />
                    <button
                      type="button"
                      onClick={() => removePortfolioImage(index, field.value || [], field.onChange)}
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
                ))}

                {/* Upload button box if portfolio < 5 */}
                {(field.value || []).length < 5 && (
                  <div className="add_upload_image" style={{ height: "100px", width: "100px", margin: 0 }}>
                    <div className="aui_content">
                      <Image src="/images/upload_icon.png" width={30} height={30} alt="" />
                      <span style={{ fontSize: "10px" }}>Upload Images</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handlePortfolioChange(e, field.value || [], field.onChange)}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div>
            <label className=" text-sm font-medium mb-0">Full Name</label>
            <InputField {...register("fullName")} placeholder="Full name" />
          </div>

          <div>
            <label className=" text-sm font-medium mb-0">Email</label>
            <InputField {...register("email")} placeholder="abc@gmail.com" />
          </div>

          <div>
            <label className=" text-sm font-medium mb-0">Phone Number</label>
            <InputField
              {...register("phoneNumber")}
              placeholder="+1 555 123-4567"
            />
          </div>

          {/* <div>
            <label className=" text-sm font-medium mb-0">Description</label>
            <InputField {...register("description")} placeholder="Description" />
          </div> */}
          <div className="edit_textarea">
            <label className=" text-sm font-medium mb-1">Description</label>
            <textarea
              {...register("description")}
              placeholder="Description"
              className="w-full p-2 border rounded-md"
              rows={3}
            />
          </div>
        </div>

        {/* Working Days */}
        {/* <div>
          <label className=" text-sm font-medium mb-0">Working Days</label>
          <div className="d-flex mt-1 mb-2 workDays">
            {ALL_DAYS.map((d) => (
              <div key={d} className="calender_item">
                <input type="checkbox" value={d} {...register("workingDays")} />
                <label>{d.slice(0, 3)}</label>
                <div className="calender_spot"></div>
              </div>
            ))}
          </div>
        </div> */}

        {/* Working Hours */}
        {/* <div className="row gy-4 py-3 time_fields"> */}
        {/* <div className="col-md-6">
            <label className=" text-sm font-medium mb-0">Start Time</label>
            <input
              type="time"
              {...register("startTime")}
              className="ms-3 w-full p-2 border rounded-md"
            />
          </div>

          <div className="col-md-6">
            <label className=" text-sm font-medium mb-0">End Time</label>
            <input
              type="time"
              {...register("endTime")}
              className="ms-3 w-full p-2 border rounded-md"
            />
          </div> */}

        {/* <div className="col-md-6">
            <label className=" text-sm font-medium mb-0">
              Break Start
            </label>
            <input
              type="time"
              {...register("breakStart")}
              className="ms-3 w-full p-2 border rounded-md"
            />
          </div>

          <div className="col-md-6">
            <label className=" text-sm font-medium mb-0">
              Break End
            </label>
            <input
              type="time"
              {...register("breakEnd")}
              className="ms-3 w-full p-2 border rounded-md"
            />
          </div> */}
        {/* </div> */}
        {/* <table className="table table-bordered wd_table">
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
 */}



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



