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
      { x: "Jan", y: 10000 },
      { x: "Feb", y: 20000 },
      { x: "Mar", y: 40000 },
      { x: "Apr", y: 20000 },
      { x: "May", y: 50000 },
      { x: "Jun", y: 20000 },
      { x: "May", y: 50000 },
    ],
  },
];

// Define CardLineChart component
const CardLineChart2 = () => (
  <div style={{ height: "340px", width: "30%", position: 'relative' }}>
    <div className="chart_head1 flex-column align-items-start position-absolute">
      <h2>Weekly Sales</h2>
      <div className="pt-4">
        <h3>$30,214.02</h3>
        <h5><span>+0.03%</span></h5>
      </div>
    </div>
    <ResponsiveLine
      data={data}
      margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: 0,
        max: 80000,
        stacked: true,
        reverse: false,
      }}
      yFormat={(value) => `${(value / 1000).toFixed(0)}k`}
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
      axisBottom={null}
      axisLeft={null}
      enableGridY={false}
      enableGridX={false}
      enablePoints={false}
      pointSize={10}
      lineWidth={3}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabel="data.yFormatted"
      pointLabelYOffset={-12}
      enableArea={true}
      enableTouchCrosshair={true}
      useMesh={true}
      legends={[]}
    />
  </div>
);

export default CardLineChart2;
