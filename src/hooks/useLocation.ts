'use client';

import { useState, useCallback } from 'react';
import { GeolocationService } from '@/lib/geolocation';
import { LocationValidator } from '@/lib/locationUtils';
import { LocationData, WeatherData } from '@/types/weather';

interface UseLocationReturn {
  currentLocation: LocationData | null;
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  searchLocation: (location: string) => Promise<void>;
  getCurrentLocation: () => Promise<void>;
  clearError: () => void;
}

export function useLocation(): UseLocationReturn {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const searchLocation = useCallback(async (location: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate input
      const validation = LocationValidator.validate(location);
      if (!validation.isValid) {
        throw new Error(validation.error || 'Invalid location format');
      }

      // Call our API route
      const response = await fetch(`/api/weather?location=${encodeURIComponent(validation.normalizedInput)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch weather data');
      }

      const result = await response.json();
      
      setCurrentLocation(result.location);
      setWeatherData(result.weather);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data');
      setCurrentLocation(null);
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCurrentLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get current position
      const coords = await GeolocationService.getCurrentPosition();
      
      // Call our API route with coordinates
      const response = await fetch(`/api/weather?lat=${coords.latitude}&lon=${coords.longitude}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch weather data');
      }

      const result = await response.json();
      
      setCurrentLocation(result.location);
      setWeatherData(result.weather);
    } catch (err: any) {
      setError(err.message || 'Failed to get current location');
      setCurrentLocation(null);
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    currentLocation,
    weatherData,
    isLoading,
    error,
    searchLocation,
    getCurrentLocation,
    clearError,
  };
}
