'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ExternalLink, RotateCcw, Maximize2 } from 'lucide-react';

interface Mapbox3DMapProps {
  location: string;
  latitude: number;
  longitude: number;
}

export default function Mapbox3DMap({ location, latitude, longitude }: Mapbox3DMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    const initializeMap = async () => {
      try {
        // Dynamically import mapbox-gl
        const mapboxgl = (await import('mapbox-gl')).default;
        
        // Set the access token
        const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
        if (!accessToken) {
          throw new Error('Mapbox access token is not configured');
        }
        mapboxgl.accessToken = accessToken;

        // Create the map with your custom style
        map.current = new mapboxgl.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/johndoe13535/cmgihixjc002501s6643v08wv',
          center: [longitude, latitude],
          zoom: 15.5, // Building level detail
          pitch: 45, // 3D tilt
          bearing: 0,
          antialias: true,
          interactive: true
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Add a marker
        new mapboxgl.Marker({ color: '#ff0000' })
          .setLngLat([longitude, latitude])
          .setPopup(new mapboxgl.Popup().setHTML(`<strong>${location}</strong>`))
          .addTo(map.current);

        // Add 3D terrain
        map.current.on('load', () => {
          // Check if terrain source already exists before adding
          if (!map.current.getSource('mapbox-dem')) {
            // Add terrain source
            map.current.addSource('mapbox-dem', {
              type: 'raster-dem',
              url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
              tileSize: 512,
              maxzoom: 14
            });
          }

          // Add terrain layer
          map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });

          // Check if sky layer already exists before adding
          if (!map.current.getLayer('sky')) {
            // Add sky layer for atmosphere
            map.current.addLayer({
              id: 'sky',
              type: 'sky',
              paint: {
                'sky-type': 'atmosphere',
                'sky-atmosphere-sun': [0.0, 0.0],
                'sky-atmosphere-sun-intensity': 15
              }
            });
          }

          setIsLoaded(true);
        });

        // Handle errors
        map.current.on('error', (e: any) => {
          console.error('Map error:', e);
          setError('Failed to load 3D map');
        });

      } catch (err: any) {
        console.error('Error initializing map:', err);
        setError('Failed to load map library');
      }
    };

    initializeMap();

    // Cleanup
    return () => {
      if (map.current) {
        // Remove all event listeners
        map.current.off('load');
        map.current.off('error');
        // Remove the map instance
        map.current.remove();
        map.current = null;
      }
    };
  }, [latitude, longitude, location]);

  const resetView = () => {
    if (map.current) {
      map.current.flyTo({
        center: [longitude, latitude],
        zoom: 15.5, // Building level detail
        pitch: 45,
        bearing: 0,
        duration: 1000
      });
    }
  };

  const toggleFullscreen = () => {
    if (mapContainer.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        mapContainer.current.requestFullscreen();
      }
    }
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card p-6 rounded-xl shadow-lg border border-subtle"
      >
        <div className="text-center py-8">
          <MapPin className="w-12 h-12 text-muted mx-auto mb-4" />
          <p className="text-muted">{error}</p>
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
          <h3 className="text-xl font-semibold text-foreground">Map</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={resetView}
            className="p-2 bg-background rounded-lg border border-subtle hover:border-primary/50 hover:bg-primary/5 hover:scale-105 transition-all duration-200 group"
            title="Reset view"
          >
            <RotateCcw className="w-4 h-4 text-foreground group-hover:text-primary transition-colors" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-background rounded-lg border border-subtle hover:border-primary/50 hover:bg-primary/5 hover:scale-105 transition-all duration-200 group"
            title="Fullscreen"
          >
            <Maximize2 className="w-4 h-4 text-foreground group-hover:text-primary transition-colors" />
          </button>
          <a
            href={`https://www.mapbox.com/maps/${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-primary hover:text-primary/80 hover:bg-primary/5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 group"
          >
            <span>Open in Maps</span>
            <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* 3D Map Container */}
      <div className="relative rounded-lg overflow-hidden border border-subtle">
        <div
          ref={mapContainer}
          className="w-full h-96 bg-muted"
          style={{ minHeight: '384px' }}
        />
        
        {!isLoaded && (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-muted text-sm">Loading 3D map...</p>
            </div>
          </div>
        )}

        {/* Map Controls Overlay */}
        {isLoaded && (
          <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-2 rounded-lg">
            <p className="text-sm font-medium">{location}</p>
            <p className="text-xs text-gray-300">
              {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </p>
          </div>
        )}
      </div>

      {/* Map Info */}
      <div className="mt-4 p-3 bg-background rounded-lg border border-subtle">
        <p className="text-sm text-muted">
          <strong>3D Features:</strong> Tilt the map by dragging with right mouse button, 
          rotate by holding Shift and dragging, zoom with mouse wheel.
        </p>
      </div>
    </motion.div>
  );
}
