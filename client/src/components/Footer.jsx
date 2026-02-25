import { Facebook, Instagram, Music2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-12 bg-neutral-900 text-neutral-200">
      <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-orange-200 to-transparent" />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-primary-500 text-white grid place-items-center font-bold">K</div>
              <div>
                <p className="text-lg font-semibold text-white">Khaja Express</p>
                <p className="text-xs text-orange-300">Multi-Vendor</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-neutral-400">Freshly cooked meals delivered fast with COD convenience.</p>
            <div className="mt-4 flex gap-3">
              <Facebook className="h-5 w-5" />
              <Instagram className="h-5 w-5" />
              <Music2 className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-neutral-400">
              <li>About</li>
              <li>Careers</li>
              <li>Contact</li>
              <li>Become a Vendor</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Support</p>
            <ul className="mt-3 space-y-2 text-sm text-neutral-400">
              <li>Help Center</li>
              <li>Support Tickets</li>
              <li>Refund Policy</li>
              <li>Terms & Privacy</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Get in touch</p>
            <ul className="mt-3 space-y-2 text-sm text-neutral-400">
              <li>Kathmandu, Nepal</li>
              <li>+977 9800000000</li>
              <li>support@khajaexpress.local</li>
              <li>10:00 AM - 10:00 PM</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-neutral-800 pt-4 text-xs text-neutral-400 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span>? 2026 Khaja Express. All rights reserved.</span>
          <span>COD only. Freshly delivered.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
