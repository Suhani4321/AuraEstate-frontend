import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  Search, 
  IndianRupee, 
  Home, 
  MapPin, 
  Bed, 
  SlidersHorizontal,
  Check
} from 'lucide-react';

export default function FilterSidebar({
  filters,
  metadata,
  onFilterChange,
  onResetFilters,
  totalResults
}) {
  const propertyTypes = [
    { value: 'house', label: 'House / Villa' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'condo', label: 'Condo' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'penthouse', label: 'Penthouse' },
    { value: 'villa', label: 'Luxury Villa' },
  ];

  const bedroomOptions = ['Any', '1', '2', '3', '4', '5'];

  const togglePropertyType = (type) => {
    const current = filters.property_type ? filters.property_type.split(',').filter(Boolean) : [];
    const exists = current.includes(type);
    const updated = exists 
      ? current.filter(t => t !== type)
      : [...current, type];
    onFilterChange('property_type', updated.join(','));
  };

  const activeTypes = filters.property_type ? filters.property_type.split(',') : [];

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-stone-800" />
          <h2 className="font-serif text-base font-normal text-stone-950">Refine Portfolio</h2>
        </div>
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium text-stone-400 hover:text-stone-900 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Listing Purpose: Sale vs Rent */}
      <div className="space-y-2">
        <label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">
          Listing Purpose
        </label>
        <div className="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded-lg text-xs font-medium">
          {[
            { value: '', label: 'All' },
            { value: 'for_sale', label: 'For Sale' },
            { value: 'for_rent', label: 'For Rent' },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onFilterChange('listing_status', item.value)}
              className={`py-1.5 rounded-md transition-all text-center ${
                (filters.listing_status || '') === item.value
                  ? 'bg-white text-stone-950 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* City / Location */}
      <div className="space-y-2">
        <label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400 flex items-center gap-1.5">
          <MapPin className="w-3 h-3 text-stone-500" />
          Location (City)
        </label>
        <select
          value={filters.city || ''}
          onChange={(e) => onFilterChange('city', e.target.value)}
          className="w-full text-xs bg-stone-50/50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:border-stone-900 transition-colors"
        >
          <option value="">All Cities ({metadata?.total_properties || 'All'})</option>
          {metadata?.cities?.map((c) => (
            <option key={c.city} value={c.city}>
              {c.city} ({c.count})
            </option>
          ))}
        </select>
      </div>

      {/* Property Type */}
      <div className="space-y-2">
        <label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400 flex items-center gap-1.5">
          <Home className="w-3 h-3 text-stone-500" />
          Property Type
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {propertyTypes.map((type) => {
            const checked = activeTypes.includes(type.value);
            return (
              <label
                key={type.value}
                onClick={() => togglePropertyType(type.value)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  checked ? 'bg-stone-100 text-stone-950 font-semibold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <span>{type.label}</span>
                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                  checked ? 'bg-stone-900 border-stone-900 text-white' : 'border-stone-300 bg-white'
                }`}>
                  {checked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400 flex items-center gap-1.5">
          <IndianRupee className="w-3 h-3 text-stone-500" />
          Price Range (₹)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <input
              type="number"
              placeholder="Min Price (₹)"
              value={filters.min_price || ''}
              onChange={(e) => onFilterChange('min_price', e.target.value)}
              className="w-full text-xs bg-stone-50/50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:border-stone-900 transition-colors"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Max Price (₹)"
              value={filters.max_price || ''}
              onChange={(e) => onFilterChange('max_price', e.target.value)}
              className="w-full text-xs bg-stone-50/50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:border-stone-900 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Bedrooms */}
      <div className="space-y-2">
        <label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400 flex items-center gap-1.5">
          <Bed className="w-3 h-3 text-stone-500" />
          Bedrooms
        </label>
        <div className="flex gap-1">
          {bedroomOptions.map((opt) => {
            const val = opt === 'Any' ? '' : opt;
            const active = (filters.bedrooms || '') === val;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onFilterChange('bedrooms', val)}
                className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${
                  active
                    ? 'bg-stone-900 text-stone-50 font-semibold shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
