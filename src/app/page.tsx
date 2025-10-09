'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LocationInput from '@/components/LocationInput';
import WeatherCard from '@/components/WeatherCard';
import WeatherDetails from '@/components/WeatherDetails';
import ErrorDisplay from '@/components/ErrorDisplay';
import WeatherRecordsManager from '@/components/WeatherRecordsManager';
import Mapbox3DMap from '@/components/Mapbox3DMap';
import HourlyForecast from '@/components/HourlyForecast';
import { useLocation } from '@/hooks/useLocation';
import { getWeatherIcon } from '@/lib/weatherUtils';
import { Cloud, Database } from 'lucide-react';

export default function Home() {
  const { currentLocation, weatherData, isLoading, error, searchLocation, getCurrentLocation, clearError } = useLocation();
  const [showRecordsManager, setShowRecordsManager] = useState(false);

  return (
    <div className="min-h-screen bg-dark">

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
              <p className="text-muted text-sm font-medium">by Hassan Amin</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <button
              onClick={() => setShowRecordsManager(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-card rounded-lg border border-subtle hover:bg-accent hover:border-primary/50 hover:scale-105 transition-all duration-200 group"
            >
              <Database className="w-4 h-4 text-foreground group-hover:text-primary transition-colors" />
              <span className="text-foreground font-medium group-hover:text-primary transition-colors">Records</span>
            </button>
          </motion.div>

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
            <h2 className="text-5xl font-bold text-foreground mb-4">
              Check Weather Anywhere.
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
                
                {/* Hourly Forecast */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <HourlyForecast
                    weather={weatherData}
                    location={currentLocation.name}
                  />
                </motion.div>
                
                {/* 5-Day Forecast */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="bg-card p-6 rounded-xl shadow-lg border border-subtle"
                >
                  <h3 className="text-2xl font-semibold text-foreground mb-6">5-Day Forecast</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {weatherData.forecast.map((day, index) => (
                      <motion.div
                        key={day.date}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                        className="flex flex-col items-center p-4 bg-background rounded-lg border border-subtle text-center"
                      >
                        <p className="text-sm text-muted mb-1">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                        <div className="text-4xl mb-2">
                          {getWeatherIcon(day.icon, `${day.date} 12:00:00`)}
                        </div>
                        <p className="text-lg font-bold text-foreground">{day.temperature.max}°C</p>
                        <p className="text-sm text-muted">{day.temperature.min}°C</p>
                        <p className="text-xs text-muted mt-1">{day.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                
                <Mapbox3DMap
                  location={currentLocation.name}
                  latitude={currentLocation.latitude}
                  longitude={currentLocation.longitude}
                />
                
                <WeatherDetails weather={weatherData} />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      {/* Weather Records Manager Modal */}
      <AnimatePresence>
        {showRecordsManager && (
          <WeatherRecordsManager onClose={() => setShowRecordsManager(false)} />
        )}
      </AnimatePresence>

    </div>
  );
}
