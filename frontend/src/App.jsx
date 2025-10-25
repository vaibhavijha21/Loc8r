import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Component Imports
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import FeaturesSection from "./components/FeaturesSection";
import VideoSection from "./components/VideoSection";
import FAQsSection from './components/FAQsSection';
import ContactSection from './components/ContactSection';
import Footer from "./components/Footer";
import BackendAuthentication from "./components1/BackendAuthentication";
import BackendLostAndFoundDashboard from "./components1/BackendLostAndFoundDashboard";
import apiService from './services/api';

// --- Component for the combined Home/Landing Page ---
const LandingPage = ({ isAuth, setIsAuthenticated }) => (
  <>
    <Navbar isAuth={isAuth} setIsAuthenticated={setIsAuthenticated} />
    <HeroSection />
    <AboutSection />
    <FeaturesSection />
    <VideoSection />
    <FAQsSection />
    <ContactSection />
    <Footer />
  </>
);

// --- Main App Component ---
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        apiService.setToken(token);
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleAuthentication = (authenticated) => {
    setIsAuthenticated(authenticated);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Home Route: The landing page bundle */}
          <Route 
            path="/" 
            element={<LandingPage isAuth={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} 
          />

          {/* Authentication Route */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <BackendAuthentication setIsAuthenticated={handleAuthentication} />
              )
            } 
          />

          {/* Dashboard Route: Protected Route */}
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? (
                <BackendLostAndFoundDashboard setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;