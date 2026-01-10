"use client";

import { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { BsSearch, BsEye } from "react-icons/bs";

const PAGE_SIZE = 10;

export default function ContentManagement() {
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // 🔐 Auth Guard
  useEffect(() => {
    if (!Cookies.get("token")) router.push("/admin/auth/login");
  }, []);

  // 🔁 Fetch contents
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/content`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      const json = await res.json();
      if (json.success) {
        setItems(json.contents);
        setStats(json.stats);
      }
      setLoading(false);
    };

    fetchContent();
  }, []);

  // 🔍 Search
  const filtered = useMemo(() => {
    return items.filter(c =>
      `${c.name} ${c.address} ${c.social?.name}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const current = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  if (loading) return <p className="m-4">Loading submissions…</p>;

  return (
    <div className="page">
      <div className="dashboard_panel_inner pt-4">

        {/* ===== STATS ===== */}
        {stats && (
          <div className="row g-3 mb-4">
            <Stat title="Total Submissions" value={stats.total} />
            <Stat title="Pending Review" value={stats.pending} color="text-warning" />
            <Stat title="Selected" value={stats.selected} color="text-success" />
          </div>
        )}

        {/* ===== TABLE ===== */}
        <div className="card">
          <div className="card-header bg-white d-flex justify-content-between">
            <div className="position-relative">
              <BsSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <input
                className="form-control ps-5"
                placeholder="Search by name, handle, location…"
                style={{ width: 350 }}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>


          <div className="dash_list card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Social Handle</th>
                    <th>Platform</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {current.map(c => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td>{c.social?.name}</td>
                      <td>{c.social?.platform}</td>
                      <td>{c.address}</td>
                      <td>
                        <StatusBadge status={c.status} />
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                          onClick={() =>
                            router.push(`/admin/dashboard/content/${c._id}`)
                          }
                        >
                          <BsEye /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
  );
}

/* ===== Helpers ===== */

const Stat = ({ title, value, color = "" }) => (
  <div className="col-md-3">
    <div className="card h-100">
      <div className="card-body">
        <p className="text-muted mb-1">{title}</p>
        <h5 className={`fw-bold ${color}`}>{value}</h5>
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    pending: "bg-secondary2 text-dark",
    selected: "bg-dark",
    rejected: "bg-danger",
  };

  return <span className={`badge ${map[status]} py-2`}>{status}</span>;
};
