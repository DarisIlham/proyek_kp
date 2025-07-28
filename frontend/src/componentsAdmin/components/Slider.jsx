import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Edit, X, Check } from "lucide-react";
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [tempSelected, setTempSelected] = useState([]);
  const [editingSlideIndex, setEditingSlideIndex] = useState(null);
  const [tempTitle, setTempTitle] = useState("");
  const [tempDescription, setTempDescription] = useState("");
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

        // Try to load saved slider images from localStorage
        const savedSlides = localStorage.getItem('sliderImages');
        if (savedSlides) {
          const parsed = JSON.parse(savedSlides);
          // Filter to only include images that still exist in gallery
          const validSlides = parsed.filter(slide => 
            galleryData.data.some(img => img.id_galeri === slide.id_galeri)
          );
          setSelectedSlides(validSlides.length > 0 ? validSlides : galleryData.data.slice(0, 3));
        } else {
          setSelectedSlides(galleryData.data.slice(0, 3));
        }
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

  // Open edit modal
  const openEditModal = () => {
    setTempSelected([...selectedSlides]);
    setShowEditModal(true);
  };

  // Close edit modal without saving
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingSlideIndex(null);
  };

  // Save selected slides
 const saveSelectedSlides = async () => {
  try {
    // Gabungkan id_galeri (dari tempSelected) dengan title/description (dari sliderData)
    const combinedData = tempSelected.map((slide, index) => ({
      order: index + 1, // Sesuai skema backend yang pakai order
      title: sliderData[index]?.title || "Default Title",
      description: sliderData[index]?.description || "Default Description",
    }));

    // Simpan ke localStorage (khusus gambar yang dipilih)
    localStorage.setItem("sliderImages", JSON.stringify(tempSelected));

    // Kirim ke backend
    const response = await fetch(`${API_BASE_URL}/api/slider`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(combinedData), // Kirim array
    });

    if (!response.ok) throw new Error("Failed to update slider data");

    const data = await response.json();

    // Update UI
    setSliderData(data);
    setSelectedSlides(tempSelected);
    setShowEditModal(false);
    setEditingSlideIndex(null);
    setCurrentSlide(0);
  } catch (error) {
    console.error("Error saving slider:", error);
  }
};

  // Toggle image selection for slider
  const toggleImageSelection = (image) => {
    setTempSelected(prev => {
      // If image is already selected, remove it
      if (prev.some(img => img.id_galeri === image.id_galeri)) {
        return prev.filter(img => img.id_galeri !== image.id_galeri);
      }
      // If less than 3 selected, add it
      if (prev.length < 3) {
        return [...prev, image];
      }
      return prev;
    });
  };

  // Open edit form for a specific slide
  const openSlideEditForm = (index) => {
    setEditingSlideIndex(index);
    setTempTitle(sliderData[index]?.title || "");
    setTempDescription(sliderData[index]?.description || "");
  };

  // Save edited title and description
  const saveSlideEdit = () => {
    const updatedSliderData = [...sliderData];
    if (!updatedSliderData[editingSlideIndex]) {
      updatedSliderData[editingSlideIndex] = {};
    }
    updatedSliderData[editingSlideIndex].title = tempTitle;
    updatedSliderData[editingSlideIndex].description = tempDescription;
    setSliderData(updatedSliderData);
    setEditingSlideIndex(null);
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
        <div className="text-gray-500">No slider images selected</div>
        {localStorage.getItem("token") && (
          <button
            onClick={openEditModal}
            className="absolute top-4 right-4 z-20 inline-flex items-center justify-center p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            title="Select Slider Images"
          >
            <Edit size={20} />
          </button>
        )}
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
      {/* Edit button for admin */}
      {localStorage.getItem("token") && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={openEditModal}
          className="absolute top-4 right-4 z-20 inline-flex items-center justify-center p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          title="Select Slider Images"
        >
          <Edit size={20} />
        </motion.button>
      )}

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

      {/* Edit Modal */}
      <AnimatePresence>
       {showEditModal && (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
            <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Slider Configuration</h3>
                <button onClick={closeEditModal} className="text-gray-500 hover:text-gray-700">
                    <X size={24} />
                </button>
                </div>
                
                {editingSlideIndex === null ? (
                <>
                    <div className="mb-4">
                    <p className="text-gray-600 mb-2">Select up to 3 images for the slider:</p>
                    <div className="flex items-center mb-4">
                        {tempSelected.map((img, idx) => (
                        <div key={img.id_galeri} className="relative mr-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            {idx + 1}
                            </div>
                        </div>
                        ))}
                        <span className="text-sm text-gray-500">
                        {tempSelected.length}/3 selected
                        </span>
                    </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[40vh] overflow-y-auto mb-6">
                    {allGalleryImages.map((image) => {
                        const isSelected = tempSelected.some(img => img.id_galeri === image.id_galeri);
                        return (
                        <div
                            key={image.id_galeri}
                            onClick={() => toggleImageSelection(image)}
                            className={`relative cursor-pointer rounded-lg overflow-hidden border-2 ${isSelected ? 'border-blue-500' : 'border-transparent'}`}
                        >
                            <img
                            src={
                                image.gambar.startsWith("http") || image.gambar.startsWith("data:")
                                ? image.gambar
                                : `data:image/jpeg;base64,${image.gambar}`
                            }
                            alt={image.judul || "Gallery image"}
                            className="w-full h-32 object-cover"
                            />
                            {isSelected && (
                            <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                                {tempSelected.findIndex(img => img.id_galeri === image.id_galeri) + 1}
                            </div>
                            )}
                        </div>
                        );
                    })}
                    </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3">Edit Slide Content</h4>
                    <div className="space-y-4">
                        {tempSelected.map((slide, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-gray-50">
                            <span className="block font-medium mb-2">Slide {index + 1}</span>
                            <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                value={sliderData[index]?.title || ""}
                                onChange={(e) => {
                                const updated = [...sliderData];
                                if (!updated[index]) updated[index] = {};
                                updated[index].title = e.target.value;
                                setSliderData(updated);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter slide title"
                            />
                            </div>
                            <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={sliderData[index]?.description || ""}
                                onChange={(e) => {
                                const updated = [...sliderData];
                                if (!updated[index]) updated[index] = {};
                                updated[index].description = e.target.value;
                                setSliderData(updated);
                                }}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter slide description"
                            />
                            </div>
                        </div>
                        ))}
                    </div>
                    </div>
                </>
                ) : (
                <div ref={editFormRef} className="mb-6">
                    <h4 className="text-lg font-semibold mb-3">Edit Slide {editingSlideIndex + 1} Content</h4>
                    <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                        type="text"
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                        value={tempDescription}
                        onChange={(e) => setTempDescription(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                        onClick={() => setEditingSlideIndex(null)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                        Cancel
                        </button>
                        <button
                        onClick={saveSlideEdit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                        Save Changes
                        </button>
                    </div>
                    </div>
                </div>
                )}

                <div className="flex justify-end space-x-3 mt-6">
                <button
                    onClick={closeEditModal}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={saveSelectedSlides}
                    disabled={tempSelected.length === 0}
                    className={`px-4 py-2 rounded-lg transition-colors ${tempSelected.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                    <div className="flex items-center">
                    <Check size={18} className="mr-2" />
                    Save Configuration
                    </div>
                </button>
                </div>
            </div>
            </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Slider;