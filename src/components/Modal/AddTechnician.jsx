"use client";

import Modal from "./layout";
import "./modal.css";
import { toast } from "react-toastify";
import { AuthBtn } from "../AuthBtn/AuthBtn";
import axios from "axios";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import MultiSelect from "@/components/MultiSelect";

function AddTechnician({ isOpen, onClose, btntitle, onSuccess, service_id }) {
  const [technicianList, setTechnicianList] = useState([]);
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [salonId, setSalonId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTechs, setLoadingTechs] = useState(false);
  const [hasLoadedService, setHasLoadedService] = useState(false);

  /* ─────────────── Get salonId from cookie ─────────────── */
  useEffect(() => {
    const cookie = Cookies.get("user");
    if (!cookie) return;
    try {
      const user = JSON.parse(cookie);
      if (user?._id) setSalonId(user._id);
    } catch {
      console.error("Invalid cookie format");
    }
  }, []);

  /* ─────────────── Fetch technicians ─────────────── */
  useEffect(() => {
    if (!salonId) return;
    (async () => {
      setLoadingTechs(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/getAllTechniciansBySalonId?salonId=${salonId}`
        );
        if (res.data.success) {
          const formatted = res.data.data.map((tech) => ({
            value: tech._id,
            label: tech.fullName || "Unnamed Technician",
          }));
          setTechnicianList(formatted);
        } else {
          toast.error("Failed to fetch technicians");
        }
      } catch {
        toast.error("Failed to fetch technicians");
      } finally {
        setLoadingTechs(false);
      }
    })();
  }, [salonId]);

  /* ─────────────── Fetch existing assigned technicians ─────────────── */
  useEffect(() => {
    if (!service_id || !technicianList.length || hasLoadedService) return;

    (async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/getServiceById?id=${service_id}`
        );

        if (res.data.success) {
          // ✅ technicianIds is an array of objects, so map to IDs
          const technicianIds = (res.data.data?.technicianId || []).map(t => t._id);
          const preSelected = technicianList.filter((tech) =>
            technicianIds.includes(String(tech.value))
          );
          setSelectedTechs(preSelected);
          setHasLoadedService(true);
          // ✅ Remove assigned from available list
          // setTechnicianList((prev) =>
          //   prev.filter((tech) => !technicianIds.includes(String(tech.value)))
          // );

          setHasLoadedService(true);
        }

      } catch (err) {
        console.error(err);
      }
    })();
  }, [service_id, technicianList, hasLoadedService]);

  /* ─────────────── Handle Submit ─────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTechs.length) {
      setError("Please select at least one technician");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const technicianIds = selectedTechs.map((t) => t.value);
      const formData = new FormData();
      formData.append("id", service_id);
      formData.append("technicianId", JSON.stringify(technicianIds));

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/updateService`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.msg || "Technicians assigned successfully!");
        onSuccess?.();
        handleClose();
      } else {
        toast.error(response?.data?.msg || "Failed to assign technicians");
        setError(response?.data?.msg || "Failed to assign technicians");
      }
    } catch (error) {
      setError(error?.response?.data?.message || error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  /* ─────────────── Handle Close ─────────────── */
  const handleClose = () => {
    onClose();
    setSelectedTechs([]);
    setError(null);
    setHasLoadedService(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="AddCategory_modal_body">
        <h3>Assign Technician(s)</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ margin: "35px 0 40px" }} className="multi_select_tech_input">
            <label className="mb-2">Select Technician(s)</label>

            <MultiSelect
              options={technicianList}
              value={selectedTechs}
              onChange={(val) => setSelectedTechs(val || [])}
              isLoading={loadingTechs}
              placeholder="Search and select technicians..."
            />

            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
          </div>

          <div className="sort_btn justify-content-end gap-2">
            <AuthBtn
              title="Cancel"
              type="button"
              location_btn="themebtn4 green btn"
              onClick={handleClose}
              disabled={isLoading}
            />
            <AuthBtn
              title={btntitle}
              type="submit"
              location_btn="themebtn4 green btn"
              disabled={isLoading}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default AddTechnician;
