import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Star, Clock, ShieldCheck, Bell, RotateCcw, UtensilsCrossed } from "lucide-react";
import api from "../lib/api";

const Hero = ({ banners, vendors }) => {
  const [active, setActive] = useState(0);
  const slides = useMemo(
    () => {
      if (banners.length > 0) {
        return banners.slice(0, 7).map((banner) => ({
          title: banner.title || "Khaja Express",
          restaurant: banner.title || "Featured",
          rating: null,
          eta: null,
          image: banner.imageUrl,
          linkUrl: banner.linkUrl
        }));
      }
      if (vendors.length > 0) {
        return vendors.slice(0, 7).map((vendor) => ({
          title: "Featured Restaurant",
          restaurant: vendor.restaurantName,
          rating: vendor.rating || 4.5,
          eta: vendor.openingHours || "Open now",
          image: vendor.coverImageUrl || "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
          linkUrl: `/vendors/${vendor.slug}`
        }));
      }
      return [];
    },
    [banners, vendors]
  );

  const activeSlide = slides[active];

  return (
    <section className="hero-glow">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <span className="rounded-full bg-orange-100 px-4 py-2 text-xs font-semibold text-orange-600">
              Fast delivery • Freshly prepared
            </span>
            <h1 className="font-display text-4xl leading-tight text-ink md:text-5xl">
              Khaja Express brings the city's best food to your door
            </h1>
            <p className="text-gray-500">
              Discover verified restaurants, real-time order updates, and flavors worth sharing.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/vendors"
                className="rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-glow"
              >
                Explore Restaurants
              </Link>
              <Link
                to="/vendor-signup"
                className="rounded-full border border-orange-200 px-6 py-3 text-sm font-semibold text-orange-700"
              >
                Become a Vendor
              </Link>
            </div>
            <div className="grid gap-3 text-sm text-gray-600 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-orange-500" />
                Verified Restaurants
              </div>
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-orange-500" />
                Real-time Order Updates
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-orange-500" />
                Easy Refunds to Wallet
              </div>
            </div>
          </div>
          {activeSlide && (
            <div className="rounded-[28px] bg-white p-6 shadow-card">
              <div className="relative h-72 overflow-hidden rounded-3xl">
                <img src={activeSlide.image} alt={activeSlide.restaurant} className="h-full w-full object-cover" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-gray-400">{activeSlide.title}</p>
                  <p className="text-lg font-semibold text-ink">{activeSlide.restaurant}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                    {activeSlide.rating && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-orange-500" /> {activeSlide.rating}
                      </span>
                    )}
                    {activeSlide.eta && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {activeSlide.eta}
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  to={activeSlide.linkUrl || "/vendors"}
                  className="rounded-full bg-primary-500 px-4 py-2 text-xs font-semibold text-white"
                >
                  Order Now
                </Link>
              </div>
              <div className="mt-4 flex gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActive(idx)}
                    className={`h-2 w-8 rounded-full ${idx === active ? "bg-primary-500" : "bg-orange-200"}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const CategorySection = ({ categories }) => (
  <section className="mx-auto max-w-6xl px-4 py-16">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="font-display text-2xl text-ink">Popular Categories</h2>
        <p className="text-sm text-gray-500">Browse by your cravings.</p>
      </div>
      <Link to="/vendors" className="text-sm font-semibold text-primary-600">View all</Link>
    </div>
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      {categories.map((category) => (
        <div key={category._id} className="rounded-2xl border border-orange-100/60 bg-white p-4 shadow-sm">
          <img src={category.imageUrl} alt={category.name} className="h-32 w-full rounded-2xl object-cover" />
          <p className="mt-3 text-sm font-semibold text-ink">{category.name}</p>
        </div>
      ))}
    </div>
  </section>
);

const RestaurantGrid = ({ restaurants }) => (
  <section className="mx-auto max-w-6xl px-4 py-16">
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="font-display text-2xl text-ink">Top Restaurants</h2>
        <p className="text-sm text-gray-500">Handpicked favorites near you.</p>
      </div>
      <div className="flex items-center gap-3">
        <select className="h-10 rounded-xl border border-orange-100 px-3 text-sm">
          {"Popular,Rating,Fast Delivery".split(",").map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <Link to="/vendors" className="text-sm font-semibold text-primary-600">View all</Link>
      </div>
    </div>
    <div className="mt-6 grid gap-6 md:grid-cols-3">
      {restaurants.map((res) => (
        <div key={res._id} className="group rounded-2xl border border-orange-100/60 bg-white p-4 shadow-sm transition-transform hover:-translate-y-1">
          <div className="relative h-40 overflow-hidden rounded-2xl">
            <img
              src={res.coverImageUrl || "https://images.unsplash.com/photo-1504674900247-0877df9cc836"}
              alt={res.restaurantName}
              className="h-full w-full object-cover"
            />
            <span className="absolute left-3 top-3 rounded-full bg-emerald-50 px-3 py-1 text-[11px] text-emerald-600">
              {res.isOpenManualOverride && !res.busyMode ? "Open now" : "Closed"}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-base font-semibold text-ink">{res.restaurantName}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {res.cuisineTags?.map((tag) => (
                <span key={tag} className="rounded-full bg-orange-50 px-3 py-1 text-[11px] text-orange-600">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1"><Star className="h-3 w-3 text-orange-500" /> {res.rating || 4.5}</span>
              <span>Rs {res.deliveryFee} fee</span>
              <span>{res.openingHours}</span>
            </div>
            <Link to={`/vendors/${res.slug}`} className="mt-4 inline-flex rounded-full bg-primary-500 px-4 py-2 text-xs font-semibold text-white">
              View Menu
            </Link>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const HowItWorks = () => (
  <section className="mx-auto max-w-6xl px-4 py-16">
    <div className="rounded-3xl bg-orange-50/70 p-8">
      <h2 className="font-display text-2xl text-ink">How it works</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          { title: "Choose restaurant", icon: UtensilsCrossed, text: "Browse verified kitchens near you." },
          { title: "Customize & place order", icon: Star, text: "Pick variants, add-ons, and notes." },
          { title: "Track & enjoy", icon: Clock, text: "Real-time updates until delivery." }
        ].map((step) => (
          <div key={step.title} className="rounded-2xl bg-white p-5 shadow-sm">
            <step.icon className="h-5 w-5 text-orange-500" />
            <p className="mt-3 font-semibold text-ink">{step.title}</p>
            <p className="mt-2 text-sm text-gray-500">{step.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CTASection = () => (
  <section className="mx-auto max-w-6xl px-4 py-16">
    <div className="rounded-3xl border border-orange-100/60 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="font-display text-2xl text-ink">Get updates & exclusive offers</h3>
          <p className="text-sm text-gray-500">Be the first to know about new restaurants and deals.</p>
        </div>
        <div className="flex w-full max-w-md gap-2">
          <input
            placeholder="Email or phone"
            className="h-11 flex-1 rounded-xl border border-orange-100 px-3 text-sm"
          />
          <button className="rounded-full bg-primary-500 px-5 py-2 text-xs font-semibold text-white">Notify me</button>
        </div>
      </div>
    </div>
  </section>
);

const Home = () => {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories", "home"],
    queryFn: async () => (await api.get("/api/categories/public")).data.data
  });

  const { data: vendors = [] } = useQuery({
    queryKey: ["vendors", "home"],
    queryFn: async () => (await api.get("/api/vendors/public")).data.data
  });

  const { data: banners = [] } = useQuery({
    queryKey: ["banners", "home"],
    queryFn: async () => (await api.get("/api/banners/public")).data.data
  });

  return (
    <div>
      <Hero banners={banners} vendors={vendors} />
      <CategorySection categories={categories} />
      <RestaurantGrid restaurants={vendors} />
      <HowItWorks />
      <CTASection />
    </div>
  );
};

export default Home;
