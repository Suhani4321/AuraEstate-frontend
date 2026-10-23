import React from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize2, MapPin, Heart, Sparkles, ExternalLink } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { getGoogleMapsUrl } from '../utils/mapUtils';

export default function PropertyCard({ property, layout = 'grid' }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(property.id);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'for_sale':
        return { label: 'For Sale', bg: 'bg-stone-900/90 text-stone-100 border border-white/10' };
      case 'for_rent':
        return { label: 'For Rent', bg: 'bg-white/90 text-stone-900 border border-stone-200/80 shadow-xs' };
      case 'pending':
        return { label: 'Pending', bg: 'bg-amber-800/90 text-amber-100 border border-amber-700/50' };
      case 'sold':
        return { label: 'Sold', bg: 'bg-stone-700/90 text-stone-200 border border-stone-600/50' };
      default:
        return { label: status, bg: 'bg-stone-800/90 text-stone-100 border border-stone-700/50' };
    }
  };

  const statusBadge = getStatusBadge(property.listing_status);

  if (layout === 'list') {
    return (
      <div className="group bg-white rounded-xl border border-stone-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:border-stone-300 transition-all duration-300 overflow-hidden flex flex-col md:flex-row">
        {/* Image Container */}
        <div className="relative md:w-80 h-56 md:h-auto shrink-0 overflow-hidden bg-stone-100">
          <img
            src={property.featured_image}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-60" />
          
          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
            <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-[0.16em] font-medium backdrop-blur-md ${statusBadge.bg}`}>
              {statusBadge.label}
            </span>
            {property.is_featured && (
              <span className="px-2.5 py-1 rounded-md text-[10px] uppercase tracking-[0.16em] font-medium bg-amber-100/90 text-amber-950 border border-amber-300/40 backdrop-blur-md flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-600" /> Featured
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(property);
            }}
            className={`absolute top-3 right-3 w-8.5 h-8.5 rounded-full backdrop-blur-md flex items-center justify-center border shadow-xs transition-all active:scale-90 ${
              favorited
                ? 'bg-white text-rose-500 border-rose-200'
                : 'bg-white/85 hover:bg-white text-stone-700 hover:text-rose-600 border-white/60'
            }`}
            aria-label="Save property"
          >
            <Heart className={`w-3.5 h-3.5 transition-transform duration-150 ${favorited ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
          </button>

          {/* Bottom Property Type */}
          <div className="absolute bottom-3 left-3">
            <span className="px-2.5 py-0.5 rounded text-[10px] uppercase tracking-[0.16em] font-medium bg-stone-900/70 text-stone-200 backdrop-blur-md">
              {property.property_type}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-2xl font-normal text-stone-950 tracking-tight">
                    {property.price_formatted}
                  </span>
                  {property.price_per_sqft > 0 && (
                    <span className="text-xs text-stone-400 font-light">
                      (₹{property.price_per_sqft?.toLocaleString()}/sqft)
                    </span>
                  )}
                </div>
                <h3 className="text-base font-medium text-stone-900 group-hover:text-stone-600 transition-colors mt-1 line-clamp-1">
                  <Link to={`/properties/${property.id}`}>
                    {property.title}
                  </Link>
                </h3>
              </div>
            </div>

            <a
              href={getGoogleMapsUrl(property)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="Open exact location on Google Maps"
              className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-950 transition-colors mt-2 line-clamp-1 font-light group/loc z-10 relative"
            >
              <MapPin className="w-3.5 h-3.5 text-stone-400 group-hover/loc:text-amber-700 shrink-0 transition-colors" />
              <span className="hover:underline underline-offset-2 decoration-stone-400 truncate">
                {property.address}, {property.city}, {property.state} {property.zip_code}
              </span>
              <ExternalLink className="w-3 h-3 text-stone-400 opacity-0 group-hover/loc:opacity-100 shrink-0 transition-opacity" />
            </a>

            {/* Amenities preview */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {property.amenities.slice(0, 3).map((amenity, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 rounded text-[11px] font-normal bg-stone-100 text-stone-600">
                    {amenity}
                  </span>
                ))}
                {property.amenities.length > 3 && (
                  <span className="px-1.5 py-0.5 rounded text-[11px] text-stone-400">
                    +{property.amenities.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Specs Footer */}
          <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-4 sm:gap-6 text-xs text-stone-600 font-light">
              <div className="flex items-center gap-1.5">
                <Bed className="w-3.5 h-3.5 text-stone-400" />
                <span>{property.bedrooms} <span className="hidden sm:inline text-stone-400">Beds</span></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bath className="w-3.5 h-3.5 text-stone-400" />
                <span>{property.bathrooms} <span className="hidden sm:inline text-stone-400">Baths</span></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-stone-400" />
                <span>{property.area_sqft.toLocaleString()} <span className="hidden sm:inline text-stone-400">sqft</span></span>
              </div>
            </div>

            <Link
              to={`/properties/${property.id}`}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-[0.14em] bg-stone-100 text-stone-800 hover:bg-stone-900 hover:text-white transition-all"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Grid layout (Default)
  return (
    <div className="group bg-white rounded-xl border border-stone-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:border-stone-300 hover:-translate-y-0.5 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <img
          src={property.featured_image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-60" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-[0.16em] font-medium backdrop-blur-md ${statusBadge.bg}`}>
            {statusBadge.label}
          </span>
          {property.is_featured && (
            <span className="px-2.5 py-1 rounded-md text-[10px] uppercase tracking-[0.16em] font-medium bg-amber-100/90 text-amber-950 border border-amber-300/40 backdrop-blur-md flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-600" /> Featured
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(property);
          }}
          className={`absolute top-3 right-3 w-8.5 h-8.5 rounded-full backdrop-blur-md flex items-center justify-center border shadow-xs transition-all active:scale-90 ${
            favorited
              ? 'bg-white text-rose-500 border-rose-200'
              : 'bg-white/85 hover:bg-white text-stone-700 hover:text-rose-600 border-white/60'
          }`}
          aria-label="Save property"
        >
          <Heart className={`w-3.5 h-3.5 transition-transform duration-150 ${favorited ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
        </button>

        {/* Property Type Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-0.5 rounded text-[10px] uppercase tracking-[0.16em] font-medium bg-stone-900/70 text-stone-200 backdrop-blur-md">
            {property.property_type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price */}
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-2xl font-normal text-stone-950 tracking-tight">
              {property.price_formatted}
            </span>
            {property.price_per_sqft > 0 && (
              <span className="text-[11px] font-light text-stone-400">
                ₹{property.price_per_sqft?.toLocaleString()}/sqft
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-medium text-stone-900 group-hover:text-stone-600 transition-colors mt-1.5 line-clamp-1">
            <Link to={`/properties/${property.id}`}>
              {property.title}
            </Link>
          </h3>

          {/* Address */}
          <a
            href={getGoogleMapsUrl(property)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Open exact location on Google Maps"
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-950 transition-colors mt-1 line-clamp-1 font-light group/loc z-10 relative"
          >
            <MapPin className="w-3 h-3 text-stone-400 group-hover/loc:text-amber-700 shrink-0 transition-colors" />
            <span className="hover:underline underline-offset-2 decoration-stone-400 truncate">
              {property.address}, {property.city}, {property.state}
            </span>
            <ExternalLink className="w-2.5 h-2.5 text-stone-400 opacity-0 group-hover/loc:opacity-100 shrink-0 transition-opacity" />
          </a>
        </div>

        {/* Specs Footer */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600 font-light">
          <div className="flex items-center gap-1">
            <Bed className="w-3.5 h-3.5 text-stone-400" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <span className="text-stone-300">•</span>
          <div className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5 text-stone-400" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <span className="text-stone-300">•</span>
          <div className="flex items-center gap-1">
            <Maximize2 className="w-3.5 h-3.5 text-stone-400" />
            <span>{property.area_sqft.toLocaleString()} sqft</span>
          </div>
        </div>
      </div>
    </div>
  );
}
