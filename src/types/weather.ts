export interface WeatherData {
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDirection: number;
    description: string;
    icon: string;
  };
  forecast: Array<{
    date: string;
    temperature: {
      min: number;
      max: number;
    };
    description: string;
    icon: string;
  }>;
}

export interface LocationData {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  state?: string;
  timezone?: string;
  localTime?: string;
}

export interface WeatherApiResponse {
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    wind_speed: number;
    wind_deg: number;
    weather: Array<{
      description: string;
      icon: string;
    }>;
  };
  daily: Array<{
    dt: number;
    temp: {
      min: number;
      max: number;
    };
    weather: Array<{
      description: string;
      icon: string;
    }>;
  }>;
}
