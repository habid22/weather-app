import axios from 'axios';
import { WeatherApiResponse, WeatherData, LocationData } from '@/types/weather';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export class WeatherService {
  private static async makeRequest<T>(url: string): Promise<T> {
    try {
      const response = await axios.get<T>(url);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
      } else if (error.response?.status === 404) {
        throw new Error('Location not found. Please check the location and try again.');
      } else if (error.response?.status === 429) {
        throw new Error('API rate limit exceeded. Please try again later.');
      } else {
        throw new Error(`Weather service error: ${error.message}`);
      }
    }
  }

  static async getCoordinates(location: string): Promise<LocationData> {
    if (!OPENWEATHER_API_KEY) {
      throw new Error('OpenWeatherMap API key is not configured');
    }

    const url = `${BASE_URL}/weather?q=${encodeURIComponent(location)}&appid=${OPENWEATHER_API_KEY}`;
    const data = await this.makeRequest<any>(url);

    return {
      name: data.name,
      latitude: data.coord.lat,
      longitude: data.coord.lon,
      country: data.sys.country,
      state: data.sys.state,
    };
  }

  static async getWeatherData(lat: number, lon: number): Promise<WeatherData> {
    if (!OPENWEATHER_API_KEY) {
      throw new Error('OpenWeatherMap API key is not configured');
    }

    const url = `${BASE_URL}/onecall?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&exclude=minutely,alerts`;
    const data = await this.makeRequest<WeatherApiResponse>(url);

    return {
      current: {
        temperature: Math.round(data.current.temp),
        feelsLike: Math.round(data.current.feels_like),
        humidity: data.current.humidity,
        pressure: data.current.pressure,
        windSpeed: data.current.wind_speed,
        windDirection: data.current.wind_deg,
        description: data.current.weather[0].description,
        icon: data.current.weather[0].icon,
      },
      forecast: data.daily.slice(0, 5).map(day => ({
        date: new Date(day.dt * 1000).toISOString().split('T')[0],
        temperature: {
          min: Math.round(day.temp.min),
          max: Math.round(day.temp.max),
        },
        description: day.weather[0].description,
        icon: day.weather[0].icon,
      })),
    };
  }

  static async getWeatherByLocation(location: string): Promise<{ location: LocationData; weather: WeatherData }> {
    const locationData = await this.getCoordinates(location);
    const weatherData = await this.getWeatherData(locationData.latitude, locationData.longitude);
    
    return {
      location: locationData,
      weather: weatherData,
    };
  }
}
