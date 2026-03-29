import { useEffect, useMemo, useState } from "react";
import { getCart, setCart } from "../lib/cart";

export default function Checkout() {
  const [cart, setCartState] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => { setCartState(getCart()); }, []);

  const total = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name || !address || !email) {
      setMessage("Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      const order = {
        customerName: name,
        customerEmail: email,
        address,
        total,
        items: cart,
      };

      const response = await fetch("/api/email-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessage(`Order placed, but email failed: ${result.error || result.message}`);
      } else {
        setMessage("Payment successful! Your order is confirmed and email sent.");
      }

      setCart([]);
      setCartState([]);
    } catch (err) {
      console.error("Checkout error:", err);
      setMessage("Checkout failed. Please try again later.");
    }

    setLoading(false);
  };

  if (!cart.length) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">No cart items available. Visit shop to add perfumes.</div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold">Billing information</h2>
          <div><label className="block text-sm font-medium">Full Name</label><input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" required /></div>
          <div><label className="block text-sm font-medium">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" required /></div>
          <div><label className="block text-sm font-medium">Address</label><textarea value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" required /></div>
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-gold px-4 py-2 font-semibold">{loading ? "Processing..." : "Confirm Purchase"}</button>
          {message && <p className="mt-2 text-center text-green-600">{message}</p>}
        </form>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold">Order summary</h2>
          <div className="mt-3 space-y-2">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} x{item.quantity}</span>
                <span>R{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-right text-xl font-bold">Total R{total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
