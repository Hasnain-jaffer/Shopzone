import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  PiTrash, PiShoppingCartSimple, PiArrowLeft,
  PiPackage, PiTruck, PiTag
} from "react-icons/pi";

const CartPage = () => {
  const [cart, setCart]                   = useState([]);
  const [coupon, setCoupon]               = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  // Read cart from localStorage once on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(stored);
  }, []);

  // Save to localStorage — called manually inside each handler
  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
      window.dispatchEvent(new Event("cartUpdated")); // ← add this line
  };

  const increaseQty = (id) => {
    const newCart = cart.map((item) =>
      item._id === id
        ? { ...item, quantity: Math.min(item.stock, item.quantity + 1) }
        : item
    );
    saveCart(newCart);
  };

  const decreaseQty = (id) => {
    const newCart = cart.map((item) =>
      item._id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    saveCart(newCart);
  };

  const removeItem = (id) => {
    const newCart = cart.filter((item) => item._id !== id);
    saveCart(newCart);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cartUpdated")); // ← add this line
  };

  // ── PRICE CALCULATIONS ──
  const subtotal  = cart.reduce((sum, item) => {
    const price = item.price ?? item.priceCents / 100;
    return sum + price * item.quantity;
  }, 0);

  const discount    = couponApplied ? subtotal * 0.1 : 0;
  const delivery    = subtotal > 50 ? 0 : 5.99;
  const total       = subtotal - discount + delivery;
  const totalItems  = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ── APPLY COUPON ──
  const handleCoupon = () => {
    if (coupon.trim().toUpperCase() === "SHOP10") {
      setCouponApplied(true);
    } else {
      alert("Invalid coupon code");
    }
  };

  // ── EMPTY CART STATE ──
  if (cart.length === 0) return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "linear-gradient(135deg, #667eea22, #764ba222)" }}
        >
          <PiShoppingCartSimple size={48} className="text-indigo-400" />
        </div>
        <h2 className="text-2xl font-black text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 text-sm mb-8">
          Looks like you haven't added anything yet
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-bold text-sm"
          style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
        >
          <PiArrowLeft size={16} /> Start Shopping
        </Link>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-8 md:px-16">

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Your Cart</h1>
          <p className="text-gray-400 text-sm mt-1">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </p>
        </div>
        <button
          onClick={clearCart}
          className="flex items-center gap-2 text-sm font-semibold text-red-400 hover:text-red-600 transition-colors"
        >
          <PiTrash size={16} /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── LEFT — CART ITEMS ── */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {cart.map((item) => {
            const price = item.price ?? item.priceCents / 100;
            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-gray-200 p-5 flex gap-5 items-center"
              >
                {/* Product image */}
                <Link to={`/products/${item._id}`} className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-contain hover:scale-105 transition-transform"
                    />
                  </div>
                </Link>

                {/* Product info */}
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item._id}`}>
                    <p className="font-bold text-gray-900 truncate hover:text-indigo-600 transition-colors">
                      {item.name}
                    </p>
                  </Link>
                  <p className="text-xs text-gray-400 mt-0.5 mb-3">{item.category}</p>

                  <div className="flex items-center justify-between flex-wrap gap-3">

                    {/* Quantity controls */}
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => decreaseQty(item._id)}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors font-bold text-base"
                      >
                        −
                      </button>
                      <span className="px-4 py-1.5 text-sm font-bold text-gray-800 border-x border-gray-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQty(item._id)}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors font-bold text-base"
                      >
                        +
                      </button>
                    </div>

                    {/* Price + remove */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p
                          className="font-black text-lg"
                          style={{
                            background: "linear-gradient(135deg, #667eea, #764ba2)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                          }}
                        >
                          ${(price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400">
                          ${price.toFixed(2)} each
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 hover:text-red-600 transition-all"
                      >
                        <PiTrash size={15} />
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}

          {/* Continue shopping */}
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:underline mt-2"
          >
            <PiArrowLeft size={15} /> Continue Shopping
          </Link>
        </div>

        {/* ── RIGHT — ORDER SUMMARY ── */}
        <div className="flex flex-col gap-4">

          {/* Coupon */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <PiTag size={18} className="text-indigo-500" />
              <h3 className="font-bold text-gray-800">Coupon Code</h3>
            </div>
            {couponApplied ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="text-emerald-700 text-sm font-bold">SHOP10 applied — 10% off!</span>
                <button
                  onClick={() => { setCouponApplied(false); setCoupon(""); }}
                  className="text-xs text-emerald-600 hover:underline font-semibold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 h-10 px-4 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
                <button
                  onClick={handleCoupon}
                  className="h-10 px-4 rounded-xl text-white text-sm font-bold transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
                >
                  Apply
                </button>
              </div>
            )}
            <p className="text-xs text-gray-400 mt-2">Try: <span className="font-semibold text-indigo-500">SHOP10</span> for 10% off</p>
          </div>

          {/* Price breakdown */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal ({totalItems} items)</span>
                <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
              </div>

              {couponApplied && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount (10%)</span>
                  <span className="font-semibold">−${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <div className="flex items-center gap-1 text-gray-500">
                  <PiTruck size={14} />
                  <span>Delivery</span>
                </div>
                {delivery === 0
                  ? <span className="font-semibold text-emerald-600">Free</span>
                  : <span className="font-semibold text-gray-800">${delivery.toFixed(2)}</span>
                }
              </div>

              {delivery > 0 && (
                <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
                  Add <span className="font-semibold text-indigo-600">${(50 - subtotal).toFixed(2)}</span> more to get free delivery
                </p>
              )}

              <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                <span className="font-black text-gray-900 text-base">Total</span>
                <span
                  className="font-black text-2xl"
                  style={{
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}
                >
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout button */}
            <button
              className="w-full h-12 mt-5 rounded-xl text-white font-bold text-base transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
              onClick={() => alert("Checkout coming soon!")}
            >
              Proceed to Checkout →
            </button>

            {/* Perks */}
            <div className="mt-4 flex flex-col gap-2">
              {[
                { icon: <PiTruck size={14} />, text: "Free delivery on orders over $50" },
                { icon: <PiPackage size={14} />, text: "Secure & tracked delivery" },
              ].map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="text-indigo-400">{p.icon}</span>
                  {p.text}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CartPage;