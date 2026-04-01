import { useState } from "react";
import { Link , useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { PiEye, PiEyeSlash } from "react-icons/pi";
import { loginUser } from "../../service/authApi";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", remember: false });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // ✅ Correct structure
const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        const { data } = await loginUser(formData);
        
        // Save token and user to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Redirect based on role
        if(data.user.role === "admin") {
            navigate("/admin");
        } else {
            navigate("/");
        }
    } catch (error) {
        alert(error.response?.data?.message || "Login failed. Please try again.");
    }
};
  return (
<div className="h-screen flex overflow-hidden">

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{ background: "linear-gradient(145deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" }}>

        <Logo />

        <div>
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Welcome back to ShopZone
          </h2>
          <p className="text-indigo-300 text-base leading-relaxed">
            Your favourite products, just one login away. Discover deals made for you.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {["10,000+ premium products", "Fast & secure checkout", "Free returns on every order"].map((f) => (
            <div key={f} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }} />
              <span className="text-purple-300 text-sm">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
<div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Logo />
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
              Sign in to your account
            </h1>
            <p className="text-gray-500 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
                Create one free
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-sm text-indigo-600 font-semibold hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full h-11 px-4 pr-11 border border-gray-300 rounded-xl text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                <button type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <PiEyeSlash size={20} /> : <PiEye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm text-gray-500 cursor-pointer">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit */}
            <button type="submit"
              className="w-full h-12 rounded-xl text-white font-bold text-base transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
              Sign in
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;