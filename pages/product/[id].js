import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { addToCart } from "../../lib/cart";

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Not found");
        setProduct(data.product);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAdd = () => {
    addToCart(product, qty);
    router.push("/cart");
  };

  if (loading) return <p className="p-10 text-center">Loading product...</p>;
  if (error) return <p className="p-10 text-center text-red-600">{error}</p>;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="relative h-96 w-full rounded-2xl overflow-hidden">
          <Image src={product.image} alt={product.name} layout="fill" objectFit="cover" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-wide text-gray-500">{product.category}</p>
          <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
          <p className="mt-3 text-xl font-semibold text-brand-black">${product.price.toFixed(2)}</p>
          <p className="mt-4 text-gray-700">{product.description}</p>
          <div className="mt-6 flex items-center gap-3">
            <input type="number" min="1" value={qty} onChange={(e) => setQty(Number(e.target.value))} className="w-24 rounded border p-2" />
            <button onClick={handleAdd} className="rounded-lg bg-gold px-5 py-2 font-semibold">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}
