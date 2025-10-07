'use client';

import { motion } from 'framer-motion';
import { WeatherData } from '@/types/weather';
import { getWindDirection, getComfortLevel } from '@/lib/weatherUtils';

interface WeatherDetailsProps {
  weather: WeatherData;
}

export default function WeatherDetails({ weather }: WeatherDetailsProps) {
  const comfort = getComfortLevel(weather.current.temperature, weather.current.humidity);
  const windDirection = getWindDirection(weather.current.windDirection);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-card rounded-2xl p-6 shadow-xl border border-subtle"
    >
      <h3 className="text-xl font-semibold text-foreground mb-6">Weather Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Comfort Level */}
        <DetailItem
          icon="😌"
          label="Comfort Level"
          value={comfort.level}
          description={comfort.description}
          color={comfort.color}
        />
        
        {/* Wind Direction */}
        <DetailItem
          icon="🧭"
          label="Wind Direction"
          value={windDirection}
          description={`${weather.current.windDirection}°`}
        />
        
        {/* Visibility (if available) */}
        <DetailItem
          icon="👁️"
          label="Visibility"
          value="10+ km"
          description="Clear visibility"
        />
        
        {/* UV Index (if available) */}
        <DetailItem
          icon="☀️"
          label="UV Index"
          value="Moderate"
          description="Some protection required"
          color="text-yellow-600"
        />
      </div>

      {/* Additional Weather Insights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 pt-6 border-t border-subtle"
      >
        <h4 className="text-lg font-semibold text-foreground mb-3">Weather Insights</h4>
        <div className="space-y-2 text-sm text-muted font-medium">
          <p>• {getWeatherInsight(weather.current.temperature, weather.current.description)}</p>
          <p>• {getClothingRecommendation(weather.current.temperature, weather.current.description)}</p>
          <p>• {getActivityRecommendation(weather.current.description)}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DetailItem({ 
  icon, 
  label, 
  value, 
  description, 
  color = "text-white" 
}: { 
  icon: string; 
  label: string; 
  value: string; 
  description: string; 
  color?: string; 
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-secondary rounded-xl p-4 border border-subtle"
    >
      <div className="flex items-center space-x-3">
        <div className="text-2xl">{icon}</div>
        <div>
          <div className="text-sm text-muted font-medium">{label}</div>
          <div className={`font-semibold ${color}`}>{value}</div>
          <div className="text-xs text-muted font-medium">{description}</div>
        </div>
      </div>
    </motion.div>
  );
}

function getWeatherInsight(temperature: number, description: string): string {
  if (temperature > 30) {
    return "Hot weather - perfect for swimming or indoor activities";
  } else if (temperature > 20) {
    return "Pleasant weather - great for outdoor activities";
  } else if (temperature > 10) {
    return "Cool weather - light jacket recommended";
  } else {
    return "Cold weather - bundle up and stay warm";
  }
}

function getClothingRecommendation(temperature: number, description: string): string {
  if (description.includes('rain')) {
    return "Don't forget your umbrella and rain jacket";
  } else if (temperature > 25) {
    return "Light, breathable clothing recommended";
  } else if (temperature > 15) {
    return "Light layers work well for this temperature";
  } else {
    return "Warm clothing and layers are essential";
  }
}

function getActivityRecommendation(description: string): string {
  if (description.includes('clear') || description.includes('sunny')) {
    return "Perfect weather for outdoor activities and sightseeing";
  } else if (description.includes('cloud')) {
    return "Good weather for walking and outdoor activities";
  } else if (description.includes('rain')) {
    return "Indoor activities or museums would be ideal";
  } else if (description.includes('storm')) {
    return "Stay indoors and enjoy indoor activities";
  } else {
    return "Weather is suitable for most activities";
  }
}
