import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("cart") : "[]";
    const items = saved ? JSON.parse(saved) : [];
    setCartCount(items.reduce((acc, item) => acc + item.quantity, 0));
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur z-50 border-b border-slate-200">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <a className="text-xl font-bold text-brand-black">LOGO</a>
        </Link>
        <nav className="flex gap-3 text-sm">
          <Link href="/">Home</Link>
          <Link href="/products">Shop</Link>
          <Link href="/cart">Cart ({cartCount})</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
