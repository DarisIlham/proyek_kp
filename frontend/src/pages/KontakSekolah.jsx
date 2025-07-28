import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Kontak = () => {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    no_telepon: "",
    isi: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = value
      .replace(/<[^>]*>?/gm, "") // Hapus tag HTML seperti <script>
      .replace(/[<>{}[\]()*&^%$#!]/g, "");
    setFormData({
      ...formData,
      [name]: sanitizedValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/kontak`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors
        if (data.errors) {
          const errorMessages = data.errors
            .map((error) => error.msg)
            .join("\n");
          throw new Error(errorMessages);
        }
        throw new Error(data.error || "Failed to submit feedback");
      }

      // Success case
      setSubmitMessage("Terima kasih atas feedback Anda!");
      setFormData({
        nama: "",
        email: "",
        no_telepon: "",
        isi: "",
      });
    } catch (error) {
      setSubmitMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <Header />

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-blue-900 to-blue-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80)",
          }}
        ></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Kontak Kami</h1>
          <p className="text-lg md:text-xl">
            Jika Memiliki Pertanyaan Bisa Langsung Isi Form Dibawah Ini!
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Hubungi Kami
            </h2>

            {submitMessage && (
              <div
                className={`mb-6 p-4 rounded-md ${
                  submitMessage.includes("Terima kasih")
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {submitMessage}
              </div>
            )}

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nama */}
                <div>
                  <label
                    htmlFor="nama"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nama
                  </label>
                  <input
                    autoComplete="off"
                    type="text"
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    placeholder="Mikana Ackerman"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white transition-colors duration-200"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    autoComplete="off"
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email@gmail.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white transition-colors duration-200"
                    required
                  />
                </div>
              </div>

              {/* No Telp */}
              <div>
                <label
                  htmlFor="no_telepon"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  No Telepon
                </label>
                <input
                  autoComplete="off"
                  type="tel" // Changed from number to tel
                  id="no_telepon"
                  name="no_telepon"
                  value={formData.no_telepon}
                  onChange={handleInputChange}
                  placeholder="08123456789"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white transition-colors duration-200"
                  required
                />
              </div>

              {/* Pesan */}
              <div>
                <label
                  htmlFor="isi"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Pesan
                </label>
                <textarea
                  id="isi"
                  name="isi"
                  value={formData.isi}
                  onChange={handleInputChange}
                  placeholder="Tulis pesan Anda di sini..."
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white transition-colors duration-200"
                  required
                  minLength="10"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Kontak;
