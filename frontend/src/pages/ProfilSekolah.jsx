import React, { useState, useEffect } from 'react';
import { X, Menu } from 'lucide-react';
import Header from "../components/Header";
import Footer from "../components/Footer";

const ProfilSekolah = () => {
  const [schoolData, setSchoolData] = useState({
    deskripsi: "",
    gambar: "",
    visi: "",
    misi: [],
    tujuan: [],
    strategi: "",
    map: ""
  });
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch school profile data
  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/profil`);
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        
        setSchoolData({
          deskripsi: data.deskripsi || "",
          gambar: data.gambar || "",
          visi: data.visi || "",
          misi: data.misi || [""],
          tujuan: data.tujuan || [""],
          strategi: data.strategi || "",
          map: data.map || ""
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfil();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Memuat data profil sekolah...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
     <Header/>

      <section className="py-18 bg-white">
      <div className="container mx-auto px-4 max-w-6xl bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Gambar Sekolah */}
          <div>
            <img
              src={schoolData.gambar}
              alt="Gambar Sekolah"
              className="rounded-lg shadow-md w-full h-auto object-cover"
            />
          </div>

          {/* Deskripsi Sekolah */}
          <div className="flex flex-col space-y-4 ">
            <h2 className="text-3xl font-bold text-blue-900">Profil</h2>
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
              {schoolData.deskripsi}
            </p>
          </div>
        </div>
      </div>
    </section>


      {/* Hero Section - Visi dan Misi */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-blue-900 mb-12">
            Visi dan Misi SDN TEMBALANG
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Visi Column */}
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">Visi</h2>
              <p className="text-gray-700 text-lg leading-relaxed text-center">
                {schoolData.visi}
              </p>
            </div>
            
            {/* Misi Column */}
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">Misi</h2>
              <ul className="text-gray-700 text-lg leading-relaxed space-y-4">
                {schoolData.misi.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-3">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tujuan Sekolah Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-blue-900 text-white py-4 px-6 rounded-t-lg">
              <h2 className="text-2xl font-bold text-center">
                Tujuan Sekolah
              </h2>
            </div>
            
            <div className="bg-white p-8 rounded-b-lg shadow-md border border-gray-200">
              <ol className="space-y-6 text-gray-700 text-lg leading-relaxed">
                {schoolData.tujuan.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Strategi Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-blue-900 text-white py-4 px-6 rounded-t-lg">
              <h2 className="text-2xl font-bold text-center">Strategi</h2>
            </div>
            
            <div className="bg-white p-8 rounded-b-lg shadow-md border border-gray-200">
              <p className="text-gray-700 text-lg leading-relaxed text-center italic">
                "{schoolData.strategi}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-5 text-gray-800">
            Lokasi Sekolah
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-200 rounded-lg overflow-hidden shadow-lg">
              <iframe
                src={schoolData.map}
                width="800%"
                height="600"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-96"
                title="Lokasi SDN TEMBALANG"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
     <Footer/>
    </div>
  );
};

export default ProfilSekolah;