'use client';

import { useState, useRef, useEffect } from 'react';
import { Navigation, Loader2, MapPin, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LandmarkService, Landmark } from '@/lib/landmarks';

interface LocationInputProps {
  onLocationSelect: (location: string) => void;
  onCurrentLocation: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

export default function LocationInput({ 
  onLocationSelect, 
  onCurrentLocation, 
  isLoading = false,
  placeholder = "Enter city, ZIP code, coordinates, or landmark..."
}: LocationInputProps) {
  const [input, setInput] = useState('');
  const [landmarkSuggestions, setLandmarkSuggestions] = useState<Landmark[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Search landmarks as user types
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (input.length >= 2) {
      debounceRef.current = setTimeout(() => {
        const suggestions = LandmarkService.searchLandmarks(input);
        setLandmarkSuggestions(suggestions);
        setShowSuggestions(suggestions.length > 0);
      }, 300);
    } else {
      setLandmarkSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onLocationSelect(input.trim());
      setInput('');
      setShowSuggestions(false);
    }
  };

  const handleLandmarkSelect = (landmark: Landmark) => {
    const locationString = `${landmark.name}, ${landmark.city}, ${landmark.country}`;
    onLocationSelect(locationString);
    setInput('');
    setShowSuggestions(false);
  };

  const handleCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      await onCurrentLocation();
    } finally {
      setIsGettingLocation(false);
    }
  };

  const isCoordinateInput = (text: string) => {
    const coordPattern = /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/;
    return coordPattern.test(text.trim());
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => {
              if (landmarkSuggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onBlur={() => {
              // Delay hiding suggestions to allow clicking on them
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            placeholder="Search city, landmark, or coordinates..."
            className="w-full pl-4 pr-20 py-3 input-dark"
            disabled={isLoading}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 z-10">
            <button
              type="button"
              onClick={handleCurrentLocation}
              disabled={isGettingLocation || isLoading}
              className="p-2 rounded-lg bg-card text-foreground border border-subtle hover:bg-accent hover:border-primary/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 group"
              title="Use current location"
            >
              {isGettingLocation ? (
                <Loader2 className="w-4 h-4 animate-spin group-hover:text-primary transition-colors" />
              ) : (
                <Navigation className="w-4 h-4 group-hover:text-primary transition-colors" />
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Landmark Suggestions */}
      <AnimatePresence>
        {showSuggestions && landmarkSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-card border border-subtle rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
          >
            <div className="p-2">
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted uppercase tracking-wide">
                <Star className="w-3 h-3" />
                Famous Landmarks
              </div>
              {landmarkSuggestions.map((landmark, index) => (
                <motion.button
                  key={`${landmark.name}-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleLandmarkSelect(landmark)}
                  className="w-full text-left px-3 py-3 rounded-lg hover:bg-accent transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 text-primary group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {landmark.name}
                      </div>
                      <div className="text-sm text-muted">
                        {landmark.city}, {landmark.country}
                      </div>
                      <div className="text-xs text-muted mt-1">
                        {landmark.description}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {landmark.category}
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input type indicator */}
      {input && !showSuggestions && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-muted text-center font-medium"
        >
          {isCoordinateInput(input) ? (
            <span className="text-foreground">📍 Coordinates detected</span>
          ) : landmarkSuggestions.length > 0 ? (
            <span className="text-primary">⭐ Landmark suggestions available</span>
          ) : (
            <span className="text-muted">🏙️ City or location</span>
          )}
        </motion.div>
      )}
    </div>
  );
}
