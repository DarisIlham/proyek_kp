import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Instagram, Facebook, Youtube } from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();
  const [footerData, setFooterData] = useState({
    logo: "",
    nama_sekolah: "SD Negeri Tembalang",
    alamat: "Jl. Jawaipno No 122, Tembalang, Semarang",
    no_telepon: "(024)6708666",
    email: "inpakan@smp1.sch.ac.id",
    facebook: "https://www.facebook.com/sdn.tembalang",
    youtube: "",
    instagram: "https://www.instagram.com/sdn_tembalang"
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/footer`);
        if (!response.ok) throw new Error('Failed to fetch footer data');
        const data = await response.json();
        setFooterData(prev => ({
          ...prev,
          ...data,
          logo: data.logo || "",

          facebook: data.facebook || "",
          instagram: data.instagram || "",
          youtube: data.youtube || ""
        }));
      } catch (error) {
        console.error('Error fetching footer data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFooterData();
  }, []);

   useEffect(() => {
    setTempData({...footerData});
  }, [footerData]);

  const handleEditClick = () => {
    setTempData(footerData);
    setIsEditing(true);
    setMessage("");
    setError("");
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/footer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(tempData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.[0]?.msg || 'Failed to update footer');
      }

      const data = await response.json();
      setFooterData(data);
      setMessage('Footer updated successfully!');
      setTimeout(() => setIsEditing(false), 1500);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  

  const renderEditForm = () => (
      <div className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-6 lg:px-10">
          <h2 className="text-3xl font-bold mb-8 text-center">Edit Informasi Footer</h2>
          <form onSubmit={handleSubmit} className="bg-white text-black p-6 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             <div className="md:col-span-2">
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Kolom input: School Name */}
                <div className="w-full">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    School Name
                  </label>
                  <input
                    type="text"
                    name="nama_sekolah"
                    value={tempData.nama_sekolah || ""}
                    onChange={handleChange}
                    placeholder="School Name"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                  {/* Input: Logo URL */}
                  <div className="w-full">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Logo URL
                  </label>
                  <input
                    type="text"
                    name="logo"
                    value={tempData.logo || ""}
                    onChange={handleChange}
                    placeholder="https://example.com/logo.png"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                 {/* Preview: Logo */}
                 {tempData.logo?.startsWith("http") && (
                    <div className="mt-2 flex justify-start">
                      <img
                        src={tempData.logo}
                        alt="Logo Preview"
                        className="h-12 w-12 object-contain border border-gray-300 rounded"
                        onError={(e) => (e.target.style.display = 'none')}
                      />
                    </div>
                  )}
                </div>
              </div>
              {/* Input Fields */}
              {[
                { label: "Address", name: "alamat", type: "text" },
                { label: "Phone Number", name: "no_telepon", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "Facebook URL", name: "facebook", type: "url" },
                { label: "Instagram URL", name: "instagram", type: "url" },
                { label: "YouTube URL", name: "youtube", type: "url" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={tempData[field.name] || ""}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {field.name === "logo" && tempData.logo && (
                    <div className="mt-2">
                      <img
                        src={tempData.logo}
                        alt="Logo Preview"
                        className="h-12 object-contain"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancelClick}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>

            {/* Message Feedback */}
            {message && <p className="text-green-600 mt-4">{message}</p>}
            {error && <p className="text-red-600 mt-4">{error}</p>}
          </form>
        </div>
      </div>
    );
  
  const handleKontak = (e) => {
    e.preventDefault();
    navigate('/kontak');
  };

  const handleGuru = (e) => {
    e.preventDefault();
    navigate('/guru');
  };

  if (loading) {
    return <div className="bg-blue-900 text-white py-12 text-center">Loading footer...</div>;
  }

  const renderFooterContent = () =>  (
    <footer className="bg-blue-900 text-white py-12 relative ">
      {localStorage.getItem("token") && (
      <button
          onClick={handleEditClick}
          className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        >
          Edit Footer
        </button>
      )}
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Contact Info */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-6">
              {footerData.logo && (
                <div className="w-10 h-10  rounded mr-3 overflow-hidden">
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
              <li><a href="/profiladmin" className="cursor-pointer hover:text-white transition-colors duration-200">Profil Sekolah</a></li>
              <li><a href="/beritaadmin" className="cursor-pointer hover:text-white transition-colors duration-200">Berita</a></li>
              <li><a href="/galeri" className="hover:text-white transition-colors duration-200">Galeri</a></li>
            </ul>
          </div>
          
          {/* Halaman Umum */}
          <div>
            <h3 className="text-xl font-bold mb-6">Halaman Umum</h3>
            <ul className="space-y-2 text-blue-200">
              <li><a href="/guruadmin" onClick={handleGuru} className="hover:text-white transition-colors duration-200">Data Guru</a></li>
              <li><a href="https://spmb.semarangkota.go.id/sd" className="hover:text-white transition-colors duration-200">SPMB SDN</a></li>
              <li><a href="https://spmb.semarangkota.go.id/assets/content_upload/panduan/Panduan%20Pendaftaran%20SD%202025.pdf" className="hover:text-white transition-colors duration-200">Panduan SPMB</a></li>
              <li><a href="https://maps.app.goo.gl/ZoFMEgttrNr5Ak6g6" className="hover:text-white transition-colors duration-200">Lokasi</a></li>
              <li><a href="/kontakadmin" onClick={handleKontak} className="hover:text-white transition-colors duration-200">Kontak</a></li>
            </ul>
          </div>
          
          {/* Media Sosial */}
          <div>
            <h3 className="text-xl font-bold mb-6">Media Sosial</h3>
            <div className="space-y-3">
              {footerData.facebook && (
                <div className="flex items-center">
                  <div className="w-6 h-6 mr-3"><Facebook/></div>
                  <a href={footerData.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white transition-colors duration-200">
                    Facebook
                  </a>
                </div>
              )}
              {footerData.youtube && (
                <div className="flex items-center">
                  <div className="w-6 h-6  mr-3"><Youtube/></div>
                  <a href={footerData.youtube} target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white transition-colors duration-200">
                    YouTube
                  </a>
                </div>
              )}
              {footerData.instagram && (
                <div className="flex items-center">
                  <div className="w-6 h-6 mr-3"> <Instagram/></div>
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
  return isEditing ? renderEditForm() : renderFooterContent();
};

export default Footer;