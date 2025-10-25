import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import sampleVideo from "../assets/campus.mp4";

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const VideoSection = () => {
  const navigate = useNavigate(); // ✅ add navigate

  return (
    <section className="relative w-full h-screen overflow-hidden">

      <video
        src={sampleVideo}
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/50 flex items-center justify-center px-6 md:px-16">
        <motion.div
          className="text-center max-w-3xl text-white space-y-6"
        >

          <motion.h2
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-4xl md:text-5xl font-extrabold font-sans"
          >
            Lost it? <span className="text-gray-300">List it. Find it.</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-lg md:text-xl text-gray-200 leading-relaxed"
          >
            Report lost or found items in seconds. Search by category, location,
            or date to quickly reconnect with your belongings. Help keep our
            campus connected and organized.
          </motion.p>

          <motion.button
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 150, 0.5)" }}
            transition={{ duration: 0.3 }}
            onClick={() => navigate("/login")} // ✅ navigate to Authentication
            className="mt-4 px-8 py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-600 transition"
          >
            Get Started
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;
