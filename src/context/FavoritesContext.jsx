import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const FAVORITES_STORAGE_KEY = 'aura_estate_favorites';

export const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  }, [favorites]);

  // Sync with changes from other tabs or windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === FAVORITES_STORAGE_KEY) {
        try {
          setFavorites(e.newValue ? JSON.parse(e.newValue) : []);
        } catch {
          setFavorites([]);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleFavorite = useCallback((property) => {
    if (!property || !property.id) return;
    setFavorites((prev) => {
      const exists = prev.some((p) => p.id === property.id);
      let updated;
      if (exists) {
        updated = prev.filter((p) => p.id !== property.id);
      } else {
        updated = [...prev, property];
      }
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save favorites to localStorage', e);
      }
      return updated;
    });
  }, []);

  const isFavorite = useCallback((id) => {
    return favorites.some((p) => p.id === id);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    try {
      localStorage.removeItem(FAVORITES_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear favorites from localStorage', e);
    }
  }, []);

  return (
    <FavoritesContext.Provider value={{
      favorites,
      toggleFavorite,
      isFavorite,
      clearFavorites,
      favoritesCount: favorites.length
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
