import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Header from "../components/Header";
import Footer from "../components/Footer";

const GuruSekolah = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const sanitizeInput = (value) => {
    return value
      .replace(/<[^>]*>?/gm, "") 
      .replace(/[<>{}[\]()*&^%$#!]/g, ""); 
  };

  // Fetch teachers from API
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/gurus`);
        if (!response.ok) throw new Error("Failed to fetch teachers");
        const data = await response.json();
        setTeachers(data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
        // Fallback to default data if API fails
        setTeachers("");
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  // Filter teachers based on search term
  const filteredTeachers = teachers.filter(teacher => {
    const nama = teacher.nama || teacher.name || "";
    const nip = teacher.nip || "";
    const pelajaran = teacher.pelajaran || teacher.subject || "";

    return (
      nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nip.toString().includes(searchTerm) ||
      pelajaran.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSearch = (e) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setSearchTerm(sanitizedValue);
    setCurrentPage(1);
  };

  // Pagination
  const teachersPerPage = 6;
  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);
  const startIndex = (currentPage - 1) * teachersPerPage;
  const currentTeachers = filteredTeachers.slice(startIndex, startIndex + teachersPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Memuat data guru...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
     <Header/>

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-blue-900 to-blue-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80)'
          }}
        ></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Data Guru</h1>
          <p className="text-lg md:text-xl">Data Guru - Guru SDN TEMBALANG</p>
        </div>
      </section>

      {/* Search Bar Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Cari guru berdasarkan nama, NIP, atau mata pelajaran..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors duration-200"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Teacher Data Grid Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentTeachers.map((teacher) => (
              <div key={teacher._id || teacher.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
                <div className="text-center mb-4">
                  {teacher.gambar ? (
                    <img
                      src={`data:image/jpeg;base64,${teacher.gambar}`}
                      alt={teacher.nama}
                      className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-blue-100"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full mx-auto bg-gray-200 flex items-center justify-center border-4 border-blue-100">
                      <span className="text-gray-500">Foto</span>
                    </div>
                  )}
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-bold text-lg text-gray-800 leading-tight">
                    {teacher.nama}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    NIP: {teacher.nip}
                  </p>
                  <p className="text-blue-600 font-medium">
                    {teacher.pelajaran}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredTeachers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Tidak ada guru yang ditemukan.</p>
            </div>
          )}
        </div>
      </section>

      {/* Pagination Section */}
      {totalPages > 1 && (
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-full bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                &lt;
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-full transition-colors duration-200 ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-full bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <Footer/>
    </div>
  );
}

export default GuruSekolah;