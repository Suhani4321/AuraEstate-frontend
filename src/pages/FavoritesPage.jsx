import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ArrowRight, Scale, Building2 } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import PropertyCard from '../components/PropertyCard';
import PropertyCompareModal from '../components/PropertyCompareModal';

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites();
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  const clearAllFavorites = () => {
    clearFavorites();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-200/80">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-400 block mb-1">
            Private Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-stone-950 tracking-tight">
            Saved Residences ({favorites.length})
          </h1>
          <p className="text-xs text-stone-500 mt-1 font-light">
            Properties bookmarked for review, evaluation, and side-by-side comparison.
          </p>
        </div>

        {favorites.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCompareModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-stone-900 hover:bg-black text-stone-50 font-medium text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs transition-colors"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Compare ({favorites.length})</span>
            </button>
            <button
              onClick={clearAllFavorites}
              className="p-2 rounded-lg border border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              title="Clear all saved properties"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {favorites.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200/90 p-12 text-center max-w-md mx-auto space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h3 className="font-serif text-xl font-normal text-stone-950">No Residences Saved</h3>
          <p className="text-xs text-stone-500 leading-relaxed font-light">
            Bookmark exceptional properties from the directory to review and compare them here.
          </p>
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 text-stone-50 font-medium text-xs uppercase tracking-wider hover:bg-black transition-colors shadow-xs"
          >
            <span>Explore Portfolio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((property) => (
            <PropertyCard key={property.id} property={property} layout="grid" />
          ))}
        </div>
      )}

      {/* Compare Modal */}
      <PropertyCompareModal
        properties={favorites.slice(0, 4)}
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
      />

    </div>
  );
}
