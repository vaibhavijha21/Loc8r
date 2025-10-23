import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi"; 
import faqImage from "../assets/faq-illustration.png"; 

const faqs = [
  {
    question: "How do I report a lost item?",
    answer:
      "Simply click on 'Report Lost' from the homepage, fill in the item details, and submit. The campus community will be notified instantly.",
  },
  {
    question: "Can I search for found items by location?",
    answer:
      "Yes! You can filter found items by building, floor, or any specific location on campus to quickly find your belongings.",
  },
  {
    question: "Is my contact information visible to others?",
    answer:
      "No. Your personal details are kept private. Only authorized personnel or the owner will be able to contact you through our platform.",
  },
  {
    question: "Can I report multiple items at once?",
    answer:
      "Yes! You can report multiple items one by one. Each item will have its own unique entry to help the system track them accurately.",
  },
];

const FAQCard = ({ faq, isOpen, onClick }) => (
  <motion.div
    layout
    onClick={onClick} id="faqs"
    className="cursor-pointer w-full bg-white text-gray-800 rounded-xl shadow-md p-5 mb-3 border border-gray-200 hover:shadow-lg transition"
  >
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium">{faq.question}</h3>
      <motion.span
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <FiChevronDown size={24} />
      </motion.span>
    </div>

    <AnimatePresence>
      {isOpen && (
        <motion.p
          layout
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-3 text-gray-700 text-base"
        >
          {faq.answer}
        </motion.p>
      )}
    </AnimatePresence>
  </motion.div>
);

const FAQsSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative w-full py-20 px-6 md:px-16 bg-gray-50 flex flex-col md:flex-row items-center gap-10">
      
      <motion.div
        className="md:w-1/2 flex justify-center"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <img
          src={faqImage}
          alt="FAQ Illustration"
          className="w-full max-w-md object-contain rounded-2xl"
        />
      </motion.div>

      <motion.div
        className="md:w-1/2 flex flex-col w-full"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-8"
        >
          Frequently Asked <span className="text-gray-5 00">Questions</span>
        </motion.h2>

        <div className="flex flex-col gap-3 w-full">
          {faqs.map((faq, index) => (
            <FAQCard
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onClick={() => handleClick(index)}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default FAQsSection;
