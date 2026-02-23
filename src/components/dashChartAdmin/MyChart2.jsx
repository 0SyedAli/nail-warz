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
                `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/getDailyRevenue?month=${month}&year=${year}`,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    },
                }
            )
            const data = await response.json()

            if (data?.success) {
                setDashboardData(data)

                const todayDay = today.getDate()

                const todayData = data.dailyRevenue.find(
                    (d) => d.day === todayDay
                )

                setTodayRevenue(todayData ? todayData.adminAmount : 0)
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

    // const handleMonthChange = (e) => {
    //     const [month, year] = e.target.value.split("-")
    //     setSelectedMonth(month)
    //     setSelectedYear(year)
    // }

    const chartData =
        dashboardData?.dailyRevenue?.map((item) => ({
            date: item.day,              // day number
            revenue: item.adminAmount,   // super admin earning
        })) || []

    if (loading) {
        return (
            <div className="row gy-4 gx-0 w-100">
                <div className="col-12">
                    <div className="chart-card">
                        <div className="overview-header d-flex align-items-center justify-content-end mb-4">
                            {/* <div className="d-flex align-items-center gap-4 flex-wrap">
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
                            </div> */}
                            {/* <select
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
                            </select> */}
                            <div className="d-flex align-items-center gap-2">

                                {/* Month Dropdown */}
                                <select
                                    className="form-select date-selector-input"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    style={{ width: "auto", fontSize: "14px" }}
                                >
                                    {Array.from({ length: 12 }, (_, i) => {
                                        const month = String(i + 1).padStart(2, "0");
                                        const date = new Date(Number(selectedYear), i);

                                        return (
                                            <option key={month} value={month}>
                                                {date.toLocaleDateString("en-US", { month: "long" })}
                                            </option>
                                        );
                                    })}
                                </select>

                                {/* Year Dropdown */}
                                <select
                                    className="form-select date-selector-input"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    style={{ width: "auto", fontSize: "14px" }}
                                >
                                    {Array.from({ length: 5 }, (_, i) => {
                                        const year = new Date().getFullYear() - 2 + i;
                                        return (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        );
                                    })}
                                </select>

                            </div>

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
                    <div className="overview-header d-flex align-items-center justify-content-end gap-2 mb-4 flex-wrap">
                        {/* <div className="d-flex align-items-center gap-4 flex-wrap">
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
                        </div> */}

                        {/* <select
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
                        </select> */}
                        <div className="d-flex align-items-center gap-2">
                            <select
                                className="form-select date-selector-input"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                style={{ width: "auto", fontSize: "14px" }}
                            >
                                {Array.from({ length: 12 }, (_, i) => {
                                    const month = String(i + 1).padStart(2, "0");
                                    const date = new Date(2026, i);

                                    return (
                                        <option key={month} value={month}>
                                            {date.toLocaleDateString("en-US", { month: "long" })}
                                        </option>
                                    );
                                })}
                            </select>
                            <select
                                className="form-select date-selector-input"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                style={{ width: "auto", fontSize: "14px" }}
                            >
                                {Array.from({ length: 5 }, (_, i) => {
                                    const year = new Date().getFullYear() - 2 + i;
                                    return (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
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
                                    tickFormatter={(value) => `Day ${value}`}
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
                                {/* <Tooltip
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
                                /> */}
                                <Tooltip
                                    formatter={(value) => [formatCurrency(value), "Revenue"]}
                                    labelFormatter={(label) => {
                                        const day = label; // label is day number

                                        const date = new Date(
                                            Number(selectedYear),
                                            Number(selectedMonth) - 1,
                                            Number(day)
                                        );

                                        return date.toLocaleDateString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        });
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
