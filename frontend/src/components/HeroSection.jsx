import Navbar from "./Navbar";
import heroVideo from "../assets/hero-video.mp4";

const HeroSection = () => {
  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">

      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
      />

      <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10"></div>

      <Navbar />

      
    </section>
  );
};

export default HeroSection;
