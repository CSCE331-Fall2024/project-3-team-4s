import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import "./ResponsiveBarChart.css";

/**
 * @module Components
 */

/**
 * ResponsiveBarChart component that renders a responsive bar chart using the Nivo library.
 *
 * @param {Object} props - The properties object.
 * @param {Array} props.data - The data to be displayed in the bar chart.
 * @returns {JSX.Element} The responsive bar chart component.
 */
const ResponsiveBarChart = ({ data }) => {
  return (
    <div className="responsive-bar-chart-container">
      <ResponsiveBar
        data={data}
        keys={["value"]}
        indexBy="label"
        margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
        padding={0.3}
        yScale={{ type: "linear", min: 0, max: "auto" }} // Set y-axis minimum to 0
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Hour",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Value",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        colors={{ scheme: "nivo" }}
        enableLabel={false}
        tooltip={({ id, value, color }) => (
          <div
            style={{
              padding: "5px",
              color,
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: "3px",
            }}
          >
            <strong>{id}</strong>: {value}
          </div>
        )}
      />
    </div>
  );
};

export default ResponsiveBarChart;
