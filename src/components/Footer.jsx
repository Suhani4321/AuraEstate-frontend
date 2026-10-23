import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-400 border-t border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand & Project Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3.5 group">
              <div className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-200">
                <Building2 className="w-4 h-4 stroke-[1.6]" />
              </div>
              <span className="font-serif text-lg tracking-[0.14em] font-medium text-stone-100 uppercase">
                Aura<span className="font-sans font-light tracking-[0.18em] text-xs text-stone-400 ml-1.5">Estate</span>
              </span>
            </Link>
            <div className="flex items-center gap-2 text-[11px] text-stone-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
              <span>Verified Architectural Properties</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-300 mb-4">
              Explore Residences
            </h4>
            <ul className="space-y-2.5 text-xs font-light">
              <li>
                <Link to="/properties" className="hover:text-stone-100 transition-colors">
                  All Properties
                </Link>
              </li>
              <li>
                <Link to="/properties?status=for_sale" className="hover:text-stone-100 transition-colors">
                  Homes for Sale
                </Link>
              </li>
              <li>
                <Link to="/properties?status=for_rent" className="hover:text-stone-100 transition-colors">
                  Rental Properties
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-stone-100 transition-colors">
                  Saved Favorites
                </Link>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-300 mb-4">
              Metropolitan Centers
            </h4>
            <ul className="space-y-2.5 text-xs font-light">
              <li>
                <Link to="/properties?city=Mumbai" className="hover:text-stone-100 transition-colors">
                  Mumbai, Maharashtra
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Delhi NCR" className="hover:text-stone-100 transition-colors">
                  Delhi NCR & Gurugram
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Bengaluru" className="hover:text-stone-100 transition-colors">
                  Bengaluru, Karnataka
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Hyderabad" className="hover:text-stone-100 transition-colors">
                  Hyderabad, Telangana
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Goa" className="hover:text-stone-100 transition-colors">
                  Goa (North & South)
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Concierge */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-300 mb-4">
              Private Concierge
            </h4>
            <ul className="space-y-3 text-xs text-stone-400 font-light">
              <li className="flex items-center gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>Worli Mumbai & Golf Course Rd Gurugram</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>+91 (22) 6900-AURA</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>concierge@auraestate.in</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-14 pt-8 border-t border-stone-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 font-light">
          <p>© 2026 AuraEstate Portfolio. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Architectural Real Estate</span>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
