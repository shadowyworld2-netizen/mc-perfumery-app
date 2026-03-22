import { useEffect, useState } from "react";

const adminAuthToken = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", category: "", description: "", image: "", stock: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const loadProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();
    setMessage("");
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || process.env.NEXT_PUBLIC_ADMIN_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json();
      setMessage(data.error || "Add product failed");
      return;
    }
    setForm({ name: "", price: "", category: "", description: "", image: "", stock: "" });
    setMessage("Product added");
    loadProducts();
  };

  const deleteProduct = async (id) => {
    await fetch(`/api/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token || process.env.NEXT_PUBLIC_ADMIN_TOKEN}` },
    });
    loadProducts();
  };

  if (loading) return <p className="p-8 text-center">Loading dashboard…</p>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button onClick={() => localStorage.setItem("adminToken", process.env.NEXT_PUBLIC_ADMIN_TOKEN)} className="rounded-lg bg-gold px-3 py-1 text-sm font-semibold">Set Admin Token</button>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Add a Product</h2>
        <form onSubmit={addProduct} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input required value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Name" className="rounded border px-3 py-2" />
          <input required type="number" value={form.price} onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))} placeholder="Price" className="rounded border px-3 py-2" />
          <input required value={form.category} onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))} placeholder="Category" className="rounded border px-3 py-2" />
          <input required value={form.stock} onChange={(e) => setForm(prev => ({ ...prev, stock: e.target.value }))} type="number" placeholder="Stock" className="rounded border px-3 py-2" />
          <input required value={form.image} onChange={(e) => setForm(prev => ({ ...prev, image: e.target.value }))} placeholder="Image URL" className="rounded border px-3 py-2 sm:col-span-2" />
          <textarea required value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Description" className="sm:col-span-2 rounded border px-3 py-2" />
          <button type="submit" className="sm:col-span-2 rounded-lg bg-brand-black px-4 py-2 text-white">Add Product</button>
        </form>
        {message && <p className="mt-3 text-sm text-green-700">{message}</p>}
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Products</h2>
        <div className="mt-4 grid gap-3">
          {products.map((p) => (
            <div key={p._id} className="flex items-center justify-between rounded-lg border p-3">
              <span className="font-medium">{p.name} - ${p.price.toFixed(2)}</span>
              <button onClick={ () => deleteProduct(p._id)} className="rounded-lg bg-red-500 px-3 py-1 text-white">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
