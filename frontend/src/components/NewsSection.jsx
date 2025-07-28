import React, { useState, useEffect } from "react";
import { ChevronRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [header, setHeader] = useState({ nama: "" });
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchHeader = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/home`);
        if (response.ok) {
          const data = await response.json();
          setHeader({ nama: data.judul || "" });
        }
      } catch (error) {
        console.error('Error fetching header:', error);
      }
    };
    fetchHeader();
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/berita`);

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Failed to fetch news. Status: ${response.status}\n${text}`);
        }

        const data = await response.json();
        setNews(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        Loading news...
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 text-red-600"
      >
        Error: {error}
      </motion.div>
    );
  }

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-20 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Berita Terbaru Di {header.nama}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <motion.div
              key={item.id_berita}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate(`/berita/${item.id_berita}`)}
            >
              <motion.div 
                className="h-48 overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                {item.gambar_utama ? (
                  <img
                    src={item.gambar_utama.startsWith('http') 
                      ? item.gambar_utama 
                      : `data:image/jpeg;base64,${item.gambar_utama}`}
                    alt={item.judul}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="bg-gray-300 h-full flex items-center justify-center">
                    <span className="text-gray-600">No Image</span>
                  </div>
                )}
              </motion.div>

              <div className="p-6">
                <motion.h3 
                  className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2"
                  whileHover={{ color: "#3b82f6" }}
                >
                  {item.judul}
                </motion.h3>
                <p className="text-blue-600 text-sm mb-3">
                  {new Date(item.tanggal_publikasi).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {item.isi}
                </p>
                <motion.div 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Baca Selengkapnya <ChevronRight className="w-4 h-4 ml-1" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default NewsSection;