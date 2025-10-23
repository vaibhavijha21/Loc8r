import { motion } from "framer-motion";

const ContactSection = () => {
  return (
    <section id="contact" className="w-full bg-gray-200 py-20 px-6 md:px-16 flex flex-col md:flex-row gap-10 items-center">
      
      <motion.div
        className="md:w-1/2 flex flex-col gap-6"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Get in Touch
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Have a question or need help? Reach out to us and we’ll get back to you as soon as possible.
        </p>

        <div className="flex flex-col gap-3 text-gray-700 text-base">
          <p><strong>Email:</strong> support@loc8r.com</p>
          <p><strong>Phone:</strong> +1 234 567 890</p>
        </div>
      </motion.div>

      <motion.div
        className="md:w-1/2 bg-white rounded-xl shadow-lg p-8"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Name"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
          />
          <textarea
            rows="5"
            placeholder="Your Message"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
          ></textarea>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0,0,0,0.2)" }}
            transition={{ duration: 0.3 }}
            className="mt-2 px-6 py-3 bg-gray-800 text-white font-semibold rounded-full hover:bg-gray-700 transition"
          >
            Send Message
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
};

export default ContactSection;
