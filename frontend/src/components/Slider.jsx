import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Slider = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [allGalleryImages, setAllGalleryImages] = useState([]);
  const [selectedSlides, setSelectedSlides] = useState([]);
  const [sliderData, setSliderData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch all gallery images and slider data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch gallery images
        const galleryResponse = await fetch(`${API_BASE_URL}/api/galeri`);
        if (!galleryResponse.ok) throw new Error("Failed to fetch gallery images");
        const galleryData = await galleryResponse.json();
        setAllGalleryImages(galleryData.data || []);
        
        // Fetch slider data (titles and descriptions)
        const sliderResponse = await fetch(`${API_BASE_URL}/api/slider`);
        if (!sliderResponse.ok) throw new Error("Failed to fetch slider data");
        const sliderData = await sliderResponse.json();
        setSliderData(sliderData);

        // Load default slider images
        setSelectedSlides(galleryData.data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (selectedSlides.length === 0) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % selectedSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedSlides.length]);

  // Merge gallery images with slider data to get complete slide information
  const getCompleteSlideInfo = (index) => {
    const slideImage = selectedSlides[index];
    const slideInfo = sliderData[index] || {};
    
    return {
      image: slideImage?.gambar || "",
      title: slideInfo?.title || "Selamat Datang di SDN Tembalang",
      description: slideInfo?.description || "Sekolah Unggulan Berbasis Kompetensi"
    };
  };

  const nextSlide = () => {
    if (selectedSlides.length === 0) return;
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % selectedSlides.length);
  };

  const prevSlide = () => {
    if (selectedSlides.length === 0) return;
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + selectedSlides.length) % selectedSlides.length);
  };

  const goToSlide = (index) => {
    if (selectedSlides.length === 0) return;
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  // Animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  const textVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (loading) {
    return (
      <div className="relative w-full h-[500px] bg-gray-200 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading slider...</div>
      </div>
    );
  }

  if (selectedSlides.length === 0) {
    return (
      <div className="relative w-full h-[500px] bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">No slider images available</div>
      </div>
    );
  }

  const currentSlideInfo = getCompleteSlideInfo(currentSlide);

  return (
    <div 
      className="relative w-full h-[400px] md:h-[500px] lg:h-[675px] overflow-hidden"
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <div className="relative w-full h-full">
            <img
              src={
                currentSlideInfo.image.startsWith("http") || 
                currentSlideInfo.image.startsWith("data:")
                  ? currentSlideInfo.image
                  : `data:image/jpeg;base64,${currentSlideInfo.image}`
              }
              alt={`Slide ${currentSlide + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center px-4 max-w-4xl mx-auto">
                <motion.h1 
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
                >
                  {currentSlideInfo.title}
                </motion.h1>
                <motion.p
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-xl md:text-2xl text-white mb-8"
                >
                  {currentSlideInfo.description}
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full z-10 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full z-10 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight size={32} />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {selectedSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-white w-6" : "bg-white/50"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;