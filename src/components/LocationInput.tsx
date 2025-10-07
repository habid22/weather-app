'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  placeholder = "Enter city, ZIP code, or coordinates..."
}: LocationInputProps) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Common location suggestions
  const commonLocations = [
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Houston, TX',
    'Phoenix, AZ',
    'Philadelphia, PA',
    'San Antonio, TX',
    'San Diego, CA',
    'Dallas, TX',
    'San Jose, CA',
    'London, UK',
    'Paris, France',
    'Tokyo, Japan',
    'Sydney, Australia',
    'Toronto, Canada',
  ];

  useEffect(() => {
    if (input.length > 2) {
      // Clear previous debounce
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // Set new debounce
      debounceRef.current = setTimeout(() => {
        const filtered = commonLocations.filter(location =>
          location.toLowerCase().includes(input.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 5));
        setShowSuggestions(true);
      }, 300);
    } else {
      setSuggestions([]);
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

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    onLocationSelect(suggestion);
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
            onFocus={() => setShowSuggestions(input.length > 2)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={placeholder}
            className="w-full pl-4 pr-20 py-3 input-dark"
            disabled={isLoading}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 z-10">
            <button
              type="button"
              onClick={handleCurrentLocation}
              disabled={isGettingLocation || isLoading}
              className="p-2 rounded-lg bg-card text-foreground border border-subtle hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              title="Use current location"
            >
              {isGettingLocation ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </form>

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-xl border border-subtle z-50 max-h-60 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-accent transition-colors duration-150 flex items-center space-x-3"
              >
                <MapPin className="w-4 h-4 text-muted" />
                <span className="text-foreground font-medium">{suggestion}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input type indicator */}
      {input && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-muted text-center font-medium"
        >
          {isCoordinateInput(input) ? (
            <span className="text-foreground">📍 Coordinates detected</span>
          ) : (
            <span className="text-muted">🏙️ City or location</span>
          )}
        </motion.div>
      )}
    </div>
  );
}
