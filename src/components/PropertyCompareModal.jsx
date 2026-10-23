import React from 'react';
import { X, Check, Minus, Building2, Bed, Bath, Maximize2, DollarSign, MapPin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getGoogleMapsUrl } from '../utils/mapUtils';

export default function PropertyCompareModal({ properties, isOpen, onClose }) {
  if (!isOpen || !properties || properties.length === 0) return null;

  const allAmenities = [
    'Swimming Pool', 'Central AC', 'Private Balcony', 'Garage Parking',
    'Fitness Center', 'Pet Friendly', 'Ocean View', 'Garden / Patio',
    'Smart Home System', '24/7 Security'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">
            Side-by-Side Analysis
          </span>
          <h3 className="font-serif text-2xl font-normal text-stone-950 mt-1">
            Compare Selected Residences
          </h3>
          <p className="text-xs text-stone-500 font-light">
            Evaluating architectural specifications, dimensions, amenities, and price efficiency
          </p>
        </div>

        {/* Table Comparison Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="p-3 bg-stone-50 font-medium text-stone-700 w-44 rounded-tl-xl text-xs uppercase tracking-wider">
                  Property
                </th>
                {properties.map((p) => (
                  <th key={p.id} className="p-3 min-w-[180px] bg-stone-50 font-medium text-stone-900">
                    <img
                      src={p.featured_image}
                      alt={p.title}
                      className="w-full h-24 object-cover rounded-lg mb-2"
                    />
                    <Link to={`/properties/${p.id}`} className="hover:text-stone-600 line-clamp-1 font-serif">
                      {p.title}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {/* Price */}
              <tr>
                <td className="p-3 font-medium text-stone-600 bg-stone-50/50 text-xs">Price</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-3 font-serif font-normal text-stone-950 text-base">
                    {p.price_formatted}
                  </td>
                ))}
              </tr>

              {/* Price per SqFt */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Price / SqFt</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-3 font-medium text-slate-700">
                    ₹{p.price_per_sqft ? Number(p.price_per_sqft).toLocaleString('en-IN') : '-'}/sqft
                  </td>
                ))}
              </tr>

              {/* Type & Status */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Type & Status</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-3 font-medium text-slate-700 capitalize">
                    {p.property_type} • {p.listing_status?.replace('_', ' ')}
                  </td>
                ))}
              </tr>

              {/* Location */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Location</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-3 text-slate-700">
                    <a
                      href={getGoogleMapsUrl(p)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open location on Google Maps"
                      className="inline-flex items-center gap-1 hover:text-amber-800 hover:underline underline-offset-2 transition-colors text-xs font-normal group/loc"
                    >
                      <MapPin className="w-3 h-3 text-stone-400 group-hover/loc:text-amber-700 shrink-0 transition-colors" />
                      <span>{p.city}, {p.state}</span>
                      <ExternalLink className="w-2.5 h-2.5 text-stone-400 opacity-60 group-hover/loc:opacity-100" />
                    </a>
                  </td>
                ))}
              </tr>

              {/* Beds & Baths */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Beds & Baths</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-3 text-slate-700 font-medium">
                    {p.bedrooms} Beds / {p.bathrooms} Baths
                  </td>
                ))}
              </tr>

              {/* Area */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Living Area</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-3 text-slate-700 font-medium">
                    {p.area_sqft?.toLocaleString()} sqft
                  </td>
                ))}
              </tr>

              {/* Amenities Breakdown */}
              {allAmenities.map((amenity) => (
                <tr key={amenity}>
                  <td className="p-3 text-xs font-medium text-slate-500 bg-slate-50/50">
                    {amenity}
                  </td>
                  {properties.map((p) => {
                    const hasAmenity = p.amenities?.includes(amenity);
                    return (
                      <td key={p.id} className="p-3 text-center">
                        {hasAmenity ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                            <Minus className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
