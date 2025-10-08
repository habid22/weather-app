import { NextRequest, NextResponse } from 'next/server';
import { YouTubeService } from '@/lib/youtubeService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const maxResults = parseInt(searchParams.get('maxResults') || '5');

    if (!location) {
      return NextResponse.json(
        { success: false, error: 'Location parameter is required' },
        { status: 400 }
      );
    }

    const videos = await YouTubeService.searchVideosByLocation(location, maxResults);
    
    return NextResponse.json({
      success: true,
      videos,
      location
    });

  } catch (error: any) {
    console.error('Error fetching YouTube videos:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
