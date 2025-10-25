import { motion } from "framer-motion";
import profilePic from "../assets/user.png"; // use any placeholder image

const Profile = () => {
  return (
    <section className="min-h-screen bg-gray-900 text-white px-6 md:px-16 py-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-5xl mx-auto bg-gray-800 rounded-2xl shadow-xl p-10"
      >
        {/* User Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
          <img
            src={profilePic}
            alt="User"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-700"
          />
          <div>
            <h2 className="text-3xl font-bold">Vaibhavi Jha</h2>
            <p className="text-gray-400">Student, Chitkara University</p>
            <p className="text-gray-500 mt-2">vaibhavi@example.com</p>
          </div>
        </div>

        {/* Active Reports Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-10"
        >
          <h3 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">
            Active Reports
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-700 p-5 rounded-xl shadow">
              <h4 className="text-xl font-semibold">Lost: Laptop</h4>
              <p className="text-gray-400 text-sm">
                Lost in Library - Reported on 23rd Oct 2025
              </p>
              <span className="text-yellow-400 text-sm mt-2 inline-block">
                Status: Pending
              </span>
            </div>

            <div className="bg-gray-700 p-5 rounded-xl shadow">
              <h4 className="text-xl font-semibold">Found: ID Card</h4>
              <p className="text-gray-400 text-sm">
                Found near Cafeteria - Reported on 24th Oct 2025
              </p>
              <span className="text-green-400 text-sm mt-2 inline-block">
                Status: Returned
              </span>
            </div>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">
            Account Info
          </h3>
          <p className="text-gray-400">Member since: March 2024</p>
          <p className="text-gray-400">Total Reports Filed: 5</p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Profile;
