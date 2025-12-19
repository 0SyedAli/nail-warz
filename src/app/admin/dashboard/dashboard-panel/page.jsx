'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import AdminDashboardCard from '@/components/AdminDashboardCard'
import AdminVendorRow from '@/components/AdminVendorRow'
import MyChart2 from "@/components/dashChartAdmin/MyChart2";
import { LuDollarSign, LuShoppingCart, LuUsers } from "react-icons/lu";
import { LuWallet } from "react-icons/lu";
import { RiSwordLine } from "react-icons/ri";

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = Cookies.get('token')

    if (!token) {
      setError('Authentication token missing')
      setLoading(false)
      return
    }

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/superAdmin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        if (res.data?.success && res.data?.stats) {
          setStats(res.data.stats)
        } else {
          setStats(null)
        }
      })
      .catch(err => {
        console.error(err)
        setError('Failed to load dashboard data')
      })
      .finally(() => setLoading(false))
  }, [])

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
          <div className="row g-4">

            {/* Total Revenue */}
            <AdminDashboardCard
              title="Total Revenue"
              value={`$${(stats.totalRevenue ?? 0).toLocaleString()}`}
              change={stats.revenueChange?.message ?? 'No data'}
              icon={LuDollarSign}
            />

            {/* Wallet Balance */}
            <AdminDashboardCard
              title="Wallet Balance"
              value={`$${stats.walletBalance ?? 0}`}
              icon={LuWallet}
            />

            {/* Total Users */}
            <AdminDashboardCard
              title="Total Users"
              value={stats.totalUsers ?? 0}
              change={stats.userChange?.message ?? 'No data'}
              icon={LuUsers}
            />

            {/* Active Battles */}
            <AdminDashboardCard
              title="Active Battles"
              value={stats.activeBattles ?? 0}
              icon={RiSwordLine}
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
                  <h6 className="fw-semibold mb-3">Recent Activity</h6>

                  <ul className="list-unstyled small text-muted mb-0">
                    <li className="mb-3 d-flex align-items-center gap-3">
                      <div className="icon-box">
                        <LuShoppingCart />
                      </div>
                      <div className='d-flex flex-column'>
                        <span className='fs-6 fw-medium text-black'>New order placed</span>
                        <span className=' fw-normal '>New order placed</span>
                      </div>
                    </li>
                    <li className="mb-3 d-flex align-items-center gap-3">
                      <div className="icon-box">
                        < LuUsers/>
                      </div>
                      <div className='d-flex flex-column'>
                        <span className='fs-6 fw-medium text-black'>New vendor registered</span>
                        <span className=' fw-normal '>New vendor registered</span>
                      </div>
                    </li>
                    <li className="d-flex align-items-center gap-3">
                      <div className="icon-box">
                        <RiSwordLine />
                      </div>
                      <div className='d-flex flex-column'>
                        <span className='fs-6 fw-medium text-black'>Battle round completed</span>
                        <span className=' fw-normal '>Battle round completed</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
