import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../app/AuthProvider";

const CartContext = createContext(null);
const CART_KEY = "foodhub_cart";

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const cartKey = useMemo(
    () => `${CART_KEY}:${user?._id || "guest"}`,
    [user?._id]
  );

  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem(cartKey) || localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : { vendorId: null, items: [] };
  });

  useEffect(() => {
    const stored = localStorage.getItem(cartKey);
    setCart(stored ? JSON.parse(stored) : { vendorId: null, items: [] });
  }, [cartKey]);

  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart, cartKey]);

  const addItem = (item) => {
    setCart((prev) => {
      if (prev.vendorId && prev.vendorId !== item.vendorId) {
        toast("Cart cleared for a new restaurant");
        return { vendorId: item.vendorId, items: [{ ...item, qty: 1 }] };
      }
      const existing = prev.items.find((i) => i.menuItemId === item.menuItemId);
      if (existing) {
        return {
          vendorId: prev.vendorId || item.vendorId,
          items: prev.items.map((i) =>
            i.menuItemId === item.menuItemId ? { ...i, qty: i.qty + 1 } : i
          )
        };
      }
      return {
        vendorId: prev.vendorId || item.vendorId,
        items: [...prev.items, { ...item, qty: 1 }]
      };
    });
  };

  const updateQty = (menuItemId, qty) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items
        .map((i) => (i.menuItemId === menuItemId ? { ...i, qty } : i))
        .filter((i) => i.qty > 0)
    }));
  };

  const removeItem = (menuItemId) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.menuItemId !== menuItemId)
    }));
  };

  const updatePreferences = (menuItemId, tastePreferences) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.menuItemId === menuItemId ? { ...i, tastePreferences } : i
      )
    }));
  };

  const clearCart = () => setCart({ vendorId: null, items: [] });

  const reorder = (order) => {
    setCart({
      vendorId: order.vendorId,
      items: order.items.map((item) => ({
        menuItemId: item.menuItemId,
        name: item.nameSnapshot,
        price: item.priceSnapshot,
        qty: item.qty,
        tastePreferences: item.tastePreferences
      }))
    });
  };

  const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const value = useMemo(
    () => ({ cart, addItem, updateQty, removeItem, clearCart, subtotal, updatePreferences, reorder }),
    [cart, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
