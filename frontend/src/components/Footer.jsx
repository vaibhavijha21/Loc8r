import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white py-12 px-6 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">
        
        <div className="flex flex-col gap-4 md:w-1/3">
          <h2 className="text-2xl font-bold">Loc8r</h2>
          <p className="text-gray-400 text-sm">
            Helping students and staff reconnect with lost items on campus.
            Report lost or found items easily and keep your campus organized.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:w-1/3">
          <h3 className="font-semibold text-white text-lg mb-2">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#home" className="hover:text-gray-400 transition cursor-pointer">Home</a>
            </li>
            <li>
              <a href="#about" className="hover:text-gray-400 transition cursor-pointer">About</a>
            </li>
            <li>
              <a href="#features" className="hover:text-gray-400 transition cursor-pointer">Features</a>
            </li>
            <li>
              <a href="#faqs" className="hover:text-gray-400 transition cursor-pointer">FAQs</a>
            </li>
            <li>
              <a href="#contact" className="hover:text-gray-400 transition cursor-pointer">Contact</a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4 md:w-1/3">
          <h3 className="font-semibold text-white text-lg mb-2">Get in Touch</h3>
          <p className="text-gray-400 text-sm">Email: support@loc8r.com</p>
          <p className="text-gray-400 text-sm">Phone: +1 234 567 890</p>
          <div className="flex gap-4 mt-2">
            <FaFacebookF className="hover:text-gray-400 cursor-pointer transition" />
            <FaTwitter className="hover:text-gray-400 cursor-pointer transition" />
            <FaInstagram className="hover:text-gray-400 cursor-pointer transition" />
            <FaLinkedinIn className="hover:text-gray-400 cursor-pointer transition" />
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Loc8r. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
