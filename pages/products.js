import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { sampleProducts } from "../lib/seedData";

const categories = ["All", "Floral", "Woody", "Gourmand", "Fresh"];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/products");
        const json = await res.json();
        setProducts(json.products || sampleProducts);
      } catch (err) {
        setError("Failed to load products.");
        setProducts(sampleProducts);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) || product.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, activeCategory]);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mt-8 mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shop Perfumes</h1>
          <p className="mt-1 text-sm text-gray-600">Browse global scents by category and note.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button key={cat} className={`rounded-lg border px-3 py-1.5 text-sm ${activeCategory === cat ? "bg-brand-black text-white" : "bg-white text-gray-700"}`} onClick={() => setActiveCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-6 flex items-center gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search perfumes..." className="w-full rounded-lg border px-3 py-2" />
      </div>
      {loading ? <p className="py-10 text-center">Loading perfumes...</p> : error ? <p className="py-10 text-center text-red-600">{error}</p> : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.length ? filtered.map((product) => <ProductCard key={product._id || product.name} product={product} />) : <p className="col-span-full py-10 text-center text-gray-500">No matching perfumeries found.</p>}
        </div>
      )}
    </div>
  );
}
