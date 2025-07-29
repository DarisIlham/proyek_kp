import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import Header from "../components/Header";
import Footer from "../components/Footer";

const SiswaSekolah = () => {
  const [students, setStudents] = useState([]);
  const [expandedClasses, setExpandedClasses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const API_URL = `${API_BASE_URL}/api/siswas`;

  const sanitizeInput = (value) => {
    return value
      .replace(/<[^>]*>?/gm, "") 
      .replace(/[<>{}[\]()*&^%$#!]/g, ""); 
  };

  const handleSearchChange = (e) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setSearchTerm(sanitizedValue);
  };

  // Helper function for HTTP errors
  const handleApiError = async (response) => {
    if (!response.ok) {
      const errorData = await response.json();
      const errorMsg = errorData.error || 
                     (errorData.errors ? 
                      errorData.errors.map(e => e.msg).join(', ') : 
                      `HTTP error! status: ${response.status}`);
      throw new Error(errorMsg);
    }
    return response.json();
  };

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
        data.forEach(student => {
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
    const filtered = students.filter(student =>
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
    const [gradeA, classA] = a.split('-');
    const [gradeB, classB] = b.split('-');
    const romanToNum = {
      I: 1,
      II: 2,
      III: 3,
      IV: 4,
      V: 5,
      VI: 6
    };
    if (romanToNum[gradeA] !== romanToNum[gradeB]) {
      return romanToNum[gradeA] - romanToNum[gradeB];
    }
  });

  // Toggle expand/collapse for class
  const toggleClass = (kelas) => {
    setExpandedClasses(prev => ({
      ...prev,
      [kelas]: !prev[kelas]
    }));
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header/>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">Data Siswa</h1>
          <p className="text-gray-600">Data Siswa SDN Tembalang</p>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari siswa..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Students Grouped by Class */}
        <div className="space-y-6">
          {sortedClasses.map((kelas) => (
            <div key={kelas} className="bg-white rounded-lg shadow-md overflow-hidden">
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
  <table className="w-full">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">No</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Kelas</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">NISN</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {studentsByClass[kelas].map((student, index) => (
        <tr key={student._id} className="hover:bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-12 text-center">
            {index + 1}
          </td>
          <td className="px-6 py-4 text-sm font-medium text-gray-900">
            {student.nama}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-24 text-center">
            {student.kelas}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-32 text-center">
            {student.nisn}
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
              <p className="text-gray-500">Tidak ada data siswa yang ditemukan.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SiswaSekolah;