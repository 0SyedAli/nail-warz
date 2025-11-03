"use client";
import { useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { showErrorToast, showSuccessToast } from "src/lib/toast";
import { useDisclosure } from "@chakra-ui/react";
import EditTechnician from "@/components/Modal/EditTechnician";
import { BsSearch } from "react-icons/bs";

const PAGE_SIZE = 10;

const Technicians = () => {
  const [techs, setTechs] = useState([]);
  const [filteredTechs, setFilteredTechs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salonId, setSalonId] = useState("");
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const router = useRouter();

  // ✅ Fetch salon ID from cookies
  useEffect(() => {
    const cookie = Cookies.get("user");
    if (!cookie) return router.push("/auth/login");
    try {
      const u = JSON.parse(cookie);
      if (u?._id) setSalonId(u._id);
      else router.push("/auth/login");
    } catch {
      router.push("/auth/login");
    }
  }, []);

  // ✅ Fetch technicians
  const fetchTechnicians = async () => {
    if (!salonId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/getAllTechniciansBySalonId?salonId=${salonId}`
      );
      if (!res.ok) throw new Error("Network error");
      const json = await res.json();
      if (!json.success || !Array.isArray(json.data))
        throw new Error("Unexpected API response");
      setTechs(json.data);
      setFilteredTechs(json.data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, [salonId]);

  // ✅ Search filter logic
  useEffect(() => {
    const filtered = techs.filter((t) => {
      const nameMatch = t.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
      const idMatch = t._id?.toLowerCase().includes(searchTerm.toLowerCase());
      return nameMatch || idMatch;
    });
    setFilteredTechs(filtered);
    setPage(1); // reset to first page when searching
  }, [searchTerm, techs]);

  const handleEditClick = (tech) => {
    setSelectedTechnician(tech);
    onEditOpen();
  };

  const handleUpdateSuccess = () => {
    showSuccessToast("Technician updated successfully!");
    onEditClose();
    fetchTechnicians(); // Refresh list
  };

  // ✅ Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredTechs.length / PAGE_SIZE));

  const currentSlice = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredTechs.slice(start, start + PAGE_SIZE);
  }, [filteredTechs, page]);

  if (loading)
    return (
      <div className="page">
        <p className="m-4">Loading technicians…</p>
      </div>
    );

  if (error)
    return (
      <div className="page">
        <p className="m-4 text-danger">Error: {error}</p>
      </div>
    );

  if (techs.length === 0)
    return (
      <div className="page">
        <p className="m-4">No technicians found for this salon.</p>
        <Link href="addnewtechnician" className="btn dash_btn2 mt-3">
          Add New Technician
        </Link>
      </div>
    );

  return (
    <div className="page">
      <div className="dashboard_panel_inner pt-2">
        <div className="text-end">
          <Link href="addnewtechnician" className="btn dash_btn2 mt-3">
            Add New Technician
          </Link>
        </div>
        <div className="card mt-4">
          <div className="card-header bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5 className="fw-bolder mb-0">Technician List</h5>
            <div className="d-flex align-items-center gap-2 position-relative">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => fetchTechnicians()}
                disabled={loading}
              >
                Refresh
              </button>
              <div className="position-relative">
                <BsSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <input
                  type="text"
                  className="form-control ps-5"
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: "280px" }}
                />
              </div>
            </div>
          </div>

          <div className="dash_list card-body p-0">
            <div className="table-responsive">
              <table className="table caption-top table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th># ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Start Date</th>
                    <th>Phone Number</th>
                    <th>Designation</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentSlice.map((t) => (
                    <tr key={t._id}>
                      <td># {t._id.slice(-5)}</td>
                      <td>{t.fullName}</td>
                      <td>{t.email}</td>
                      <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                      <td>{t.phoneNumber || "-"}</td>
                      <td>{t.designation || "-"}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => router.push(`technicians/${t._id}`)}
                          >
                            View
                          </button>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleEditClick(t)}
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="pagination justify-content-end mt-4">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    &lt;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      className={n === page ? "active" : ""}
                      onClick={() => setPage(n)}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    &gt;
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Edit Modal */}
      {selectedTechnician && (
        <EditTechnician
          isOpen={isEditOpen}
          onClose={onEditClose}
          techId={selectedTechnician?._id}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default Technicians;
