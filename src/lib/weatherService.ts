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
        windSpeed: data.current.wind_kph / 3.6, // Convert km/h to m/s
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
