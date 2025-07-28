import React, { useState, useEffect, useRef } from "react";
import { BookOpen, Users, Wrench, Trophy, Edit, X, Check, Loader2 } from 'lucide-react';
import { motion, useInView } from 'framer-motion'; 


const FeatureSection = () => {
  const [features, setFeatures] = useState({
    judulfeature: "",
    feature1: "",
    deskripsifeature1: "",
    feature2: "",
    deskripsifeature2: "",
    feature3: "",
    deskripsifeature3: "",
    feature4: "",
    deskripsifeature4: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempFeatures, setTempFeatures] = useState({ ...features });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [showNotification, setShowNotification] = useState(false);

  // 👀 Ref dan scroll trigger
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/home`);
        if (!response.ok) throw new Error('Failed to fetch features');
        const data = await response.json();

        setFeatures({
          judulfeature: data.judulfeature || "Kenapa Harus SD Negeri Tembalang?",
          feature1: data.feature1 || "Kurikulum Berbasis Industri",
          deskripsifeature1: data.deskripsifeature1 || "Program pembelajaran yang disesuaikan dengan kebutuhan industri modern.",
          feature2: data.feature2 || "Tenaga Pengajar Berpengalaman",
          deskripsifeature2: data.deskripsifeature2 || "Guru-guru profesional dengan pengalaman industri.",
          feature3: data.feature3 || "Fasilitas Lengkap",
          deskripsifeature3: data.deskripsifeature3 || "Laboratorium dan workshop modern dengan peralatan terkini.",
          feature4: data.feature4 || "Prestasi Gemilang",
          deskripsifeature4: data.deskripsifeature4 || "Meraih berbagai prestasi di tingkat regional dan nasional."
        });
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load features');
      }
    };
    fetchFeatures();
  }, []);

  const handleEditClick = () => {
    setTempFeatures({ ...features });
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempFeatures(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      const currentData = await fetch(`${API_BASE_URL}/api/home`).then(res => res.json());

      const response = await fetch(`${API_BASE_URL}/api/home`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...currentData,
          ...tempFeatures
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.[0]?.msg || 'Failed to update features');
      }

      const data = await response.json();
      setFeatures({
        judulfeature: data.judulfeature,
        feature1: data.feature1,
        deskripsifeature1: data.deskripsifeature1,
        feature2: data.feature2,
        deskripsifeature2: data.deskripsifeature2,
        feature3: data.feature3,
        deskripsifeature3: data.deskripsifeature3,
        feature4: data.feature4,
        deskripsifeature4: data.deskripsifeature4
      });
      setMessage("Data berhasil diperbaharui");
      setShowNotification(true);
      setIsEditing(false);

      setTimeout(() => {
      setShowNotification(false);
    }, 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const featureIcons = [
    <BookOpen className="w-8 h-8 text-blue-600" />,
    <Users className="w-8 h-8 text-blue-600" />,
    <Wrench className="w-8 h-8 text-blue-600" />,
    <Trophy className="w-8 h-8 text-blue-600" />
  ];

  // 🔁 Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 1.0,
        staggerChildren: 0.8
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          {isEditing ? (
            <div className="flex flex-col items-center">
              <input
                type="text"
                name="judulfeature"
                value={tempFeatures.judulfeature}
                onChange={handleInputChange}
                className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-center w-full max-w-2xl p-2 border rounded"
              />
              {localStorage.getItem('token') && (
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={handleCancelClick}
                    className="bg-gray-500 text-white px-4 py-2 rounded flex items-center"
                  >
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    Save
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {features.judulfeature}
              </h2>
              {localStorage.getItem('token') && (
                <button
                  onClick={handleEditClick}
                  className="ml-4 bg-blue-500 text-white p-2 rounded-full"
                >
                  <Edit className="h-5 w-5" />
                </button>
              )}
            </div>
          )}
          {error && <p className="text-red-600 mt-2">{error}</p>}
          {message && <p className="text-green-600 mt-2">{}</p>}
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {[1, 2, 3, 4].map((num, index) => (
            <motion.div
              key={index}
              className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow bg-gray-50"
              variants={cardVariants}
            >
              <div className="flex justify-center mb-4">
                {featureIcons[index]}
              </div>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name={`feature${num}`}
                    value={tempFeatures[`feature${num}`]}
                    onChange={handleInputChange}
                    className="text-xl font-semibold text-gray-900 mb-3 w-full p-2 border rounded"
                  />
                  <textarea
                    name={`deskripsifeature${num}`}
                    value={tempFeatures[`deskripsifeature${num}`]}
                    onChange={handleInputChange}
                    className="text-gray-600 w-full p-2 border rounded"
                    rows="3"
                  />
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {features[`feature${num}`]}
                  </h3>
                  <p className="text-gray-600">
                    {features[`deskripsifeature${num}`]}
                  </p>
                </>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
      {showNotification && (
        <div className="fixed bottom-4 right-4">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in-up">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>{message}</span>
          </div>
        </div>
      )}
    </section>
  );
};

export default FeatureSection;
