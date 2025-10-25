import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import FeaturesSection from "./components/FeaturesSection";
import VideoSection from "./components/VideoSection";
import FAQsSection from './components/FAQsSection';
import ContactSection from './components/ContactSection';
import Footer from "./components/Footer";

import Authentication from "./components1/Authentication";
import LostAndFoundDashboard from "./components1/LostAndFoundDashboard";
import Profile from "./components/Profile"; // ✅ Import Profile

// --- Landing Page ---
const LandingPage = ({ isAuth }) => (
  <>
    <Navbar isAuth={isAuth} />
    <HeroSection />
    <AboutSection />
    <FeaturesSection />
    <VideoSection />
    <FAQsSection />
    <ContactSection />
    <Footer />
  </>
);

// --- Main App ---
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="App">
        <Routes>

          {/* Home Route */}
          <Route 
            path="/" 
            element={<LandingPage isAuth={isAuthenticated} />} 
          />

          {/* Authentication Route */}
          <Route 
            path="/login" 
            element={<Authentication setIsAuthenticated={setIsAuthenticated} />} 
          />

          {/* Protected Dashboard Route */}
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? (
                <LostAndFoundDashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />

          {/* Protected Profile Route */}
          <Route 
            path="/profile"
            element={
              isAuthenticated ? (
                <Profile />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
