'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { LocationData, WeatherData } from '@/types/weather';
import { getWeatherIcon, getWeatherGradient, getWeatherDescription } from '@/lib/weatherUtils';

interface WeatherCardProps {
  location: LocationData;
  weather: WeatherData;
  isLoading?: boolean;
}

export default function WeatherCard({ location, weather, isLoading = false }: WeatherCardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return <WeatherCardSkeleton />;
  }

  const gradient = getWeatherGradient(weather.current.description);
  const icon = getWeatherIcon(weather.current.icon, location.localTime, location.timezone);
  const description = getWeatherDescription(weather.current.description);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl shadow-2xl"
    >
      {/* Card Background */}
      <div className="absolute inset-0 bg-card" />
      
      {/* Subtle Overlay */}
      <div className="absolute inset-0 bg-white/[0.02]" />
      
      {/* Content */}
      <div className="relative z-10 p-8 text-foreground">
        {/* Location and Local Time */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex justify-between items-start"
        >
          <div>
            <h1 className="text-2xl font-semibold mb-1">{location.name}</h1>
            <p className="text-muted text-sm font-medium">
              {location.state && `${location.state}, `}{location.country}
            </p>
          </div>
          
          {/* Local Time */}
          {location.timezone && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-right"
            >
              <div className="text-lg font-semibold text-foreground">
                {currentTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                  timeZone: location.timezone
                })}
              </div>
              <div className="text-xs text-muted font-medium">
                Local Time
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Main Weather Info */}
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="flex items-center space-x-4"
          >
            <div className="text-6xl">
              {icon}
            </div>
            <div>
              <div className="text-5xl font-light mb-1">
                {weather.current.temperature}°
              </div>
              <div className="text-lg text-foreground capitalize font-medium">
                {description}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Weather Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-4"
        >
          <WeatherDetail
            icon="🌡️"
            label="Feels Like"
            value={`${weather.current.feelsLike}°`}
          />
          <WeatherDetail
            icon="💧"
            label="Humidity"
            value={`${weather.current.humidity}%`}
          />
          <WeatherDetail
            icon="🌬️"
            label="Wind"
            value={`${weather.current.windSpeed} m/s`}
          />
          <WeatherDetail
            icon="📊"
            label="Pressure"
            value={`${weather.current.pressure} hPa`}
          />
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 pt-6 border-t border-subtle"
        >
          <div className="flex items-center justify-between text-sm text-muted font-medium">
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
            <span>Wind Direction: {weather.current.windDirection}°</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function WeatherDetail({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-secondary rounded-xl p-4 text-center border border-subtle"
        >
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-sm text-muted mb-1 font-medium">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </motion.div>
  );
}

function WeatherCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-gray-200 animate-pulse">
      <div className="p-8">
        <div className="mb-6">
          <div className="h-8 bg-gray-300 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </div>
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
            <div>
              <div className="h-12 bg-gray-300 rounded w-24 mb-2"></div>
              <div className="h-6 bg-gray-300 rounded w-32"></div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-300 rounded-xl p-4 h-20"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
