import React from "react";
import Header from '../componentsAdmin/components/Header'
import Footer from '../componentsAdmin/components/Footer'
import HeroSection from "../componentsAdmin/components/HeroSection";
import FeaturesSection from "../componentsAdmin/components/FeatureSection";
import AboutSection from "../componentsAdmin/components/AboutSection";
import NewsSection from "../componentsAdmin/components/NewsSection";
import GallerySection from "../componentsAdmin/components/GallerySection";
import JumlahSiswa from "../componentsAdmin/components/JumlahSiswa";

const App = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
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