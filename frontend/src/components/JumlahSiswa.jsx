import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Jumlah = () => {
  const [stats, setStats] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/home`);
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();

        // Fetch data siswa
        const siswaResponse = await fetch(`${API_BASE_URL}/api/siswas`);
        if (!siswaResponse.ok) throw new Error('Failed to fetch siswa data');
        const siswaData = await siswaResponse.json();
        const jumlahSiswa = siswaData.length;

        // Fetch data guru
        const guruResponse = await fetch(`${API_BASE_URL}/api/gurus`);
        if (!guruResponse.ok) throw new Error('Failed to fetch guru data');
        const guruData = await guruResponse.json();
        const jumlahGuru = guruData.length;

        setStats({
          namajumlah1: 'Jumlah Siswa',
          jumlah1: jumlahSiswa,
          namajumlah2: 'Jumlah Guru',
          jumlah2: jumlahGuru,
          namajumlah3: data.namajumlah3 || '',
          jumlah3: data.jumlah3 || 0,
          nama: data.judul || ""
        });
      } catch (error) {
        console.error('Error:', error);
        // Optionally fallback to static data
      }
    };
    fetchStats();
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
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.section
      className="pb-12 pt-4 bg-white rounded-lg shadow"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex justify-between items-center mb-4 mt-16"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold">
            Statistik Warga Sekolah {stats.nama}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((num) => (
            <motion.div
              key={num}
              className="text-center p-8 bg-gray-50 rounded hover:shadow-lg transition-shadow"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {stats[`namajumlah${num}`] || `Stat ${num}`}
              </h3>
              <div className="text-3xl font-bold text-blue-600">
                {stats[`jumlah${num}`]}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Jumlah;
