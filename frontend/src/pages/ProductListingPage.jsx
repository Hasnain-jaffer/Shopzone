import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PiHeart, PiHeartFill, PiStar, PiStarFill, PiMagnifyingGlass, PiX } from "react-icons/pi";

const categories = [
  "All",
  "Electronics & Gadgets",
  "Fashion & Apparel",
  "Home & Kitchen",
  "Health & Fitness",
  "Beauty & Personal Care",
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
  const price = (product.price ?? product.priceCents / 100).toFixed(2);

  return (
    <Link
      to={`/products/${product._id ?? product.id}`}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-indigo-400 hover:shadow-md transition-all group"
    >
      <div className="relative bg-gray-50 p-4 h-48 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="h-36 object-contain group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={(e) => { e.preventDefault(); setWished(!wished); }}
          className="absolute top-2.5 right-2.5 bg-white rounded-full w-8 h-8 flex items-center justify-center border border-gray-200 hover:border-red-300 transition-all"
        >
          {wished
            ? <PiHeartFill size={15} className="text-red-500" />
            : <PiHeart size={15} className="text-gray-400" />}
        </button>
        <span className="absolute top-2.5 left-2.5 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {product.category?.split(" ")[0]}
        </span>
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-gray-800 truncate mb-0.5">{product.name}</p>
        <p className="text-xs text-gray-400 truncate mb-2">{product.subCategory ?? product.category}</p>
        <div className="flex items-center justify-between">
          <span className="text-base font-black text-indigo-600">${price}</span>
          <div className="flex items-center gap-1">
            <StarRating rating={product.rating?.stars ?? 4} />
            <span className="text-xs text-gray-400">({product.rating?.count ?? 0})</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const ProductListingPage = () => {
  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(false);
  const [search, setSearch]             = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchParams]                  = useSearchParams();

  // Read ?category= from URL (set by HomePage category cards)
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  // Fetch all products once
  useEffect(() => {
    fetch("http://localhost:5001/api/products")
      .then((r) => r.json())
      .then((data) => { setProducts(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  // Filter products based on search + category
  const filtered = products.filter((p) => {
    const matchesSearch   = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* ── PAGE HEADER ── */}
      <div
        className="px-8 md:px-16 py-10"
        style={{ background: "linear-gradient(135deg, #0f0c29 0%, #302b63 100%)" }}
      >
        <h1 className="text-3xl font-black text-white mb-1">All Products</h1>
        <p className="text-indigo-300 text-sm">
          {loading ? "Loading..." : `${filtered.length} products found`}
        </p>

        {/* Search bar */}
        <div className="relative mt-6 max-w-xl">
          <PiMagnifyingGlass
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name..."
            className="w-full h-12 pl-11 pr-11 bg-white rounded-xl text-sm outline-none border border-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <PiX size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="px-8 md:px-16 py-8">

        {/* ── CATEGORY FILTER BUTTONS ── */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border
                ${activeCategory === cat
                  ? "text-white border-transparent"
                  : "bg-white text-gray-600 border-gray-200 hover:border-indigo-400 hover:text-indigo-600"
                }`}
              style={activeCategory === cat
                ? { background: "linear-gradient(135deg, #667eea, #764ba2)" }
                : {}}
            >
              {cat}
              {cat !== "All" && (
                <span className={`ml-1.5 text-xs ${activeCategory === cat ? "text-indigo-200" : "text-gray-400"}`}>
                  ({products.filter((p) => p.category === cat).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── STATES: error / loading / empty / products ── */}
        {error ? (
          <div className="text-center py-24">
            <p className="text-xl font-bold text-gray-700 mb-2">Failed to load products</p>
            <p className="text-sm text-gray-400">Make sure your backend is running on port 5001</p>
          </div>

        ) : loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-72 animate-pulse" />
            ))}
          </div>

        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-xl font-bold text-gray-700 mb-2">No products found</p>
            <p className="text-sm text-gray-400 mb-6">
              Try a different search term or category
            </p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("All"); }}
              className="px-6 py-2.5 rounded-xl text-white text-sm font-bold"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
            >
              Clear filters
            </button>
          </div>

        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <ProductCard key={p._id ?? p.id} product={p} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductListingPage;