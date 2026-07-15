import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";
import { PiShoppingCart, PiList, PiX } from "react-icons/pi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // At the top of your Navbar component
const user = JSON.parse(localStorage.getItem("user") || "null");

   // Read cart count on mount
  useEffect(() => {
  const updateCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(total);
  };

  updateCount(); // run on mount

  window.addEventListener("cartUpdated", updateCount); // ← custom event
  window.addEventListener("storage", updateCount);     // ← cross-tab support
  
  return () => {
    window.removeEventListener("cartUpdated", updateCount);
    window.removeEventListener("storage", updateCount);
  };
}, []);
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">

      {/* Main bar */}
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <Logo />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/"
            className={({ isActive }) =>
              `text-sm font-medium px-4 py-2 rounded-lg transition-all
              ${isActive ? "text-indigo-600 bg-indigo-50" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`
            }>
            Home
          </NavLink>
          <NavLink to="/products"
            className={({ isActive }) =>
              `text-sm font-medium px-4 py-2 rounded-lg transition-all
              ${isActive ? "text-indigo-600 bg-indigo-50" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`
            }>
            Products
          </NavLink>
          <NavLink to="/cart"
            className={({ isActive }) =>
              `text-sm font-medium px-4 py-2 rounded-lg transition-all
              ${isActive ? "text-indigo-600 bg-indigo-50" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`
            }>
            Cart
          </NavLink>
          {user?.role === "admin" && (
    <NavLink to="/admin"
        className={({ isActive }) =>
            `text-sm font-medium px-4 py-2 rounded-lg transition-all
            ${isActive ? "text-indigo-600 bg-indigo-50" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`
        }>
        Admin
    </NavLink>
)}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">

          {/* Cart icon */}
          <Link to="/cart" className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all">
            <PiShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth buttons - desktop only */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/login"
              className="text-sm font-semibold text-gray-600 px-4 py-2 rounded-lg border border-gray-300 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
              Login
            </Link>
            <Link to="/register"
              className="text-sm font-semibold text-white px-4 py-2 rounded-lg transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
              Register
            </Link>
          </div>

          {/* Hamburger - mobile only */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
            onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <PiX size={24} /> : <PiList size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-6 py-3 flex flex-col gap-1">
          <NavLink to="/" onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `text-[15px] font-medium px-3 py-3 rounded-lg transition-all
              ${isActive ? "text-indigo-600 bg-indigo-50" : "text-gray-600 hover:bg-gray-100"}`
            }>
            Home
          </NavLink>
          <NavLink to="/products" onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `text-[15px] font-medium px-3 py-3 rounded-lg transition-all
              ${isActive ? "text-indigo-600 bg-indigo-50" : "text-gray-600 hover:bg-gray-100"}`
            }>
            Products
          </NavLink>
          <NavLink to="/cart" onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `text-[15px] font-medium px-3 py-3 rounded-lg transition-all
              ${isActive ? "text-indigo-600 bg-indigo-50" : "text-gray-600 hover:bg-gray-100"}`
            }>
            Cart
          </NavLink>

          <div className="h-px bg-gray-200 my-2" />

          <div className="flex gap-3 px-3 pb-2">
            <Link to="/login" onClick={() => setMenuOpen(false)}
              className="flex-1 text-center text-sm font-semibold text-gray-600 py-2.5 rounded-lg border border-gray-300">
              Login
            </Link>
            <Link to="/register" onClick={() => setMenuOpen(false)}
              className="flex-1 text-center text-sm font-semibold text-white py-2.5 rounded-lg"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;