import React from "react";
import { ResponsiveLine } from "@nivo/line";
import "./ResponsiveLineChart.css";

/**
 * @module Components
 */

/**
 * ResponsiveLineChart component that renders a responsive line chart using the Nivo library.
 *
 * @param {Object} props - The properties object.
 * @param {Array} props.data - The data to be displayed in the line chart.
 * @returns {JSX.Element} The responsive line chart component.
 */
const ResponsiveLineChart = ({ data }) => {
  return (
    <div className="responsive-line-chart-container">
      <ResponsiveLine
        data={[
          {
            id: "Z Report",
            data: data.map((d) => ({ x: d.label, y: d.value })),
          },
        ]}
        margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
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
        colors={{ scheme: "category10" }}
        lineWidth={3}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        enableGridX={false}
        enableArea={true}
        enableSlices="x"
        tooltip={({ point }) => (
          <div
            style={{
              padding: "5px 10px",
              color: point.serieColor,
              background: "white",
              border: "1px solid #ccc",
              borderRadius: "3px",
              boxShadow: "0px 0px 5px rgba(0,0,0,0.2)",
            }}
          >
            <strong>{point.data.xFormatted}</strong>: {point.data.yFormatted}
          </div>
        )}
        sliceTooltip={({ slice }) => (
          <div
            style={{
              background: "white",
              padding: "9px 12px",
              border: "1px solid #ccc",
              borderRadius: "3px",
              boxShadow: "0px 0px 5px rgba(0,0,0,0.2)",
            }}
          >
            {slice.points.map((point) => (
              <div
                key={point.id}
                style={{
                  color: point.serieColor,
                  padding: "3px 0",
                }}
              >
                <strong>{point.data.xFormatted}</strong>:{" "}
                {point.data.yFormatted}
              </div>
            ))}
          </div>
        )}
      />
    </div>
  );
};

export default ResponsiveLineChart;
