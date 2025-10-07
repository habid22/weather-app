'use client';

import { useState, useRef } from 'react';
import { Navigation, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
// Removed static database import - we'll use direct API search

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
  // Removed suggestion state - no longer needed
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // Removed debounce ref - no longer needed for autocomplete

  // Removed static database search - users can type any city name directly

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onLocationSelect(input.trim());
      setInput('');
    }
  };

  // Removed suggestion click handler - no longer needed

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
            onFocus={() => {}}
            onBlur={() => {}}
            placeholder="Search any location..."
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

      {/* Removed static suggestions - users can type any city name directly */}

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
