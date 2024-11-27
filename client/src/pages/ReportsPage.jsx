import React, { useState } from "react";
import axios from "axios";
import { toPng } from "html-to-image"; // For saving images
import { saveAs } from "file-saver"; // For downloading files
import PageHeader from "../components/PageHeader";
import ResponsiveBarChart from "../components/ResponsiveBarChart";
import ResponsiveLineChart from "../components/ResponsiveLineChart";
import ResponsiveMultiLineChart from "../components/ResponsiveMultiLineChart";

const ReportsPage = () => {
  const [graphType, setGraphType] = useState("");
  const [reportData, setReportData] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(21);
  const [loading, setLoading] = useState(false);

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const fetchReportData = async () => {
    if (!graphType) {
      alert("Please select a report type.");
      return;
    }

    if (graphType === "z-report" && !startDate) {
      alert("Please select a date for the Z Report.");
      return;
    }

    if (
      (graphType === "x-report" || graphType === "product-usage") &&
      (!startDate || !endDate)
    ) {
      alert("Please select valid start and end dates.");
      return;
    }

    if (graphType !== "z-report" && new Date(startDate) > new Date(endDate)) {
      alert("Start date cannot be after end date.");
      return;
    }

    if (startHour > endHour) {
      alert("Start time cannot be later than end time.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${backendURL}/reports/${graphType}`, {
        params: {
          startDate,
          endDate: graphType === "z-report" ? undefined : endDate,
          startHour: graphType !== "z-report" ? startHour : undefined,
          endHour: graphType !== "z-report" ? endHour : undefined,
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
    setReportData(null);
    setStartDate("");
    setEndDate("");
  };

  const saveAllGraphsAsCSV = () => {
    if (!reportData) {
      alert("No data available to export.");
      return;
    }

    let csvContent = "";

    if (graphType === "x-report" || graphType === "z-report") {
      csvContent += "Sales Data:\nHour,Total Sales\n";
      reportData.sales.forEach((row) => {
        csvContent += `${row.label},${row.value}\n`;
      });
      csvContent += "\n";

      csvContent += "Items Sold:\nHour,Total Items\n";
      reportData.itemsSold.forEach((row) => {
        csvContent += `${row.label},${row.value}\n`;
      });
      csvContent += "\n";

      csvContent += "Transaction Types:\nType,Hour,Count\n";
      Object.entries(reportData.transactionTypes).forEach(([type, series]) => {
        series.forEach(({ label, value }) => {
          csvContent += `${type},${label},${value}\n`;
        });
      });
    } else if (graphType === "product-usage") {
      csvContent += "Product Usage:\nUnit,Ingredient,Total Used\n";
      Object.entries(reportData).forEach(([unit, data]) => {
        data.forEach(({ label, value }) => {
          csvContent += `${unit},${label},${value}\n`;
        });
      });
    }

    const blob = new Blob([csvContent], { type: "text/csv" });
    saveAs(blob, `${graphType}-report.csv`);
  };

  const saveGraphAsImage = (graphId) => {
    const graphElement = document.getElementById(graphId);
    if (!graphElement) {
      alert("Could not find the graph to save.");
      return;
    }

    toPng(graphElement)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${graphType}-graph.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error("Error saving the graph as an image:", error);
      });
  };

  const renderChart = () => {
    if (loading) return <p>Loading...</p>;
    if (!reportData) return <p>No data available for the selected report.</p>;

    if (graphType === "x-report") {
      return (
        <div id={`${graphType}-chart`}>
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
        <div id={`${graphType}-chart`}>
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
        <div id={`${graphType}-chart`}>
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

      {(graphType === "x-report" || graphType === "product-usage") && (
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="startDate">Start Date: </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label htmlFor="endDate">End Date: </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <label htmlFor="startHour">Start Hour: </label>
          <input
            type="number"
            id="startHour"
            value={startHour}
            onChange={(e) => setStartHour(Number(e.target.value))}
            min="0"
            max="23"
          />
          <label htmlFor="endHour">End Hour: </label>
          <input
            type="number"
            id="endHour"
            value={endHour}
            onChange={(e) => setEndHour(Number(e.target.value))}
            min="0"
            max="23"
          />
        </div>
      )}

      {graphType === "z-report" && (
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="startDate">Select Date: </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
      )}

      <button onClick={fetchReportData}>Generate Report</button>
      {reportData && (
        <>
          <button
            onClick={() => saveGraphAsImage(`${graphType}-chart`)}
            style={{ marginLeft: "10px" }}
          >
            Save Graphs as Image
          </button>
          <button onClick={saveAllGraphsAsCSV} style={{ marginLeft: "10px" }}>
            Export All Data to CSV
          </button>
        </>
      )}

      <div>{renderChart()}</div>
    </div>
  );
};

export default ReportsPage;
