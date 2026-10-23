import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  LayoutGrid, 
  List, 
  Search, 
  SlidersHorizontal, 
  X, 
  ChevronLeft, 
  ChevronRight,
  RotateCcw,
  AlertCircle,
  Building,
  Zap,
  ArrowUpDown,
  Loader2
} from 'lucide-react';
import { propertyService } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import FilterSidebar from '../components/FilterSidebar';

export default function PropertyListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [metrics, setMetrics] = useState(null);
  const [layout, setLayout] = useState('grid'); // 'grid' | 'list'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Read current filters from URL query parameters
  const currentFilters = {
    q: searchParams.get('q') || '',
    listing_status: searchParams.get('status') || '',
    property_type: searchParams.get('property_type') || '',
    city: searchParams.get('city') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    bathrooms: searchParams.get('bathrooms') || '',
    min_area: searchParams.get('min_area') || '',
    amenities: searchParams.get('amenities') || '',
    search_mode: searchParams.get('search_mode') || 'standard',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '1', 10),
  };

  // Local state for instant typing search input
  const [searchInput, setSearchInput] = useState(currentFilters.q);

  // Sync searchInput when URL query changes (e.g. back/forward navigation or reset)
  useEffect(() => {
    const urlQ = searchParams.get('q') || '';
    if (urlQ !== searchInput && document.activeElement?.getAttribute('name') !== 'search_query') {
      setSearchInput(urlQ);
    }
  }, [searchParams]);

  // Fetch metadata once on mount
  useEffect(() => {
    async function loadMeta() {
      try {
        const meta = await propertyService.getMetadata();
        setMetadata(meta);
      } catch (err) {
        console.error('Failed to load metadata', err);
      }
    }
    loadMeta();
  }, []);

  // Fetch properties whenever query parameters change
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (currentFilters.q) params.q = currentFilters.q;
      if (currentFilters.listing_status) params.listing_status = currentFilters.listing_status;
      if (currentFilters.property_type) params.property_type = currentFilters.property_type;
      if (currentFilters.city) params.city = currentFilters.city;
      if (currentFilters.min_price) params.min_price = currentFilters.min_price;
      if (currentFilters.max_price) params.max_price = currentFilters.max_price;
      if (currentFilters.bedrooms) params.bedrooms = currentFilters.bedrooms;
      if (currentFilters.bathrooms) params.bathrooms = currentFilters.bathrooms;
      if (currentFilters.min_area) params.min_area = currentFilters.min_area;
      if (currentFilters.amenities) params.amenities = currentFilters.amenities;
      if (currentFilters.search_mode) params.search_mode = currentFilters.search_mode;
      if (currentFilters.sort) params.sort = currentFilters.sort;
      if (currentFilters.page) params.page = currentFilters.page;

      const response = await propertyService.getProperties(params);
      setProperties(response.results);
      setTotalCount(response.count);
      setMetrics(response.metrics);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch property listings. Please ensure backend Django server is running.');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Update URL parameters
  const updateFilter = useCallback((key, value) => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      const paramKey = key === 'listing_status' ? 'status' : key;
      if (value) {
        newParams.set(paramKey, value);
      } else {
        newParams.delete(paramKey);
      }
      newParams.set('page', '1'); // reset to page 1 on filter change
      return newParams;
    });
  }, [setSearchParams]);

  // Instant live search as user types with smooth 150ms debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      const urlQ = searchParams.get('q') || '';
      const trimmed = searchInput.trim();
      if (trimmed !== urlQ) {
        updateFilter('q', trimmed);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [searchInput, searchParams, updateFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilter('q', searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput('');
    updateFilter('q', '');
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Count active filters
  const activeFiltersCount = Object.entries(currentFilters).filter(
    ([k, v]) => v && !['page', 'sort', 'search_mode'].includes(k)
  ).length;

  const totalPages = Math.ceil(totalCount / 9);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      
      {/* Top Header & Breadcrumb */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200/80">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-400 block mb-1">
            Properties Portfolio
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-stone-950">
            Real Estate Directory
          </h1>
        </div>

        {/* Action Controls: Search Bar & Layout Switcher */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="relative min-w-[240px] sm:min-w-[280px]">
            {loading && searchInput ? (
              <Loader2 className="w-3.5 h-3.5 text-stone-500 animate-spin absolute left-3.5 top-3" />
            ) : (
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-3" />
            )}
            <input
              type="text"
              name="search_query"
              placeholder="Search title, city, address..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900 shadow-xs placeholder:text-stone-400 transition-colors"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700 p-0.5"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Mobile Filter Drawer Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden p-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 flex items-center gap-1.5 text-xs font-medium shadow-xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-900" />
            <span>Filters ({activeFiltersCount})</span>
          </button>

          {/* Grid vs List Layout Switcher */}
          <div className="hidden sm:flex items-center bg-stone-100 p-1 rounded-lg border border-stone-200/60">
            <button
              onClick={() => setLayout('grid')}
              className={`p-1.5 rounded-md transition-all ${
                layout === 'grid' ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLayout('list')}
              className={`p-1.5 rounded-md transition-all ${
                layout === 'list' ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar + Listings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <FilterSidebar
            filters={currentFilters}
            metadata={metadata}
            onFilterChange={updateFilter}
            onResetFilters={handleResetFilters}
            totalResults={totalCount}
          />
        </div>

        {/* Listings Content */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Subheader: Sort & Active Filter Tags */}
          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="font-normal text-stone-600 flex items-center gap-1.5">
              <span>Showing</span>
              <span className="text-stone-950 font-semibold">{properties.length}</span>
              <span>of</span>
              <span className="text-stone-950 font-semibold">{totalCount}</span>
              <span>properties</span>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <span className="text-stone-400 font-normal hidden sm:inline flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3" /> Sort by:
              </span>
              <select
                value={currentFilters.sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="bg-stone-50 border border-stone-200 text-xs font-medium rounded-lg px-2.5 py-1.5 text-stone-800 focus:outline-none focus:border-stone-900"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="area_desc">Area: Largest SqFt</option>
                <option value="bedrooms_desc">Bedrooms: Most</option>
              </select>
            </div>
          </div>

          {/* Active Filter Pills */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-stone-400 font-light">Applied:</span>
              {currentFilters.q && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 border border-stone-200 font-medium">
                  Search: "{currentFilters.q}"
                  <button onClick={() => updateFilter('q', '')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {currentFilters.city && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 border border-stone-200 font-medium">
                  City: {currentFilters.city}
                  <button onClick={() => updateFilter('city', '')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {currentFilters.listing_status && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 border border-stone-200 font-medium capitalize">
                  {currentFilters.listing_status.replace('_', ' ')}
                  <button onClick={() => updateFilter('listing_status', '')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {currentFilters.property_type && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 border border-stone-200 font-medium capitalize">
                  Types: {currentFilters.property_type}
                  <button onClick={() => updateFilter('property_type', '')}><X className="w-3 h-3" /></button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs text-stone-500 hover:text-stone-900 font-medium underline ml-1"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Loading Skeletons on initial empty state */}
          {loading && properties.length === 0 && (
            <div className={layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-white rounded-xl border border-stone-200 animate-pulse" />
              ))}
            </div>
          )}

          {/* Error Message */}
          {error && !loading && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center text-rose-800">
              <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
              <h3 className="font-serif text-base font-normal">Error Loading Properties</h3>
              <p className="text-xs text-rose-600 mt-1">{error}</p>
              <button
                onClick={fetchProperties}
                className="mt-4 px-4 py-2 rounded-lg bg-stone-900 text-white font-medium text-xs hover:bg-black transition-colors"
              >
                Retry Request
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && properties.length === 0 && (
            <div className="bg-white rounded-2xl border border-stone-200/90 p-12 text-center max-w-lg mx-auto space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center mx-auto">
                <Building className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-serif text-xl font-normal text-stone-900">No Matching Residences Found</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-light">
                No listings matched your active filter criteria. Try searching for a different city or title.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-lg bg-stone-900 text-white font-medium text-xs hover:bg-black transition-colors shadow-xs"
              >
                Reset Filters & Search Again
              </button>
            </div>
          )}

          {/* Property Cards Render with smooth live transition */}
          {!error && properties.length > 0 && (
            <div className={`transition-opacity duration-150 ${loading ? 'opacity-60' : 'opacity-100'} ${
              layout === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }`}>
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} layout={layout} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-6 flex items-center justify-center gap-2">
              <button
                disabled={currentFilters.page <= 1}
                onClick={() => handlePageChange(currentFilters.page - 1)}
                className="p-2 rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                    currentFilters.page === pageNum
                      ? 'bg-stone-900 text-white shadow-xs font-semibold'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                disabled={currentFilters.page >= totalPages}
                onClick={() => handlePageChange(currentFilters.page + 1)}
                className="p-2 rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-xs sm:max-w-sm bg-white h-full overflow-y-auto p-5 shadow-2xl animate-in slide-in-from-right">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
              <h3 className="font-serif text-lg font-normal text-stone-900">Filter Portfolio</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <FilterSidebar
              filters={currentFilters}
              metadata={metadata}
              onFilterChange={(key, val) => {
                updateFilter(key, val);
              }}
              onResetFilters={() => {
                handleResetFilters();
                setMobileFilterOpen(false);
              }}
              totalResults={totalCount}
            />
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="mt-6 w-full py-3 rounded-lg bg-stone-900 text-white font-medium text-xs uppercase tracking-wider shadow-xs hover:bg-black transition-colors"
            >
              Apply Filters ({totalCount} Results)
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
