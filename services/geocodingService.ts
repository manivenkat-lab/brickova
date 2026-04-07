
export interface GeocodingResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

export const geocodeAddress = async (address: string): Promise<GeocodingResult | null> => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error("Google Maps API Key is missing.");
    return null;
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${apiKey}`
    );
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      const { lat, lng } = result.geometry.location;
      return {
        latitude: lat,
        longitude: lng,
        formattedAddress: result.formatted_address,
      };
    } else {
      console.error("Geocoding failed:", data.status);
      return null;
    }
  } catch (error) {
    console.error("Error during geocoding:", error);
    return null;
  }
};

export interface AddressComponents {
  addressLine: string;
  city: string;
  area: string;
  state: string;
  zip: string;
  country: string;
}

export const reverseGeocode = async (lat: number, lng: number): Promise<AddressComponents | null> => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY;
  
  if (apiKey) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        const components = result.address_components;
        
        let addressLine = '';
        let city = '';
        let area = '';
        let state = '';
        let zip = '';
        let country = '';

        const findComp = (types: string[]) => 
          components.find((c: any) => types.some(t => c.types.includes(t)))?.long_name || '';

        const streetNumber = findComp(['street_number']);
        const route = findComp(['route']);
        const neighborhood = findComp(['neighborhood', 'sublocality', 'sublocality_level_1']);
        const locality = findComp(['locality']);
        const administrativeAreaLevel1 = findComp(['administrative_area_level_1']);
        const postalCode = findComp(['postal_code']);
        const countryComp = findComp(['country']);

        addressLine = [streetNumber, route].filter(Boolean).join(', ') || result.formatted_address.split(',')[0];
        area = neighborhood || findComp(['sublocality_level_2']) || '';
        city = locality || '';
        state = administrativeAreaLevel1 || '';
        zip = postalCode || '';
        country = countryComp || 'India';

        return { addressLine, city, area, state, zip, country };
      }
    } catch (error) {
      console.warn("Google Maps reverse geocoding failed, trying fallback...", error);
    }
  }

  // Fallback to OpenStreetMap (Nominatim) - No API Key required
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en-US,en;q=0.5',
          'User-Agent': 'BrickovaApp/1.0' // Encouraged by OSM usage policy
        }
      }
    );
    const data = await response.json();
    
    if (data && data.address) {
      const addr = data.address;
      return {
        addressLine: addr.road || addr.suburb || addr.neighbourhood || data.display_name.split(',')[0],
        city: addr.city || addr.town || addr.village || addr.municipality || '',
        area: addr.suburb || addr.neighbourhood || addr.residential || '',
        state: addr.state || '',
        zip: addr.postcode || '',
        country: addr.country || 'India'
      };
    }
    return null;
  } catch (error) {
    console.error("All reverse geocoding attempts failed:", error);
    return null;
  }
};
