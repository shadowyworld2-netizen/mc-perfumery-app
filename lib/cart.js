export const getCart = () => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("cart");
  return stored ? JSON.parse(stored) : [];
};

export const setCart = (cart) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const addToCart = (product, qty = 1) => {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id || item.id === product._id);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({
      id: product.id || product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: qty,
    });
  }
  setCart(cart);
  return cart;
};
