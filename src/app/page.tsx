'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LocationInput from '@/components/LocationInput';
import WeatherCard from '@/components/WeatherCard';
import WeatherDetails from '@/components/WeatherDetails';
import ErrorDisplay from '@/components/ErrorDisplay';
import { useLocation } from '@/hooks/useLocation';
import { Cloud, Info } from 'lucide-react';

export default function Home() {
  const { currentLocation, weatherData, isLoading, error, searchLocation, getCurrentLocation, clearError } = useLocation();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="min-h-screen bg-dark">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.01] rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="p-2 bg-card rounded-lg border border-subtle">
              <Cloud className="w-8 h-8 text-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Weather App</h1>
              <p className="text-muted text-sm font-medium">by Hassan</p>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 bg-card text-foreground rounded-lg border border-subtle hover:bg-accent transition-colors duration-200"
            title="About PM Accelerator"
          >
            <Info className="w-6 h-6" />
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-12 pt-16">
        <div className="max-w-4xl mx-auto">
          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Check Weather Anywhere
            </h2>
            <p className="text-muted mb-8 font-medium">
              Enter a city, ZIP code, coordinates, or landmark to get current weather and 5-day forecast
            </p>
            
            <LocationInput
              onLocationSelect={searchLocation}
              onCurrentLocation={getCurrentLocation}
              isLoading={isLoading}
            />
          </motion.div>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8"
              >
                <ErrorDisplay
                  error={error}
                  onRetry={() => {
                    clearError();
                    if (currentLocation) {
                      searchLocation(currentLocation.name);
                    }
                  }}
                  onClear={clearError}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Weather Display */}
          <AnimatePresence mode="wait">
            {weatherData && currentLocation && (
              <motion.div
                key="weather-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <WeatherCard
                  location={currentLocation}
                  weather={weatherData}
                  isLoading={isLoading}
                />
                
                <WeatherDetails weather={weatherData} />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowInfo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-2xl p-8 max-w-md w-full shadow-2xl border border-subtle"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-semibold mb-4 text-foreground">About PM Accelerator</h3>
              <p className="text-muted mb-6 font-medium">
                PM Accelerator is a comprehensive program designed to accelerate your career in product management. 
                We provide hands-on training, mentorship, and real-world experience to help you become a successful product manager.
              </p>
              <div className="flex space-x-3">
                <a
                  href="https://www.linkedin.com/company/product-manager-accelerator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 btn-primary text-center"
                >
                  Visit LinkedIn
                </a>
                <button
                  onClick={() => setShowInfo(false)}
                  className="btn-secondary"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
