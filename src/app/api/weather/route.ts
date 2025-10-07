import { NextRequest, NextResponse } from 'next/server';
import { WeatherService } from '@/lib/weatherService';

export async function GET(request: NextRequest) {
  try {
    console.log('Weather API route called');
    console.log('Environment check:', {
      NODE_ENV: process.env.NODE_ENV,
      WEATHER_API_KEY_EXISTS: !!process.env.NEXT_PUBLIC_WEATHER_API_KEY,
      WEATHER_API_KEY_PREFIX: process.env.NEXT_PUBLIC_WEATHER_API_KEY ? process.env.NEXT_PUBLIC_WEATHER_API_KEY.substring(0, 8) : 'undefined',
      ALL_ENV_KEYS: Object.keys(process.env).filter(key => key.includes('WEATHER') || key.includes('API')),
      CWD: process.cwd(),
      ALL_NEXT_PUBLIC_KEYS: Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_')),
      RAW_WEATHER_KEY: process.env.NEXT_PUBLIC_WEATHER_API_KEY
    });
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    console.log('Request parameters:', { location, lat, lon });

    if (!location && (!lat || !lon)) {
      console.log('No location parameters provided');
      return NextResponse.json(
        { error: 'Location parameter is required' },
        { status: 400 }
      );
    }

    let weatherData;
    
    if (lat && lon) {
      // Direct coordinates provided - format as "lat,lon"
      const coordinateLocation = `${lat},${lon}`;
      console.log('Using coordinates:', coordinateLocation);
      weatherData = await WeatherService.getWeatherByLocation(coordinateLocation);
    } else {
      // Location string provided
      console.log('Using location string:', location);
      weatherData = await WeatherService.getWeatherByLocation(location!);
    }

    console.log('Weather data retrieved successfully');
    return NextResponse.json(weatherData);
  } catch (error: any) {
    console.error('Weather API error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json(
      { error: error.message || 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
