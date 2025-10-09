export interface LocationInfo {
  latitude: number;
  longitude: number;
  address: string;
  placeId?: string;
  formattedAddress: string;
}

export class MapsService {
  // Mapbox 3D implementation
  static generateMapboxUrl(latitude: number, longitude: number, zoom: number = 12): string {
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error('Mapbox access token is not configured');
    }
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-marker+ff0000(${longitude},${latitude})/${longitude},${latitude},${zoom},0/600x400@2x?access_token=${accessToken}`;
  }

  static generateMapboxEmbedUrl(latitude: number, longitude: number, zoom: number = 12): string {
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error('Mapbox access token is not configured');
    }
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-marker+ff0000(${longitude},${latitude})/${longitude},${latitude},${zoom},0/600x400@2x?access_token=${accessToken}`;
  }

  // Mapbox 3D GL JS configuration with your custom style
  static getMapboxConfig(latitude: number, longitude: number, zoom: number = 15.5) {
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error('Mapbox access token is not configured');
    }
    
    return {
      accessToken,
      style: 'mapbox://styles/johndoe13535/cmgihixjc002501s6643v08wv', // Your custom style
      center: [longitude, latitude],
      zoom: zoom,
      pitch: 45, // 3D tilt
      bearing: 0, // Rotation
      antialias: true,
      container: 'map', // Will be set dynamically
      interactive: true,
      terrain: {
        source: 'mapbox-dem',
        exaggeration: 1.5
      }
    };
  }

  // OpenStreetMap with Leaflet (no API key required)
  static generateOpenStreetMapUrl(latitude: number, longitude: number, zoom: number = 12): string {
    return `https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}&layer=mapnik&marker=${latitude},${longitude}`;
  }

  static generateOpenStreetMapStaticUrl(latitude: number, longitude: number, zoom: number = 12): string {
    return `https://tile.openstreetmap.org/${zoom}/${Math.floor((longitude + 180) / 360 * Math.pow(2, zoom))}/${Math.floor((1 - Math.log(Math.tan(latitude * Math.PI / 180) + 1 / Math.cos(latitude * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))}.png`;
  }

  // Here Maps (if you want to use it)
  static generateHereMapUrl(latitude: number, longitude: number, zoom: number = 12): string {
    const apiKey = process.env.HERE_API_KEY || 'your_here_api_key';
    return `https://image.maps.ls.hereapi.com/mia/1.6/mapview?apiKey=${apiKey}&c=${latitude},${longitude}&z=${zoom}&w=600&h=400&poi=${latitude},${longitude}`;
  }

  // Universal method that tries different providers
  static getMapLinks(location: string, latitude: number, longitude: number, provider: 'mapbox' | 'openstreetmap' | 'here' = 'mapbox') {
    const baseUrls = {
      mapbox: {
        embedUrl: this.generateMapboxEmbedUrl(latitude, longitude),
        staticMapUrl: this.generateMapboxUrl(latitude, longitude),
        directionsUrl: `https://www.mapbox.com/directions/?destination=${latitude},${longitude}`,
        streetViewUrl: `https://www.mapbox.com/streets/${latitude},${longitude}`,
        mapsUrl: `https://www.mapbox.com/maps/${latitude},${longitude}`
      },
      openstreetmap: {
        embedUrl: this.generateOpenStreetMapUrl(latitude, longitude),
        staticMapUrl: this.generateOpenStreetMapStaticUrl(latitude, longitude),
        directionsUrl: `https://www.openstreetmap.org/directions?to=${latitude},${longitude}`,
        streetViewUrl: `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=18`,
        mapsUrl: `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=12`
      },
      here: {
        embedUrl: this.generateHereMapUrl(latitude, longitude),
        staticMapUrl: this.generateHereMapUrl(latitude, longitude),
        directionsUrl: `https://wego.here.com/directions/mix/${latitude},${longitude}`,
        streetViewUrl: `https://wego.here.com/location/${latitude},${longitude}`,
        mapsUrl: `https://wego.here.com/location/${latitude},${longitude}`
      }
    };

    return baseUrls[provider];
  }
}
