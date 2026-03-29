import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", category: "", description: "", image: "", stock: "" });
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", price: "", category: "", description: "", image: "", stock: "" });
  const [logo, setLogo] = useState("MC PERFUMERY");
  const [logoInput, setLogoInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Check if already authenticated on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("adminAuth");
      if (auth === "true") {
        setIsAuthenticated(true);
        loadProducts();
        const savedLogo = localStorage.getItem("siteLogo");
        if (savedLogo) {
          setLogo(savedLogo);
          setLogoInput(savedLogo);
        }
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

  const updateLogo = () => {
    if (logoInput.trim()) {
      localStorage.setItem("siteLogo", logoInput);
      setLogo(logoInput);
      setMessage("Logo updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    }
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

  const startEditProduct = (product) => {
    setEditingProduct(product._id);
    setEditForm({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      image: product.image,
      stock: product.stock,
    });
  };

  const saveEditProduct = async () => {
    setMessage("");
    const token = process.env.NEXT_PUBLIC_ADMIN_TOKEN;
    const payload = { ...editForm, price: Number(editForm.price), stock: Number(editForm.stock) };
    try {
      const res = await fetch(`/api/products/${editingProduct}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        setMessage(data.error || "Update failed");
        return;
      }
      setMessage("Product updated successfully!");
      setEditingProduct(null);
      loadProducts();
    } catch (err) {
      setMessage("Error updating product: " + err.message);
    }
  };

  const cancelEditProduct = () => {
    setEditingProduct(null);
    setEditForm({ name: "", price: "", category: "", description: "", image: "", stock: "" });
  };

  const deleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
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
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 pt-24">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <button onClick={seedDatabase} className="rounded-lg bg-blue-500 px-3 py-1 text-sm font-semibold text-white hover:bg-blue-600">Seed Database</button>
          <button onClick={logout} className="rounded-lg bg-red-500 px-3 py-1 text-sm font-semibold text-white hover:bg-red-600">Logout</button>
        </div>
      </div>

      {message && (
        <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-800 border border-green-200">
          {message}
        </div>
      )}

      {/* Logo Management */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Site Logo</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Current Logo:</label>
            <p className="text-2xl font-bold text-gold">{logo}</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Change Logo:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={logoInput}
                onChange={(e) => setLogoInput(e.target.value)}
                placeholder="Enter new logo text"
                className="flex-1 rounded border px-3 py-2"
              />
              <button
                onClick={updateLogo}
                className="rounded-lg bg-gold px-4 py-2 font-semibold text-white hover:bg-opacity-90"
              >
                Update Logo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Product */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Add a Product</h2>
        <form onSubmit={addProduct} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input required value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Name" className="rounded border px-3 py-2" />
          <input required type="number" step="0.01" value={form.price} onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))} placeholder="Price" className="rounded border px-3 py-2" />
          <input required value={form.category} onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))} placeholder="Category" className="rounded border px-3 py-2" />
          <input required value={form.stock} onChange={(e) => setForm(prev => ({ ...prev, stock: e.target.value }))} type="number" placeholder="Stock" className="rounded border px-3 py-2" />
          <input required value={form.image} onChange={(e) => setForm(prev => ({ ...prev, image: e.target.value }))} placeholder="Image URL" className="rounded border px-3 py-2 sm:col-span-2" />
          <textarea required value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Description" className="sm:col-span-2 rounded border px-3 py-2" />
          <button type="submit" className="sm:col-span-2 rounded-lg bg-brand-black px-4 py-2 text-white hover:bg-opacity-90">Add Product</button>
        </form>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <input value={editForm.name} onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Name" className="rounded border px-3 py-2" />
              <input type="number" step="0.01" value={editForm.price} onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))} placeholder="Price" className="rounded border px-3 py-2" />
              <input value={editForm.category} onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))} placeholder="Category" className="rounded border px-3 py-2" />
              <input type="number" value={editForm.stock} onChange={(e) => setEditForm(prev => ({ ...prev, stock: e.target.value }))} placeholder="Stock" className="rounded border px-3 py-2" />
              <input value={editForm.image} onChange={(e) => setEditForm(prev => ({ ...prev, image: e.target.value }))} placeholder="Image URL" className="rounded border px-3 py-2 sm:col-span-2" />
              {editForm.image && (
                <div className="sm:col-span-2">
                  <img src={editForm.image} alt="Preview" className="h-32 w-32 object-cover rounded border" />
                </div>
              )}
              <textarea value={editForm.description} onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Description" className="sm:col-span-2 rounded border px-3 py-2" />
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={saveEditProduct} className="flex-1 rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600">Save</button>
              <button onClick={cancelEditProduct} className="flex-1 rounded-lg bg-gray-500 px-4 py-2 font-semibold text-white hover:bg-gray-600">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Products List */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Products ({products.length})</h2>
        <div className="mt-4 grid gap-3">
          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-600">No products yet. Add one above.</p>
          ) : (
            products.map((p) => (
              <div key={p._id} className="flex items-start justify-between rounded-lg border p-4 hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex gap-3">
                    {p.image && <img src={p.image} alt={p.name} className="h-16 w-16 object-cover rounded" />}
                    <div>
                      <h3 className="font-semibold">{p.name}</h3>
                      <p className="text-sm text-gray-600">R{parseFloat(p.price).toFixed(2)} | {p.category} | Stock: {p.stock}</p>
                      <p className="text-xs text-gray-500 mt-1">{p.description?.substring(0, 50)}...</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-2">
                  <button onClick={() => startEditProduct(p)} className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-600">Edit</button>
                  <button onClick={() => deleteProduct(p._id)} className="rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
