import { NextRequest, NextResponse } from 'next/server';
import { WeatherService } from '@/lib/weatherService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');

    if (!location) {
      return NextResponse.json(
        { error: 'Location parameter is required' },
        { status: 400 }
      );
    }

    const coordinates = await WeatherService.getCoordinates(location);
    return NextResponse.json(coordinates);
  } catch (error: any) {
    console.error('Coordinates API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get coordinates' },
      { status: 500 }
    );
  }
}
