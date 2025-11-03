"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@chakra-ui/react";
import { showErrorToast, showSuccessToast } from "src/lib/toast";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import Cookies from "js-cookie";
import BallsLoading from "@/components/Spinner/BallsLoading";
import DeleteConfirm from "@/components/Modal/DeleteConfirm";
import AddTechnician from "@/components/Modal/AddTechnician";

const fallbackImg = "/images/avatar.png";
const IMG_BASE = process.env.NEXT_PUBLIC_IMAGE_URL;

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isTechOpen, onOpen: onTechOpen, onClose: onTechClose } = useDisclosure();
  const [salonId, setSalonId] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const router = useRouter();

  /* ──────────── COOKIE CHECK ──────────── */
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
      } else {
        router.replace("/auth/login");
      }
    } catch {
      router.replace("/auth/login");
    }
  }, [router]);

  /* ─────────────── GET ─────────────── */
  useEffect(() => {
    if (!salonId) return;
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/getAllServicesBySalonId?salonId=${salonId}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const json = await res.json();
        setServices(json?.data ?? []);
      } catch (err) {
        console.error(err);
        setError("Failed to load services");
        showErrorToast("Couldn’t fetch services. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [salonId]);

  /* ───────────── DELETE ───────────── */
  const handleDelete = useCallback(async () => {
    if (!selectedService?._id) return;

    setDeleting(selectedService._id);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deleteService`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedService._id }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) throw new Error(data.message || "Delete failed");

      setServices((prev) => prev.filter((s) => s._id !== selectedService._id));
      showSuccessToast(data.message || "Service deleted successfully!");
      onDeleteClose(); // ✅ close modal after delete
    } catch (err) {
      console.error(err);
      showErrorToast("Couldn’t delete service");
    } finally {
      setDeleting(null);
      setSelectedService(null);
    }
  }, [selectedService, onDeleteClose]);

  /* ───────────── EDIT ───────────── */
  const handleEdit = (service) => router.push(`/dashboard/services/${service._id}`);

  /* ───────────── PAGINATION ───────────── */
  const totalPages = Math.ceil(services.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentServices = services.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  /* ──────────── RENDER ──────────── */
  if (loading)
    return (
      <div className="page h-50 d-flex align-items-center">
        <BallsLoading borderWidth="mx-auto" />
      </div>
    );

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
    <>
      <div className="page">
        <div className="dashboard_panel_inner">
          <div className="py-4 dash_list">
            <div className="table-responsive pb-3">
              <table className="table caption-top">
                <thead>
                  <tr>
                    <th>ID #</th>
                    <th>Service</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Technician</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentServices.map((s) => {
                    const imageSrc =
                      s.images?.length && IMG_BASE
                        ? `${IMG_BASE}/${s.images[0]}`
                        : fallbackImg;

                    const technician =
                      s.technicianId?.[0]?.fullName ||
                      s.technicianId?.[0]?.email ||
                      "—";
                    const category = s.categoryId?.categoryName || "—";

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
                        <td>{category}</td>
                        <td>{technician}</td>
                        <td style={{width:"310px"}}>
                          <div className="d-flex gap-2">
                            <AuthBtn
                              title="Assign Technicain"
                              location_btn="btn  addTechBtn red"
                              
                              onClick={() => {
                                setSelectedService(s); // ✅ set selected service
                                onTechOpen();        // ✅ open modal
                              }}
                              disabled={deleting === s._id}
                            />
                            <button
                              className="btn orderBtn green"
                              onClick={() => handleEdit(s)}
                            >
                              Edit
                            </button>
                            <AuthBtn
                              title="Delete"
                              location_btn="btn orderBtn red"
                              onClick={() => {
                                setSelectedService(s); // ✅ set selected service
                                onDeleteOpen();        // ✅ open modal
                              }}
                              disabled={deleting === s._id}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* ─────────── Pagination ─────────── */}
              {services.length > itemsPerPage && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>

                  <div>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`btn btn-sm mx-1 ${currentPage === i + 1
                          ? "btn-primary"
                          : "btn-outline-secondary"
                          }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}

              {/* Add Service Button */}
              <div className="d-flex justify-content-end mt-4">
                <Link href="addnewservice" className="btn dash_btn2">
                  Add New Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Delete Confirmation Modal */}
      <DeleteConfirm
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={handleDelete}
      />
      <AddTechnician
        btntitle="Assign Technician"
        isOpen={isTechOpen}
        onClose={onTechClose}
        service_id={selectedService?._id}
        // onSuccess={() => fetchServices()} // optional refresh callback
      />

    </>
  );
}
