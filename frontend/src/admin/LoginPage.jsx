import { useState, useEffect } from "react";
import { User, Lock, Eye, EyeOff, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [isRecaptchaFilled, setIsRecaptchaFilled] = useState(false);
  const [errorNotification, setErrorNotification] = useState({
    show: false,
    message: ''
  });

   const sanitizeInput = (value) => {
    return value
      .replace(/<[^>]*>?/gm, "") 
      .replace(/[<>{}[\]()*&^%$#!]/g, ""); 
  };

  const handleEmailChange = (e) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setEmail(sanitizedValue);
  }

  const handlePasswordChange = (e) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setPassword(sanitizedValue);
  }
  const handleRecaptchaChange = (value) => {
    setIsRecaptchaFilled(!!value); // captcha
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorNotification({ show: false, message: '' });

    try {
      // Step 1: Login
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error("Gagal masuk: " + errorData.message);
      }

      const data = await res.json();

      // Store token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/homeadmin");
    } catch (error) {
      setErrorNotification({
      show: true,
      message: error.message
    });
    }
  };

  useEffect(() => {
    if (errorNotification.show) {
      const timer = setTimeout(() => {
        setErrorNotification({ show: false, message: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorNotification.show]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Masuk ke Dashboard Admin Sekolah
          </p>
        </div>

        {errorNotification.show && (
        <div className="fixed top-4 right-4 z-50">
          <div className="px-6 py-4 rounded-lg shadow-lg flex items-center space-x-4 bg-red-500 text-white animate-fade-in-up">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span>{errorNotification.message}</span>
            <button
              onClick={() => setErrorNotification({ show: false, message: "" })}
              className="ml-4 text-white hover:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-2xl p-8 space-y-6">
          <div className="space-y-6">
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  autoComplete="off"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                  placeholder="Masukkan username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="off"
                  value={password}
                  required
                  onChange={handlePasswordChange}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                  placeholder="Masukkan password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <ReCAPTCHA
              sitekey="6LcHa5ErAAAAAHyY4DLCyK3fVNgpl_-rIY19PvzL"
              onChange={handleRecaptchaChange}
            />

            {/* Login Button */}
            <div
              onClick={isRecaptchaFilled ? handleSubmit : null}
              className={`w-full flex justify-center py-3 px-4 border rounded-lg shadow-sm text-lg font-semibold transition-all duration-200 cursor-pointer ${
                isRecaptchaFilled
                  ? "bg-blue-600 hover:bg-blue-700 border-white text-white"
                  : "bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed"
              }`}
            >
              Login
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2025 Sistem Manajemen Sekolah. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
