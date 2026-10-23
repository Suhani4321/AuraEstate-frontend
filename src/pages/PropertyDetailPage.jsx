import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Bed, 
  Bath, 
  Maximize2, 
  Calendar, 
  Car, 
  DollarSign, 
  MapPin, 
  Heart, 
  Share2, 
  Sparkles, 
  Phone, 
  Mail, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Building,
  Clock,
  ExternalLink
} from 'lucide-react';
import { propertyService } from '../services/api';
import { useFavorites } from '../hooks/useFavorites';
import { getGoogleMapsUrl } from '../utils/mapUtils';
import InquiryModal from '../components/InquiryModal';
import PropertyCard from '../components/PropertyCard';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    async function loadPropertyDetails() {
      setLoading(true);
      setError(null);
      try {
        const response = await propertyService.getPropertyById(id);
        setProperty(response.data);

        // Fetch similar properties in the same city or of same property type
        const similarRes = await propertyService.getProperties({
          city: response.data.city,
          page_size: 3
        });
        setSimilarProperties(
          (similarRes.results || []).filter(p => p.id !== parseInt(id, 10))
        );
      } catch (err) {
        console.error(err);
        setError('Property not found or server is unreachable.');
      } finally {
        setLoading(false);
      }
    }
    loadPropertyDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-8">
        <div className="h-8 bg-slate-200 rounded-xl w-64" />
        <div className="h-96 bg-slate-200 rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-72 bg-slate-200 rounded-2xl" />
          <div className="h-72 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900">Property Not Found</h2>
        <p className="text-sm text-slate-500">{error}</p>
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Listings
        </Link>
      </div>
    );
  }

  const allImages = [
    property.featured_image,
    ...(property.gallery_images?.map(img => img.image_url) || [])
  ];

  const favorited = isFavorite(property.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      
      {/* Back button & Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-600 hover:text-stone-950 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Portfolio</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
            title="Share listing link"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{copied ? 'Link Copied' : 'Share'}</span>
          </button>

          {/* Favorite */}
          <button
            onClick={() => toggleFavorite(property)}
            className={`p-2.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-medium shadow-xs ${
              favorited
                ? 'bg-stone-900 border-stone-900 text-stone-50'
                : 'bg-white border-stone-200 text-stone-700 hover:border-stone-400'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-stone-50 text-stone-50' : ''}`} />
            <span className="hidden sm:inline">{favorited ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Image Gallery Section */}
      <div className="space-y-3">
        {/* Main Display Image */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden shadow-lg bg-stone-950 border border-stone-200/60">
          <img
            src={allImages[activeImageIndex] || property.featured_image}
            alt={property.title}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent opacity-60" />

          {/* Badges on main image */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 items-center">
            <span className="px-3 py-1 rounded-md text-[10px] font-semibold uppercase tracking-[0.16em] bg-stone-900/90 text-stone-100 backdrop-blur-md border border-white/10 shadow-xs">
              {property.listing_status?.replace('_', ' ')}
            </span>
            <span className="px-3 py-1 rounded-md text-[10px] font-semibold uppercase tracking-[0.16em] bg-white/90 text-stone-900 backdrop-blur-md shadow-xs">
              {property.property_type}
            </span>
            {property.is_featured && (
              <span className="px-3 py-1 rounded-md text-[10px] font-semibold uppercase tracking-[0.16em] bg-amber-100/90 text-amber-950 border border-amber-300/40 backdrop-blur-md flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3 h-3 text-amber-600" /> Featured
              </span>
            )}
          </div>
        </div>

        {/* Thumbnail Carousel / Row */}
        {allImages.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {allImages.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-24 sm:w-32 aspect-[4/3] rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                  activeImageIndex === idx
                    ? 'border-stone-900 scale-98 shadow-sm'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Title, Address & Pricing Overview */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-200">
        <div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-stone-950 leading-tight">
            {property.title}
          </h1>
          <a
            href={getGoogleMapsUrl(property)}
            target="_blank"
            rel="noopener noreferrer"
            title="Open exact location on Google Maps"
            className="group/loc inline-flex flex-wrap items-center gap-2 text-xs sm:text-sm text-stone-600 hover:text-stone-950 transition-colors mt-2 font-light py-0.5"
          >
            <MapPin className="w-4 h-4 text-stone-400 group-hover/loc:text-amber-700 shrink-0 transition-colors" />
            <span className="underline decoration-stone-300 underline-offset-4 group-hover/loc:decoration-stone-900 transition-colors font-normal">
              {property.address}, {property.city}, {property.state} {property.zip_code}, {property.country}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-900 bg-amber-50 group-hover/loc:bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200/60 transition-all ml-1">
              <span>Google Maps</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </span>
          </a>
        </div>

        <div className="text-left md:text-right shrink-0">
          <div className="font-serif text-3xl sm:text-4xl font-normal text-stone-950 tracking-tight">
            {property.price_formatted}
          </div>
          {property.price_per_sqft > 0 && (
            <p className="text-xs text-stone-400 mt-1 font-light">
              Estimated ₹{property.price_per_sqft?.toLocaleString()} / sqft
            </p>
          )}
        </div>
      </div>

      {/* Key Specifications Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs text-center">
          <Bed className="w-4 h-4 text-stone-400 mx-auto mb-1" />
          <div className="font-serif text-xl font-normal text-stone-900">{property.bedrooms}</div>
          <div className="text-[11px] text-stone-400 uppercase tracking-wider font-medium">Bedrooms</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs text-center">
          <Bath className="w-4 h-4 text-stone-400 mx-auto mb-1" />
          <div className="font-serif text-xl font-normal text-stone-900">{property.bathrooms}</div>
          <div className="text-[11px] text-stone-400 uppercase tracking-wider font-medium">Bathrooms</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs text-center">
          <Maximize2 className="w-4 h-4 text-stone-400 mx-auto mb-1" />
          <div className="font-serif text-xl font-normal text-stone-900">{property.area_sqft?.toLocaleString()}</div>
          <div className="text-[11px] text-stone-400 uppercase tracking-wider font-medium">Living SqFt</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs text-center">
          <Calendar className="w-4 h-4 text-stone-400 mx-auto mb-1" />
          <div className="font-serif text-xl font-normal text-stone-900">{property.year_built || '2022'}</div>
          <div className="text-[11px] text-stone-400 uppercase tracking-wider font-medium">Year Built</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs text-center">
          <Car className="w-4 h-4 text-stone-400 mx-auto mb-1" />
          <div className="font-serif text-xl font-normal text-stone-900">{property.garage_spaces} Cars</div>
          <div className="text-[11px] text-stone-400 uppercase tracking-wider font-medium">Parking Spaces</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs text-center">
          <DollarSign className="w-4 h-4 text-stone-400 mx-auto mb-1" />
          <div className="font-serif text-xl font-normal text-stone-900">
            {property.hoa_fee_monthly > 0 ? `₹${Number(property.hoa_fee_monthly).toLocaleString()}/mo` : 'Included'}
          </div>
          <div className="text-[11px] text-stone-400 uppercase tracking-wider font-medium">Maintenance</div>
        </div>
      </div>

      {/* Main Grid: Details + Agent Contact & Mortgage Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Description & Amenities */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Detailed Description */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="font-serif text-2xl font-normal text-stone-950">Property Overview</h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed whitespace-pre-line font-light">
              {property.description}
            </p>
          </div>

          {/* Amenities & Architectural Features */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="font-serif text-2xl font-normal text-stone-950">Features & Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {property.amenities?.map((amenity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-100 text-xs font-normal text-stone-800"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>



        </div>

        {/* Right Column: Listing Agent Card & Tour CTA */}
        <div className="space-y-6 sticky top-24">
          
          {/* Agent Card */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center font-bold text-lg overflow-hidden shrink-0 border border-stone-200/60">
                {property.agent_avatar ? (
                  <img src={property.agent_avatar} alt={property.agent_name} className="w-full h-full object-cover" />
                ) : (
                  <span>{property.agent_name?.charAt(0)}</span>
                )}
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">
                  Listing Agent
                </span>
                <h3 className="font-serif text-lg font-normal text-stone-950">{property.agent_name}</h3>
                <p className="text-xs text-stone-500 font-light">Luxury Portfolio Specialist</p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-stone-100 text-xs text-stone-600 font-light">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <a href={`tel:${property.agent_phone}`} className="hover:text-stone-950 transition-colors">
                  {property.agent_phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <a
                  href={`mailto:${property.agent_email}?subject=Inquiry: ${encodeURIComponent(property.title)}`}
                  className="truncate hover:text-amber-900 underline decoration-stone-200 hover:decoration-amber-900 transition-colors"
                  title={`Email agent ${property.agent_name} directly`}
                >
                  {property.agent_email}
                </a>
              </div>
            </div>

            <button
              onClick={() => setInquiryModalOpen(true)}
              className="w-full py-3.5 rounded-xl bg-stone-900 hover:bg-black text-stone-50 font-medium text-xs uppercase tracking-[0.16em] shadow-xs transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <span>Schedule Private Tour</span>
            </button>
          </div>

        </div>

      </div>

      {/* Similar Properties Section */}
      {similarProperties.length > 0 && (
        <div className="pt-12 border-t border-stone-200">
          <div className="mb-6">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-400 block mb-1">
              Curated Recommendations
            </span>
            <h2 className="font-serif text-2xl font-normal text-stone-950">Similar Residences in {property.city}</h2>
            <p className="text-xs text-stone-500 mt-1 font-light">Explore other comparable listings in the neighborhood</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarProperties.map(sim => (
              <PropertyCard key={sim.id} property={sim} layout="grid" />
            ))}
          </div>
        </div>
      )}

      {/* Inquiry Modal */}
      <InquiryModal
        property={property}
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
      />

    </div>
  );
}
