import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Home, 
  DollarSign, 
  ArrowRight,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { propertyService } from '../services/api';
import PropertyCard from '../components/PropertyCard';

export default function HomePage() {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quick Hero Search Form State
  const [searchStatus, setSearchStatus] = useState('for_sale');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceBudget, setPriceBudget] = useState('');

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        const [featured, meta] = await Promise.all([
          propertyService.getFeaturedProperties(),
          propertyService.getMetadata()
        ]);
        setFeaturedProperties(featured || []);
        setMetadata(meta);
      } catch (err) {
        console.error('Error fetching home page data', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchStatus) queryParams.set('status', searchStatus);
    if (location) queryParams.set('city', location);
    if (propertyType) queryParams.set('property_type', propertyType);
    if (priceBudget) queryParams.set('max_price', priceBudget);
    navigate(`/properties?${queryParams.toString()}`);
  };

  const topLocations = [
    { name: 'Mumbai', state: 'Maharashtra', count: 8, image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80' },
    { name: 'Delhi NCR', state: 'Delhi & Haryana', count: 6, image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80' },
    { name: 'Bengaluru', state: 'Karnataka', count: 6, image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80' },
    { name: 'Goa', state: 'Goa', count: 3, image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <div className="space-y-24 pb-24">
      
      {/* Hero Section */}
      <section className="relative min-h-[620px] lg:min-h-[700px] flex items-center justify-center overflow-hidden bg-stone-950 text-white">
        {/* Architectural Background Photography with Cinematic Tone */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Architecture"
            className="w-full h-full object-cover opacity-50 scale-102 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-stone-950/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 sm:pt-16 sm:pb-24 text-center">
          
          {/* Editorial Display Heading */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-stone-50 tracking-tight leading-[1.08] max-w-4xl mx-auto">
            Find Your <span className="italic font-normal text-amber-100 font-editorial">Perfect Property</span>
          </h1>

          {/* Unified Architectural Search Capsule */}
          <div className="mt-14 sm:mt-16 max-w-4xl mx-auto text-left">
            
            {/* Minimalist Tab Switcher */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex p-1 rounded-full bg-stone-900/70 backdrop-blur-md border border-white/15">
                <button
                  type="button"
                  onClick={() => setSearchStatus('for_sale')}
                  className={`px-5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.16em] transition-all ${
                    searchStatus === 'for_sale'
                      ? 'bg-stone-50 text-stone-950 shadow-xs'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  Buy
                </button>
                <button
                  type="button"
                  onClick={() => setSearchStatus('for_rent')}
                  className={`px-5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.16em] transition-all ${
                    searchStatus === 'for_rent'
                      ? 'bg-stone-50 text-stone-950 shadow-xs'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  Rent
                </button>
              </div>
            </div>

            {/* Segmented Search Bar */}
            <form 
              onSubmit={handleHeroSearch} 
              className="bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.22)] border border-stone-200/90 p-2 sm:p-2.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-0 lg:divide-x lg:divide-stone-200"
            >
              
              {/* Location */}
              <div className="relative px-3.5 py-2.5 sm:px-4">
                <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-stone-500" /> Location
                </label>
                <div className="relative">
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full appearance-none bg-transparent text-sm font-medium text-stone-900 focus:outline-none cursor-pointer pr-6 py-0.5"
                  >
                    <option value="">Any Major City</option>
                    {metadata?.cities?.map((c) => (
                      <option key={c.city} value={c.city}>
                        {c.city} ({c.count})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Property Type */}
              <div className="relative px-3.5 py-2.5 sm:px-4">
                <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400 mb-1 flex items-center gap-1.5">
                  <Home className="w-3 h-3 text-stone-500" /> Property Type
                </label>
                <div className="relative">
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full appearance-none bg-transparent text-sm font-medium text-stone-900 focus:outline-none cursor-pointer pr-6 py-0.5"
                  >
                    <option value="">All Categories</option>
                    <option value="villa">Luxury Villa</option>
                    <option value="penthouse">Sky Penthouse</option>
                    <option value="apartment">Luxury Apartment</option>
                    <option value="house">Bespoke Bungalow</option>
                    <option value="condo">Condominium</option>
                    <option value="townhouse">Townhouse</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Budget Limit */}
              <div className="relative px-3.5 py-2.5 sm:px-4">
                <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400 mb-1 flex items-center gap-1.5">
                  <DollarSign className="w-3 h-3 text-stone-500" /> Max Budget
                </label>
                <div className="relative">
                  <select
                    value={priceBudget}
                    onChange={(e) => setPriceBudget(e.target.value)}
                    className="w-full appearance-none bg-transparent text-sm font-medium text-stone-900 focus:outline-none cursor-pointer pr-6 py-0.5"
                  >
                    <option value="">No Limit</option>
                    {searchStatus === 'for_rent' ? (
                      <>
                        <option value="150000">Up to ₹1.5 Lakh / mo</option>
                        <option value="300000">Up to ₹3.0 Lakh / mo</option>
                        <option value="600000">Up to ₹6.0 Lakh / mo</option>
                      </>
                    ) : (
                      <>
                        <option value="50000000">Up to ₹5 Crore</option>
                        <option value="150000000">Up to ₹15 Crore</option>
                        <option value="350000000">Up to ₹35 Crore</option>
                      </>
                    )}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Submit Button */}
              <div className="p-1 sm:p-1.5 flex items-center">
                <button
                  type="submit"
                  className="w-full h-full min-h-[48px] bg-stone-900 hover:bg-black text-stone-50 font-medium text-xs uppercase tracking-[0.18em] rounded-xl px-5 flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.98]"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Find Homes</span>
                </button>
              </div>

            </form>
          </div>

        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-5 border-b border-stone-200/80">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-stone-950 tracking-tight">
              Featured Exclusive Listings
            </h2>
          </div>
          <Link
            to="/properties?featured=true"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-900 hover:text-stone-600 transition-colors group"
          >
            <span>View All Featured</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-stone-100 animate-pulse border border-stone-200/60" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.slice(0, 3).map((property) => (
              <PropertyCard key={property.id} property={property} layout="grid" />
            ))}
          </div>
        )}
      </section>

      {/* Popular Cities / Locations */}
      <section className="bg-[#f5f5f2] py-20 border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-500">
              Metropolitan Centers
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-stone-950 tracking-tight mt-1.5">
              Explore Popular Locations
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topLocations.map((loc) => (
              <Link
                key={loc.name}
                to={`/properties?city=${encodeURIComponent(loc.name)}`}
                className="group relative rounded-xl overflow-hidden aspect-[4/5] shadow-xs hover:shadow-xl transition-all duration-500 block border border-stone-300/40"
              >
                <img
                  src={loc.image}
                  alt={loc.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <h3 className="font-serif text-2xl font-normal">{loc.name}</h3>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-stone-300 font-medium mt-0.5">{loc.state}</p>
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-stone-200 group-hover:text-white">
                    <span>Explore Listings</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
