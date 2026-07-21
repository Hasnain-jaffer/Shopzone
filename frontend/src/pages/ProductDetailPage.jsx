import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  PiStar, PiStarFill, PiShoppingCart, PiArrowLeft,
  PiPackage, PiTruck, PiArrowCounterClockwise, PiCheckCircle
} from "react-icons/pi";

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((i) =>
      i <= Math.round(rating)
        ? <PiStarFill key={i} size={18} className="text-yellow-400" />
        : <PiStar key={i} size={18} className="text-gray-300" />
    )}
    <span className="text-sm text-gray-500 ml-1">({rating})</span>
  </div>
);

const ProductDetailPage = () => {
  const { id } = useParams();

  const [product, setProduct]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded]       = useState(false);

  // Fetch single product by ID
  useEffect(() => {
    setLoading(true);
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
    fetch(`${API_URL}/products/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => { setProduct(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [id]);

  // Add to cart — saves to localStorage
  const handleAddToCart = () => {
    // 1. Read existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    // 2. Check if this product is already in cart
    const existingIndex = existingCart.findIndex((item) => item._id === product._id);

    if (existingIndex !== -1) {
      // 3a. Product already in cart — just increase its quantity
      existingCart[existingIndex].quantity += quantity;
    } else {
      // 3b. New product — add it with selected quantity
      existingCart.push({ ...product, quantity });
    }

    // 4. Save updated cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("cartUpdated")); // ← add this line

    // 5. Show "Added!" confirmation for 2 seconds
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // ── LOADING STATE ──
  if (loading) return (
    <div className="bg-gray-100 min-h-screen px-8 md:px-16 py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-gray-200 rounded-xl h-96 animate-pulse" />
        <div className="flex flex-col gap-4">
          <div className="bg-gray-200 rounded h-8 w-3/4 animate-pulse" />
          <div className="bg-gray-200 rounded h-5 w-1/2 animate-pulse" />
          <div className="bg-gray-200 rounded h-10 w-1/3 animate-pulse" />
          <div className="bg-gray-200 rounded h-24 animate-pulse" />
          <div className="bg-gray-200 rounded h-12 animate-pulse" />
        </div>
      </div>
    </div>
  );

  // ── ERROR STATE ──
  if (error) return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-2xl font-black text-gray-700 mb-2">Product not found</p>
        <p className="text-gray-400 text-sm mb-6">
          This product may have been removed or the ID is invalid
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm"
          style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
        >
          <PiArrowLeft size={16} /> Back to Products
        </Link>
      </div>
    </div>
  );

  const price = (product.price ?? product.priceCents / 100).toFixed(2);
  const inStock = product.stock > 0;

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-8 md:px-16">
      <div className="max-w-5xl mx-auto">

        {/* ── BACK BUTTON ── */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors mb-6"
        >
          <PiArrowLeft size={16} /> Back to Products
        </Link>

        {/* ── MAIN CARD ── */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

            {/* LEFT — Product Image */}
            <div className="bg-gray-50 p-10 flex items-center justify-center border-r border-gray-100 min-h-80">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-72 object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* RIGHT — Product Info */}
            <div className="p-8 flex flex-col gap-5">

              {/* Category badge */}
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full text-white"
                  style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
                >
                  {product.category}
                </span>
                {inStock
                  ? <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">In Stock</span>
                  : <span className="text-xs font-semibold text-red-500 bg-red-50 px-3 py-1 rounded-full">Out of Stock</span>
                }
              </div>

              {/* Name */}
              <h1 className="text-2xl font-black text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Star rating */}
              <StarRating rating={product.rating?.stars ?? 4.5} />

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span
                  className="text-4xl font-black"
                  style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                >
                  ${price}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  ${(parseFloat(price) * 1.2).toFixed(2)}
                </span>
                <span className="text-sm font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">
                  -20%
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                {product.description}
              </p>

              {/* Stock info */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <PiPackage size={16} className="text-indigo-500" />
                <span>
                  {inStock
                    ? <><span className="font-semibold text-gray-800">{product.stock}</span> units left in stock</>
                    : "Currently out of stock"}
                </span>
              </div>

              {/* Quantity selector */}
              {inStock && (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors font-bold text-lg"
                    >
                      −
                    </button>
                    <span className="px-5 py-2 text-sm font-bold text-gray-800 border-x border-gray-200">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors font-bold text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`w-full h-13 py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all
                  ${!inStock
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : added
                      ? "bg-emerald-500 text-white"
                      : "text-white hover:opacity-90"
                  }`}
                style={inStock && !added
                  ? { background: "linear-gradient(135deg, #667eea, #764ba2)" }
                  : {}}
              >
                {added ? (
                  <><PiCheckCircle size={20} /> Added to Cart!</>
                ) : (
                  <><PiShoppingCart size={20} />
                    {inStock ? "Add to Cart" : "Out of Stock"}</>
                )}
              </button>

            </div>
          </div>

          {/* ── BOTTOM — Perks strip ── */}
          <div className="border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-0">
            {[
              { icon: <PiTruck size={22} className="text-indigo-500" />, title: "Free Delivery", sub: "On orders over $50" },
              { icon: <PiArrowCounterClockwise size={22} className="text-indigo-500" />, title: "Free Returns", sub: "30-day return policy" },
              { icon: <PiPackage size={22} className="text-indigo-500" />, title: "Secure Packaging", sub: "Safe & protected delivery" },
            ].map((perk, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 p-6 ${i < 2 ? "border-b md:border-b-0 md:border-r border-gray-100" : ""}`}
              >
                <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0">
                  {perk.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{perk.title}</p>
                  <p className="text-xs text-gray-400">{perk.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailPage;