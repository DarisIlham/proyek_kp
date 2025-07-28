import React from "react";
import Header from '../components/Header'
import Footer from '../components/Footer'
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeatureSection";
import AboutSection from "../components/AboutSection";
import DepartmentsSection from "../components/DepartmentsSection";
import NewsSection from "../components/NewsSection";
import GallerySection from "../components/GallerySection";
import AlumniSection from "../components/AlumniSection";
import JumlahSiswa from "../components/JumlahSiswa";
import Slider from "../components/Slider";

const App = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Slider />
      <HeroSection />
      <JumlahSiswa />
      <FeaturesSection />
      <section id="about"><AboutSection /></section>
      <section id="news"><NewsSection /></section>
      <GallerySection />
      <Footer />
    </div>
  );
};

export default App;