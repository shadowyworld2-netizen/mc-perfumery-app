import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getCart, setCart } from "../lib/cart";

export default function CartPage() {
  const [cart, setCartState] = useState([]);

  useEffect(() => {
    setCartState(getCart());
  }, []);

  const total = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);

  const updateQty = (id, value) => {
    const updated = cart.map((item) => item.id === id ? { ...item, quantity: Math.max(1, value) } : item);
    setCart(updated);
    setCartState(updated);
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    setCartState(updated);
  };

  if (!cart.length) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-gray-600">Add your favorite perfume to begin checkout.</p>
        <Link href="/products"><a className="mt-4 inline-block rounded-lg bg-gold px-5 py-2 font-semibold">Return to Shop</a></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Shopping Cart</h1>
      <div className="mt-6 space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="grid grid-cols-1 items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-[auto_1fr_auto]">
            <div className="relative h-24 w-24 overflow-hidden rounded-lg">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-lg font-semibold">{item.name}</p>
              <p className="text-sm text-gray-600">R{item.price.toFixed(2)} each</p>
              <div className="mt-2 flex items-center gap-2">
                <input type="number" min="1" value={item.quantity} onChange={(e) => updateQty(item.id, Number(e.target.value))} className="w-20 rounded border px-2 py-1" />
                <button onClick={() => removeItem(item.id)} className="text-sm text-red-600">Remove</button>
              </div>
            </div>
            <div className="text-right font-semibold">R{(item.price * item.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-col items-end gap-3 text-right">
        <p className="text-xl font-semibold">Total: R{total.toFixed(2)}</p>
        <Link href="/checkout"><a className="rounded-lg bg-brand-black px-6 py-2 text-white">Proceed to Checkout</a></Link>
      </div>
    </div>
  );
}
