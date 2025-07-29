import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
  MapPin,
  Clock,
  Users,
  Plus,
  Edit,
  Menu,
  Trash2,
  X,
  Save,
} from "lucide-react";
import Header from "../componentsAdmin/components/Header";
import Footer from "../componentsAdmin/components/Footer";
import ActivityList from "../componentsAdmin/components/Activity";

const AkademikAdmin = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [academicEvents, setAcademicEvents] = useState([]);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteEventId, setDeleteEventId] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Navigation handlers

  // Form states
  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    time: "",
    category: "Akademik",
    description: "",
  });

  // Categories and statuses
  const categories = [
    "Upacara",
    "Akademik",
    "Ekstrakurikuler",
    "Rapat",
    "Kompetisi",
    "Olahraga",
    "Sosial",
  ];

  useEffect(() => {
  if (!token) {
    navigate("/admin");
    return;
  }

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/calendar`);
      if (!response.ok) throw new Error("Failed to fetch events");
      const data = await response.json();
      setAcademicEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

    fetchEvents();
  }, [token, navigate]);

  if (!token) {
    return null;
}

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const getEventsForDate = (day) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return academicEvents.filter((event) => {
      const eventDate = new Date(event.date).toISOString().split("T")[0];
      return eventDate === dateStr;
    });
  };

  const handleDayClick = (day) => {
    if (!day) return;
    
    const events = getEventsForDate(day);
    if (events.length > 0) {
      setSelectedEventDetails(events);
      setShowEventDetails(true);
    }
  };

   const filteredEvents = academicEvents.filter((event) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      event.title.toLowerCase().includes(searchLower) ||
      (event.category && event.category.toLowerCase().includes(searchLower)) ||
      (event.description && event.description.toLowerCase().includes(searchLower)) ||
      (event.date && new Date(event.date).toLocaleDateString('id-ID').toLowerCase().includes(searchLower)) ||
      (event.time && event.time.toLowerCase().includes(searchLower))
    );
  });

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Event handlers
  const handleAddEvent = () => {
    setEditingEvent(null);
    setEventForm({
      title: "",
      date: "",
      time: "",
      category: "Akademik",
      description: "",
    });
    setShowEventModal(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      date: new Date(event.date).toISOString().split("T")[0],
      time: event.time || "",
      category: event.category || "Akademik",
      description: event.description || "",
    });
    setShowEventModal(true);
  };

  const handleDeleteEvent = (eventId) => {
  setDeleteEventId(eventId);
  setShowDeleteConfirm(true);
  setDeleteError(null);
  };

  const confirmDelete = async () => {
    if (!deleteEventId) return;
    setDeleteLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/calendar/${deleteEventId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to delete event");

        setAcademicEvents(
          academicEvents.filter((event) => event._id !== deleteEventId)
        );
        setShowDeleteConfirm(false);
      } catch (error) {
        console.error("Error deleting event:", error);
        setDeleteEventId(null);
        setDeleteError("Gagal menghapus kegiatan");
      } finally {
        setDeleteLoading(false);
      }
  };

  const handleSaveEvent = async () => {
    if (!eventForm.title || !eventForm.date) {
      alert("Mohon lengkapi semua field yang wajib diisi"); // ganti pop up disini
      return;
    }

    try {
      const eventData = {
        title: eventForm.title,
        date: eventForm.date,
        description: eventForm.description,
        time: eventForm.time,
        category: eventForm.category,
      };

      let response;

      if (editingEvent) {
        response = await fetch(
          `${API_BASE_URL}/api/calendar/${editingEvent._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(eventData),
          }
        );
      } else {
        response = await fetch(`${API_BASE_URL}/api/calendar`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(eventData),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          alert(data.errors.map((err) => err.msg).join("\n"));
        } else {
          alert(data.error || "Gagal menyimpan kegiatan");
        }
        return;
      }

      if (editingEvent) {
        setAcademicEvents(
          academicEvents.map((event) =>
            event._id === editingEvent._id ? data : event
          )
        );
      } else {
        setAcademicEvents([...academicEvents, data]);
      }

      setShowEventModal(false);
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Terjadi kesalahan saat menyimpan");
    }
  };

  // Activity handlers (these would need their own backend endpoints)

  // Helper functions
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const getCategoryColor = (category) => {
    const colors = {
      Upacara: "bg-blue-100 text-blue-800",
      Akademik: "bg-green-100 text-green-800",
      Ekstrakurikuler: "bg-purple-100 text-purple-800",
      Rapat: "bg-orange-100 text-orange-800",
      Kompetisi: "bg-red-100 text-red-800",
      Olahraga: "bg-yellow-100 text-yellow-800",
      Sosial: "bg-pink-100 text-pink-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <Header />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Kalender Kegiatan Sekolah - Admin
          </h1>
          <p className="text-gray-600 text-lg">
            Kelola jadwal kegiatan dan acara sekolah
          </p>
        </div>

        {/* Admin Controls */}
        <div className="flex justify-center space-x-4 mb-8">
          {localStorage.getItem("token") && (
            <button
              onClick={handleAddEvent}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Tambah Kegiatan
            </button>
          )}
        </div>

        {/* Search Box */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari kegiatan atau acara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-blue-900">
                  {monthNames[currentDate.getMonth()]}{" "}
                  {currentDate.getFullYear()}
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="p-3 text-center font-semibold text-gray-600 bg-gray-50"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentDate).map((day, index) => {
                  const events = getEventsForDate(day);
                  const hasEvents = events.length > 0;

                  return (
                    <div
                      key={index}
                      className={`min-h-[80px] p-2 border border-gray-200 ${
                      day ? "hover:bg-gray-50 cursor-pointer" : ""
                      } ${hasEvents ? "bg-blue-50" : ""}`}
                      onClick={() => handleDayClick(day)}
                    >
                      {day && (
                        <>
                          <div className="font-semibold text-sm mb-1">
                            {day}
                          </div>
                          {events.slice(0, 2).map((event) => (
                            <div
                              key={event._id}
                              className={`text-xs px-2 py-1 rounded mb-1 ${getCategoryColor(
                                event.category
                              )}`}
                            >
                              {event.title.substring(0, 10)}...
                            </div>
                          ))}
                          {events.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{events.length - 2} lagi
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Events List */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-blue-900 mb-6">
                Daftar Kegiatan Akademik
              </h3>
              {filteredEvents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Tidak ada kegiatan yang ditemukan
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEvents.map((event) => (
                    <div
                      key={event._id}
                      className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h4 className="text-lg font-semibold text-gray-900 mr-3">
                              {event.title}
                            </h4>
                            {event.category && (
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                                  event.category
                                )}`}
                              >
                                {event.category}
                              </span>
                            )}
                          </div>
                          {event.description && (
                            <p className="text-gray-600 mb-3">
                              {event.description}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(event.date).toLocaleDateString(
                                "id-ID",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </div>
                            {event.time && (
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {event.time}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleEditEvent(event)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Upcoming Activities */}
          <ActivityList />
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {editingEvent ? "Edit Kegiatan" : "Tambah Kegiatan"}
              </h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Judul Kegiatan *
                </label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan judul kegiatan"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal *
                </label>
                <input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Waktu
                </label>
                <input
                  type="time"
                  value={eventForm.time}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, time: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 08:00 - 10:00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  value={eventForm.category}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Masukkan deskripsi kegiatan"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEventModal(false);
                  if (editingEvent) {
                    setSelectedEventDetails([editingEvent]);
                    setShowEventDetails(true);
                  }
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Kembali
              </button>
              <button
                onClick={handleSaveEvent}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Popup */}
     {showEventDetails && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="relative bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg">
          
          {/* Tombol X (close) */}
          <button
            onClick={() => setShowEventDetails(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900">Detail Kegiatan</h3>
          </div>

          <div className="space-y-4">
            {selectedEventDetails.map((event, index) => (
              <div
                key={index}
                className="mb-6 pb-6 border-b border-gray-200 last:border-0 last:pb-0 last:mb-0"
              >
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h4>

                <div className="grid grid-cols-2 gap-4 mb-3 mt-4">
                  <div>
                    <p className="text-sm text-gray-500">Tanggal</p>
                    <p className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                      {new Date(event.date).toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  {event.time && (
                    <div>
                      <p className="text-sm text-gray-500">Waktu</p>
                      <p className="mt-1 block w-full border border-gray-300 rounded-md p-2">{event.time}</p>
                    </div>
                  )}
                </div>

                {event.category && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Kategori</p>
                    <span
                      className={`mt-1 block w-full border border-gray-300 rounded-md p-2 
                      )}`}
                    >
                      {event.category}
                    </span>
                  </div>
                )}

                {event.description && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Deskripsi</p>
                    <p className="mt-1 block w-full border border-gray-300 rounded-md p-2">{event.description}</p>
                  </div>
                )}

                <div className="flex justify-end mt-5 space-x-3">
                  <button
                    onClick={() => {
                      setShowEventDetails(false);
                      handleEditEvent(event);
                    }}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                  >
                    <Edit className="w-4 h-8 mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setShowEventDetails(false);
                      handleDeleteEvent(event._id);
                    }}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}

    {showDeleteConfirm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Konfirmasi Hapus</h3>
        <button
          onClick={() => {
            setShowDeleteConfirm(false);
            setDeleteEventId(null);
          }}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="mb-6">
        <p className="text-gray-700">
          Apakah Anda yakin ingin menghapus kegiatan ini? Tindakan ini tidak dapat dibatalkan.
        </p>
        {deleteError && (
          <p className="mt-2 text-red-600 text-sm">{deleteError}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={() => {
            setShowDeleteConfirm(false);
            setDeleteEventId(null);
          }}
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
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

export default AkademikAdmin;
