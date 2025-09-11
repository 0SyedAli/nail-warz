"use client";
import { ResponsiveLine } from "@nivo/line";
import { Select } from "@chakra-ui/react";

const CardLineChart = ({ data }) => (
  <div style={{ height: "340px", width: "100%" }}>
    <div className="chart_head px-4">
      <h2>Overview</h2>
      <div className="chart_head_filter">
        <Select placeholder="Select Month">
          <option value="08-2025">Aug, 2025</option>
          <option value="07-2025">July, 2025</option>
          <option value="06-2025">June, 2025</option>
        </Select>
      </div>
    </div>
    <ResponsiveLine
      data={data || []}
      margin={{ top: 50, right: 15, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      curve="monotoneX"
      yFormat={(value) => `${value}`}
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
      }}
      enableGridY={false}
      enablePoints={false}
      pointSize={10}
      lineWidth={3}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      enableTouchCrosshair={true}
      useMesh={true}
      legends={[]}
    />
  </div>
);

export default CardLineChart;
