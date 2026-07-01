"use client";
import { useEffect, useState, useCallback } from "react";
import Modal from "./layout";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import BallsLoading from "../Spinner/BallsLoading";
import { showErrorToast } from "@/lib/toast";

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

export default function EditTechnicianAvailablity({ isOpen, onClose, techId, onSuccess }) {
  const [loading, setLoading] = useState(true);
  const [originalData, setOriginalData] = useState(null);

  const {
    register,
    handleSubmit,
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
          portfolio: (technician.portfolio || []).map((img) => ({
            name: img,
            preview: img.startsWith("http") ? img : `${process.env.NEXT_PUBLIC_IMAGE_URL}/${img}`,
          })),
        });


        setLoading(false);
      } catch (err) {
        showErrorToast(err.message);
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
        {/* Upload Portfolio */}
        <Controller
          control={control}
          name="portfolio"
          render={({ field }) => (
            <div className="mb-3 mt-2 text-start">
              <label className="form-label mb-1 fw-medium text-dark" style={{ fontSize: "14px" }}>
                Upload Portfolio (Optional, Max 5 images)
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



