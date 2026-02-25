import { Outlet, Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useCart } from "../features/cart/CartProvider";

const Layout = () => {
  const { cart } = useCart();
  return (
    <div className="min-h-screen bg-swirl">
      <Header />
      <main className="min-h-[70vh]">
        <Outlet />
      </main>
      <Footer />
      {cart.items.length > 0 && (
        <Link
          to="/cart"
          className="fixed bottom-5 right-5 z-40 rounded-full bg-primary-500 px-5 py-3 text-sm font-semibold text-white shadow-glow md:hidden"
        >
          View Cart
        </Link>
      )}
    </div>
  );
};

export default Layout;
