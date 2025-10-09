'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { WeatherData } from '@/types/weather';
import { getWeatherIcon } from '@/lib/weatherUtils';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Sun, 
  CloudRain,
  ChevronLeft,
  ChevronRight,
  Moon
} from 'lucide-react';

interface HourlyForecastProps {
  weather: WeatherData;
  location: string;
}

export default function HourlyForecast({ weather, location }: HourlyForecastProps) {
  const [selectedHour, setSelectedHour] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  
  if (!weather.hourly || weather.hourly.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card p-6 rounded-xl shadow-lg border border-subtle"
      >
        <div className="text-center py-8">
          <CloudRain className="w-12 h-12 text-muted mx-auto mb-4" />
          <p className="text-muted">Hourly forecast data not available</p>
        </div>
      </motion.div>
    );
  }

  const hoursPerPage = 8;
  const totalPages = Math.ceil(weather.hourly.length / hoursPerPage);
  const currentHours = weather.hourly.slice(
    currentPage * hoursPerPage,
    (currentPage + 1) * hoursPerPage
  );

  const selectedHourData = weather.hourly[selectedHour];

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const getUVIndexLevel = (uv: number) => {
    if (uv <= 2) return { level: 'Low', color: 'text-green-500' };
    if (uv <= 5) return { level: 'Moderate', color: 'text-yellow-500' };
    if (uv <= 7) return { level: 'High', color: 'text-orange-500' };
    if (uv <= 10) return { level: 'Very High', color: 'text-red-500' };
    return { level: 'Extreme', color: 'text-purple-500' };
  };

  const isNightTime = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    return hour >= 18 || hour < 6; // Night time from 6 PM to 6 AM
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card p-6 rounded-xl shadow-lg border border-subtle"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Thermometer className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">Hourly Forecast</h3>
        </div>
        <div className="text-sm text-muted">
          {location}
        </div>
      </div>

      {/* Hour Selection */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-foreground">Select Hour</h4>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="p-1 rounded-lg bg-background border border-subtle hover:bg-accent hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-muted px-2">
              {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className="p-1 rounded-lg bg-background border border-subtle hover:bg-accent hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {currentHours.map((hour, index) => {
            const globalIndex = currentPage * hoursPerPage + index;
            const isSelected = globalIndex === selectedHour;
            const isCurrentHour = globalIndex === 0; // Assuming first hour is current
            
            return (
              <motion.button
                key={globalIndex}
                onClick={() => setSelectedHour(globalIndex)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-lg border transition-all duration-200 ${
                  isSelected
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-subtle hover:border-primary/50 hover:bg-accent'
                }`}
              >
                <div className="text-center">
                  <div className={`text-xs font-medium ${isCurrentHour ? 'text-primary' : ''}`}>
                    {isCurrentHour ? 'Now' : hour.time}
                  </div>
                   <div className="text-2xl my-1">
                     {getWeatherIcon(hour.icon, `2024-01-01 ${hour.time}:00`)}
                   </div>
                  <div className="text-sm font-semibold">
                    {hour.temperature}°
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* View More Button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="px-4 py-2 bg-background border border-subtle rounded-lg hover:bg-accent hover:border-primary/50 hover:scale-105 transition-all duration-200 text-foreground font-medium"
        >
          {showDetails ? 'Show Less' : 'View More'}
        </button>
      </div>

      {/* Detailed Hour Information */}
      {showDetails && selectedHourData && (
        <motion.div
          key={selectedHour}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-background rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-foreground">
                {selectedHour === 0 ? 'Current' : selectedHourData.time}
              </h4>
              <p className="text-muted capitalize">{selectedHourData.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <img 
                src={`https:${selectedHourData.icon}`} 
                alt={selectedHourData.description}
                className="w-12 h-12"
              />
              <div className="text-3xl font-light text-foreground">
                {selectedHourData.temperature}°
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card rounded-lg p-4 border border-subtle">
              <div className="flex items-center space-x-2 mb-2">
                <Thermometer className="w-4 h-4 text-muted" />
                <span className="text-sm text-muted">Feels Like</span>
              </div>
              <div className="text-lg font-semibold text-foreground">
                {selectedHourData.feelsLike}°C
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 border border-subtle">
              <div className="flex items-center space-x-2 mb-2">
                <Droplets className="w-4 h-4 text-muted" />
                <span className="text-sm text-muted">Humidity</span>
              </div>
              <div className="text-lg font-semibold text-foreground">
                {selectedHourData.humidity}%
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 border border-subtle">
              <div className="flex items-center space-x-2 mb-2">
                <Wind className="w-4 h-4 text-muted" />
                <span className="text-sm text-muted">Wind</span>
              </div>
              <div className="text-lg font-semibold text-foreground">
                {selectedHourData.windSpeed} m/s
              </div>
              <div className="text-xs text-muted">
                {getWindDirection(selectedHourData.windDirection)}
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 border border-subtle">
              <div className="flex items-center space-x-2 mb-2">
                <Eye className="w-4 h-4 text-muted" />
                <span className="text-sm text-muted">Visibility</span>
              </div>
              <div className="text-lg font-semibold text-foreground">
                {selectedHourData.visibility} km
              </div>
            </div>

            {selectedHourData.precipitation > 0 && (
              <div className="bg-card rounded-lg p-4 border border-subtle">
                <div className="flex items-center space-x-2 mb-2">
                  <CloudRain className="w-4 h-4 text-muted" />
                  <span className="text-sm text-muted">Precipitation</span>
                </div>
                <div className="text-lg font-semibold text-foreground">
                  {selectedHourData.precipitation} mm
                </div>
              </div>
            )}

            <div className="bg-card rounded-lg p-4 border border-subtle">
              <div className="flex items-center space-x-2 mb-2">
                <Sun className="w-4 h-4 text-muted" />
                <span className="text-sm text-muted">UV Index</span>
              </div>
              <div className={`text-lg font-semibold ${getUVIndexLevel(selectedHourData.uvIndex).color}`}>
                {selectedHourData.uvIndex}
              </div>
              <div className="text-xs text-muted">
                {getUVIndexLevel(selectedHourData.uvIndex).level}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
