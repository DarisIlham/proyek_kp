import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
  const [content, setContent] = useState({
    judul: "SD Negeri Tembalang",
    subjudul: "Lorem ipsum dolor sit amet consectetur adipisicing.",
    deskripsi: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet, provident.",
    gambar: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState({ ...content });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ message: "", error: "" });
  const [, setIsHovering] = useState(false);
  const imageRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/home`);
        if (!response.ok) throw new Error("Gagal memuat konten");
        const data = await response.json();
        setContent({
          judul: data.judul || "SD Negeri Tembalang",
          subjudul: data.subjudul || "Lorem ipsum dolor sit amet consectetur adipisicing.",
          deskripsi: data.deskripsi || "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet, provident.",
          gambar: data.gambar || "",
        });
      } catch (error) {
        setStatus((prev) => ({ ...prev, error: error.message }));
      }
    };
    fetchContent();
  }, []);

  const handleEdit = () => {
    setEditContent({ ...content });
    setIsEditing(true);
    setStatus({ message: "", error: "" });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditContent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setStatus({ message: "", error: "" });

    try {
      const currentData = await fetch(`${API_BASE_URL}/api/home`).then((res) => res.json());

      const response = await fetch(`${API_BASE_URL}/api/home`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...currentData,
          judul: editContent.judul,
          subjudul: editContent.subjudul,
          deskripsi: editContent.deskripsi,
          gambar: editContent.gambar,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menyimpan perubahan");
      }

      const updatedData = await response.json();
      setContent(updatedData);
      setStatus((prev) => ({ ...prev, message: "Perubahan berhasil disimpan!" }));
      setIsEditing(false);
    } catch (error) {
      setStatus((prev) => ({ ...prev, error: error.message }));
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 1.0,
        delayChildren: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "tween",
      ease: "easeOut",
      duration: 1.0
      }
    }
  };

  const imageVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "tween",
      ease: "easeOut",
      duration: 1.0,
      delay: 0.5
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
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.3,
        yoyo: Infinity
      }
    },
    tap: {
      scale: 0.95
    }
  };

  if (isEditing) {
    return (
      <section className="bg-gray-50 animate-fade-in transition-opacity duration-500 ease-in-out">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  name="gambar"
                  value={editContent.gambar || ""}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-2 border rounded transition-all duration-300 focus:ring-2 focus:ring-blue-400"
                  required
                />
                {editContent.gambar && (
                  <div className="mt-2">
                    <motion.img
                      src={editContent.gambar}
                      alt="Preview"
                      className="max-w-full h-40 object-contain border rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/300x200?text=Invalid+URL";
                      }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                    <p className="text-xs text-gray-500 mt-1">Image Preview</p>
                  </div>
                )}
              </div>
            </div>

            <div className="order-2 lg:order-2 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                <input
                  type="text"
                  name="judul"
                  value={editContent.judul}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded transition-all duration-300 focus:ring-2 focus:ring-blue-400"
                  maxLength={200}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subjudul</label>
                <input
                  type="text"
                  name="subjudul"
                  value={editContent.subjudul}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded transition-all duration-300 focus:ring-2 focus:ring-blue-400"
                  maxLength={200}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  name="deskripsi"
                  value={editContent.deskripsi}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded transition-all duration-300 focus:ring-2 focus:ring-blue-400"
                  rows={4}
                  maxLength={1000}
                  required
                />
              </div>

              <div className="flex gap-2 pt-4">
                <motion.button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoading ? "Menyimpan..." : "Simpan"}
                </motion.button>
                <motion.button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Batal
                </motion.button>
              </div>

              {status.message && (
                <motion.p 
                  className="text-green-600 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {status.message}
                </motion.p>
              )}
              {status.error && (
                <motion.p 
                  className="text-red-600 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {status.error}
                </motion.p>
              )}
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
          <motion.div 
            className="order-1 lg:order-1"
            variants={imageVariants}
            ref={imageRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="bg-gray-200 rounded-lg h-75 md:h-85 lg:h-94 flex items-center justify-center overflow-hidden relative">
              {content.gambar ? (
                <>
                  <motion.img
                    src={content.gambar}
                    alt="Lingkungan sekolah"
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      transition: { duration: 0.6 }
                    }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  />
                </>
              ) : (
                <span className="text-gray-500">Gambar Sekolah</span>
              )}
            </div>
          </motion.div>

          <motion.div className="order-1 lg:order-2 space-y-6">
            <motion.h1 
              className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
              variants={itemVariants}
            >
              {content.judul.split("").map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{ display: 'inline-block' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
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

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start"
              variants={itemVariants}
            >
              <motion.a
                href="https://spmb.semarangkota.go.id/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 text-lg font-semibold shadow-md">
                  Daftar Sekarang
                </button>
              </motion.a>

              {localStorage.getItem("token") && (
                <motion.button
                  onClick={handleEdit}
                  className="bg-gray-600 text-white px-8 py-3 rounded-lg w-49 hover:bg-gray-700 text-lg font-semibold shadow-md"
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                >
                  Edit Konten
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;