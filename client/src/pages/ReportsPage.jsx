import React, { useState } from 'react';
import axios from 'axios';
import PageHeader from "../components/PageHeader";
import ResponsiveBarChart from '../components/ResponsiveBarChart';
import ResponsiveLineChart from '../components/ResponsiveLineChart';
import ResponsiveMultiLineChart from '../components/ResponsiveMultiLineChart';

const ReportsPage = () => {
    const [graphType, setGraphType] = useState(''); // Report type (X or Z report)
    const [reportData, setReportData] = useState(null); // Data returned from API
    const [date, setDate] = useState(''); // Date input for both reports
    const [startHour, setStartHour] = useState(9); // Start hour for X report only
    const [endHour, setEndHour] = useState(21); // End hour for X report only
    const [loading, setLoading] = useState(false); // Loading state for API request

    // Function to fetch report data based on selected report type and parameters
    const fetchReportData = async () => {
        if (!graphType || !date) {
            alert("Please select a report type and date.");
            return;
        }
    
        setLoading(true);
        try {
            const response = await axios.get(`/reports/${graphType}`, {
                params: {
                    date,
                    startHour: graphType === 'x-report' ? startHour : undefined,
                    endHour: graphType === 'x-report' ? endHour : undefined
                }
            });
            setReportData(response.data);
        } catch (error) {
            console.error("Error fetching report data:", error);
            alert("An error occurred while fetching the report data.");
        }
        setLoading(false);
    };

    // Function to display charts based on the fetched report data
    const renderChart = () => {
        if (loading) return <p>Loading...</p>;
        if (!reportData || !reportData.sales) return <p>No data available for the selected report.</p>;
    
        return (
            <div>
                <h3>Sales Data</h3>
                <ResponsiveLineChart data={reportData.sales || []} />
    
                <h3>Items Sold</h3>
                <ResponsiveBarChart data={reportData.itemsSold || []} />
    
                <h3>Transaction Types</h3>
                <ResponsiveMultiLineChart
                    data={Object.entries(reportData.transactionTypes || {}).map(([type, series]) => ({
                        id: type,
                        data: series.map(({ label, value }) => ({ x: label, y: value }))
                    }))} 
                />
            </div>
        );
    };

    return (
        <div>
            <PageHeader pageTitle="Reports" />

            {/* Report Type Selector */}
            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="graphType">Select Report Type: </label>
                <select id="graphType" value={graphType} onChange={(e) => setGraphType(e.target.value)}>
                    <option value="">--Select--</option>
                    <option value="x-report">X Report</option>
                    <option value="z-report">Z Report</option>
                </select>
            </div>

            {/* Date Selector */}
            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="date" style={{ marginRight: '10px' }}>Select Date: </label>
                <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>

            {/* Start Hour and End Hour Inputs (Only for X Report) */}
            {graphType === 'x-report' && (
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <div>
                        <label htmlFor="startHour" style={{ marginRight: '5px' }}>Start Hour: </label>
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
                        <label htmlFor="endHour" style={{ marginRight: '5px' }}>End Hour: </label>
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

            {/* Button to Trigger Report Fetch */}
            <button onClick={fetchReportData} disabled={!graphType || !date}>
                Generate Report
            </button>

            {/* Render the Charts */}
            <div style={{ marginTop: '20px', padding: '20px', borderTop: '1px solid #ccc' }}>
                {renderChart()}
            </div>
        </div>
    );
};

export default ReportsPage;