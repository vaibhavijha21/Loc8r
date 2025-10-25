import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6">
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold mb-8 text-center"
      >
        Select Your Role
      </motion.h2>

      <div className="flex flex-col md:flex-row gap-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="bg-gray-800 p-8 rounded-2xl shadow-lg w-72 cursor-pointer text-center hover:bg-gray-700"
          onClick={() => navigate("/profile")}
        >
          <h3 className="text-2xl font-semibold mb-2">User</h3>
          <p className="text-gray-400 text-sm">
            Access your dashboard to view and manage your lost or found items.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="bg-gray-800 p-8 rounded-2xl shadow-lg w-72 cursor-pointer text-center hover:bg-gray-700"
          onClick={() => navigate("/admin-dashboard")}
        >
          <h3 className="text-2xl font-semibold mb-2">Admin</h3>
          <p className="text-gray-400 text-sm">
            Manage all reported items, verify claims, and oversee reports.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
 
export default RoleSelection;
