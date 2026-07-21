import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { PiEye, PiEyeSlash } from "react-icons/pi";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";

const getStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

const strengthConfig = {
  0: { label: "Enter a password", color: "bg-gray-200" },
  1: { label: "Weak", color: "bg-red-500" },
  2: { label: "Fair", color: "bg-yellow-400" },
  3: { label: "Good", color: "bg-emerald-500" },
  4: { label: "Strong", color: "bg-indigo-500" },
};

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "",
    password: "", confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const strength = getStrength(formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      await register(formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-ink-gradient">

        <Logo />

        <div>
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Join thousands of happy shoppers
          </h2>
          <p className="text-indigo-300 text-base leading-relaxed">
            Create your free account in under 2 minutes and start exploring the best deals today.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {[
            "Free account, forever",
            "Personalised recommendations",
            "Order tracking & history",
            "Exclusive member-only deals",
          ].map((f) => (
            <div key={f} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full flex-shrink-0 bg-brand-gradient" />
              <span className="text-purple-300 text-sm">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-2 bg-white overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden mb-4"><Logo /></div>

          <div className="mb-4">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-1">
              Create your account
            </h1>
            <p className="text-gray-500 text-sm">
              Already have one?{" "}
              <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                Sign in instead
              </Link>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "First name", name: "firstName", placeholder: "John" },
                { label: "Last name", name: "lastName", placeholder: "Doe" },
              ].map(({ label, name, placeholder }) => (
                <div key={name}>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                    {label}
                  </label>
                  <input
                    type="text" name={name} value={formData[name]}
                    onChange={handleChange} placeholder={placeholder} required
                    className="w-full h-10 px-4 border border-gray-300 rounded-xl text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              ))}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                Email address
              </label>
              <input
                type="email" name="email" value={formData.email}
                onChange={handleChange} placeholder="you@example.com" required
                className="w-full h-10 px-4 border border-gray-300 rounded-xl text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password" value={formData.password}
                  onChange={handleChange} placeholder="Min. 8 characters" required
                  className="w-full h-10 px-4 pr-11 border border-gray-300 rounded-xl text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <PiEyeSlash size={18} /> : <PiEye size={18} />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i}
                        className={`flex-1 h-1 rounded-full transition-all ${i <= strength ? strengthConfig[strength].color : "bg-gray-200"}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs mt-0.5"
                    style={{ color: strength >= 3 ? "#10b981" : strength === 2 ? "#f59e0b" : "#ef4444" }}>
                    {strengthConfig[strength].label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword" value={formData.confirmPassword}
                  onChange={handleChange} placeholder="Repeat your password" required
                  className={`w-full h-10 px-4 pr-11 border rounded-xl text-sm outline-none transition-all focus:ring-2
                    ${formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? "border-red-400 focus:ring-red-100"
                      : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-100"}`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirm ? <PiEyeSlash size={18} /> : <PiEye size={18} />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-500 mt-0.5">Passwords do not match</p>
              )}
            </div>

            {/* Submit */}
            <Button type="submit" variant="primary" className="w-full h-10 text-sm" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>

            <p className="text-xs text-gray-400 text-center leading-relaxed">
              By creating an account you agree to our{" "}
              <Link to="/terms" className="text-indigo-600 font-semibold">Terms of Service</Link>
              {" "}and{" "}
              <Link to="/privacy" className="text-indigo-600 font-semibold">Privacy Policy</Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;