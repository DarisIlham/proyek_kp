import React, { useState, useEffect } from "react";
import { Trash2, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../componentsAdmin/components/Header";
import Footer from "../componentsAdmin/components/Footer";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/api/kontak`;

const fetchFeedback = async () => {
  const response = await fetch(`${API_URL}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return await response.json();
};

const deleteFeedback = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return await response.json();
};

const KontakAdmin = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/admin");
    }
  }, [token, navigate]);

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const data = await fetchFeedback();
        setFeedbacks(data.data || []);
        setFilteredFeedbacks(data.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load feedbacks:", error);
        setLoading(false);
      }
    };
    loadFeedbacks();
  }, []);

  useEffect(() => {
    const results = feedbacks.filter(
      (feedback) =>
        feedback.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.isi.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFeedbacks(results);
  }, [searchTerm, feedbacks]);

  const handleDeleteClick = (id) => {
    setFeedbackToDelete(id);
    setShowDeleteModal(true);
    setDeleteError(null);
  }

  const confirmDelete = async () => {
    if (!feedbackToDelete) return;

    setDeleteLoading(true);
      try {
        await deleteFeedback(feedbackToDelete);
        setFeedbacks(feedbacks.filter((feedback) => feedback._id !== feedbackToDelete));
        setShowDeleteModal(false);
      } catch (error) {
        console.error("Failed to delete feedback:", error);
        setDeleteError('Gagal menghapus feedback ini, silahkan coba lagi.');
      } finally {
        setDeleteLoading(false);
      }
  };

   if (!token) {
    return null; 
  }

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <Header />

      {/* Admin Panel Header */}
      <div className="bg-blue-900 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">
            Manajemen Feedback Pengguna
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="mb-8 max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari feedback berdasarkan nama, email, atau isi..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Feedback Table */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <p className="text-gray-600">Memuat data feedback...</p>
              </div>
            ) : filteredFeedbacks.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600">
                  {searchTerm ? "Tidak ditemukan feedback yang sesuai" : "Belum ada feedback"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto divide-y divide-gray-200">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                        Nama
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                        Kontak
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                        Isi Feedback
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-blue-900 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredFeedbacks.map((feedback) => (
                      <tr key={feedback._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-normal break-words max-w-xs">
                          <div className="font-medium text-gray-900">
                            {feedback.nama}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-normal break-words max-w-xs">
                          <div className="text-gray-600">{feedback.email}</div>
                          <div className="text-gray-500 text-sm mt-1">
                            {feedback.no_telepon}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-normal break-words max-w-xs">
                          <div className="text-gray-700 max-w-md">
                            {feedback.isi}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-normal break-words max-w-xs">
                          <div className="text-gray-500 text-sm">
                            {formatDate(feedback.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDeleteClick(feedback._id)}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded"
                            title="Hapus Feedback"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Stats */}
          {!loading && (
            <div className="mt-4 text-right text-sm text-gray-500">
              Menampilkan {filteredFeedbacks.length} dari {feedbacks.length} feedback
            </div>
          )}
        </div>
      </section>

      {showDeleteModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Konfirmasi Hapus</h3>
        <button
          onClick={() => setShowDeleteModal(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="mb-6">
        <p className="text-gray-700">
          Apakah Anda yakin ingin menghapus feedback ini? Tindakan ini tidak dapat dibatalkan.
        </p>
        {deleteError && (
          <p className="mt-2 text-red-600 text-sm">{deleteError}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          disabled={deleteLoading}
        >
          Batal
        </button>
        <button
          onClick={confirmDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
          disabled={deleteLoading}
        >
          {deleteLoading ? (
            <>
              <svg 
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Menghapus...
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus
            </>
          )}
        </button>
      </div>
    </div>
  </div>
)}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default KontakAdmin;