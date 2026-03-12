import { Link } from "react-router-dom";
import { useState } from "react";
import { ChevronDown, Trash2 } from "lucide-react";
import { useCart } from "../features/cart/CartProvider";
import EmptyState from "../components/EmptyState";

const CartPage = () => {
  const { cart, updateQty, removeItem, subtotal, updatePreferences } = useCart();
  const [openItems, setOpenItems] = useState({});

  if (cart.items.length === 0) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-10">
        <EmptyState
          title="Your cart is empty"
          subtitle="Add meals from a restaurant to get started."
          action={
            <Link to="/vendors" className="rounded-full bg-primary-500 px-4 py-2 text-xs font-semibold text-white">
              Browse Restaurants
            </Link>
          }
        />
      </section>
    );
  }

  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl text-ink">Your Cart</h2>
            <p className="text-sm text-gray-500">Review items and customize taste before checkout.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-4">
            {cart.items.map((item) => {
              const isOpen = openItems[item.menuItemId];
              return (
                <div key={item.menuItemId} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 overflow-hidden rounded-xl bg-slate-100">
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">{item.name}</p>
                        <p className="text-xs text-gray-500">Rs {item.price}</p>
                        {item.selectedVariant?.name && (
                          <p className="text-[11px] text-gray-500">Variant: {item.selectedVariant.name}</p>
                        )}
                        {item.selectedAddons?.length > 0 && (
                          <p className="text-[11px] text-gray-500">
                            Addons: {item.selectedAddons.map((a) => a.name).join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 rounded-full border border-orange-100 px-2 py-1 text-xs">
                        <button
                          onClick={() => updateQty(item.menuItemId, item.qty - 1)}
                          className="h-6 w-6 rounded-full border border-orange-200 text-sm"
                        >
                          -
                        </button>
                        <span className="min-w-[20px] text-center">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.menuItemId, item.qty + 1)}
                          className="h-6 w-6 rounded-full border border-orange-200 text-sm"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.menuItemId)}
                        className="grid h-8 w-8 place-items-center rounded-full border border-orange-100 text-orange-600"
                        title="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setOpenItems((prev) => ({ ...prev, [item.menuItemId]: !prev[item.menuItemId] }))
                    }
                    className="mt-4 flex w-full items-center justify-between rounded-xl border border-orange-100 px-3 py-2 text-xs font-semibold text-orange-700"
                  >
                    Customize taste
                    <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isOpen && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-500">Food Taste</p>
                        <div className="mt-2 grid gap-2 md:grid-cols-3">
                          <select
                            value={item.tastePreferences?.spiceLevel || "Normal"}
                            onChange={(e) =>
                              updatePreferences(item.menuItemId, {
                                ...item.tastePreferences,
                                spiceLevel: e.target.value
                              })
                            }
                            className="rounded-2xl border border-orange-100 px-3 py-2 text-xs"
                          >
                            {["No", "Medium", "Hot", "Normal"].map((val) => (
                              <option key={val} value={val}>
                                🌶 Spice: {val}
                              </option>
                            ))}
                          </select>
                          <select
                            value={item.tastePreferences?.saltLevel || "Normal"}
                            onChange={(e) =>
                              updatePreferences(item.menuItemId, {
                                ...item.tastePreferences,
                                saltLevel: e.target.value
                              })
                            }
                            className="rounded-2xl border border-orange-100 px-3 py-2 text-xs"
                          >
                            {["Less", "Normal", "Extra"].map((val) => (
                              <option key={val} value={val}>
                                🧂 Salt: {val}
                              </option>
                            ))}
                          </select>
                          <select
                            value={item.tastePreferences?.sweetLevel || "Normal"}
                            onChange={(e) =>
                              updatePreferences(item.menuItemId, {
                                ...item.tastePreferences,
                                sweetLevel: e.target.value
                              })
                            }
                            className="rounded-2xl border border-orange-100 px-3 py-2 text-xs"
                          >
                            {["Less", "Normal", "Extra"].map((val) => (
                              <option key={val} value={val}>
                                🍬 Sweet: {val}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-500">Drink Options</p>
                        <div className="mt-2 grid gap-2 md:grid-cols-3">
                          <select
                            value={item.tastePreferences?.drinkSugar || "Normal"}
                            onChange={(e) =>
                              updatePreferences(item.menuItemId, {
                                ...item.tastePreferences,
                                drinkSugar: e.target.value
                              })
                            }
                            className="rounded-2xl border border-orange-100 px-3 py-2 text-xs"
                          >
                            {["0", "Less", "Normal", "Extra"].map((val) => (
                              <option key={val} value={val}>
                                Sugar: {val}
                              </option>
                            ))}
                          </select>
                          <select
                            value={item.tastePreferences?.drinkMilk || "Normal"}
                            onChange={(e) =>
                              updatePreferences(item.menuItemId, {
                                ...item.tastePreferences,
                                drinkMilk: e.target.value
                              })
                            }
                            className="rounded-2xl border border-orange-100 px-3 py-2 text-xs"
                          >
                            {["Less", "Normal", "Extra"].map((val) => (
                              <option key={val} value={val}>
                                Milk: {val}
                              </option>
                            ))}
                          </select>
                          <select
                            value={item.tastePreferences?.drinkStrength || "Normal"}
                            onChange={(e) =>
                              updatePreferences(item.menuItemId, {
                                ...item.tastePreferences,
                                drinkStrength: e.target.value
                              })
                            }
                            className="rounded-2xl border border-orange-100 px-3 py-2 text-xs"
                          >
                            {["Light", "Normal", "Strong"].map((val) => (
                              <option key={val} value={val}>
                                Strength: {val}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-500">Remarks</p>
                        <textarea
                          value={item.tastePreferences?.remarks || ""}
                          onChange={(e) =>
                            updatePreferences(item.menuItemId, {
                              ...item.tastePreferences,
                              remarks: e.target.value
                            })
                          }
                          placeholder="Any instructions? e.g., less oil, no onion"
                          className="mt-2 w-full rounded-2xl border border-orange-100 px-3 py-2 text-xs"
                        />
                      </div>
                      <p className="text-[11px] text-gray-400">Saved with this item for vendor instructions.</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h3 className="text-lg font-semibold text-ink">Order Summary</h3>
            <div className="mt-4 space-y-3 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>Rs {subtotal}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Payment</span>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold text-orange-600">COD</span>
              </div>
              <div className="border-t border-slate-100 pt-3 text-base font-semibold text-ink flex items-center justify-between">
                <span>Total</span>
                <span>Rs {subtotal}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="mt-5 flex w-full items-center justify-center rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white"
            >
              Checkout (COD)
            </Link>
            <p className="mt-3 text-center text-xs text-gray-400">You can review address at checkout.</p>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
