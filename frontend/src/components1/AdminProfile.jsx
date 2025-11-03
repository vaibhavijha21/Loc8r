// src/components1/AdminProfile.jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminProfile = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [statusFilter, setStatusFilter] = useState("all");
  const chartRef = useRef(null);

  // Dummy user data
  const usersData = [
    { name: "Alice Johnson", email: "alice@uni.edu", role: "User" },
    { name: "Bob Smith", email: "bob@uni.edu", role: "Admin" },
    { name: "Charlie Brown", email: "charlie@uni.edu", role: "User" },
  ];

  // Dummy items data
  const itemsData = [
    { name: "Wallet", date: "2 days ago", status: "Found", location: "Library" },
    { name: "Phone", date: "1 day ago", status: "Lost", location: "Cafeteria" },
    { name: "Bag", date: "3 days ago", status: "Returned", location: "Reception" },
  ];

  // Dummy reports
  const [reports, setReports] = useState([
    {
      item: "Silver Keychain",
      type: "Found",
      reporter: "Jane Smith",
      date: "9/5/2025",
      status: "In Review",
    },
    {
      item: "Blue Water Bottle",
      type: "Lost",
      reporter: "Rahul Sharma",
      date: "9/1/2025",
      status: "Resolved",
    },
    {
      item: "Black Backpack",
      type: "Lost",
      reporter: "John Doe",
      date: "8/12/2025",
      status: "Resolved",
    },
  ]);

  // Pending report count
  const pendingReports = reports.filter((r) => r.status === "In Review").length;

  // Chart data
  const chartData = {
    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    datasets: [
      {
        label: "Lost",
        data: [1, 2, 3, 1, 2, 3],
        borderColor: "#ef4444",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, "rgba(239,68,68,0.3)");
          gradient.addColorStop(1, "rgba(239,68,68,0)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#ef4444",
      },
      {
        label: "Found",
        data: [1, 2, 1, 2, 1, 2],
        borderColor: "#22c55e",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, "rgba(34,197,94,0.3)");
          gradient.addColorStop(1, "rgba(34,197,94,0)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#22c55e",
      },
    ],
  };

  const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      labels: { color: "#fff" },
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      ticks: { color: "#ccc" },
      grid: { color: "rgba(255,255,255,0.1)" },
    },
    y: {
      min: 1,
      max: 10,
      ticks: {
        stepSize: 1,
        color: "#ccc",
        callback: function (value) {
          return Number.isInteger(value) ? value : null;
        },
      },
      grid: { color: "rgba(255,255,255,0.1)" },
    },
  },
};


  // Button Handlers
  const handleMarkInReview = (index) => {
    const updated = [...reports];
    updated[index].status = "In Review";
    setReports(updated);
  };

  const handleResolve = (index) => {
    const updated = [...reports];
    updated[index].status = "Resolved";
    setReports(updated);
  };

  const handleDelete = (index) => {
    const updated = reports.filter((_, i) => i !== index);
    setReports(updated);
  };

  // Filter Reports
  const filteredReports =
    statusFilter === "all"
      ? reports
      : reports.filter((r) => r.status === statusFilter);

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-gray-700">
          Loc8r Admin
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {["dashboard", "users", "items", "reports"].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`block w-full text-left px-4 py-2 rounded-lg ${
                activeSection === section
                  ? "bg-gray-700 text-white"
                  : "hover:bg-gray-800"
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Dashboard */}
        {activeSection === "dashboard" && (
          <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-900">
              Dashboard Overview
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-gray-500">Total Users</h2>
                <p className="text-3xl font-bold text-gray-700">
                  {usersData.length}
                </p>
              </div>
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-gray-500">Lost Items</h2>
                <p className="text-3xl font-bold text-gray-700">
                  {itemsData.filter((i) => i.status === "Lost").length}
                </p>
              </div>
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-gray-500">Resolved Reports</h2>
                <p className="text-3xl font-bold text-gray-700">
                  {reports.filter((r) => r.status === "Resolved").length}
                </p>
              </div>
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-gray-500">Pending Reports</h2>
                <p className="text-3xl font-bold text-gray-700">
                  {pendingReports}
                </p>
              </div>
            </div>

            {/* Graph */}
            <div className="mt-10 bg-gray-700 p-6 shadow-md rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Activity (Last 6 Months)
              </h2>
              <Line ref={chartRef} data={chartData} options={chartOptions} />
            </div>
          </div>
        )}

        {/* Users */}
        {activeSection === "users" && (
          <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-900">
              Manage Users
            </h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <table className="w-full border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Role</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersData.map((user, i) => (
                    <tr key={i} className="border-t border-gray-300">
                      <td className="p-2">{user.name}</td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">{user.role}</td>
                      <td className="p-2 space-x-2">
                        <button className="text-gray-600 hover:underline">
                          Edit
                        </button>
                        <button className="text-gray-500 hover:underline">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Items */}
        {activeSection === "items" && (
          <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-900">
              Lost & Found Items
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {itemsData.map((item, i) => (
                <div key={i} className="bg-white p-4 shadow rounded-lg">
                  <h2 className="font-bold text-lg mb-2">{item.name}</h2>
                  <p className="text-sm text-gray-500">Status: {item.status}</p>
                  <p className="text-sm text-gray-500">
                    Location: {item.location}
                  </p>
                  <p className="text-sm text-gray-500">Reported: {item.date}</p>
                  <button className="mt-3 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reports */}
        {activeSection === "reports" && (
          <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Reports</h1>

            <div className="flex items-center mb-4 space-x-4">
              <input
                type="text"
                placeholder="Search reports..."
                className="border border-gray-400 rounded p-2 w-1/3"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-400 rounded p-2"
              >
                <option value="all">All Status</option>
                <option value="In Review">In Review</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-3">Item</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Reporter</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report, index) => (
                    <tr
                      key={index}
                      className="border-t border-gray-300 hover:bg-gray-50"
                    >
                      <td className="p-3">{report.item}</td>
                      <td className="p-3">{report.type}</td>
                      <td className="p-3">{report.reporter}</td>
                      <td className="p-3">{report.date}</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            report.status === "Resolved"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-3">
                        <button
                          onClick={() => handleMarkInReview(index)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Mark In Review
                        </button>
                        <button
                          onClick={() => handleResolve(index)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredReports.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center p-4 text-gray-500"
                      >
                        No reports found for this status.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminProfile; 