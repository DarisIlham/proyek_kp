import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Home, Users, BookOpen, Image, Settings, LogOut, Menu, Bell, ChevronLeft } from "lucide-react";

const DetailBerita = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [berita, setBerita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [header, setHeader] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
    useEffect(() => {
          const fetchData = async () => {
            try {
              const response = await fetch(`${API_BASE_URL}/api/home`);
              if (response.ok) {
    
                const data = await response.json();
                setHeader({nama: data.judul || ""});
              }
      
            } catch (error) {
              console.error('Error:', error);
              // Fallback to default values if API fails
            } finally {
              setLoading(false);
            }
          };
          fetchData();
        }, []);

useEffect(() => {
    const fetchBerita = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/berita/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Gagal mengambil data berita");

        const data = await response.json();
        setBerita(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBerita();
  }, [id, navigate]); 

  if (loading) return <div className="text-center py-12">Memuat...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!berita) return <div className="text-center py-12">Berita tidak ditemukan</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <ChevronLeft size={20} className="mr-1" />
              Kembali
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <article className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          {berita.gambar_utama && (
            <div className="h-64 md:h-96 overflow-hidden">
              <img
                src={berita.gambar_utama.startsWith('http') 
                  ? berita.gambar_utama 
                  : `data:image/jpeg;base64,${berita.gambar_utama}`}
                alt={berita.judul}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              {berita.judul}
            </h1>
            <div className="text-sm text-gray-500 mb-6">
              Dipublikasikan pada: {new Date(berita.tanggal_publikasi).toLocaleDateString()}
            </div>
            <div className="text-gray-600 whitespace-pre-line">
              {berita.isi}
            </div>
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>&copy; 2025 {header.nama}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DetailBerita;