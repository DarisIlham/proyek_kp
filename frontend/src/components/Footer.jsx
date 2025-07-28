import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Instagram, Facebook, Youtube } from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();
    const [footerData, setFooterData] = useState("");
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    useEffect(() => {
      const fetchFooterData = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/footer`);
          if (response.ok) {
            const data = await response.json();
            setFooterData({
              logo: data.logo || "",
              nama_sekolah: data.nama_sekolah || "",
              alamat: data.alamat || "",
              no_telepon: data.no_telepon || "",
              email: data.email || "",
              facebook: data.facebook || "",
              youtube: data.youtube || "",
              instagram: data.instagram || ""
            });
          }
        } catch (error) {
          console.error('Error fetching footer data:', error);
        }
      };
      
      fetchFooterData();
    }, []);
   
    const handleKontak = (e) => {
    e.preventDefault();
    navigate('/kontak');
    }
    const handleGuru = (e) => {
    e.preventDefault();
    navigate('/guru')
    }
 
  return (
    <footer className="bg-blue-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Contact Info */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-6">
              {footerData.logo && (
                <div className="w-10 h-10 rounded mr-3 overflow-hidden">
                  <img src={footerData.logo} alt="School Logo" className="w-full h-full object-contain" />
                </div>
              )}
              <span className="font-semibold text-lg">{footerData.nama_sekolah}</span>
            </div>
            <div className="space-y-2 text-blue-200">
              <p>{footerData.alamat}</p>
              <p>Jawa Tengah 43351, Indonesia</p>
              <p>{footerData.no_telepon}</p>
              <p>{footerData.email}</p>
            </div>
          </div>
          
          {/* Jelajah */}
          <div>
            <h3 className="text-xl font-bold mb-6">Jelajah</h3>
            <ul className="space-y-2 text-blue-200">
              <li><a href="/profil" className="cursor-pointer hover:text-white transition-colors duration-200">Profil Sekolah</a></li>
              <li><a href="/berita" className="cursor-pointer hover:text-white transition-colors duration-200">Berita</a></li>
            </ul>
          </div>
          
          {/* Halaman Umum */}
          <div>
            <h3 className="text-xl font-bold mb-6">Halaman Umum</h3>
            <ul className="space-y-2 text-blue-200">
              <li><a href="/guru" onClick={handleGuru} className="hover:text-white transition-colors duration-200">Data Guru</a></li>
              <li><a href="https://spmb.semarangkota.go.id/sd" className="hover:text-white transition-colors duration-200">SPMB SDN</a></li>
              <li><a href="https://spmb.semarangkota.go.id/assets/content_upload/panduan/Panduan%20Pendaftaran%20SD%202025.pdf" className="hover:text-white transition-colors duration-200">Panduan SPMB</a></li>
              <li><a href="https://maps.app.goo.gl/ZoFMEgttrNr5Ak6g6" className="hover:text-white transition-colors duration-200">Lokasi</a></li>
              <li><a href="/kontak" onClick={handleKontak} className="hover:text-white transition-colors duration-200">Kontak</a></li>
            </ul>
          </div>
          
          {/* Media Sosial */}
          <div>
            <h3 className="text-xl font-bold mb-6">Media Sosial</h3>
            <div className="space-y-3">
              {footerData.facebook && (
                <div className="flex items-center">
                  <div className="w-6 h-6  mr-3"><Facebook /></div>
                  <a href={footerData.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white transition-colors duration-200">
                    Facebook
                  </a>
                </div>
              )}
              {footerData.youtube && (
                <div className="flex items-center">
                  <div className="w-6 h-6 mr-3"><Youtube /></div>
                  <a href={footerData.youtube} target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white transition-colors duration-200">
                    YouTube
                  </a>
                </div>
              )}
              {footerData.instagram && (
                <div className="flex items-center">
                  <div className="w-6 h-6 mr-3"><Instagram /></div>
                  <a href={footerData.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white transition-colors duration-200">
                    Instagram
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200">
          <p>&copy; 2025 {footerData.nama_sekolah}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;