import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
  Clock,
  Save,
  X,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ActivityList from "../components/Activity";

const AkademikAdmin = ({ token }) => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent] = useState(null);
  const [academicEvents, setAcademicEvents] = useState([]);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    time: "",
    category: "Akademik",
    description: "",
  });

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
  }, []);

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

  const filteredEvents = academicEvents.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.category &&
        event.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (event.date && new Date(event.date).toLocaleDateString('id-ID').toLowerCase().includes(searchTerm.toLowerCase())) ||
      (event.time && event.time.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleSaveEvent = async () => {
    if (!eventForm.title || !eventForm.date) {
      alert("Mohon lengkapi semua field yang wajib diisi");
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

      const headers = {
        "Content-Type": "application/json",
      };

      if (token) headers.Authorization = `Bearer ${token}`;

      if (editingEvent) {
        response = await fetch(
          `${API_BASE_URL}/api/calendar/${editingEvent._id}`,
          {
            method: "PUT",
            headers,
            body: JSON.stringify(eventData),
          }
        );
      } else {
        response = await fetch(`${API_BASE_URL}/api/calendar`, {
          method: "POST",
          headers,
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
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Kalender Kegiatan Sekolah
          </h1>
          <p className="text-gray-600 text-lg">
            Kelola jadwal kegiatan dan acara sekolah
          </p>
        </div>

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
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
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
                          <div className="font-semibold text-sm mb-1">{day}</div>
                          {events.slice(0, 2).map((event) => (
                            <div
                              key={event._id}
                              className={`text-xs px-2 py-1 rounded mb-1 ${getCategoryColor(
                                event.category
                              )}`}
                            >
                              {event.title.substring(0, 15)}...
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
                      className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedEventDetails([event]);
                        setShowEventDetails(true);
                      }}
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
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <ActivityList />
        </div>
      </div>

      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
              <input
                type="text"
                value={eventForm.title}
                onChange={(e) =>
                  setEventForm({ ...eventForm, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Judul kegiatan *"
                required
              />
              <input
                type="date"
                value={eventForm.date}
                onChange={(e) =>
                  setEventForm({ ...eventForm, date: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="time"
                value={eventForm.time}
                onChange={(e) =>
                  setEventForm({ ...eventForm, time: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <select
                value={eventForm.category}
                onChange={(e) =>
                  setEventForm({ ...eventForm, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <textarea
                value={eventForm.description}
                onChange={(e) =>
                  setEventForm({ ...eventForm, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows="3"
                placeholder="Deskripsi kegiatan"
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEventModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEvent}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
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
            
            {/* Close button */}
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
                        className={`mt-1 block w-full border border-gray-300 rounded-md p-2 ${getCategoryColor(event.category)}`}
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
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AkademikAdmin;