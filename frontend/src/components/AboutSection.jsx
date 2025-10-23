import { motion } from "framer-motion";
import aboutImg1 from "../assets/about1.png";
import aboutImg2 from "../assets/about2.png";

const AboutSection = () => {
  return (
    <section id="about" className="relative w-full min-h-screen bg-white text-gray-800 flex flex-col items-center justify-center px-6 md:px-16 py-20 overflow-hidden">
      
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_#d1d5db,_transparent_70%)]"></div>

      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-extrabold font-sans text-center mb-12 relative z-10 text-gray-800 tracking-wide"
      >
        About <span className="text-gray-500">Loc8r</span>
      </motion.h2>

      <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="md:w-1/2 space-y-6"
        >
          <h3 className="text-2xl md:text-3xl font-semibold font-sans text-gray-600 tracking-tight">
            Making Lost & Found Easy on Campus
          </h3>

          <p className="text-gray-700 text-lg leading-relaxed font-sans">
            Loc8r is your campus companion for all lost and found needs.  
            Whether you’ve misplaced your belongings or discovered someone
            else’s, our platform makes it simple to report, search, and recover
            items — all within your college campus.
          </p>

          <p className="text-gray-600 text-md leading-relaxed font-sans">
            We understand how frustrating it can be to lose something in a big
            campus. That’s why Loc8r helps students and staff easily connect and
            locate lost items with just a few clicks.  
            <br />
            Safe, fast, and super helpful — Loc8r keeps your campus connected.
          </p>

          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 15px rgba(156, 163, 175, 0.5)",
            }}
            transition={{ duration: 0.3 }}
            className="mt-4 px-6 py-3 bg-gray-800 text-white font-semibold font-sans rounded-full hover:bg-gray-700 transition duration-300"
          >
            Learn More
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="md:w-1/2 flex gap-4 justify-center"
        >
          <motion.img
            src={aboutImg1}
            alt="Lost and Found"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl w-1/2 object-cover shadow-lg hover:shadow-gray-400/50"
          />
          <motion.img
            src={aboutImg2}
            alt="Campus Help"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl w-1/2 object-cover shadow-lg hover:shadow-gray-400/50"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
