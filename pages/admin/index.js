import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", category: "", description: "", image: "", stock: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Check if already authenticated on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("adminAuth");
      if (auth === "true") {
        setIsAuthenticated(true);
        loadProducts();
      }
    }
  }, []);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError("");
    
    if (password === "demi") {
      localStorage.setItem("adminAuth", "true");
      setIsAuthenticated(true);
      setPassword("");
      loadProducts();
    } else {
      setPasswordError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      setMessage("Failed to load products");
    }
    setLoading(false);
  };

  const addProduct = async (e) => {
    e.preventDefault();
    setMessage("");
    const token = process.env.NEXT_PUBLIC_ADMIN_TOKEN;
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        setMessage(data.error || "Add product failed");
        return;
      }
      setForm({ name: "", price: "", category: "", description: "", image: "", stock: "" });
      setMessage("Product added successfully!");
      loadProducts();
    } catch (err) {
      setMessage("Error adding product: " + err.message);
    }
  };

  const deleteProduct = async (id) => {
    setMessage("");
    const token = process.env.NEXT_PUBLIC_ADMIN_TOKEN;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        setMessage("Failed to delete product");
        return;
      }
      setMessage("Product deleted successfully!");
      loadProducts();
    } catch (err) {
      setMessage("Error deleting product: " + err.message);
    }
  };

  const seedDatabase = async () => {
    setMessage("");
    const token = process.env.NEXT_PUBLIC_ADMIN_TOKEN;
    try {
      const res = await fetch("/api/seed", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const data = await res.json();
        setMessage(data.error || "Seed failed");
        return;
      }
      const data = await res.json();
      setMessage(`Seeded ${data.inserted} products`);
      loadProducts();
    } catch (err) {
      setMessage("Error seeding database: " + err.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("adminAuth");
    setIsAuthenticated(false);
    setPassword("");
    setProducts([]);
  };

  // Password screen
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
        <div className="w-full max-w-md">
          <div className="rounded-xl bg-white p-8 shadow-2xl">
            <h1 className="text-2xl font-bold text-center mb-6">Admin Panel</h1>
            <p className="text-center text-gray-600 mb-6">Enter password to continue</p>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
                autoFocus
              />
              {passwordError && (
                <p className="text-sm text-red-600">{passwordError}</p>
              )}
              <button
                type="submit"
                className="w-full rounded-lg bg-gold px-4 py-2 font-semibold text-white hover:bg-opacity-90 transition"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <button onClick={seedDatabase} className="rounded-lg bg-blue-500 px-3 py-1 text-sm font-semibold text-white hover:bg-blue-600">Seed Database</button>
          <button onClick={logout} className="rounded-lg bg-red-500 px-3 py-1 text-sm font-semibold text-white hover:bg-red-600">Logout</button>
        </div>
      </div>

      {message && (
        <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">
          {message}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Add a Product</h2>
        <form onSubmit={addProduct} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input required value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Name" className="rounded border px-3 py-2" />
          <input required type="number" value={form.price} onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))} placeholder="Price" className="rounded border px-3 py-2" />
          <input required value={form.category} onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))} placeholder="Category" className="rounded border px-3 py-2" />
          <input required value={form.stock} onChange={(e) => setForm(prev => ({ ...prev, stock: e.target.value }))} type="number" placeholder="Stock" className="rounded border px-3 py-2" />
          <input required value={form.image} onChange={(e) => setForm(prev => ({ ...prev, image: e.target.value }))} placeholder="Image URL" className="rounded border px-3 py-2 sm:col-span-2" />
          <textarea required value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Description" className="sm:col-span-2 rounded border px-3 py-2" />
          <button type="submit" className="sm:col-span-2 rounded-lg bg-brand-black px-4 py-2 text-white hover:bg-opacity-90">Add Product</button>
        </form>
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Products ({products.length})</h2>
        <div className="mt-4 grid gap-3">
          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-600">No products yet. Add one above.</p>
          ) : (
            products.map((p) => (
              <div key={p._id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <span className="font-medium">{p.name}</span>
                  <p className="text-sm text-gray-600">R{parseFloat(p.price).toFixed(2)} | Stock: {p.stock}</p>
                </div>
                <button onClick={() => deleteProduct(p._id)} className="rounded-lg bg-red-500 px-3 py-1 text-white hover:bg-red-600">Delete</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
