// src/components1/AdminProfile.jsx
import React, { useState, useRef, useEffect, Component } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/api";
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
  Filler,
} from "chart.js";

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AdminProfile Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-red-500 p-4">Something went wrong. Please try refreshing the page.</div>;
    }
    return this.props.children;
  }
}

try {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
  );
} catch (error) {
  console.error('Failed to register Chart.js components:', error);
}

const AdminProfile = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [statusFilter, setStatusFilter] = useState("all");
  const chartRef = useRef(null);
  const api = ApiService; // Using the singleton instance instead of creating new

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
    api.setToken(token); // Ensure token is set in API service
  }, [navigate]);

  // State for real data
  const [analytics, setAnalytics] = useState({
    lostItems: 0,
    foundItems: 0,
    totalUsers: 0,
    totalClaims: 0,
    approvedClaims: 0,
    rejectedClaims: 0,
    returnedItems: 0
  });
  const [claims, setClaims] = useState([]);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Effect to fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all data in parallel
        const [analyticsData, claimsData, usersData, itemsData] = await Promise.all([
          api.getAdminAnalytics(),
          api.getAllClaims(), // <-- fetch all claims, not just pending
          api.getAllUsers(),
          api.getAllItems()
        ]);

        setAnalytics(analyticsData || {
          lostItems: 0,
          foundItems: 0,
          totalUsers: 0,
          totalClaims: 0,
          approvedClaims: 0,
          rejectedClaims: 0,
          returnedItems: 0
        });
        setClaims(claimsData || []);
        setUsers(usersData || []);
        setItems(itemsData || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Set default values if fetch fails
        setAnalytics({
          lostItems: 0,
          foundItems: 0,
          totalUsers: 0,
          totalClaims: 0,
          approvedClaims: 0,
          rejectedClaims: 0,
          returnedItems: 0
        });
        setClaims([]);
        setUsers([]);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Chart data
  const chartData = {
    labels: ["Lost Items", "Found Items", "Total Claims", "Approved", "Rejected", "Returned"],
    datasets: [
      {
        label: "Count",
        data: [
          analytics.lostItems,
          analytics.foundItems,
          analytics.totalClaims,
          analytics.approvedClaims,
          analytics.rejectedClaims,
          analytics.returnedItems
        ],
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
      }
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
        min: 0,
        ticks: {
          color: "#ccc",
          callback: function (value) {
            return Number.isInteger(value) ? value : null;
          },
        },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  const handleLogout = () => {
    api.clearToken(); // Clear token from API service
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    navigate('/login');
  };

  const handleClaimAction = async (claimId, action) => {
    try {
      setLoading(true);
      // Call API to update claim status
      await api.updateClaimStatus(claimId, action === 'approve' ? 'Approved' : 'Rejected');
      
      // Refresh data after action
      const [claims, analyticsData] = await Promise.all([
        api.getAllClaims(),
        api.getAdminAnalytics()
      ]);
      
      setClaims(claims);
      setAnalytics(analyticsData);
      
      // Show success message
      alert(`Claim ${action}d successfully`);
    } catch (error) {
      console.error(`Failed to ${action} claim:`, error);
      alert(`Failed to ${action} claim`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-gray-700">
          Loc8r Admin
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {["dashboard", "users", "items", "claims"].map((section) => (
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
            onClick={handleLogout}
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
                <h2 className="text-gray-500">Lost Items</h2>
                <p className="text-3xl font-bold text-gray-700">
                  {analytics.lostItems}
                </p>
              </div>
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-gray-500">Found Items</h2>
                <p className="text-3xl font-bold text-gray-700">
                  {analytics.foundItems}
                </p>
              </div>
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-gray-500">Total Users</h2>
                <p className="text-3xl font-bold text-gray-700">
                  {analytics.totalUsers}
                </p>
              </div>
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-gray-500">Total Claims</h2>
                <p className="text-3xl font-bold text-gray-700">
                  {analytics.totalClaims}
                </p>
              </div>
            </div>

            {/* Graph */}
            <div className="mt-10 bg-gray-700 p-6 shadow-md rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Item Statistics
              </h2>
              <Line ref={chartRef} data={chartData} options={chartOptions} />
            </div>

            {/* Additional Analytics */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 shadow-md rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Claims Overview</h2>
                <div className="space-y-2">
                  <p>Total Claims: {analytics.totalClaims}</p>
                  <p>Approved Claims: {analytics.approvedClaims}</p>
                  <p>Rejected Claims: {analytics.rejectedClaims}</p>
                  <p>Returned Items: {analytics.returnedItems}</p>
                </div>
              </div>
              <div className="bg-white p-6 shadow-md rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Item Status</h2>
                <div className="space-y-2">
                  <p>Lost Items: {analytics.lostItems}</p>
                  <p>Found Items: {analytics.foundItems}</p>
                  <p>Success Rate: {
                    analytics.totalClaims > 0 
                      ? ((analytics.approvedClaims / analytics.totalClaims) * 100).toFixed(1)
                      : 0
                  }%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Section */}
        {activeSection === "users" && (
          <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-900">
              Users
            </h1>
            <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3">ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.UserID} className="border-t">
                      <td className="p-3">{user.UserID}</td>
                      <td className="p-3">{user.User_name}</td>
                      <td className="p-3">{user.Email}</td>
                      <td className="p-3">{new Date(user.Created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Claims Section */}
        {activeSection === "claims" && (
          <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-900">
              All Claims
            </h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <table className="w-full border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2 text-left">Item Name</th>
                    <th className="p-2 text-left">Claimer</th>
                    <th className="p-2 text-left">Message</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.length > 0 ? claims.map((claim, i) => (
                    <tr key={i} className="border-t border-gray-300">
                      <td className="p-2">{claim.Item_name}</td>
                      <td className="p-2">{claim.claimer_name}</td>
                      <td className="p-2 max-w-md">
                        <div className="text-gray-700 line-clamp-2" title={claim.Message || claim.message || ''}>
                          {claim.Message || claim.message || '-'}
                        </div>
                      </td>
                      <td className="p-2">{claim.Claim_status}</td>
                      <td className="p-2 space-x-2">
                        {claim.Claim_status !== 'Approved' && (
                          <button
                            onClick={() => handleClaimAction(claim.ClaimID, 'approve')}
                            className="text-green-600 hover:underline"
                          >
                            Approve
                          </button>
                        )}
                        {claim.Claim_status !== 'Rejected' && (
                          <button
                            onClick={() => handleClaimAction(claim.ClaimID, 'reject')}
                            className="text-red-500 hover:underline"
                          >
                            Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="p-4 text-center text-gray-500">
                        No claims found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Items Section */}
        {activeSection === "items" && (
          <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-900">
              All Items
            </h1>
            <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
              <div className="flex mb-4 space-x-4">
                <button 
                  onClick={() => setStatusFilter("all")}
                  className={`px-4 py-2 rounded ${statusFilter === "all" ? "bg-gray-700 text-white" : "bg-gray-200"}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setStatusFilter("Lost")}
                  className={`px-4 py-2 rounded ${statusFilter === "Lost" ? "bg-gray-700 text-white" : "bg-gray-200"}`}
                >
                  Lost
                </button>
                <button 
                  onClick={() => setStatusFilter("Found")}
                  className={`px-4 py-2 rounded ${statusFilter === "Found" ? "bg-gray-700 text-white" : "bg-gray-200"}`}
                >
                  Found
                </button>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3">Item</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Reporter</th>
                  </tr>
                </thead>
                <tbody>
                  {items
                    .filter(item => statusFilter === "all" || item.Type === statusFilter)
                    .map(item => (
                      <tr key={item.ItemID} className="border-t">
                        <td className="p-3">{item.Item_name}</td>
                        <td className="p-3">{item.Type}</td>
                        <td className="p-3">
                          {item.ItemStatus || item.FoundStatus || "Pending"}
                        </td>
                        <td className="p-3">{item.Reporter}</td>
                      </tr>
                    ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-4 text-center text-gray-500">
                        No items found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg">
              <p className="text-gray-800">Loading...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Wrap AdminProfile with ErrorBoundary
export default function WrappedAdminProfile() {
  return (
    <ErrorBoundary>
      <AdminProfile />
    </ErrorBoundary>
  );
}