import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import VendorCard from "../components/VendorCard";
import SectionHeading from "../components/SectionHeading";
import SkeletonCard from "../components/SkeletonCard";

const Vendors = () => {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");

  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ["vendors", { search, city }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (city) params.append("city", city);
      return (await api.get(`/api/vendors/public?${params.toString()}`)).data.data;
    }
  });

  return (
    <section className="bg-slate-50">
      <div className="bg-gradient-to-br from-orange-50 via-amber-50/40 to-white">
        <div className="mx-auto max-w-6xl px-4 pb-8 pt-10">
          <SectionHeading title="Restaurants" subtitle="Pick your favorite spot and order COD." />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-12">
        <div className="rounded-3xl border border-orange-100/60 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="lg:col-span-2">
              <label className="text-xs font-semibold text-gray-500">Search</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Restaurant name"
                className="mt-2 h-11 w-full rounded-2xl border border-orange-100 px-4 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">City</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="mt-2 h-11 w-full rounded-2xl border border-orange-100 px-4 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          {!isLoading && vendors.length === 0 && (
            <div className="rounded-3xl border border-orange-100/60 bg-white p-10 text-center text-sm text-gray-500 md:col-span-2 lg:col-span-3">
              No restaurants found for your filters.
            </div>
          )}
          {vendors.map((vendor) => (
            <VendorCard key={vendor._id} vendor={vendor} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Vendors;
