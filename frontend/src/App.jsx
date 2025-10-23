import { useState } from 'react'
import './index.css'
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import FeaturesSection from "./components/FeaturesSection";
import VideoSection from "./components/VideoSection";
import FAQsSection from './components/FAQsSection';
import ContactSection from './components/ContactSection';
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <VideoSection />
      <FAQsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default App;