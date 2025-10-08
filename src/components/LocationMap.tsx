'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ExternalLink } from 'lucide-react';

interface LocationMapProps {
  location: string;
  latitude: number;
  longitude: number;
  mapProvider?: 'mapbox' | 'openstreetmap' | 'here';
}

export default function LocationMap({ 
  location, 
  latitude, 
  longitude,
  mapProvider = 'mapbox'
}: LocationMapProps) {
  const [mapLinks, setMapLinks] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMapData();
  }, [location, latitude, longitude, mapProvider]);

  const fetchMapData = async () => {
    setLoading(true);
    setError(null);

    try {
      const url = `/api/location/maps?location=${encodeURIComponent(location)}&latitude=${latitude}&longitude=${longitude}&provider=${mapProvider}`;
      console.log('Fetching map data from:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('Map API response:', data);

      if (data.success) {
        setMapLinks(data.mapLinks);
        console.log('Map links set:', data.mapLinks);
      } else {
        setError('Failed to load map data: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      setError('Failed to load map data: ' + err.message);
      console.error('Error fetching map data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card p-6 rounded-xl shadow-lg border border-subtle"
      >
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted">Loading map...</span>
        </div>
      </motion.div>
    );
  }

  if (error || !mapLinks) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card p-6 rounded-xl shadow-lg border border-subtle"
      >
        <div className="text-center py-8">
          <MapPin className="w-12 h-12 text-muted mx-auto mb-4" />
          <p className="text-muted">Map unavailable</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card p-6 rounded-xl shadow-lg border border-subtle"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">Location Map</h3>
        </div>
        <a
          href={mapLinks.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1 text-primary hover:text-primary/80 text-sm font-medium"
        >
          <span>Open in Maps</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Map Image */}
      <div className="relative rounded-lg overflow-hidden border border-subtle">
        <img
          src={mapLinks.staticMapUrl}
          alt={`Map of ${location}`}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <div className="bg-black/80 text-white px-4 py-2 rounded-lg">
            <p className="text-sm font-medium">{location}</p>
            <p className="text-xs text-gray-300">
              {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </p>
          </div>
        </div>
      </div>

      {/* Map Actions */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <a
          href={mapLinks.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-2 p-3 bg-background rounded-lg border border-subtle hover:border-primary/50 transition-colors"
        >
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Get Directions</span>
        </a>
        
        <a
          href={mapLinks.streetViewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-2 p-3 bg-background rounded-lg border border-subtle hover:border-primary/50 transition-colors"
        >
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Street View</span>
        </a>
      </div>
    </motion.div>
  );
}
