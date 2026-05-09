"use client";

import { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { BsSearch } from "react-icons/bs";
import AdminDashboardCard from "@/components/AdminDashboardCard";
import { LuDollarSign, LuWallet } from "react-icons/lu";
import { FiPercent } from "react-icons/fi";

const PAGE_SIZE = 10;

export default function PayoutHistory() {
  const router = useRouter();

  const [vendorId, setVendorId] = useState("");
  const [vendor, setVendor] = useState("");
  const [payouts, setPayouts] = useState([]);
  const [filteredPayouts, setFilteredPayouts] = useState([]);
  const [summary, setSummary] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");


  /* 🔐 Auth */
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    const userCookie = Cookies.get("user");
    if (userCookie) {
      const user = JSON.parse(userCookie);
      setVendorId(user._id);
    }


  }, []);

  /* 🔁 Fetch payout history */
  useEffect(() => {
    if (!vendorId) return;

    const fetchPayoutHistory = async () => {
      setLoading(true);
      setError(null);

      try {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/vendor/${vendorId}`;
        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });


        const json = await res.json();

        // ❌ Vendor not found or any failure
        if (!json.success) {
          setPayouts([]);
          setFilteredPayouts([]);
          setSummary(null);
          setError(json.message || "Something went wrong");
          return; // 🔴 stop here
        }

        // ✅ Success
        const history = json.revenueSummary?.payoutHistory || [];
        setPayouts(history);
        setFilteredPayouts(history);
        setSummary(json.revenueSummary);
        setVendor(json.vendor);
      } catch (err) {
        setError("Server error. Please try again later.");
      } finally {
        setLoading(false);
      }
    };


    fetchPayoutHistory();
  }, [vendorId]);


  const handleFetch = (sDate = startDate, eDate = endDate) => {
    if (!vendorId) return;

    const fetchPayoutHistory = async () => {
      setLoading(true);
      setError(null);

      try {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/vendor/${vendorId}`;
        const params = new URLSearchParams();
        if (sDate) params.append("startDate", sDate);
        if (eDate) params.append("endDate", eDate);
        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });

        const json = await res.json();

        if (!json.success) {
          setPayouts([]);
          setFilteredPayouts([]);
          setSummary(null);
          setError(json.message || "Something went wrong");
          return;
        }

        const history = json.revenueSummary?.payoutHistory || [];
        setPayouts(history);
        setFilteredPayouts(history);
        setSummary(json.revenueSummary);
        setVendor(json.vendor);
      } catch (err) {
        setError("Server error. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayoutHistory();
  };


  /* 🔍 Search */
  useEffect(() => {
    if (!searchTerm) {
      setFilteredPayouts(payouts);
      return;
    }

    const q = searchTerm.toLowerCase();
    setFilteredPayouts(
      payouts.filter(
        (p) =>
          p.transactionId?.toLowerCase().includes(q) ||
          p.payoutMethod?.toLowerCase().includes(q) ||
          p.status?.toLowerCase().includes(q)
      )
    );
    setPage(1);
  }, [searchTerm, payouts]);

  /* 📄 Pagination */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayouts.length / PAGE_SIZE)
  );

  const currentPayouts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredPayouts.slice(start, start + PAGE_SIZE);
  }, [filteredPayouts, page]);

  if (loading) return <p className="m-4">Loading payout history…</p>;
  if (error) return <p className="m-4 text-danger">{error}</p>;

  return (
    <div className="page">
      <div className="dashboard_panel_inner pt-4">

        {/* ===== DATE FILTERS ===== */}
        <div className="mb-4 d-flex gap-3 justify-content-end align-items-center">
          <div className="d-flex align-items-center gap-2">
            <label className="form-label fw-bold text-nowrap mb-0">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="d-flex align-items-center gap-2">
            <label className="form-label fw-bold text-nowrap mb-0">End Date</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button
            className="btn btn-danger"
            onClick={handleFetch}
            disabled={!startDate || !endDate}
          >
            Fetch
          </button>
          {(startDate || endDate) && (
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                setStartDate("");
                setEndDate("");
                handleFetch("", "");
              }}
            >
              Clear
            </button>

          )}
        </div>


        {/* ===== SUMMARY ===== */}

        {summary && (
          <div className="row g-4 justify-content-between">

            {/* Total Revenue */}
            <AdminDashboardCard
              title="Your Total Revenue"
              value={`$${(summary.totalRevenue ?? 0).toLocaleString()}`}
              icon={LuDollarSign}
            />

            {/* Wallet Balance */}
            <AdminDashboardCard
              title="Nail Warz Commission (15%)"
              value={`$${summary.platformFee.amount ?? 0}`}
              icon_class="payoutCommisionIcon"
              // value={'$15'}
              icon={FiPercent}
            />

            {/* Active Battles */}
            <AdminDashboardCard
              title="Total Received"
              value={`$${summary.totalPaidAmount ?? 0}`}
              icon={LuDollarSign}
            />

            {/* Wallet Balance */}
            <AdminDashboardCard
              title="Your Pending Payouts"
              value={`$${summary.totalPayoutPending ?? 0}`}
              icon={LuDollarSign}
            />
          </div>
        )}

        {/* ===== TABLE ===== */}
        <div className="card mt-4">
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 className="fw-bolder mb-0">Your Payout History</h5>

            <div className="position-relative">
              <BsSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <input
                className="form-control ps-5"
                placeholder="Search by payout ID"
                style={{ width: 480 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="dash_list card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Payout ID</th>
                    <th>Title</th>
                    <th>Method</th>
                    <th>Received Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPayouts.map((p, i) => (
                    <tr key={p.transactionId}>
                      {/* <td>{(page - 1) * PAGE_SIZE + i + 1}</td> */}
                      <td>{p.transactionId}</td>
                      <td>{vendor?.salonName || "-"}</td>
                      <td>{p.payoutMethod}</td>
                      <td className="fw-bold">${p.amount}</td>
                      <td>
                        <span className="badge bg-success">Received</span>
                      </td>
                      <td>
                        {new Date(p.payoutDate).toLocaleString()}
                      </td>
                      <td>{p.remarks || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ===== PAGINATION ===== */}
        {totalPages > 1 && (
          <div className="pagination justify-content-end mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              &lt;
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={page === n ? "active" : ""}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
