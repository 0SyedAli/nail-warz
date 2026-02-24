'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import AdminDashboardCard from '@/components/AdminDashboardCard'
import AdminVendorRow from '@/components/AdminVendorRow'
import MyChart2 from "@/components/dashChartAdmin/MyChart2";
import { RiSwordLine } from "react-icons/ri";
import {
  LuShoppingCart,
  LuClock,
  LuRefreshCcw,
  LuTruck,
  LuRotateCcw,
  LuWallet,
  LuDollarSign,
  LuUsers,
  LuCheckCheck,
  LuListChecks,
  LuCircleX
} from "react-icons/lu";
export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [weeklyData, setWeeklyData] = useState(null);
  const [topVendors, setTopVendors] = useState([]);
  // useEffect(() => {
  //   const token = Cookies.get('token')

  //   if (!token) {
  //     setError('Authentication token missing')
  //     setLoading(false)
  //     return
  //   }

  //   axios
  //     .get(`${process.env.NEXT_PUBLIC_API_URL}/superAdmin/dashboard`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then(res => {
  //       if (res.data?.success && res.data?.stats) {
  //         setStats(res.data.stats)
  //       } else {
  //         setStats(null)
  //       }
  //     })
  //     .catch(err => {
  //       console.error(err)
  //       setError('Failed to load dashboard data')
  //     })
  //     .finally(() => setLoading(false))
  // }, [])

  useEffect(() => {
    const token = Cookies.get('token')

    if (!token) {
      setError('Authentication token missing')
      setLoading(false)
      return
    }

    const fetchDashboard = axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/dashboard`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )

    const fetchWeeklyStats = axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/weeklyOrderStats`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    const fetchTopVendors = axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/topVendorsBySales`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    Promise.all([fetchDashboard, fetchWeeklyStats, fetchTopVendors])
      .then(([dashboardRes, weeklyRes, vendorsRes]) => {

        // Dashboard Data
        if (dashboardRes.data?.success && dashboardRes.data?.stats) {
          setStats(dashboardRes.data.stats)
        }

        // Weekly Data
        if (weeklyRes.data?.success) {
          setWeeklyData(weeklyRes.data)
        }
        if (vendorsRes.data?.success) {
          setTopVendors(vendorsRes.data.vendors || [])
        }
      })
      .catch(err => {
        console.error(err)
        setError('Failed to load dashboard data')
      })
      .finally(() => setLoading(false))

  }, [])
  const orderStatuses = [
    {
      key: "totalOrders",
      label: "Total Orders",
      icon: LuShoppingCart,
      bg: "#e3f2fd"
    },
    {
      key: "pendingOrders",
      label: "Pending Orders",
      icon: LuClock,
      bg: "#fff3cd"
    },
    {
      key: "processingOrders",
      label: "Processing Orders",
      icon: LuRefreshCcw,
      bg: "#d1ecf1"
    },
    {
      key: "shippedOrders",
      label: "Shipped Orders",
      icon: LuTruck,
      bg: "#cfe2ff"
    },
    {
      key: "deliveredOrders",
      label: "Delivered Orders",
      icon: LuCheckCheck,
      bg: "#d4edda"
    },
    {
      key: "completedOrders",
      label: "Completed Orders",
      icon: LuListChecks,
      bg: "#e2f0d9"
    },
    {
      key: "cancelledOrders",
      label: "Cancelled Orders",
      icon: LuCircleX,
      bg: "#f8d7da"
    },
    {
      key: "returnedOrders",
      label: "Returned Orders",
      icon: LuRotateCcw,
      bg: "#fce5cd"
    },
  ]
  /* ---------------- Loading ---------------- */
  if (loading) {
    return (
      <div className="page">
        <div className="dashboard_panel_inner">
          <div className="my-4 d-flex mb-0">
            <div className="spinner-border text-primary" />
          </div>
        </div>
      </div>
    )
  }

  /* ---------------- Error ---------------- */
  if (error) {
    return (
      <div className="page">
        <div className="dashboard_panel_inner">
          <div className="my-4 d-flex mb-0">
            <p className="text-danger fw-semibold">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  /* ---------------- Empty Data ---------------- */
  if (!stats) {
    return (
      <div className="page">
        <div className="dashboard_panel_inner">
          <div className="my-4 d-flex mb-0">
            <p className="text-muted">No dashboard data available</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="dashboard_panel_inner">
        <div className="my-4 mb-0">
          <div className="row  row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-5 g-2">

            {/* Total Revenue */}
            <AdminDashboardCard
              title="Total Revenue"
              value={`$${(stats.totalRevenue ?? 0).toLocaleString()}`}
              change={stats.revenueChange?.message ?? 'No data'}
              icon={LuDollarSign}
              icon_class="icon-dash"

            />

            {/* Wallet Balance */}
            <AdminDashboardCard
              title="Total User's Wallet"
              value={`$${stats.walletBalance ?? 0}`}
              icon={LuWallet}
              icon_class="icon-dash"

            />

            {/* Total Users */}
            <AdminDashboardCard
              title="Total App Users"
              value={stats.totalUsers ?? 0}
              change={stats.userChange?.message ?? 'No data'}
              icon={LuUsers}
              icon_class="icon-dash"

            />

            {/* Active Battles */}
            <AdminDashboardCard
              title="Total Vendors"
              value={stats.totalVendors ?? 0}
              change={stats.vendorChange?.message ?? 'No data'}
              icon={LuUsers}
              icon_class="icon-dash"

            />

            {/* Active Battles */}
            <AdminDashboardCard
              title="Active Battles"
              value={stats.activeBattles ?? 0}
              icon={RiSwordLine}
              icon_class="icon-dash"

            />
          </div>
          <div className="my-4 d-flex mb-0 admin_chart">
            <MyChart2 />
          </div>
          {/* Bottom Section */}
          <div className="row g-4 mt-1">
            <div className="col-lg-6">
              <div className="card dashboard-card h-100">
                <div className="card-body">
                  <h6 className="fw-semibold mb-1">Weekly Orders Activity</h6>

                  {weeklyData?.weekRange && (
                    <p className="text-muted small mb-3">
                      {weeklyData.weekRange.start} - {weeklyData.weekRange.end}
                    </p>
                  )}

                  {/* <ul className="list-unstyled small text-muted mb-0 row">

                    {orderStatuses.map(status => (
                      <li key={status.key} className="col-6 mb-3 d-flex align-items-center gap-3">
                        <div className="icon-box">
                          <LuShoppingCart />
                        </div>
                        <div className="d-flex flex-column">
                          <span className="fs-6 fw-medium text-black">
                            {status.label}
                          </span>
                          <span>
                            {weeklyData?.data?.[status.key]?.length || 0} Orders
                          </span>
                        </div>
                      </li>
                    ))}

                  </ul> */}

                  <ul className="list-unstyled small text-muted mb-0 row">
                    {orderStatuses.map(status => {
                      const Icon = status.icon;
                      return (
                        <li
                          key={status.key}
                          className="col-12 col-md-6 mb-3 d-flex align-items-center gap-3"
                        >
                          <div
                            className="icon-box d-flex align-items-center justify-content-center"
                            style={{
                              backgroundColor: status.bg,
                              width: "40px",
                              height: "40px",
                              borderRadius: "8px"
                            }}
                          >
                            {Icon && <Icon size={18} />}
                          </div>

                          <div className="d-flex flex-column">
                            <span className="fs-6 fw-medium text-black">
                              {status.label}
                            </span>
                            <span>
                              {weeklyData?.data?.[status.key]?.length || 0} Orders
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>

            {/* <div className="col-lg-6">
              <div className="card dashboard-card h-100">
                <div className="card-body">
                  <h6 className="fw-semibold mb-3">Top Performing Vendors</h6>
                  <AdminVendorRow
                    name="Glamour Nails Salon"
                    location="Los Angeles, CA"
                    amount="$45,680"
                  />
                  <AdminVendorRow
                    name="Elite Nail Studio"
                    location="New York, NY"
                    amount="$38,920"
                  />
                  <AdminVendorRow
                    name="Sparkle & Shine"
                    location="Miami, FL"
                    amount="$22,340"
                  />
                </div>
              </div>
            </div> */}
            <div className="col-lg-6">
              <div className="card dashboard-card h-100">
                <div className="card-body">
                  <h6 className="fw-semibold mb-3">Top Performing Vendors</h6>

                  {topVendors.length === 0 && (
                    <p className="text-muted small">No vendor data available</p>
                  )}

                  {topVendors.slice(0, 5).map((vendor) => (
                    <AdminVendorRow
                      key={vendor._id}
                      name={vendor.salonName || "N/A"}
                      location={vendor.locationName || vendor.city || "Unknown"}
                      amount={`$${(vendor.totalSales ?? 0).toLocaleString()}`}
                    />
                  ))}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
