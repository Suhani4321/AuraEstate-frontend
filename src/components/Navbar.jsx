import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Building2, 
  Heart, 
  Search, 
  Menu, 
  X
} from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { favorites } = useFavorites();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'All Properties', path: '/properties' },
  ];

  const isActive = (path) => {
    if (path.includes('?')) {
      return location.pathname + location.search === path;
    }
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#fbfbf9]/92 backdrop-blur-md border-b border-stone-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-9 h-9 rounded-lg bg-stone-900 flex items-center justify-center text-stone-100 transition-transform duration-300 group-hover:scale-95 shadow-xs">
              <Building2 className="w-4 h-4 stroke-[1.6]" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg tracking-[0.14em] font-medium text-stone-950 uppercase leading-none">
                Aura<span className="font-sans font-light tracking-[0.18em] text-xs text-stone-500 ml-1.5">Estate</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-stone-400 font-medium mt-1">
                Private Residences
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
                    active
                      ? 'text-stone-950 after:content-[\'\'] after:absolute after:bottom-0 after:left-4 after:right-4 after:h-[2px] after:bg-stone-950'
                      : 'text-stone-500 hover:text-stone-950'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-3">
            {/* Saved / Favorites Button */}
            <Link
              to="/favorites"
              className="relative px-3.5 py-2 rounded-full border border-stone-200/90 text-stone-700 hover:text-stone-950 hover:border-stone-400 bg-white/70 transition-all flex items-center gap-2 text-xs font-medium tracking-wide shadow-xs"
              title="Saved Properties"
            >
              <Heart className={`w-3.5 h-3.5 transition-colors ${favorites.length > 0 ? 'text-stone-900 fill-stone-900' : 'text-stone-400'}`} />
              <span className="text-xs font-medium tracking-wider uppercase hidden sm:inline">Saved</span>
              {favorites.length > 0 && (
                <span className="min-w-4.5 h-4.5 px-1 rounded-full bg-stone-900 text-stone-50 text-[10px] font-semibold flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-700 hover:text-stone-950 hover:bg-stone-100 focus:outline-none lg:hidden border border-stone-200"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-[#fbfbf9] px-4 pt-4 pb-6 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-lg text-xs uppercase tracking-[0.16em] font-medium transition-colors ${
                  active ? 'bg-stone-200/60 text-stone-950 font-bold' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-950'
                }`}
              >
                <span>{link.name}</span>
              </Link>
            );
          })}
          <div className="pt-3 border-t border-stone-200/70 flex flex-col gap-2">
            <Link
              to="/favorites"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-lg text-xs uppercase tracking-[0.16em] font-medium text-stone-700 hover:bg-stone-100"
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-stone-900" />
                <span>Saved Favorites</span>
              </div>
              <span className="font-semibold text-xs text-stone-500">
                {favorites.length}
              </span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
