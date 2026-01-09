"use client"

import { useState, useEffect } from "react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import SpinnerLoading from "../Spinner/SpinnerLoading"
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
export default function Dashboard() {
    const today = new Date()
    const currentMonth = String(today.getMonth() + 1).padStart(2, "0")
    const currentYear = today.getFullYear()
    const [salonId, setSalonId] = useState(null);
    const [dashboardData, setDashboardData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedMonth, setSelectedMonth] = useState(currentMonth)
    const [selectedYear, setSelectedYear] = useState(String(currentYear))
    const [todayRevenue, setTodayRevenue] = useState(0)
    const router = useRouter();

    useEffect(() => {
        const cookie = Cookies.get("user");
        if (!cookie) return router.push("/admin/auth/login");
        try {
            const u = JSON.parse(cookie);
            if (u?._id) setSalonId(u._id);
            else router.push("/admin/auth/login");
        } catch {
            router.push("/admin/auth/login");
        }
    }, [router]);

    const fetchDashboardData = async (month, year) => {
        try {
            setLoading(true)
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/getSalonMonthlyRevenue?salonId=${"6865688e65aa0e302ed91d27"}&monthYear=${month}-${year}`
            )
            const data = await response.json()

            if (data?.success) {
                setDashboardData(data)

                // Find today's revenue
                const todayDate = today.toLocaleDateString("en-GB").split("/").reverse().join("-") // dd-mm-yyyy
                const todayData = data.data.find((d) => d.date === todayDate)
                setTodayRevenue(todayData ? todayData.revenue : 0)
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!salonId) return;  // wait for cookie parse first
        fetchDashboardData(selectedMonth, selectedYear)
    }, [salonId, selectedMonth, selectedYear])

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const handleMonthChange = (e) => {
        const [month, year] = e.target.value.split("-")
        setSelectedMonth(month)
        setSelectedYear(year)
    }

    const chartData =
        dashboardData?.data?.map((item) => ({
            date: item.date,
            revenue: item.revenue,
        })) || []

    if (loading) {
        return (
            <div className="row gy-4 gx-0 w-100">
                <div className="col-12">
                    <div className="chart-card">
                        <div className="overview-header d-flex align-items-center justify-content-between mb-4">
                            <div className="d-flex align-items-center gap-4 flex-wrap">
                                <div className="d-flex align-items-center gap-2 flex-wrap" style={{
                                    border: "1px solid #ccc",
                                    padding: "10px",
                                    borderRadius: "5px",
                                }}>
                                    <h3 className="overview-title fw-bolder m-0">Overview (Total):</h3>
                                    <div className="total-amount">$0</div>
                                </div>
                                <div className="d-flex align-items-center gap-2 flex-wrap" style={{
                                    border: "1px solid #ccc",
                                    padding: "10px",
                                    borderRadius: "5px",
                                }}>
                                    <h3 className="overview-title fw-bolder m-0">Today's Revenue:</h3>
                                    <div className="total-amount">$0</div>
                                </div>
                            </div>
                            <select
                                className="form-select date-selector-input"
                                value={`${selectedMonth}-${selectedYear}`}
                                onChange={handleMonthChange}
                                style={{ width: "auto", fontSize: "14px" }}
                            >
                                {Array.from({ length: 12 }, (_, i) => {
                                    const month = String(i + 1).padStart(2, "0")
                                    const date = new Date(currentYear, i)
                                    return (
                                        <option key={month} value={`${month}-${currentYear}`}>
                                            {date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="chart-container" style={{ height: "350px" }}>
                            <SpinnerLoading spinner_class="h-100" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="row gy-4 gx-0 w-100">
            <div className="col-12">
                <div className="chart-card">
                    <div className="overview-header d-flex align-items-center justify-content-center justify-content-sm-between gap-2 mb-4 flex-wrap">
                        <div className="d-flex align-items-center gap-4 flex-wrap">
                            <div className="d-flex align-items-center gap-2 flex-wrap" style={{
                                border: "1px solid #ccc",
                                padding: "10px",
                                borderRadius: "5px",
                            }}>
                                <h3 className="overview-title fw-bolder m-0">Overview (Total):</h3>
                                <div className="total-amount">
                                    {dashboardData ? formatCurrency(dashboardData.totalMonthRevenue) : "$0"}
                                </div>
                            </div>
                            <div className="d-flex align-items-center gap-2 flex-wrap" style={{
                                border: "1px solid #ccc",
                                padding: "10px",
                                borderRadius: "5px",
                            }}>
                                <h3 className="overview-title fw-bolder m-0">Today's Revenue:</h3>
                                <div className="total-amount">{formatCurrency(todayRevenue)}</div>
                            </div>
                        </div>

                        <select
                            className="form-select date-selector-input"
                            value={`${selectedMonth}-${selectedYear}`}
                            onChange={handleMonthChange}
                            style={{ width: "auto", fontSize: "14px" }}
                        >
                            {Array.from({ length: 12 }, (_, i) => {
                                const month = String(i + 1).padStart(2, "0")
                                const date = new Date(currentYear, i)
                                return (
                                    <option key={month} value={`${month}-${currentYear}`}>
                                        {date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                                    </option>
                                )
                            })}
                        </select>
                    </div>

                    <div className="chart-container" style={{ height: "350px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#000" stopOpacity={1} />
                                        <stop offset="95%" stopColor="#FE0000" stopOpacity={1} />
                                    </linearGradient>
                                </defs>

                                {/* ✅ X-Axis: Format as US-style date (Aug 1) */}
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 10, fill: "#000" }}
                                    tickFormatter={(value) => {
                                        // value looks like "01-08-2025"
                                        const [day] = value.split("-") // ignore year
                                        return `${day}` // show only dd-mm
                                    }}
                                />

                                {/* ✅ Y-Axis: Format as US dollars */}
                                <YAxis
                                    axisLine={true}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: "#000" }}
                                    tickFormatter={(value) =>
                                        new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        }).format(value)
                                    }
                                />

                                {/* ✅ Tooltip: Clean full date format */}
                                <Tooltip
                                    formatter={(value) => [formatCurrency(value), "Revenue"]}
                                    labelFormatter={(label) => {
                                        const [day, month, year] = label.split("-")
                                        const date = new Date(`${year}-${month}-${day}`)
                                        return date.toLocaleDateString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                    }}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#ccc"
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}
