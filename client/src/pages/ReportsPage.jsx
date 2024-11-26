import React, { useState } from "react";
import axios from "axios";
import PageHeader from "../components/PageHeader";
import ResponsiveBarChart from "../components/ResponsiveBarChart";
import ResponsiveLineChart from "../components/ResponsiveLineChart";
import ResponsiveMultiLineChart from "../components/ResponsiveMultiLineChart";

const ReportsPage = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const [graphType, setGraphType] = useState(""); // Report type (X, Product Usage, Z)
  const [reportData, setReportData] = useState(null); // Data returned from API
  const [startDate, setStartDate] = useState(""); // Start date for X and Product Usage
  const [endDate, setEndDate] = useState(""); // End date for X and Product Usage
  const [date, setDate] = useState(""); // Date for Z Report
  const [startHour, setStartHour] = useState(9); // Start hour for X report only
  const [endHour, setEndHour] = useState(21); // End hour for X report only
  const [loading, setLoading] = useState(false); // Loading state for API request

  const fetchReportData = async () => {
    if (!graphType) {
      alert("Please select a report type.");
      return;
    }

    if (
      (graphType === "x-report" || graphType === "product-usage") &&
      (!startDate || !endDate)
    ) {
      alert("Please select both a start date and an end date.");
      return;
    }

    if (graphType === "z-report" && !date) {
      alert("Please select a date for the Z Report.");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      alert(
        "End date cannot be earlier than start date. Please select a valid date range."
      );
      return;
    }

    if (graphType === "x-report" && startHour > endHour) {
      alert(
        "Start hour cannot be later than end hour. Please select a valid time range."
      );
      return;
    }

    if (
      graphType === "z-report" &&
      new Date(date).toISOString().split("T")[0] ===
        new Date().toISOString().split("T")[0]
    ) {
      const confirm = window.confirm(
        "You are generating a Z Report for the current day. The data might not be complete. Do you want to proceed?"
      );
      if (!confirm) return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${backendURL}/reports/${graphType}`, {
        params: {
          startDate: graphType !== "z-report" ? startDate : undefined,
          endDate: graphType !== "z-report" ? endDate : undefined,
          date: graphType === "z-report" ? date : undefined,
          startHour: graphType === "x-report" ? startHour : undefined,
          endHour: graphType === "x-report" ? endHour : undefined,
        },
      });
      setReportData(response.data);
    } catch (error) {
      console.error("Error fetching report data:", error);
      alert(
        `An error occurred while fetching the report data: ${error.message}`
      );
    }
    setLoading(false);
  };

  const handleGraphTypeChange = (event) => {
    setGraphType(event.target.value);
    setReportData(null); // Clear previous report data
  };

  const renderChart = () => {
    if (loading) return <p>Loading...</p>;
    if (!reportData) return <p>No data available for the selected report.</p>;

    if (graphType === "x-report") {
      return (
        <div>
          <h3>Sales Data</h3>
          <ResponsiveLineChart data={reportData.sales} />

          <h3>Items Sold</h3>
          <ResponsiveBarChart data={reportData.itemsSold} />

          <h3>Transaction Types</h3>
          <ResponsiveMultiLineChart
            data={Object.entries(reportData.transactionTypes).map(
              ([type, series]) => ({
                id: type,
                data: series.map(({ label, value }) => ({
                  x: label,
                  y: value,
                })),
              })
            )}
          />
        </div>
      );
    } else if (graphType === "product-usage") {
      return (
        <div>
          {Object.entries(reportData).map(([unit, data]) => (
            <div key={unit} style={{ marginBottom: "20px" }}>
              <h3>Product Usage for Unit: {unit}</h3>
              <ResponsiveBarChart data={data} />
            </div>
          ))}
        </div>
      );
    } else if (graphType === "z-report") {
      return (
        <div>
          <h3>Sales Data</h3>
          <ResponsiveLineChart data={reportData.sales} />

          <h3>Items Sold</h3>
          <ResponsiveBarChart data={reportData.itemsSold} />

          <h3>Transaction Types</h3>
          <ResponsiveMultiLineChart
            data={Object.entries(reportData.transactionTypes).map(
              ([type, series]) => ({
                id: type,
                data: series.map(({ label, value }) => ({
                  x: label,
                  y: value,
                })),
              })
            )}
          />
        </div>
      );
    }
  };

  return (
    <div>
      <PageHeader pageTitle="Reports" />

      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="graphType">Select Report Type: </label>
        <select
          id="graphType"
          value={graphType}
          onChange={handleGraphTypeChange}
        >
          <option value="">--Select--</option>
          <option value="x-report">X Report</option>
          <option value="product-usage">Product Usage</option>
          <option value="z-report">Z Report</option>
        </select>
      </div>

      {/* Date Range Selector */}
      {(graphType === "x-report" || graphType === "product-usage") && (
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="startDate">Select Start Date: </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <label htmlFor="endDate" style={{ marginLeft: "20px" }}>
            Select End Date:{" "}
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
      )}

      {/* Date Selector for Z Report */}
      {graphType === "z-report" && (
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="date">Select Date: </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      )}

      {/* Start and End Hour Inputs (Only for X Report) */}
      {graphType === "x-report" && (
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <div>
            <label htmlFor="startHour">Start Hour: </label>
            <input
              type="number"
              id="startHour"
              value={startHour}
              onChange={(e) => setStartHour(parseInt(e.target.value))}
              min="0"
              max="23"
              required
            />
          </div>
          <div>
            <label htmlFor="endHour">End Hour: </label>
            <input
              type="number"
              id="endHour"
              value={endHour}
              onChange={(e) => setEndHour(parseInt(e.target.value))}
              min="0"
              max="23"
              required
            />
          </div>
        </div>
      )}

      <button
        onClick={fetchReportData}
        disabled={
          (graphType === "x-report" || graphType === "product-usage") &&
          (!startDate || !endDate)
        }
      >
        Generate Report
      </button>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          borderTop: "1px solid #ccc",
        }}
      >
        {renderChart()}
      </div>
    </div>
  );
};

export default ReportsPage;