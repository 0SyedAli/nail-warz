"use client";
// Import necessary dependencies
import { ResponsiveLine } from "@nivo/line";
import { Select } from "@chakra-ui/react";

// Define data
const data = [
  {
    id: "japan",
    color: "hsl(99, 70%, 50%)",
    data: [
      { x: "11 Nov", y: 3 },
      { x: "12 Nov", y: 10 },
      { x: "13 Nov", y: 2 },
      { x: "14 Nov", y: 15 },
      { x: "15 Nov", y: 2 },
      { x: "16 Nov", y: 5 },
    ],
  },
];

// Define CardLineChart component
const CardLineChart = () => (
  <div style={{ height: "340px", width: "100%" }}>
    <div className="chart_head px-4">
      <h2>Overview</h2>
      <div className="chart_head_filter">
        <Select placeholder="Select Month">
          <option value="option1">June, 2025</option>
          <option value="option2">July, 2025</option>
          <option value="option3">Aug, 2025</option>
        </Select>
      </div>
    </div>
    <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 15, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: 0,
        max: 15,
        stacked: false,
        reverse: false,
      }}
      curve="monotoneX" // Rounded/smooth line
      yFormat={(value) => `${value}k`} // All values show with 'k'
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "",
        legendOffset: -29,
        legendPosition: "middle",
        tickValues: 5,
        tickFormat: (value) => `${value}k`, // Ensure 'k' on all y-axis ticks
      }}
      enableGridY={false}
      enablePoints={false}
      pointSize={10}
      lineWidth={3}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabel="data.yFormatted"
      pointLabelYOffset={-12}
      enableTouchCrosshair={true}
      useMesh={true}
      legends={[]}
    />
  </div>
);

export default CardLineChart;
