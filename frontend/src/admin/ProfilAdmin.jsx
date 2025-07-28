import React, { useState, useEffect } from "react";
import { Edit, Save, X, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../componentsAdmin/components/Header";
import Footer from "../componentsAdmin/components/Footer";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/api/profil`;

const fetchProfil = async () => {
  const response = await fetch(`${API_URL}`);
  return await response.json();
};

const updateProfil = async (data) => {
  const response = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });
  return await response.json();
};

const ProfilAdmin = () => {
  // State for editing mode
  const [editMode, setEditMode] = useState({
    deskripsi: false,
    gambar: false,
    visi: false,
    misi: false,
    tujuan: false,
    strategi: false,
    map: false
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/admin");
    }
  }, [token, navigate]);

  useEffect(() => {
    const loadProfil = async () => {
      try {
        const data = await fetchProfil();
        if (data) {
          setSchoolData({
            deskripsi: data.deskripsi || "",
            gambar: data.gambar || "",
            visi: data.visi || "",
            misi: Array.isArray(data.misi) ? data.misi : [],
            tujuan: Array.isArray(data.tujuan) ? data.tujuan : [],
            strategi: data.strategi || "",
            map: data.map || ""
          });
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };
    loadProfil();
  }, []);

  const [schoolData, setSchoolData] = useState({
    deskripsi: "",
    gambar: "",
    visi: "",
    misi: [],
    tujuan: [],
    strategi: "",
    map: ""
  });

  const [tempData, setTempData] = useState({});
  
  // CRUD Operations
  const handleEdit = (section) => {
    setEditMode({ ...editMode, [section]: true });
    setTempData({ ...tempData, [section]: schoolData[section] });
  };

  const handleSave = async (section) => {
    try {
      // Prepare data for API
      const dataToSend = {
        ...schoolData,
        [section]: tempData[section] || schoolData[section],
      };

      // Send to backend
      console.log("Data dikirim:", dataToSend);
      await updateProfil(dataToSend);

      // Update local state
      setSchoolData({
        ...schoolData,
        [section]: tempData[section] || schoolData[section],
      });

      setEditMode({ ...editMode, [section]: false });
      setTempData({ ...tempData, [section]: undefined });
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save changes");
    }
  };

  const handleCancel = (section) => {
    setEditMode({ ...editMode, [section]: false });
    setTempData({ ...tempData, [section]: undefined });
  };

  const handleAddItem = (section) => {
    const newItem = "";
    setTempData({
      ...tempData,
      [section]: [...(tempData[section] || schoolData[section]), newItem],
    });
  };

  const handleDeleteItem = (section, index) => {
    const updatedItems = (tempData[section] || schoolData[section]).filter(
      (_, i) => i !== index
    );
    if (editMode[section]) {
      setTempData({ ...tempData, [section]: updatedItems });
    } else {
      setSchoolData({ ...schoolData, [section]: updatedItems });
    }
  };

  const handleItemChange = (section, index, value) => {
    const updatedItems = [...(tempData[section] || schoolData[section])];
    updatedItems[index] = value;
    setTempData({ ...tempData, [section]: updatedItems });
  };

  if (!token) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <Header/>

      {/* Admin Panel Header */}
      <div className="bg-blue-900 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">
            Manajemen Profil Sekolah
          </h1>
        </div>
      </div>

      {/* Profil Section */}
      <section className="py-12 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className=" mx-auto grid md:grid-cols-2 gap-8 bg-white p-8 rounded-lg shadow-md border border-gray-200">
            {/* Gambar Sekolah */}
            <div className="flex flex-col justify-start space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-blue-900">
                  Gambar Sekolah
                </h2>
                {!editMode.gambar ? (
                  <button
                    onClick={() => handleEdit("gambar")}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave("gambar")}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      <Save size={16} />
                      Save
                    </button>
                    <button
                      onClick={() => handleCancel("gambar")}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {editMode.gambar ? (
                <>
                  <input
                    type="text"
                    value={tempData.gambar || ""}
                    onChange={(e) =>
                      setTempData({ ...tempData, gambar: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan URL gambar sekolah"
                  />
                  {tempData.gambar && (
                    <img
                      src={tempData.gambar}
                      alt="Preview Gambar"
                      className="rounded-lg shadow-md object-cover w-full max-h-[300px]"
                    />
                  )}
                </>
              ) : (
                <img
                  src={schoolData.gambar || "/placeholder.jpg"}
                  alt="Foto Sekolah"
                  className="rounded-lg shadow-md object-cover w-full max-h-[300px]"
                />
              )}
            </div>

            {/* Profil Deskripsi */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-blue-900">Profil</h2>
                {!editMode.deskripsi ? (
                  <button
                    onClick={() => handleEdit("deskripsi")}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave("deskripsi")}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      <Save size={16} />
                      Save
                    </button>
                    <button
                      onClick={() => handleCancel("deskripsi")}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {editMode.deskripsi ? (
                <textarea
                  value={tempData.deskripsi || ""}
                  onChange={(e) =>
                    setTempData({ ...tempData, deskripsi: e.target.value })
                  }
                  className="w-full h-40 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan profil sekolah..."
                />
              ) : (
                <p className="text-gray-700 text-lg leading-relaxed">
                  {schoolData.deskripsi}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Visi dan Misi Section */}
      <section className="py-12 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 mx-auto">
            {/* Visi Column */}
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-blue-900">Visi</h2>
                {!editMode.visi ? (
                  <button
                    onClick={() => handleEdit("visi")}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave("visi")}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      <Save size={16} />
                      Save
                    </button>
                    <button
                      onClick={() => handleCancel("visi")}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {editMode.visi ? (
                <textarea
                  value={tempData.visi || ""}
                  onChange={(e) =>
                    setTempData({ ...tempData, visi: e.target.value })
                  }
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan visi sekolah..."
                />
              ) : (
                <p className="text-gray-700 text-lg leading-relaxed">
                  {schoolData.visi}
                </p>
              )}
            </div>

            {/* Misi Column */}
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-blue-900">Misi</h2>
                {!editMode.misi ? (
                  <button
                    onClick={() => handleEdit("misi")}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave("misi")}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      <Save size={16} />
                      Save
                    </button>
                    <button
                      onClick={() => handleCancel("misi")}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {editMode.misi ? (
                <div className="space-y-3">
                  {(tempData.misi || schoolData.misi).map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) =>
                          handleItemChange("misi", index, e.target.value)
                        }
                        className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Misi ${index + 1}`}
                      />
                      <button
                        onClick={() => handleDeleteItem("misi", index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddItem("misi")}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} />
                    Tambah Misi
                  </button>
                </div>
              ) : (
                <ul className="text-gray-700 text-lg leading-relaxed space-y-4">
                  {schoolData.misi.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-3">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tujuan Sekolah Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-blue-900 text-white py-4 px-6 rounded-t-lg flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                Tujuan Sekolah 
              </h2>
              {!editMode.tujuan ? (
                <button
                  onClick={() => handleEdit("tujuan")}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors"
                >
                  <Edit size={16} />
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave("tujuan")}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    <Save size={16} />
                    Save
                  </button>
                  <button
                    onClick={() => handleCancel("tujuan")}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white p-8 rounded-b-lg shadow-md border border-gray-200">
              {editMode.tujuan ? (
                <div className="space-y-4">
                  {(tempData.tujuan || schoolData.tujuan).map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mt-1 flex-shrink-0">
                        {index + 1}
                      </span>
                      <div className="flex-1 flex items-center gap-2">
                        <textarea
                          value={item}
                          onChange={(e) =>
                            handleItemChange("tujuan", index, e.target.value)
                          }
                          className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          rows="2"
                          placeholder={`Tujuan ${index + 1}`}
                        />
                        <button
                          onClick={() => handleDeleteItem("tujuan", index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddItem("tujuan")}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} />
                    Tambah Tujuan
                  </button>
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Strategi Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-blue-900 text-white py-4 px-6 rounded-t-lg flex items-center justify-between">
              <h2 className="text-2xl font-bold">Strategi</h2>
              {!editMode.strategi ? (
                <button
                  onClick={() => handleEdit("strategi")}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors"
                >
                  <Edit size={16} />
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave("strategi")}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    <Save size={16} />
                    Save
                  </button>
                  <button
                    onClick={() => handleCancel("strategi")}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white p-8 rounded-b-lg shadow-md border border-gray-200">
              {editMode.strategi ? (
                <textarea
                  value={tempData.strategi || ""}
                  onChange={(e) =>
                    setTempData({ ...tempData, strategi: e.target.value })
                  }
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan strategi sekolah..."
                />
              ) : (
                <p className="text-gray-700 text-lg leading-relaxed text-center italic">
                  "{schoolData.strategi}"
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

        {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
              Lokasi Sekolah
            </h2>
            {!editMode.map ? (
              <button
                onClick={() => handleEdit("map")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                <Edit size={16} />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave("map")}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  <Save size={16} />
                  Save
                </button>
                <button
                  onClick={() => handleCancel("map")}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            )}
          </div>
          
          <div className="max-w-4xl mx-auto">
            {editMode.map ? (
              <div className="mb-4">
                <input
                  type="text"
                  value={tempData.map || schoolData.map || ""}
                  onChange={(e) => setTempData({ ...tempData, map: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan URL embed Google Maps"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Contoh: https://maps.google.com/maps?width=600&height=400&hl=en&q=SD%20Negeri%20Tembalang...
                </p>
              </div>
            ) : null}
            
            <div className="bg-gray-200 rounded-lg overflow-hidden shadow-lg">
              <iframe
                src={editMode.map ? (tempData.map || schoolData.map) : (schoolData.map || "https://maps.google.com/maps?width=600&height=400&hl=en&q=SD%20Negeri%20Tembalang&t=&z=14&ie=UTF8&iwloc=B&output=embed")}
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
      <Footer />
    </div>
  );
};

export default ProfilAdmin;
