"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { showErrorToast, showSuccessToast } from "src/lib/toast";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";

const fallbackImg = "/images/avatar.png";
const SALON_ID = "687181540a1ce00c6a3fa4b2";
const IMG_BASE = process.env.NEXT_PUBLIC_IMAGE_URL;     // e.g. https://cdn.example.com

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  /* ─────────────── GET ─────────────── */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/getAllServicesBySalonId?salonId=${SALON_ID}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const json = await res.json();
        setServices(json?.data ?? []);          // <── path changed
      } catch (err) {
        console.error(err);
        setError("Failed to load services");
        showErrorToast("Couldn’t fetch services. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ───────────── DELETE ───────────── */
  const handleDelete = useCallback(async (service) => {
    if (!confirm(`Delete "${service?.serviceName}"?`)) return;

    setDeleting(service._id);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/deleteService`,
        {
          method: "POST",                       // or DELETE, if the API allows
          headers: { "Content-Type": "application/json" },   //  ←  add this
          body: JSON.stringify({ id: service._id }),         //  req.body.id
        }
      );

      if (!res.ok) throw new Error(`Server responded ${res.status}`);

      setServices((prev) => prev.filter((s) => s._id !== service._id));
      showSuccessToast("Service deleted");
    } catch (err) {
      console.error(err);
      showErrorToast("Couldn’t delete service");
    } finally {
      setDeleting(null);
    }
  }, []);
  /* ───────────── EDIT ───────────── */
  const handleEdit = (service) =>
    router.push(`/dashboard/services/${service._id}`);

  /* ──────────── RENDER ──────────── */
  if (loading) return <p className="p-4">Loading…</p>;
  if (error) return <p className="p-4 text-danger">{error}</p>;
  if (!services.length)
    return (
      <div className="p-4">
        <p>No services yet.</p>
        <Link href="addnewservice" className="btn dash_btn2 mt-3">
          Add New Service
        </Link>
      </div>
    );

  return (
    <div className="page">
      <div className="dashboard_panel_inner">
        <div className="py-4 dash_list">
          <div className="table-responsive">
            <table className="table caption-top">
              <thead>
                <tr>
                  <th># ID</th>
                  <th>Service</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Technician</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {services.map((s) => {
                  const imageSrc =
                    s.images?.length && IMG_BASE
                      ? `${IMG_BASE}/${s.images[0]}`
                      : fallbackImg;

                  const technician =
                    s.technicianId?.[0]?.fullName ||
                    s.technicianId?.[0]?.email ||
                    "—";
                  const category =
                    s.categoryId?.categoryName ||
                    "—";

                  return (
                    <tr key={s._id}>
                      <td>{s._id}</td>
                      <td className="user_td">
                        <img
                          src={imageSrc}
                          alt="Service"
                          onError={(e) => (e.currentTarget.src = fallbackImg)}
                        />
                        {s.serviceName}
                      </td>
                      <td>${Number(s.price).toFixed(2)}</td>
                      <td>{category ?? "—"}</td>
                      <td>{technician}</td>
                      <td>
                        <div className="d-flex gap-2 justify-content-end">
                          <button
                            className="btn orderBtn green"
                            onClick={() => handleEdit(s)}
                          >
                            Edit
                          </button>
                          {/* <button
                            className="btn orderBtn red"
                            
                            
                          >
                            {deleting === s._id ? "Deleting…" : "Delete"}
                          </button> */}
                          <AuthBtn title="Delete" location_btn="btn orderBtn red" type="submit" onClick={() => handleDelete(s)} disabled={deleting === s._id} />

                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="d-flex justify-content-end mt-4">
              <Link href="addnewservice" className="btn dash_btn2">
                Add New Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
