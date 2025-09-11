"use client"

import { useState, useEffect } from "react"
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import SpinnerLoading from "../Spinner/SpinnerLoading"

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedMonth, setSelectedMonth] = useState("08")
    const [selectedYear, setSelectedYear] = useState("2025")

    const fetchDashboardData = async (month, year) => {
        try {
            setLoading(true)
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/getSalonMonthlyRevenue?salonId=6865688e65aa0e302ed91d27&monthYear=${month}-${year}`,
            )
            const data = await response.json()
            setDashboardData(data)
        } catch (error) {
            console.error("Error fetching dashboard data:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData(selectedMonth, selectedYear)
    }, [selectedMonth, selectedYear])

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const getMonthName = (monthYear) => {
        if (!monthYear) return "Loading..."
        const [month, year] = monthYear.split("-")
        const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1)
        return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    }

    const handleMonthChange = (e) => {
        const [month, year] = e.target.value.split("-")
        setSelectedMonth(month)
        setSelectedYear(year)
    }

    const chartData =
        dashboardData?.data?.map((item, index) => ({
            day: index + 1,
            revenue: item.revenue,
            date: item.date,
        })) || []

    //   const pieData = [{ name: "Total", value: 50 }]

    if (loading) {
        return (
            <div className="row g-4 w-100">
                {/* Left Column - Overview Chart */}
                <div className="col-12" >
                    <div className="chart-card" >
                        <div className="overview-header d-flex align-items-center justify-content-between mb-4">
                            <div className="d-flex align-items-center gap-3 gap-column-2 flex-wrap">
                                <h3 className="overview-title fw-bolder m-0">Overview (total)</h3>
                                <div className="total-amount">
                                    {dashboardData ? formatCurrency(dashboardData.totalMonthRevenue) : "$ 0"}
                                </div>
                            </div>
                            <select
                                className="form-select date-selector-input"
                                value={`${selectedMonth}-${selectedYear}`}
                                onChange={handleMonthChange}
                                style={{ width: "auto", fontSize: "14px" }}
                            >
                                <option value="01-2025">January 2025</option>
                                <option value="02-2025">February 2025</option>
                                <option value="03-2025">March 2025</option>
                                <option value="04-2025">April 2025</option>
                                <option value="05-2025">May 2025</option>
                                <option value="06-2025">June 2025</option>
                                <option value="07-2025">July 2025</option>
                                <option value="08-2025">August 2025</option>
                                <option value="09-2025">September 2025</option>
                                <option value="10-2025">October 2025</option>
                                <option value="11-2025">November 2025</option>
                                <option value="12-2025">December 2025</option>
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
        <div className="row g-4 w-100">
            {/* Left Column - Overview Chart */}
            <div className="col-12">
                <div className="chart-card">
                    <div className="overview-header d-flex align-items-center justify-content-center justify-content-sm-between gap-2 mb-4 flex-wrap">
                        <div className="d-flex align-items-center gap-3  row-gap-2 flex-wrap">
                            <h3 className="overview-title fw-bolder m-0">Overview (total)</h3>
                            <div className="total-amount">
                                {dashboardData ? formatCurrency(dashboardData.totalMonthRevenue) : "$ 0"}
                            </div>
                        </div>
                        <select
                            className="form-select date-selector-input"
                            value={`${selectedMonth}-${selectedYear}`}
                            onChange={handleMonthChange}
                            style={{ width: "auto", fontSize: "14px" }}
                        >
                            <option value="01-2025">January 2025</option>
                            <option value="02-2025">February 2025</option>
                            <option value="03-2025">March 2025</option>
                            <option value="04-2025">April 2025</option>
                            <option value="05-2025">May 2025</option>
                            <option value="06-2025">June 2025</option>
                            <option value="07-2025">July 2025</option>
                            <option value="08-2025">August 2025</option>
                            <option value="09-2025">September 2025</option>
                            <option value="10-2025">October 2025</option>
                            <option value="11-2025">November 2025</option>
                            <option value="12-2025">December 2025</option>
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
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 10, fill: "#000" }}
                                    tickFormatter={(value) => {
                                        // value looks like "01-08-2025"
                                        const [day, month] = value.split("-") // ignore year
                                        return `${day}-${month}` // show only dd-mm
                                    }}
                                />
                                <YAxis
                                    axisLine={true}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: "#000" }}
                                    tickFormatter={(value) => `${value / 1000}k`}
                                />
                                <Tooltip
                                    formatter={(value) => [formatCurrency(value), "Revenue"]}
                                    labelFormatter={(label) => `Day ${label}`}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#ccc" fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Right Column - Solid Black Circle */}
            {/* <div className="col-lg-4">
          <div className="chart-card">
            <h3 className="section-title">Comes & Expenses</h3>

            <div className="donut-chart-container" style={{ height: "200px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} fill="#000" dataKey="value" stroke="none">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#FE0000" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div> */}
        </div>
    )
}
