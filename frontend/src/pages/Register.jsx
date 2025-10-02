// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/axios";
import RegisterBg from "../assets/register1.jpg";
import { FaGoogle, FaFacebookF, FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center p-4 md:p-8"
      style={{ backgroundImage: `url(${RegisterBg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>

      <div className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row items-center justify-between md:space-x-20 min-h-[80vh]">
        
        {/* LEFT SIDE: Register Form */}
        <div className="w-full max-w-md md:w-1/2 flex justify-start md:justify-start ml-[-60px] ">
          <div className="bg-white/10 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-full transition-all duration-500 border border-white/30 animate-fadeInUp">
            <h1 className="text-4xl font-extrabold text-white mb-6 text-center drop-shadow-md">
              Create Account
            </h1>

            {error && (
              <p className="text-red-600 bg-red-100/80 p-2 rounded-lg mb-4 text-sm font-medium text-center">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className="p-4 rounded-xl bg-white/70 border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-shadow text-lg placeholder-gray-600"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="p-4 rounded-xl bg-white/70 border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-shadow text-lg placeholder-gray-600"
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="p-4 rounded-xl bg-white/70 border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-shadow text-lg placeholder-gray-600 w-full"
                  required
                />
                <span
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600 hover:text-gray-800"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white py-4 mt-2 rounded-xl text-xl font-bold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                Sign Up
              </button>
            </form>

            {/* Social Buttons */}
            <div className="mt-6 flex flex-col gap-4">
              <button className="flex items-center justify-center gap-3 bg-red-500 text-white py-3 rounded-xl text-lg font-semibold hover:bg-red-600 transition-all duration-300">
                <FaGoogle /> Sign up with Google
              </button>
              <button className="flex items-center justify-center gap-3 bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-800 transition-all duration-300">
                <FaFacebookF /> Sign up with Facebook
              </button>
            </div>

            <p className="mt-6 text-center text-gray-100 text-base">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-blue-400 hover:text-blue-300 hover:underline transition-colors"
              >
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: Branding */}
        <div className="hidden md:flex md:w-1/2 flex-col items-end justify-start text-right p-8 pt-12 absolute top-0 right-0"> 
          <h1 className="text-7xl lg:text-8xl xl:text-9xl font-extrabold text-white drop-shadow-[0_15px_20px_rgba(0,0,0,0.8)] tracking-tight leading-none animate-fadeInUp">
            TRIPLYTICS
          </h1>
          <div className="h-1 w-32 bg-blue-500 rounded-full mt-4 mb-6"></div> 
          <p className="text-2xl lg:text-3xl font-light text-gray-200 drop-shadow-[0_6px_8px_rgba(0,0,0,0.6)] max-w-md animate-fadeInUp delay-200">
            Your journey starts here. <br />
            <span className="font-medium text-white">Analyze. Plan. Travel.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
