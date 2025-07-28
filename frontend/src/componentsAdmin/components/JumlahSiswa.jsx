import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const JumlahSiswa = () => {
  const [stats, setStats] = useState({
    namajumlah1: "",
    jumlah1: 0,
    namajumlah2: "",
    jumlah2: 0,
    namajumlah3: "",
    jumlah3: 0,
  });
  const statsRef = useRef(null);
  const isInView = useInView(statsRef, { once: true });
  const [isEditing, setIsEditing] = useState(false);
  const [tempStats, setTempStats] = useState({ ...stats });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/home`);
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();

        // Fetch data siswa
        const siswaResponse = await fetch(`${API_BASE_URL}/api/siswas`);
        if (!siswaResponse.ok) throw new Error("Failed to fetch siswa data");
        const siswaData = await siswaResponse.json();
        const jumlahSiswa = siswaData.length;

        // Fetch data guru
        const guruResponse = await fetch(`${API_BASE_URL}/api/gurus`);
        if (!guruResponse.ok) throw new Error("Failed to fetch guru data");
        const guruData = await guruResponse.json();
        const jumlahGuru = guruData.length;

        setStats({
          namajumlah1: "Jumlah Siswa",
          jumlah1: jumlahSiswa,
          namajumlah2: "Jumlah Guru",
          jumlah2: jumlahGuru,
          namajumlah3: data.namajumlah3 || "",
          jumlah3: data.jumlah3 || 0,
          nama: data.judul || "",
        });
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load stats");
      }
    };
    fetchStats();
  }, []);

  const handleEditClick = () => {
    setTempStats({ ...stats });
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempStats((prev) => ({
      ...prev,
      [name]: name.startsWith("jumlah") ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      // First get the current document to preserve other fields
      const currentData = await fetch(`${API_BASE_URL}/api/home`).then((res) =>
        res.json()
      );

      const response = await fetch(`${API_BASE_URL}/api/home`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...currentData,
          ...tempStats,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.[0]?.msg || "Failed to update stats");
      }

      const data = await response.json();
      setStats(prev => ({
        ...prev,
        namajumlah3: data.namajumlah3,
        jumlah3: data.jumlah3,
      }));
      
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.8,
        staggerChildren: 1.0,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "tween",
        ease: "easeOut",
        duration: 0.6,
      },
    },
  };

  return (
    <div className="pb-16 bg-white rounded-lg shadow ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-4 mt-16 ">
          <h2 className="text-2xl font-bold">
            Statistik Warga Sekolah {stats.nama}
          </h2>
          {localStorage.getItem("token") && !isEditing && (
            <button
              onClick={handleEditClick}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}
      {message && <div className="text-green-600 mb-4">{}</div>}

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2].map((num) => (
              <div key={num} className="space-y-2 p-8">
                <h3 className="text-lg font-semibold text-gray-800">
                  {stats[`namajumlah${num}`] || `Stat ${num}`}
                </h3>
                <div className="text-3xl font-bold text-blue-600">
                  {stats[`jumlah${num}`]}
                </div>
              </div>
            ))}

            {[3].map((num) => (
              <div key={num} className="space-y-2">
                <input
                  type="text"
                  name={`namajumlah${num}`}
                  value={tempStats[`namajumlah${num}`]}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder={`Stat ${num} Name`}
                />
                <input
                  type="number"
                  name={`jumlah${num}`}
                  value={tempStats[`jumlah${num}`]}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder={`Stat ${num} Value`}
                  min="0"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={handleCancelClick}
              className="bg-gray-500 text-white px-4 py-2 rounded"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      ) : (
        <motion.div
          ref={statsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {[1, 2, 3].map((num) => (
            <motion.div
              key={num}
              className="text-center p-8 bg-gray-50 rounded shadow"
              variants={cardVariants}
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {stats[`namajumlah${num}`] || `Stat ${num}`}
              </h3>
              <div className="text-3xl font-bold text-blue-600">
                {stats[`jumlah${num}`]}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
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
    </div>
  );
};

export default JumlahSiswa;
