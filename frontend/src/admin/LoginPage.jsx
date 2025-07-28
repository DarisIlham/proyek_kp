import { useState } from "react";
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

  const handleRecaptchaChange = (value) => {
    setIsRecaptchaFilled(!!value); // Akan true jika value ada (reCAPTCHA diisi), false jika tidak
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
        alert("Login failed: " + errorData.message);
        return;
      }

      const data = await res.json();

      // Store token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/homeadmin");
    } catch (error) {
      alert("Error connecting to server: " + error.message);
    }
  };

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
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
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
              sitekey="6LfRLZErAAAAACX5wyaa_95nnMhR-CKPYcIMBUOJ"
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
