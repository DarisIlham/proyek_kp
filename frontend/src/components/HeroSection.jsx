import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
  const [content, setContent] = useState({
    judul: "",
    subjudul: "",
    deskripsi: "",
    gambar: ""
  });
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/home`);
        if (!response.ok) throw new Error("Failed to fetch content");
        const data = await response.json();
        
        setContent({
          judul: data.judul || "SD Negeri Tembalang",
          subjudul: data.subjudul || "Sekolah Unggulan Berbasis Teknologi",
          deskripsi: data.deskripsi || "Menyediakan pendidikan berkualitas untuk membangun generasi penerus yang berkarakter dan berprestasi.",
          gambar: data.gambar || ""
        });
      } catch (error) {
        console.error("Error fetching hero content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.7,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.3,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 1.4,
        ease: "easeOut",
        delay: 0.2
      }
    },
    hover: {
      scale: 1.03,
      transition: { duration: 0.3 }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)"
    },
    tap: {
      scale: 0.98
    }
  };

  if (loading) {
    return (
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image placeholder */}
            <div className="bg-gray-200 rounded-lg h-96 animate-pulse"></div>
            
            {/* Content placeholder */}
            <div className="space-y-6">
              <div className="h-12 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </div>
              <div className="h-12 bg-gray-200 rounded animate-pulse w-48"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pb-36 pt-36"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Left side - Image with animation */}
          <motion.div 
            className="order-1 lg:order-1"
            variants={imageVariants}
          >
            <div className="bg-gray-200 rounded-lg h-75 md:h-85 lg:h-94 flex items-center justify-center overflow-hidden relative">
              {content.gambar ? (
                <motion.img
                  src={content.gambar} 
                  alt="School environment" 
                  className="w-full h-full object-cover"
                  whileHover="hover"
                />
              ) : (
                <span className="text-gray-600">School Environment Image</span>
              )}
            </div>
          </motion.div>

          {/* Right side - Content with staggered animations */}
          <motion.div className="order-2 lg:order-2 space-y-6">
            <motion.h1 
              className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
              variants={itemVariants}
            >
              {content.judul}
            </motion.h1>

            <motion.h2 
              className="text-xl lg:text-2xl text-blue-600 mb-6"
              variants={itemVariants}
            >
              {content.subjudul}
            </motion.h2>

            <motion.p 
              className="text-gray-600 mb-8 text-lg"
              variants={itemVariants}
            >
              {content.deskripsi}
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start">
              <motion.a
                href="https://spmb.semarangkota.go.id/"
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
              >
                <motion.button 
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Daftar Sekarang
                </motion.button>
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;