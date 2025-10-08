'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Youtube, ExternalLink, Play, Clock, Eye, Calendar } from 'lucide-react';

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
  url: string;
}

interface MapLinks {
  embedUrl: string;
  staticMapUrl: string;
  directionsUrl: string;
  streetViewUrl: string;
  googleMapsUrl: string;
}

interface LocationDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  location: string;
  latitude: number;
  longitude: number;
  mapProvider?: 'mapbox' | 'openstreetmap' | 'here';
}

export default function LocationDetails({ 
  isOpen, 
  onClose, 
  location, 
  latitude, 
  longitude,
  mapProvider = 'mapbox'
}: LocationDetailsProps) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [mapLinks, setMapLinks] = useState<MapLinks | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'videos' | 'map'>('videos');
  const [selectedMapProvider, setSelectedMapProvider] = useState<'mapbox' | 'openstreetmap' | 'here'>(mapProvider);

  useEffect(() => {
    if (isOpen) {
      fetchLocationData();
    }
  }, [isOpen, location, latitude, longitude]);

  const fetchLocationData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch YouTube videos and map data in parallel
      const [videosResponse, mapsResponse] = await Promise.all([
        fetch(`/api/location/youtube?location=${encodeURIComponent(location)}&maxResults=6`),
        fetch(`/api/location/maps?location=${encodeURIComponent(location)}&latitude=${latitude}&longitude=${longitude}&provider=${selectedMapProvider}`)
      ]);

      const videosData = await videosResponse.json();
      const mapsData = await mapsResponse.json();

      if (videosData.success) {
        setVideos(videosData.videos);
      }

      if (mapsData.success) {
        setMapLinks(mapsData.mapLinks);
      }
    } catch (err: any) {
      setError('Failed to load location information');
      console.error('Error fetching location data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-background rounded-xl shadow-2xl border border-subtle w-full max-w-6xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-subtle">
            <div className="flex items-center space-x-3">
              <MapPin className="w-6 h-6 text-primary" />
              <div>
                <h2 className="text-2xl font-bold text-foreground">Location Details</h2>
                <p className="text-muted">{location}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-subtle">
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'videos'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <Youtube className="w-4 h-4" />
              <span>Videos</span>
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'map'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Map</span>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-muted">Loading location information...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={fetchLocationData}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                {activeTab === 'videos' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Videos about {location}
                    </h3>
                    {videos.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {videos.map((video) => (
                          <motion.div
                            key={video.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-card rounded-lg border border-subtle overflow-hidden hover:border-primary/50 transition-colors"
                          >
                            <div className="relative">
                              <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full h-32 object-cover"
                              />
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <Play className="w-8 h-8 text-white" />
                              </div>
                              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                                {video.duration}
                              </div>
                            </div>
                            <div className="p-4">
                              <h4 className="font-medium text-foreground text-sm line-clamp-2 mb-2">
                                {video.title}
                              </h4>
                              <p className="text-xs text-muted mb-3 line-clamp-2">
                                {video.description}
                              </p>
                              <div className="flex items-center justify-between text-xs text-muted">
                                <span>{video.channelTitle}</span>
                                <div className="flex items-center space-x-3">
                                  <div className="flex items-center space-x-1">
                                    <Eye className="w-3 h-3" />
                                    <span>{video.viewCount}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{formatDate(video.publishedAt)}</span>
                                  </div>
                                </div>
                              </div>
                              <a
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center space-x-1 text-primary hover:text-primary/80 text-xs font-medium"
                              >
                                <span>Watch on YouTube</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Youtube className="w-12 h-12 text-muted mx-auto mb-4" />
                        <p className="text-muted">No videos found for this location</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'map' && mapLinks && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">
                        Map of {location}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted">Provider:</span>
                        <select
                          value={selectedMapProvider}
                          onChange={(e) => {
                            setSelectedMapProvider(e.target.value as 'mapbox' | 'openstreetmap' | 'here');
                            fetchLocationData();
                          }}
                          className="px-3 py-1 bg-background border border-subtle rounded-md text-sm"
                        >
                          <option value="openstreetmap">OpenStreetMap (Free)</option>
                          <option value="mapbox">Mapbox</option>
                          <option value="here">Here Maps</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Interactive Map */}
                    <div className="bg-card rounded-lg border border-subtle overflow-hidden">
                      <iframe
                        src={mapLinks.embedUrl}
                        width="100%"
                        height="400"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Map of ${location}`}
                      />
                    </div>

                    {/* Map Actions */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <a
                        href={mapLinks.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 p-3 bg-card rounded-lg border border-subtle hover:border-primary/50 transition-colors"
                      >
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Open in Maps</span>
                        <ExternalLink className="w-3 h-3 text-muted" />
                      </a>
                      
                      <a
                        href={mapLinks.directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 p-3 bg-card rounded-lg border border-subtle hover:border-primary/50 transition-colors"
                      >
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Get Directions</span>
                        <ExternalLink className="w-3 h-3 text-muted" />
                      </a>
                      
                      <a
                        href={mapLinks.streetViewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 p-3 bg-card rounded-lg border border-subtle hover:border-primary/50 transition-colors"
                      >
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Street View</span>
                        <ExternalLink className="w-3 h-3 text-muted" />
                      </a>
                      
                      <div className="flex items-center space-x-2 p-3 bg-card rounded-lg border border-subtle">
                        <MapPin className="w-4 h-4 text-muted" />
                        <span className="text-sm text-muted">
                          {latitude.toFixed(4)}, {longitude.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
