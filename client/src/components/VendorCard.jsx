import { MapPin, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";

const VendorCard = ({ vendor }) => {
  const rating = vendor.rating || 4.5;
  const isOpen = vendor.isOpenManualOverride ?? true;
  const isBusy = vendor.busyMode ?? false;
  return (
    <Link to={`/vendors/${vendor.slug}`} className="group">
      <div className="overflow-hidden rounded-3xl border border-orange-100/60 bg-white shadow-sm transition-transform duration-300 group-hover:-translate-y-1">
        <div className="relative h-44 w-full overflow-hidden">
          <img
            src={vendor.coverImageUrl || "https://images.unsplash.com/photo-1504674900247-0877df9cc836"}
            alt={vendor.restaurantName}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute left-3 top-3 flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isOpen ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
              {isOpen ? "Open" : "Closed"}
            </span>
            {isBusy && (
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">Busy</span>
            )}
          </div>
          <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-orange-600">
            Rs {vendor.deliveryFee} delivery
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3">
            <img
              src={vendor.logoUrl || "https://images.unsplash.com/photo-1526367790999-0150786686a2"}
              alt={vendor.restaurantName}
              className="h-12 w-12 rounded-2xl object-cover"
            />
            <div className="flex-1">
              <p className="text-lg font-semibold text-ink">{vendor.restaurantName}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin className="h-3 w-3" />
                {vendor.city}
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
              <Star className="h-3 w-3" /> {rating}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {vendor.cuisineTags?.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-600">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-600">Min Rs {vendor.minOrder}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {vendor.openingHours}
            </span>
          </div>
          <div className="mt-5 flex items-center justify-end">
            <span className="rounded-full bg-primary-500 px-4 py-2 text-xs font-semibold text-white">View Menu</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VendorCard;
