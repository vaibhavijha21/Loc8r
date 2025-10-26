import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import profilePic from "../assets/profile.png";
import { FaEnvelope, FaPhone, FaLinkedin, FaGithub } from "react-icons/fa";
import Sidebar from "../components1/Sidebar";
import apiService from "../services/api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Profile = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
    }
  }, []);

  const handleLogout = () => {
    apiService.clearToken();
    localStorage.removeItem("user");
    setIsAuthenticated && setIsAuthenticated(false);
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Loading your profile...</p>
      </div>
    );
  }

  const activeReports = [
    { title: "Lost: Laptop", description: "Lost in Library - 23rd Oct 2025", status: "Pending" },
    { title: "Found: ID Card", description: "Found near Cafeteria - 24th Oct 2025", status: "Returned" },
  ];

  const reportData = [
    { name: "Pending", value: activeReports.filter(r => r.status === "Pending").length },
    { name: "Returned", value: activeReports.filter(r => r.status === "Returned").length },
  ];

  const COLORS = ["#EF4444", "#10B981"];

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="grid grid-cols-[4rem_1fr] h-screen">
        <Sidebar onLogout={handleLogout} />

        <main className="p-6 overflow-y-auto">
          <section className="min-h-screen bg-black px-6 md:px-16 py-20">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="max-w-6xl mx-auto bg-gray-300 rounded-3xl shadow-2xl p-10 grid md:grid-cols-2 gap-10"
            >
              {/* Left Column: Profile Info */}
              <motion.div
                className="flex flex-col items-center text-center space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <img
                  src={profilePic}
                  alt="User"
                  className="w-36 h-36 rounded-full border-4 border-gray-300 object-cover hover:scale-105 transition-transform duration-300"
                />
                <h2 className="text-4xl font-bold mt-2 text-black">
                  {user.name || "Unnamed User"}
                </h2>
                <p className="text-gray-600">{user.role || "Student, Chitkara University"}</p>

                <div className="flex flex-col gap-2 mt-2 text-gray-500">
                  <span>
                    <FaEnvelope className="inline mr-2" /> {user.email || "example@example.com"}
                  </span>
                  <span>
                    <FaPhone className="inline mr-2" /> {user.phone || "+91 9876543210"}
                  </span>
                </div>

                <div className="flex gap-4 mt-3 justify-center">
                  <a href={user.linkedin || "#"} className="hover:text-gray-700"><FaLinkedin size={24} /></a>
                  <a href={user.github || "#"} className="hover:text-gray-700"><FaGithub size={24} /></a>
                </div>
              </motion.div>

              {/* Right Column: Reports + Stats */}
              <div className="flex flex-col gap-8">
                {/* Active Reports */}
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <h3 className="text-2xl font-semibold border-b border-gray-300 pb-2 text-black">
                    Active Reports
                  </h3>
                  <div className="space-y-4">
                    {activeReports.map((report, idx) => (
                      <motion.div
                        key={idx}
                        className="bg-gray-200 p-5 rounded-xl shadow hover:scale-105 transition-transform duration-300"
                        whileHover={{ y: -5 }}
                      >
                        <h4 className="text-lg font-semibold text-black">{report.title}</h4>
                        <p className="text-gray-700 text-sm mt-1">{report.description}</p>
                        <span
                          className={`mt-2 inline-block text-sm ${
                            report.status === "Pending" ? "text-red-500" : "text-green-500"
                          }`}
                        >
                          Status: {report.status}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Report Statistics */}
                <motion.div
                  className="bg-gray-200 rounded-xl p-5 shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <h3 className="text-xl font-semibold mb-3 text-black">Report Statistics</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={reportData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        label
                      >
                        {reportData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>
            </motion.div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Profile;
