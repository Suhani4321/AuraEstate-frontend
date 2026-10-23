/**
 * Utility functions for Google Maps redirection and embedding.
 */

/**
 * Returns a direct Google Maps URL for the exact location of a property.
 * Prioritizes exact latitude and longitude coordinates, with address string fallback.
 *
 * @param {Object} property - Property object
 * @returns {string} Google Maps URL
 */
export function getGoogleMapsUrl(property) {
  if (!property) return 'https://maps.google.com';

  if (property.google_maps_url) {
    return property.google_maps_url;
  }

  const lat = property.latitude;
  const lng = property.longitude;

  if (lat !== null && lat !== undefined && lng !== null && lng !== undefined) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }

  const parts = [
    property.address,
    property.city,
    property.state,
    property.zip_code,
    property.country || 'India',
  ].filter(Boolean);

  const query = parts.join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Returns a Google Maps Embed URL for iframe preview.
 *
 * @param {Object} property - Property object
 * @returns {string} Google Maps embed iframe URL
 */
export function getGoogleMapsEmbedUrl(property) {
  if (!property) return '';

  const lat = property.latitude;
  const lng = property.longitude;

  let query = '';
  if (lat !== null && lat !== undefined && lng !== null && lng !== undefined) {
    query = `${lat},${lng}`;
  } else {
    const parts = [
      property.address,
      property.city,
      property.state,
      property.country || 'India',
    ].filter(Boolean);
    query = encodeURIComponent(parts.join(', '));
  }

  return `https://maps.google.com/maps?q=${query}&t=m&z=15&output=embed&iwloc=near`;
}

/**
 * Formats coordinates for elegant display (e.g. "18.9702° N, 72.8083° E").
 *
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {string|null} Formatted coordinates string
 */
export function formatCoordinates(lat, lng) {
  if (lat === null || lat === undefined || lng === null || lng === undefined) {
    return null;
  }

  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);

  if (Number.isNaN(latNum) || Number.isNaN(lngNum)) return null;

  const latDirection = latNum >= 0 ? 'N' : 'S';
  const lngDirection = lngNum >= 0 ? 'E' : 'W';

  return `${Math.abs(latNum).toFixed(4)}° ${latDirection}, ${Math.abs(lngNum).toFixed(4)}° ${lngDirection}`;
}
