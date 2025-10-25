import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import './index.css';

// Component Imports
// import Navbar from "./components/Navbar";
// import HeroSection from "./components/HeroSection";
// import AboutSection from "./components/AboutSection";
// import FeaturesSection from "./components/FeaturesSection";
// import VideoSection from "./components/VideoSection";
// import FAQsSection from './components/FAQsSection';
// import ContactSection from './components/ContactSection';
// import Footer from "./components/Footer";

// Your new page imports (assuming they are in './components1/')
// import Authentication from "./components1/Authentication";
import LostAndFoundDashboard from "./components1/LostAndFoundDashboard";


// --- Component for the combined Home/Landing Page ---
// const LandingPage = ({ isAuth }) => (
//   <>
//     <Navbar isAuth={isAuth} />
//     <HeroSection />
//     <AboutSection />
//     <FeaturesSection />
//     <VideoSection />
//     <FAQsSection />
//     <ContactSection />
//     <Footer />
//   </>
// );

// // --- Main App Component ---
function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
<div>
      <LostAndFoundDashboard />
    </div>
//     <Router>
//       <div className="App">
//         <Routes>
//           {/* Home Route: The landing page bundle */}
//           <Route 
//             path="/" 
//             element={<LandingPage isAuth={isAuthenticated} />} 
//           />

//           {/* Authentication Route */}
//           <Route 
//             path="/login" 
//             element={<Authentication setIsAuthenticated={setIsAuthenticated} />} 
//           />

//           {/* Dashboard Route: Protected Route */}
//           <Route 
//             path="/dashboard" 
//             element={
//               // If authenticated, show the Dashboard, otherwise redirect to login
//               isAuthenticated ? (
//                 <LostAndFoundDashboard />
//               ) : (
//                 <Navigate to="/login" replace />
//               )
//             } 
//           />
          
//           {/* Fallback Route (Optional) */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </div>
//     </Router>
  );
 }

export default App;