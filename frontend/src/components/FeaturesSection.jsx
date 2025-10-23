import { motion } from "framer-motion";
import reportIcon from "../assets/report.png";
import browseIcon from "../assets/browse.png";
import notificationIcon from "../assets/notification.png";

const features = [
  {
    title: "Report Lost Items",
    description:
      "Quickly report items you’ve lost and alert the campus community instantly.",
    icon: reportIcon,
  },
  {
    title: "Browse Found Items",
    description:
      "Easily browse items others have found and reclaim your belongings fast.",
    icon: browseIcon,
  },
  {
    title: "Instant Notifications",
    description:
      "Receive alerts immediately when a matching lost or found item is reported.",
    icon: notificationIcon,
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="relative w-full min-h-screen bg-black text-gray-100 py-20 px-6 md:px-16 overflow-hidden">
        
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold font-sans">
          Campus <span className="text-gray-400">Superpowers</span>
        </h2>
        <p className="text-gray-300 mt-2 text-lg md:text-xl">
          Empowering students to find and report lost items easily across campus
        </p>
      </motion.div>
      <div className="relative flex flex-wrap justify-center gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50, rotate: -2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 15,
              delay: index * 0.2,
            }}
            className="w-64 h-64 bg-gray-800 rounded-3xl shadow-lg flex flex-col items-center justify-center p-6 cursor-pointer relative"
          >
            
            <motion.img
              src={feature.icon}
              alt={feature.title}
              className="w-16 h-16 mb-4"
              whileHover={{ rotate: 15 }}
              transition={{ duration: 0.3 }}
            />

        
            <h3 className="text-xl font-semibold font-sans text-center mb-2 text-gray-100">
              {feature.title}
            </h3>

        
            <p className="text-gray-300 text-center font-sans">
              {feature.description}
            </p>

            
            <motion.div
              className="absolute w-12 h-12 bg-gray-700 rounded-full -top-6 -left-6 opacity-40"
              animate={{ y: [0, 10, 0], x: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
            />
            <motion.div
              className="absolute w-8 h-8 bg-gray-700 rounded-full -bottom-4 -right-4 opacity-30"
              animate={{ y: [0, -8, 0], x: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, repeatType: "mirror" }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
