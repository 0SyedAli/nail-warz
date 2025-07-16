"use client";
import { useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";

const PAGE_SIZE = 10;                         // items per page

const Technicians = () => {
  const [techs, setTechs] = useState([]);   // raw API data
  const [page, setPage] = useState(1);    // current page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salonId, setSalonId] = useState("");

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
  /* ──────────────── Fetch once on mount ──────────────── */
  useEffect(() => {
    if (!salonId) return;
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/getAllTechniciansBySalonId?salonId=${salonId}`
        );
        if (!res.ok) throw new Error("Network error");

        const json = await res.json();
        if (!json.success || !Array.isArray(json.data))
          throw new Error("Unexpected API shape");

        setTechs(json.data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    })();
  }, [salonId]);

  /* ──────────────── Pagination helpers ──────────────── */
  const totalPages = Math.max(1, Math.ceil(techs.length / PAGE_SIZE));

  // memoise the slice for current page
  const currentSlice = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return techs.slice(start, start + PAGE_SIZE);
  }, [techs, page]);

  /* ──────────────── Render ──────────────── */
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
                  <th scope="col"># ID</th>
                  <th scope="col">Full Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Start Date</th>
                  <th scope="col">Designation</th>
                </tr>
              </thead>

              <tbody>
                {currentSlice.map((t) => (
                  <tr key={t._id}>
                    <td>{t._id.slice(-5)}</td>
                    <td>{t.fullName}</td>
                    <td>{t.email}</td>
                    <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td>{t.designation || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ───── Pagination controls ───── */}
            {totalPages > 1 && (
              <div className="pagination justify-content-end mt-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  &lt;
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (n) => (
                    <button
                      key={n}
                      className={n === page ? "active" : ""}
                      onClick={() => setPage(n)}
                    >
                      {n}
                    </button>
                  )
                )}

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
  );
};

export default Technicians;
