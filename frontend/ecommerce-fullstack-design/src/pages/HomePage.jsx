import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PiHeart, PiHeartFill, PiStar, PiStarFill } from "react-icons/pi";

const shopCategories = [
  { name: "Electronics & Gadgets", icon: "📱", bg: "#dbeafe" },
  { name: "Fashion & Apparel", icon: "👗", bg: "#fce7f3" },
  { name: "Home & Kitchen", icon: "🏠", bg: "#d1fae5" },
  { name: "Health & Fitness", icon: "💪", bg: "#fef3c7" },
  { name: "Beauty & Personal Care", icon: "💄", bg: "#ede9fe" },
];

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) =>
      i <= Math.round(rating)
        ? <PiStarFill key={i} size={13} className="text-yellow-400" />
        : <PiStar key={i} size={13} className="text-gray-300" />
    )}
  </div>
);

const ProductCard = ({ product }) => {
  const [wished, setWished] = useState(false);
  const price = (product.price || product.priceCents / 100).toFixed(2);

  return (
    <Link
      to={`/products/${product._id || product.id}`}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="relative bg-gray-50 p-4 h-44 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="h-32 object-contain group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={(e) => { e.preventDefault(); setWished(!wished); }}
          className="absolute top-2.5 right-2.5 bg-white rounded-full w-7 h-7 flex items-center justify-center border border-gray-200 hover:border-red-300 transition-all"
        >
          {wished
            ? <PiHeartFill size={14} className="text-red-500" />
            : <PiHeart size={14} className="text-gray-400" />}
        </button>
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-gray-800 truncate mb-1">{product.name}</p>
        <p className="text-xs text-gray-400 truncate mb-2">{product.category}</p>
        <div className="flex items-center gap-1 mb-1.5">
          <span className="text-base font-black text-indigo-600">${price}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <StarRating rating={product.rating?.stars || 4} />
          <span className="text-xs text-gray-400">({product.rating?.count || 0})</span>
        </div>
      </div>
    </Link>
  );
};

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    fetch("http://localhost:5001/api/products")
      .then((r) => r.json())
      .then((data) => { setProducts(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const electronics = products.filter(
    (p) => p.category === "Electronics & Gadgets"
  );
  const featured = products.slice(0, 8);
  const heroProducts = electronics.slice(0, 3);

  return (
    <div className="bg-gray-100 min-h-screen">
     
      {/* ── HERO ── */}
      <div
        className="px-8 md:px-16 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
        style={{ background: "linear-gradient(135deg, #3dcab1 0%, #2ab09a 100%)" }}
      >
        <div>
          <span className="inline-block text-xs font-extrabold tracking-widest uppercase text-teal-900 bg-teal-700 bg-opacity-20 px-3 py-1 rounded-full mb-4">
            New Arrivals 2026
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-teal-950 leading-tight mb-4">
            Latest Trending{" "}
            <span className="text-white">Electronic Items</span>
          </h1>
          <p className="text-teal-800 text-sm mb-8 leading-relaxed max-w-sm">
            Discover the best deals on top electronics. Fast shipping, free returns on every order.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link
              to="/products"
              className="inline-block bg-teal-950 text-white text-sm font-bold px-8 py-3.5 rounded-xl hover:opacity-85 transition-opacity"
            >
              Shop Now →
            </Link>
            <Link
              to="/products"
              className="inline-block bg-white bg-opacity-30 text-teal-950 text-sm font-bold px-8 py-3.5 rounded-xl hover:bg-opacity-40 transition-all"
            >
              View All
            </Link>
          </div>
        </div>

        {/* Hero product images from real API */}
        <div className="flex justify-center items-center gap-4 flex-wrap">
          {loading
            ? [1, 2, 3].map((i) => (
                <div key={i} className="bg-white bg-opacity-20 rounded-2xl w-28 h-36 animate-pulse" />
              ))
            : heroProducts.map((p, i) => (
                <Link
                  to={`/products/${p._id || p.id}`}
                  key={p._id || p.id}
                  className="bg-white bg-opacity-30 rounded-2xl p-4 text-center hover:bg-opacity-50 transition-all"
                  style={{ width: i === 1 ? "140px" : "118px" }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-24 object-contain mx-auto"
                  />
                  <p className="text-xs font-semibold text-teal-900 mt-2 truncate">
                    {p.name.split(" ").slice(0, 2).join(" ")}
                  </p>
                </Link>
              ))}
        </div>
      </div>

      {/* ── FEATURED PRODUCTS ── */}
      <div className="px-8 md:px-16 py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Featured Products</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {loading ? "Loading..." : `${products.length} products available`}
            </p>
          </div>
          <Link to="/products" className="text-sm font-semibold text-indigo-600 hover:underline">
            View all →
          </Link>
        </div>

        {error ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-semibold">Could not load products</p>
            <p className="text-sm mt-1">Make sure your backend server is running on port 5000</p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((p) => <ProductCard key={p._id || p.id} product={p} />)}
          </div>
        )}
      </div>

      {/* ── SHOP BY CATEGORY ── */}
      <div className="px-8 md:px-16 pb-16">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Shop by Category</h2>
            <p className="text-sm text-gray-400 mt-0.5">Find exactly what you're looking for</p>
          </div>
          <Link to="/products" className="text-sm font-semibold text-indigo-600 hover:underline">
            All categories →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {shopCategories.map((c) => (
            <Link
              to={`/products?category=${encodeURIComponent(c.name)}`}
              key={c.name}
              className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center gap-3 hover:border-indigo-400 hover:shadow-md transition-all"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                style={{ background: c.bg }}
              >
                {c.icon}
              </div>
              <span className="text-sm font-bold text-gray-900 text-center">{c.name}</span>
              <span className="text-xs text-gray-400">
                {products.filter((p) => p.category === c.name).length} items
              </span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
};

export default HomePage;