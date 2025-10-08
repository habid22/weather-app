'use client';

import { motion } from 'framer-motion';
import { Calendar, Thermometer, Wind, Droplets, Eye } from 'lucide-react';

interface DailyData {
  date: string;
  temperature: {
    current: number;
    min: number;
    max: number;
    feelsLike: number;
  };
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  description: string;
  icon: string;
}

interface HistoricalWeatherDetailsProps {
  dailyData: DailyData[];
  location: string;
  dateRange: {
    start: string;
    end: string;
  };
}

export default function HistoricalWeatherDetails({ 
  dailyData, 
  location, 
  dateRange 
}: HistoricalWeatherDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDayAndDate = (dateString: string) => {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return { dayOfWeek: 'Invalid Date', fullDate: 'Invalid Date' };
    }
    
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const fullDate = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    return { dayOfWeek, fullDate };
  };

  const formatTemperature = (temp: number) => {
    return `${Math.round(temp)}°C`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-foreground mb-2">
          Historical Weather Data
        </h3>
        <p className="text-muted">
          {location} • {formatDayAndDate(dateRange.start).fullDate} - {formatDayAndDate(dateRange.end).fullDate}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dailyData.map((day, index) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-background rounded-lg border border-subtle p-4 hover:border-primary/50 transition-colors"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium text-foreground text-sm">
                  {formatDayAndDate(day.date).dayOfWeek}
                </h4>
                <p className="text-xs text-muted">
                  {formatDayAndDate(day.date).fullDate}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <img 
                  src={`https:${day.icon}`} 
                  alt={day.description} 
                  className="w-8 h-8" 
                />
                <div className="text-right">
                  <div className="text-lg font-bold text-foreground">
                    {formatTemperature(day.temperature.current)}
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Description */}
            <p className="text-xs text-muted mb-3">{day.description}</p>

            {/* Compact Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center space-x-1">
                <Thermometer className="w-3 h-3 text-muted" />
                <span className="text-muted">Temp:</span>
                <span className="font-medium text-foreground">
                  {formatTemperature(day.temperature.min)}-{formatTemperature(day.temperature.max)}
                </span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Wind className="w-3 h-3 text-muted" />
                <span className="text-muted">Wind:</span>
                <span className="font-medium text-foreground">
                  {day.windSpeed} m/s
                </span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Droplets className="w-3 h-3 text-muted" />
                <span className="text-muted">Humidity:</span>
                <span className="font-medium text-foreground">
                  {day.humidity}%
                </span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3 text-muted" />
                <span className="text-muted">Pressure:</span>
                <span className="font-medium text-foreground">
                  {day.pressure} mb
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
