export function addItemToCart(cart, product, quantity = 1) {
  const maxStock = product.stock ?? 0;
  if (maxStock <= 0) return cart;

  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    const nextQty = Math.min(maxStock, existing.quantity + quantity);
    return cart.map((item) =>
      item.id === product.id ? { ...item, quantity: nextQty } : item
    );
  }

  const initialQty = Math.min(maxStock, Math.max(1, quantity));
  return [...cart, { ...product, quantity: initialQty }];
}

export function updateItemQuantity(cart, productId, newQuantity) {
  if (newQuantity <= 0) {
    return removeItemFromCart(cart, productId);
  }

  return cart.map((item) => {
    if (item.id !== productId) return item;
    const maxStock = item.stock ?? newQuantity;
    const clampedQty = Math.min(maxStock, newQuantity);
    return { ...item, quantity: clampedQty };
  });
}

export function removeItemFromCart(cart, productId) {
  return cart.filter((item) => item.id !== productId);
}

export function calculateCartSummary(cart) {
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  return { cartCount, cartSubtotal };
}