import { NextRequest, NextResponse } from 'next/server';
import { WeatherService } from '@/lib/weatherService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!location && (!lat || !lon)) {
      return NextResponse.json(
        { error: 'Location parameter is required' },
        { status: 400 }
      );
    }

    let weatherData;
    
    if (lat && lon) {
      // Direct coordinates provided
      const weather = await WeatherService.getWeatherData(parseFloat(lat), parseFloat(lon));
      weatherData = { weather };
    } else {
      // Location string provided
      weatherData = await WeatherService.getWeatherByLocation(location!);
    }

    return NextResponse.json(weatherData);
  } catch (error: any) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
