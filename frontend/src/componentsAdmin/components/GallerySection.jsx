import React, { useState, useEffect, useRef } from "react";
import { ZoomIn, ZoomOut, X, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const GallerySection = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const [header, setHeader] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [homeRes, galeriRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/home`),
          fetch(`${API_BASE_URL}/api/galeri`)
        ]);

        if (homeRes.ok) {
          const homeData = await homeRes.json();
          setHeader({ nama: homeData.judul || "" });
        }

        if (galeriRes.ok) {
          const galeriData = await galeriRes.json();
          setImages(galeriData.data || []);
        }
      } catch (e) {
        console.error("Error fetching data:", e);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleZoom = (direction) => {
    if (direction === "in") {
      setZoomLevel((prev) => Math.min(prev + 0.25, 3));
    } else {
      setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
    }
    setPosition({ x: 0, y: 0 });
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (zoomLevel === 1) return;
    setIsDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoomLevel === 1) return;

    const newX = e.clientX - startPos.x;
    const newY = e.clientY - startPos.y;

    if (imageRef.current) {
      const maxX = (imageRef.current.offsetWidth * (zoomLevel - 1)) / 2;
      const maxY = (imageRef.current.offsetHeight * (zoomLevel - 1)) / 2;

      setPosition({
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (loading) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-20 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Foto Dokumentasi Kegiatan {header.nama}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                className="bg-gray-200 rounded-lg h-64"
              ></motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-20 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 relative">
          <div className="flex justify-center items-center gap-4 relative">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Foto Dokumentasi Kegiatan {header.nama}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/galeri")}
              className="absolute right-0 inline-flex items-center justify-center p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              title="Edit Gallery"
            >
              <Edit size={20} />
            </motion.button>
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {images.map((image, index) => (
            <motion.div
              key={image.id_galeri}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-w-4 aspect-h-3 relative">
                <motion.img
                  src={
                    image.gambar.startsWith("http") || image.gambar.startsWith("data:")
                      ? image.gambar
                      : `data:image/jpeg;base64,${image.gambar}`
                  }
                  alt={`Gallery Image ${image.id_galeri}`}
                  className="w-full h-64 object-cover cursor-zoom-in"
                  onClick={() => {
                    setZoomedImage(
                      image.gambar.startsWith("http") || image.gambar.startsWith("data:")
                        ? image.gambar
                        : `data:image/jpeg;base64,${image.gambar}`
                    );
                    setZoomLevel(1);
                    setPosition({ x: 0, y: 0 });
                  }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-black/50 p-2 rounded-full hover:bg-black/70"
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomedImage(
                        image.gambar.startsWith("http") || image.gambar.startsWith("data:")
                          ? image.gambar
                          : `data:image/jpeg;base64,${image.gambar}`
                      );
                      setZoomLevel(1);
                      setPosition({ x: 0, y: 0 });
                    }}
                  >
                    <ZoomIn className="text-white w-6 h-6" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Zoom Modal */}
      <AnimatePresence>
          {zoomedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={() => {
              setZoomedImage(null);
              resetZoom();
            }}
          >
            <motion.div
              className="relative w-full h-full overflow-auto"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomedImage(null);
                  resetZoom(e);
                }}
                className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full z-10 hover:bg-black/70"
              >
                <X size={24} />
              </motion.button>

              <div className="absolute top-4 left-4 flex gap-2 z-10">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handleZoom('in', e)}
                  className="text-white bg-black/50 p-2 rounded-full hover:bg-black/70"
                  disabled={zoomLevel >= 3}
                >
                  <ZoomIn size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handleZoom('out', e)}
                  className="text-white bg-black/50 p-2 rounded-full hover:bg-black/70"
                  disabled={zoomLevel <= 0.5}
                >
                  <ZoomOut size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => resetZoom(e)}
                  className="text-white bg-black/50 p-2 rounded-full text-sm px-3 hover:bg-black/70"
                >
                  Reset
                </motion.button>
              </div>

              <div
                className="w-full h-full overflow-hidden flex items-center justify-center"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{
                  cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                }}
              >
                <motion.img
                  ref={imageRef}
                  src={zoomedImage}
                  alt="Zoomed"
                  className="object-contain"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: zoomLevel }}
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    transformOrigin: 'center center',
                    transition: isDragging ? 'none' : 'transform 0.3s ease',
                    width: 'auto',
                    height: 'auto',
                    maxWidth: '100%',
                    maxHeight: '100%',
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default GallerySection;
