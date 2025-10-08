const YOUTUBE_API_KEY = 'AIzaSyAQksFhN6IeHClle-4Y4lhQTBrv0A0dptQ';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
  url: string;
}

export class YouTubeService {
  private static async makeRequest(url: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error: any) {
      console.error('YouTube API request failed:', error);
      throw new Error(`YouTube service error: ${error.message}`);
    }
  }

  static async searchVideosByLocation(location: string, maxResults: number = 5): Promise<YouTubeVideo[]> {
    if (!YOUTUBE_API_KEY) {
      throw new Error('YouTube API key is not configured');
    }

    try {
      // Search for videos about the location
      const searchQuery = `${location} travel guide tourism`;
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`;
      
      const searchResponse = await this.makeRequest(searchUrl);
      
      if (!searchResponse.items || searchResponse.items.length === 0) {
        return [];
      }

      // Get video details for duration and view count
      const videoIds = searchResponse.items.map((item: any) => item.id.videoId).join(',');
      const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
      
      const detailsResponse = await this.makeRequest(detailsUrl);
      const videoDetails = detailsResponse.items || [];

      // Combine search results with video details
      return searchResponse.items.map((item: any, index: number) => {
        const details = videoDetails[index] || {};
        const statistics = details.statistics || {};
        const contentDetails = details.contentDetails || {};

        return {
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
          channelTitle: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt,
          duration: this.formatDuration(contentDetails.duration),
          viewCount: this.formatViewCount(statistics.viewCount),
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`
        };
      });
    } catch (error: any) {
      console.error('Error fetching YouTube videos:', error);
      throw new Error(`Failed to fetch YouTube videos: ${error.message}`);
    }
  }

  private static formatDuration(duration: string): string {
    if (!duration) return 'Unknown';
    
    // Parse ISO 8601 duration (PT4M13S)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 'Unknown';
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }

  private static formatViewCount(viewCount: string): string {
    if (!viewCount) return '0 views';
    
    const count = parseInt(viewCount);
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K views`;
    } else {
      return `${count} views`;
    }
  }
}
