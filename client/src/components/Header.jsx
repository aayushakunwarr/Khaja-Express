import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, LogOut, LayoutDashboard, Bell } from "lucide-react";
import { useAuth } from "../app/AuthProvider";
import { useState } from "react";
import { useCart } from "../features/cart/CartProvider";

const Header = () => {
  const { user, logout, notifications, clearNotifications } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const onLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-orange-100/60 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-2xl bg-primary-500 text-white grid place-items-center text-lg font-bold">
            K
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">Khaja Express</p>
            <p className="text-xs text-orange-400">Fresh food, fast smiles.</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <NavLink to="/vendors" className="hover:text-primary-600">Restaurants</NavLink>
          {user?.role !== "ADMIN" && (
            <NavLink to="/vendor-signup" className="hover:text-primary-600">Become a Vendor</NavLink>
          )}
          {user?.role === "CUSTOMER" && (
            <NavLink to="/account" className="hover:text-primary-600">My Account</NavLink>
          )}
          {user?.role === "VENDOR" && (
            <NavLink to="/vendor" className="hover:text-primary-600">Vendor Panel</NavLink>
          )}
          {user?.role === "ADMIN" && (
            <NavLink to="/admin" className="hover:text-primary-600">Admin</NavLink>
          )}
        </nav>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="grid h-10 w-10 place-items-center rounded-full bg-orange-100 text-primary-600"
            >
              <Bell className="h-5 w-5" />
            </button>
            {notifications.length > 0 && (
              <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-primary-500 text-[10px] font-semibold text-white grid place-items-center">
                {notifications.length}
              </span>
            )}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white p-3 shadow-card">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-ink">Notifications</p>
                  <button onClick={clearNotifications} className="text-[10px] text-gray-500">Clear</button>
                </div>
                <div className="mt-2 space-y-2 text-xs text-gray-600">
                  {notifications.slice(0, 5).map((note) => (
                    <div key={note.id} className="rounded-xl bg-orange-50 px-2 py-1">
                      {note.message}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {user ? (
            <>
              {user.role !== "CUSTOMER" && (
                <Link
                  to={user.role === "ADMIN" ? "/admin" : "/vendor"}
                  className="hidden items-center gap-2 rounded-full border border-orange-200 px-3 py-1 text-xs font-semibold text-orange-700 md:flex"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              )}
              <button
                onClick={onLogout}
                className="rounded-full border border-orange-200 px-3 py-2 text-xs font-semibold text-orange-700 hover:bg-orange-50"
              >
                <span className="hidden md:inline">Logout</span>
                <LogOut className="h-4 w-4 md:hidden" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="hidden rounded-full border border-orange-200 px-4 py-2 text-xs font-semibold text-orange-700 md:inline-flex"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="rounded-full bg-primary-500 px-4 py-2 text-xs font-semibold text-white shadow-glow"
              >
                Login
              </Link>
            </>
          )}
          <Link to="/cart" className="relative">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-orange-100 text-primary-600">
              <ShoppingBag className="h-5 w-5" />
            </div>
            {cart.items.length > 0 && (
              <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-primary-500 text-[10px] font-semibold text-white grid place-items-center">
                {cart.items.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
