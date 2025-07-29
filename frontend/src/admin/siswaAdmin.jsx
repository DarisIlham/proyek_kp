import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Header from "../componentsAdmin/components/Header";
import Footer from "../componentsAdmin/components/Footer";
const SiswaAdmin = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [students, setStudents] = useState([]);
  const [expandedClasses, setExpandedClasses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentStudent, setCurrentStudent] = useState({
    nama: "",
    kelas: "",
    nisn: "",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const API_URL = `${API_BASE_URL}/api/siswas`;

  const kelasOptions = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
  ];

  // Helper function for HTTP errors
  const handleApiError = async (response) => {
    if (!response.ok) {
      const errorData = await response.json();
      const errorMsg =
        errorData.error ||
        (errorData.errors
          ? errorData.errors.map((e) => e.msg).join(", ")
          : `HTTP error! status: ${response.status}`);
      throw new Error(errorMsg);
    }
    return response.json();
  };

  useEffect(() => {
    if (!token) {
      navigate("/admin");
    }
  }, [token, navigate]);

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        const data = await handleApiError(response);
        setStudents(data);
        setFilteredStudents(data);

        // Initialize all classes as expanded
        const initialExpanded = {};
        data.forEach((student) => {
          if (!initialExpanded[student.kelas]) {
            initialExpanded[student.kelas] = true;
          }
        });
        setExpandedClasses(initialExpanded);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Filter students based on search term
  useEffect(() => {
    const filtered = students.filter(
      (student) =>
        student.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.nisn.toString().includes(searchTerm)
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  // Group students by class
  const groupStudentsByClass = (students) => {
    return students.reduce((groups, student) => {
      const kelas = student.kelas;
      if (!groups[kelas]) {
        groups[kelas] = [];
      }
      groups[kelas].push(student);
      return groups;
    }, {});
  };

  const studentsByClass = groupStudentsByClass(filteredStudents);
  const sortedClasses = Object.keys(studentsByClass).sort((a, b) => {
    const partsA = a.split("-");
    const partsB = b.split("-");
    const gradeA = partsA[0]?.trim() || "";
    const classA = partsA[1]?.trim() || "";
    const gradeB = partsB[0]?.trim() || "";
    const classB = partsB[1]?.trim() || "";
    const romanToNum = {
      I: 1,
      II: 2,
      III: 3,
      IV: 4,
      V: 5,
      VI: 6,
    };
    const gradeComparison =
      (romanToNum[gradeA] || 0) - (romanToNum[gradeB] || 0);
    if (gradeComparison !== 0) {
      return gradeComparison;
    }
    return (classA || "").localeCompare(classB || "");
  });

  // Toggle expand/collapse for class
  const toggleClass = (kelas) => {
    setExpandedClasses((prev) => ({
      ...prev,
      [kelas]: !prev[kelas],
    }));
  };

  // CRUD Operations
  const handleAddStudent = () => {
    setModalMode("add");
    setCurrentStudent({
      nama: "",
      kelas: "",
      nisn: "",
    });
    setShowModal(true);
  };

  const handleEditStudent = (student) => {
    setModalMode("edit");
    setCurrentStudent({
      _id: student._id,
      nama: student.nama,
      kelas: student.kelas,
      nisn: student.nisn,
    });
    setShowModal(true);
  };

  const handleSaveStudent = async () => {
    if (!currentStudent.nama || !currentStudent.kelas || !currentStudent.nisn) {
      alert("Semua field harus diisi!");
      return;
    }

    try {
      let response;
      const headers = {
        "Content-Type": "application/json",
      };

      if (modalMode === "add") {
        response = await fetch(API_URL, {
          method: "POST",
          headers,
          body: JSON.stringify(currentStudent),
        });
        const newStudent = await handleApiError(response);
        setStudents([...students, newStudent]);
      } else {
        response = await fetch(`${API_URL}/${currentStudent._id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(currentStudent),
        });
        const updatedStudent = await handleApiError(response);
        setStudents(
          students.map((student) =>
            student._id === currentStudent._id ? updatedStudent : student
          )
        );
      }
      setShowModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteStudent = (student) => {
    setStudentToDelete(student);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteStudent = async () => {
    try {
      await fetch(`${API_URL}/${studentToDelete._id}`, {
        method: "DELETE",
      });
      setStudents(
        students.filter((student) => student._id !== studentToDelete._id)
      );
      setShowDeleteConfirm(false);
      setStudentToDelete(null);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data siswa...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Add Button */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari siswa..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleAddStudent}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambah Siswa
          </button>
        </div>

        {/* Students Grouped by Class */}
        <div className="space-y-6">
          {sortedClasses.map((kelas) => (
            <div
              key={kelas}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div
                className="bg-blue-50 px-6 py-3 border-b border-blue-100 flex justify-between items-center cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={() => toggleClass(kelas)}
              >
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold text-blue-800 mr-3">
                    Kelas {kelas}
                  </h3>
                  <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    {studentsByClass[kelas].length} siswa
                  </span>
                </div>
                {expandedClasses[kelas] ? (
                  <ChevronUp className="w-5 h-5 text-blue-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-blue-600" />
                )}
              </div>

              {expandedClasses[kelas] && (
                <div className="overflow-x-auto">
                  <table className="w-full table-fixed">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                          No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nama
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                          NISN
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {studentsByClass[kelas].map((student, index) => (
                        <tr key={student._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-12">
                            {index + 1}
                          </td>
                          <td
                            className="px-6 py-4 text-sm font-medium text-gray-900 truncate"
                            title={student.nama}
                          >
                            {student.nama}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-1/4">
                            {student.nisn}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium w-1/4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditStudent(student)}
                                className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors duration-200 flex items-center gap-1"
                              >
                                <Edit className="w-3 h-3" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(student)}
                                className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors duration-200 flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}

          {/* Empty State */}
          {filteredStudents.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">
                Tidak ada data siswa yang ditemukan.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {modalMode === "add" ? "Tambah Siswa" : "Edit Siswa"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama
                </label>
                <input
                  type="text"
                  value={currentStudent.nama}
                  onChange={(e) =>
                    setCurrentStudent({
                      ...currentStudent,
                      nama: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nama siswa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kelas
                </label>
                <select
                  value={currentStudent.kelas}
                  onChange={(e) =>
                    setCurrentStudent({
                      ...currentStudent,
                      kelas: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih kelas</option>
                  {kelasOptions.map((kelas) => (
                    <option key={kelas} value={kelas}>
                      {kelas}
                    </option>
                  ))}
                  <option value="lainnya">Lainnya...</option>
                </select>

                {currentStudent.kelas === "lainnya" && (
                  <input
                    type="text"
                    placeholder="Masukkan kelas lainnya (contoh: I-A)"
                    value={currentStudent.kelasLainnya || ""}
                    onChange={(e) => {
                      const formatted = e.target.value
                        .replace(/\s+/g, "")
                        .toUpperCase();
                      setCurrentStudent({
                        ...currentStudent,
                        kelasLainnya: formatted,
                      });
                    }}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NISN
                </label>
                <input
                  type="text"
                  value={currentStudent.nisn}
                  onChange={(e) =>
                    setCurrentStudent({
                      ...currentStudent,
                      nisn: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan NISN"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleSaveStudent}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h2>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus siswa{" "}
              <strong>{studentToDelete?.nama}</strong>? Tindakan ini tidak dapat
              dibatalkan.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={confirmDeleteStudent}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Hapus
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

export default SiswaAdmin;
