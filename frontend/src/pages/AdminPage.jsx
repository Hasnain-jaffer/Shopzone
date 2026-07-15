import { useState, useEffect } from "react";
import {
    PiPackage, PiPlus, PiTrash, PiCheck, PiX,
    PiSignOut, PiList, PiPencil, PiSquaresFour,
    PiUsers, PiShieldCheck, PiWarning
} from "react-icons/pi";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5001/api";

const getToken = () => localStorage.getItem("token");

const AdminPage = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [activeTab, setActiveTab] = useState("dashboard");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);

    const [form, setForm] = useState({
        name: "", price: "", image: "",
        category: "", description: "", stock: ""
    });

    // Fetch all products
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/products`);
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            alert("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    // Fetch all users (admin only)
    const fetchUsers = async () => {
        setUsersLoading(true);
        try {
            const res = await fetch(`${API}/auth/users`, {
                headers: { "Authorization": `Bearer ${getToken()}` }
            });
            if (!res.ok) throw new Error("Failed to fetch users");
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            alert(err.message);
        } finally {
            setUsersLoading(false);
        }
    };

    const handleRoleChange = async (id, role) => {
        try {
            const res = await fetch(`${API}/auth/users/${id}/role`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                },
                body: JSON.stringify({ role })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to update role");
            fetchUsers();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Delete this user permanently?")) return;
        try {
            const res = await fetch(`${API}/auth/users/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${getToken()}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to delete user");
            fetchUsers();
        } catch (err) {
            alert(err.message);
        }
    };

    useEffect(() => { fetchProducts(); fetchUsers(); }, []);

    const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 10).length;
    const outOfStockCount = products.filter(p => p.stock === 0).length;
    const adminCount = users.filter(u => u.role === "admin").length;

    // Handle add product form change
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // Add product
    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API}/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                },
                body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock) })
            });
            if (!res.ok) throw new Error("Failed to add product");
            setForm({ name: "", price: "", image: "", category: "", description: "", stock: "" });
            fetchProducts();
            setActiveTab("products");
            alert("Product added successfully!");
        } catch (err) {
            alert(err.message);
        }
    };

    // Start editing a row
    const startEdit = (product) => {
        setEditingId(product._id);
        setEditData({ ...product });
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingId(null);
        setEditData({});
    };

    // Save edited product
    const saveEdit = async (id) => {
        try {
            const res = await fetch(`${API}/products/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    ...editData,
                    price: Number(editData.price),
                    stock: Number(editData.stock)
                })
            });
            if (!res.ok) throw new Error("Failed to update product");
            setEditingId(null);
            fetchProducts();
        } catch (err) {
            alert(err.message);
        }
    };

    // Delete product
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            const res = await fetch(`${API}/products/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${getToken()}` }
            });
            if (!res.ok) throw new Error("Failed to delete product");
            fetchProducts();
        } catch (err) {
            alert(err.message);
        }
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const inputClass = "w-full h-9 px-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all";

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">

            {/* ── SIDEBAR ── */}
            <div className={`${sidebarOpen ? "w-56" : "w-16"} transition-all duration-300 flex flex-col flex-shrink-0`}
                style={{ background: "linear-gradient(145deg, #0f0c29, #302b63)" }}>

                {/* Logo area */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-white border-opacity-10">
                    {sidebarOpen && <span className="text-white font-black text-lg">ShopZone</span>}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-indigo-300 hover:text-white transition-colors">
                        <PiList size={22} />
                    </button>
                </div>

                {/* Nav items */}
                <div className="flex flex-col gap-1 p-3 flex-1">
                    {[
                        { id: "dashboard", icon: <PiSquaresFour size={20} />, label: "Dashboard" },
                        { id: "products", icon: <PiPackage size={20} />, label: "Products" },
                        { id: "add", icon: <PiPlus size={20} />, label: "Add Product" },
                        { id: "users", icon: <PiUsers size={20} />, label: "Users" },
                    ].map(item => (
                        <button key={item.id} onClick={() => setActiveTab(item.id)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold
                                ${activeTab === item.id
                                    ? "bg-indigo-500 bg-opacity-30 text-white"
                                    : "text-indigo-300 hover:text-white hover:bg-indigo-500 hover:bg-opacity-20"}`}>
                            {item.icon}
                            {sidebarOpen && <span>{item.label}</span>}
                        </button>
                    ))}
                </div>

                {/* User + logout */}
                <div className="p-3 border-t border-white border-opacity-10">
                    {sidebarOpen && (
                        <div className="px-3 py-2 mb-2">
                            <p className="text-white text-xs font-bold truncate">{user.firstName} {user.lastName}</p>
                            <p className="text-indigo-400 text-xs truncate">{user.email}</p>
                        </div>
                    )}
                    <button onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-white hover:bg-opacity-10 transition-all w-full text-sm font-semibold">
                        <PiSignOut size={20} />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Top bar */}
                <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
                    <div>
                        <h1 className="text-lg font-black text-gray-900">
                            {activeTab === "dashboard" ? "Dashboard"
                                : activeTab === "products" ? "All Products"
                                : activeTab === "users" ? "User Management"
                                : "Add New Product"}
                        </h1>
                        <p className="text-xs text-gray-400">
                            {activeTab === "dashboard" ? "Store overview at a glance"
                                : activeTab === "products" ? `${products.length} products total`
                                : activeTab === "users" ? `${users.length} registered users`
                                : "Fill in the details below"}
                        </p>
                    </div>
                    <button
                        onClick={() => setActiveTab("add")}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold"
                        style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
                        <PiPlus size={16} /> Add Product
                    </button>
                </div>

                {/* Content area */}
                <div className="flex-1 overflow-y-auto p-6">

                    {/* ── DASHBOARD ── */}
                    {activeTab === "dashboard" && (
                        <div className="flex flex-col gap-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { label: "Total Products", value: products.length, icon: <PiPackage size={22} />, color: "#667eea" },
                                    { label: "Total Users", value: users.length, icon: <PiUsers size={22} />, color: "#764ba2" },
                                    { label: "Admins", value: adminCount, icon: <PiShieldCheck size={22} />, color: "#22c55e" },
                                    { label: "Low / Out of Stock", value: lowStockCount + outOfStockCount, icon: <PiWarning size={22} />, color: "#f59e0b" },
                                ].map(stat => (
                                    <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                                            style={{ background: stat.color }}>
                                            {stat.icon}
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                                            <p className="text-xs text-gray-400 font-semibold">{stat.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h2 className="text-base font-black text-gray-800 mb-4">Recently Added Products</h2>
                                <div className="flex flex-col gap-3">
                                    {products.slice(-5).reverse().map(p => (
                                        <div key={p._id} className="flex items-center gap-3 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                            <img src={p.image} alt={p.name} className="w-10 h-10 object-contain rounded-lg bg-gray-100 p-1" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                                                <p className="text-xs text-gray-400">{p.category}</p>
                                            </div>
                                            <span className="font-bold text-indigo-600 text-sm">${p.price}</span>
                                        </div>
                                    ))}
                                    {products.length === 0 && (
                                        <p className="text-sm text-gray-400">No products yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── ADD PRODUCT FORM ── */}
                    {activeTab === "add" && (
                        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 p-6">
                            <h2 className="text-base font-black text-gray-800 mb-5">Product Details</h2>
                            <form onSubmit={handleAddProduct} className="flex flex-col gap-4">

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Name</label>
                                        <input className={inputClass} name="name" value={form.name}
                                            onChange={handleFormChange} placeholder="Product name" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Price ($)</label>
                                        <input className={inputClass} name="price" type="number" value={form.price}
                                            onChange={handleFormChange} placeholder="0.00" required />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Category</label>
                                        <input className={inputClass} name="category" value={form.category}
                                            onChange={handleFormChange} placeholder="e.g. Electronics" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Stock</label>
                                        <input className={inputClass} name="stock" type="number" value={form.stock}
                                            onChange={handleFormChange} placeholder="0" required />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Image URL</label>
                                    <input className={inputClass} name="image" value={form.image}
                                        onChange={handleFormChange} placeholder="https://..." required />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Description</label>
                                    <textarea className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
                                        name="description" value={form.description}
                                        onChange={handleFormChange} placeholder="Product description..."
                                        rows={3} required />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button type="submit"
                                        className="flex-1 h-10 rounded-xl text-white font-bold text-sm transition-opacity hover:opacity-90"
                                        style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
                                        Add Product
                                    </button>
                                    <button type="button" onClick={() => setActiveTab("products")}
                                        className="px-6 h-10 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* ── PRODUCTS TABLE ── */}
                    {activeTab === "products" && (
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                            {loading ? (
                                <div className="p-12 text-center text-gray-400">Loading products...</div>
                            ) : products.length === 0 ? (
                                <div className="p-12 text-center text-gray-400">No products found</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-100 bg-gray-50">
                                                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Product</th>
                                                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Category</th>
                                                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Price</th>
                                                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Stock</th>
                                                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map((product) => (
                                                <tr key={product._id}
                                                    className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${editingId === product._id ? "bg-indigo-50" : ""}`}>

                                                    {/* Product name + image */}
                                                    <td className="px-4 py-3">
                                                        {editingId === product._id ? (
                                                            <input className={inputClass} value={editData.name}
                                                                onChange={e => setEditData(p => ({ ...p, name: e.target.value }))} />
                                                        ) : (
                                                            <div className="flex items-center gap-3">
                                                                <img src={product.image} alt={product.name}
                                                                    className="w-10 h-10 object-contain rounded-lg bg-gray-100 p-1" />
                                                                <span className="font-semibold text-gray-800 truncate max-w-xs">{product.name}</span>
                                                            </div>
                                                        )}
                                                    </td>

                                                    {/* Category */}
                                                    <td className="px-4 py-3">
                                                        {editingId === product._id ? (
                                                            <input className={inputClass} value={editData.category}
                                                                onChange={e => setEditData(p => ({ ...p, category: e.target.value }))} />
                                                        ) : (
                                                            <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">
                                                                {product.category}
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Price */}
                                                    <td className="px-4 py-3">
                                                        {editingId === product._id ? (
                                                            <input className={inputClass} type="number" value={editData.price}
                                                                onChange={e => setEditData(p => ({ ...p, price: e.target.value }))} />
                                                        ) : (
                                                            <span className="font-bold text-indigo-600">${product.price}</span>
                                                        )}
                                                    </td>

                                                    {/* Stock */}
                                                    <td className="px-4 py-3">
                                                        {editingId === product._id ? (
                                                            <input className={inputClass} type="number" value={editData.stock}
                                                                onChange={e => setEditData(p => ({ ...p, stock: e.target.value }))} />
                                                        ) : (
                                                            <span className={`text-xs font-bold px-2 py-1 rounded-full
                                                                ${product.stock > 10 ? "bg-emerald-50 text-emerald-600"
                                                                    : product.stock > 0 ? "bg-yellow-50 text-yellow-600"
                                                                        : "bg-red-50 text-red-500"}`}>
                                                                {product.stock > 0 ? `${product.stock} left` : "Out of stock"}
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-4 py-3">
                                                        {editingId === product._id ? (
                                                            <div className="flex items-center gap-2">
                                                                <button onClick={() => saveEdit(product._id)}
                                                                    className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-200 transition-colors">
                                                                    <PiCheck size={15} />
                                                                </button>
                                                                <button onClick={cancelEdit}
                                                                    className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors">
                                                                    <PiX size={15} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2">
                                                                <button onClick={() => startEdit(product)}
                                                                    className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center hover:bg-indigo-100 transition-colors">
                                                                    <PiPencil size={15} />
                                                                </button>
                                                                <button onClick={() => handleDelete(product._id)}
                                                                    className="w-8 h-8 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors">
                                                                    <PiTrash size={15} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── USERS TABLE ── */}
                    {activeTab === "users" && (
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                            {usersLoading ? (
                                <div className="p-12 text-center text-gray-400">Loading users...</div>
                            ) : users.length === 0 ? (
                                <div className="p-12 text-center text-gray-400">No users found</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-100 bg-gray-50">
                                                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Name</th>
                                                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Email</th>
                                                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Role</th>
                                                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((u) => (
                                                <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-3 font-semibold text-gray-800">{u.firstName} {u.lastName}</td>
                                                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`text-xs font-bold px-2 py-1 rounded-full
                                                            ${u.role === "admin" ? "bg-indigo-50 text-indigo-600" : "bg-gray-100 text-gray-500"}`}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            {u._id === user._id ? (
                                                                <span className="text-xs text-gray-400 italic">This is you</span>
                                                            ) : (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleRoleChange(u._id, u.role === "admin" ? "user" : "admin")}
                                                                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors">
                                                                        {u.role === "admin" ? "Revoke Admin" : "Make Admin"}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteUser(u._id)}
                                                                        className="w-8 h-8 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors">
                                                                        <PiTrash size={15} />
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;