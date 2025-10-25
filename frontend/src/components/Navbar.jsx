import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const navLinks = [
  { name: "Home", id: "home" },
  { name: "About", id: "about" },
  { name: "Features", id: "features" },
  { name: "Contact", id: "contact" },
];

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-[80%] rounded-full 
                 bg-white/20 backdrop-blur-md border border-white/30 shadow-lg 
                 flex items-center justify-between px-6 py-3"
    >
      <motion.h1
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="text-2xl font-bold text-white tracking-wide cursor-pointer"
        onClick={() => navigate("/")}
      >
        Loc8r
      </motion.h1>

      <ul className="flex items-center gap-6 text-white font-medium">
        {navLinks.map((link, index) => (
          <motion.li
            key={index}
            whileHover={{ scale: 1.1, color: "#d1d5db" }}
            transition={{ type: "spring", stiffness: 300 }}
            className="cursor-pointer hover:text-gray-200 transition-all duration-300"
          >
            <a href={`#${link.id}`}>{link.name}</a>
          </motion.li>
        ))}

        {/* ✅ Login/Signup Button now navigates to /login */}
        <motion.button
          whileHover={{
            scale: 1.05,
            backgroundColor: "rgba(255,255,255,0.9)",
            color: "#111827",
            boxShadow: "0 0 12px rgba(255,255,255,0.5)",
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={() => navigate("/login")}
          className="ml-4 px-4 py-2 bg-white/80 text-gray-900 font-semibold rounded-full 
                     hover:bg-white transition-all duration-300 shadow-sm"
        >
          Login / Signup
        </motion.button>
      </ul>
    </motion.nav>
  );
};

export default Navbar;
