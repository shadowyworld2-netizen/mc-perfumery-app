import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-1">
      <div className="h-52 overflow-hidden rounded-lg bg-slate-100 relative">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="mt-4">
        <span className="text-xs uppercase tracking-widest text-gray-500">{product.category}</span>
        <h3 className="mt-1 text-lg font-semibold text-brand-black">{product.name}</h3>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-brand-black">R{product.price.toFixed(2)}</span>
          <Link href={`/product/${product._id || product.id}`}>
            <a className="rounded-lg bg-brand-gold px-3 py-1.5 text-sm font-medium text-black">Detail</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
