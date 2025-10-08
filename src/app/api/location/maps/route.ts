import { NextRequest, NextResponse } from 'next/server';
import { MapsService } from '@/lib/mapsService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const latitude = parseFloat(searchParams.get('latitude') || '0');
    const longitude = parseFloat(searchParams.get('longitude') || '0');
    const zoom = parseInt(searchParams.get('zoom') || '12');
    const provider = (searchParams.get('provider') || 'mapbox') as 'mapbox' | 'openstreetmap' | 'here';

    console.log('Map API called with:', { location, latitude, longitude, provider });

    if (!location || latitude === 0 || longitude === 0) {
      console.log('Invalid parameters:', { location, latitude, longitude });
      return NextResponse.json(
        { success: false, error: 'Location, latitude, and longitude parameters are required' },
        { status: 400 }
      );
    }

    const mapLinks = MapsService.getMapLinks(location, latitude, longitude, provider);
    console.log('Generated map links:', mapLinks);
    
    return NextResponse.json({
      success: true,
      mapLinks,
      provider,
      location: {
        name: location,
        latitude,
        longitude
      }
    });

  } catch (error: any) {
    console.error('Error generating map links:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
