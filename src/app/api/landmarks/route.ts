import { NextRequest, NextResponse } from 'next/server';
import { LandmarkService } from '@/lib/landmarks';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category') as any;
    const limit = parseInt(searchParams.get('limit') || '10');

    let landmarks;

    if (query) {
      landmarks = LandmarkService.searchLandmarks(query).slice(0, limit);
    } else if (category) {
      landmarks = LandmarkService.getLandmarksByCategory(category).slice(0, limit);
    } else {
      landmarks = LandmarkService.getRandomLandmarks(limit);
    }

    return NextResponse.json({
      success: true,
      data: landmarks,
      count: landmarks.length
    });

  } catch (error: any) {
    console.error('Landmarks API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch landmarks',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
