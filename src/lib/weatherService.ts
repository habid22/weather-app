import axios from 'axios';
import { WeatherApiResponse, WeatherData, LocationData } from '@/types/weather';

const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || '37001647cefc4a8cb2c172227250710';
const BASE_URL = 'https://api.weatherapi.com/v1';

export class WeatherService {
  private static async makeRequest<T>(url: string): Promise<T> {
    try {
      const response = await axios.get<T>(url);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your WeatherAPI key.');
      } else if (error.response?.status === 404) {
        throw new Error('Location not found. Please check the location and try again.');
      } else if (error.response?.status === 429) {
        throw new Error('API rate limit exceeded. Please try again later.');
      } else {
        throw new Error(`Weather service error: ${error.message}`);
      }
    }
  }

  // Check if date range is in the past
  private static isHistoricalDateRange(startDate: string, endDate: string): boolean {
    // Parse dates without timezone conversion
    const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
    const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
    
    const start = new Date(startYear, startMonth - 1, startDay);
    const end = new Date(endYear, endMonth - 1, endDay);
    const now = new Date();
    
    // If the end date is before today, it's historical
    return end < now;
  }

  // Get historical weather data for a date range
  private static async getHistoricalWeather(location: string, startDate: string, endDate: string): Promise<{ location: LocationData; weather: WeatherData }> {
    // Parse dates without timezone conversion to avoid date shifting
    const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
    const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
    
    const start = new Date(startYear, startMonth - 1, startDay);
    const end = new Date(endYear, endMonth - 1, endDay);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Limit to 10 days for historical data (API limitation)
    const maxDays = Math.min(days, 10);
    
    // Get historical data for each day
    const historicalData = [];
    let locationData: LocationData | null = null;
    
    for (let i = 0; i < maxDays; i++) {
      const currentDate = new Date(startYear, startMonth - 1, startDay + i);
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      const currentDay = currentDate.getDate();
      
      // Format date as YYYY-MM-DD without timezone conversion
      const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`;
      
      try {
        const url = `${BASE_URL}/history.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}&dt=${dateStr}`;
        const dayData = await this.makeRequest<any>(url);
        
        if (!locationData) {
          locationData = {
            name: dayData.location.name,
            latitude: dayData.location.lat,
            longitude: dayData.location.lon,
            country: dayData.location.country,
            state: dayData.location.region,
          };
        }
        
        const day = dayData.forecast.forecastday[0].day;
        historicalData.push({
          date: new Date(currentYear, currentMonth - 1, currentDay).toISOString(),
          temperature: {
            current: Math.round(day.avgtemp_c || 0),
            min: Math.round(day.mintemp_c || 0),
            max: Math.round(day.maxtemp_c || 0),
            feelsLike: Math.round(day.avgtemp_c || 0),
          },
          description: day.condition?.text || 'Unknown',
          icon: day.condition?.icon || '//cdn.weatherapi.com/weather/64x64/day/113.png',
          humidity: day.avghumidity || 0,
          pressure: day.avgpressure_mb || 1013.25,
          windSpeed: Math.round(((day.maxwind_kph || 0) / 3.6) * 10) / 10,
          windDirection: day.avgwind_degree || 0,
        });
      } catch (error) {
        console.warn(`Failed to fetch historical data for ${dateStr}:`, error);
        // Continue with other dates even if one fails
      }
    }
    
    if (!locationData || historicalData.length === 0) {
      throw new Error('No historical weather data available for the specified date range');
    }
    
    // For historical data, use the first day's data as "current" and show all days in forecast
    const firstDay = historicalData[0];
    
    const weatherData: WeatherData = {
      current: {
        temperature: firstDay.temperature.current,
        feelsLike: firstDay.temperature.feelsLike,
        humidity: firstDay.humidity,
        pressure: firstDay.pressure,
        windSpeed: firstDay.windSpeed,
        windDirection: firstDay.windDirection,
        description: firstDay.description,
        icon: firstDay.icon,
      },
      forecast: historicalData.map(day => ({
        date: day.date,
        temperature: {
          min: day.temperature.min,
          max: day.temperature.max,
        },
        description: day.description,
        icon: day.icon,
      })),
    };
    
    return {
      location: locationData,
      weather: weatherData,
      dailyHistoricalData: historicalData, // Include raw daily data
    };
  }

  // New method to get weather data with date range support
  static async getWeatherByLocationAndDateRange(
    location: string, 
    startDate?: string, 
    endDate?: string
  ): Promise<{ location: LocationData; weather: WeatherData; isHistorical: boolean; dailyData?: any[] }> {
    console.log('WeatherService.getWeatherByLocationAndDateRange called with:', { location, startDate, endDate });
    
    if (!WEATHER_API_KEY) {
      console.error('Weather API key is not configured');
      throw new Error('Weather API key is not configured');
    }

    // If no date range provided, get current weather
    if (!startDate || !endDate) {
      const currentWeather = await this.getWeatherByLocation(location);
      return {
        ...currentWeather,
        isHistorical: false
      };
    }

    // Check if this is a historical date range
    const isHistorical = this.isHistoricalDateRange(startDate, endDate);
    
    if (isHistorical) {
      console.log('Fetching historical weather data for date range:', startDate, 'to', endDate);
      const historicalWeather = await this.getHistoricalWeather(location, startDate, endDate);
      return {
        ...historicalWeather,
        isHistorical: true,
        dailyData: historicalWeather.dailyHistoricalData
      };
    } else {
      console.log('Fetching current weather data for future date range');
      const currentWeather = await this.getWeatherByLocation(location);
      return {
        ...currentWeather,
        isHistorical: false
      };
    }
  }

  static async getWeatherByLocation(location: string): Promise<{ location: LocationData; weather: WeatherData }> {
    console.log('WeatherService.getWeatherByLocation called with:', location);
    console.log('Environment variable check:');
    console.log('- NEXT_PUBLIC_WEATHER_API_KEY from process.env:', process.env.NEXT_PUBLIC_WEATHER_API_KEY);
    console.log('- WEATHER_API_KEY final value:', WEATHER_API_KEY);
    console.log('- WEATHER_API_KEY exists:', !!WEATHER_API_KEY);
    console.log('- WEATHER_API_KEY value:', WEATHER_API_KEY ? `${WEATHER_API_KEY.substring(0, 8)}...` : 'undefined');
    
    if (!WEATHER_API_KEY) {
      console.error('Weather API key is not configured');
      throw new Error('Weather API key is not configured');
    }

    // Use forecast.json endpoint which includes both current weather and forecast
    const url = `${BASE_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}&days=5`;
    console.log('Making request to:', url.replace(WEATHER_API_KEY, 'HIDDEN_KEY'));
    const data = await this.makeRequest<any>(url);

    const locationData: LocationData = {
      name: data.location.name,
      latitude: data.location.lat,
      longitude: data.location.lon,
      country: data.location.country,
      state: data.location.region,
    };

    const weatherData: WeatherData = {
      current: {
        temperature: Math.round(data.current.temp_c),
        feelsLike: Math.round(data.current.feelslike_c),
        humidity: data.current.humidity,
        pressure: data.current.pressure_mb,
        windSpeed: Math.round((data.current.wind_kph / 3.6) * 10) / 10, // Convert km/h to m/s and round to 1 decimal
        windDirection: data.current.wind_degree,
        description: data.current.condition.text,
        icon: data.current.condition.icon,
      },
      forecast: data.forecast.forecastday.slice(0, 5).map((day: any) => ({
        date: day.date,
        temperature: {
          min: Math.round(day.day.mintemp_c),
          max: Math.round(day.day.maxtemp_c),
        },
        description: day.day.condition.text,
        icon: day.day.condition.icon,
      })),
    };

    return {
      location: locationData,
      weather: weatherData,
    };
  }
}
