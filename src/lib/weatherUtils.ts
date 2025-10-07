export function getWeatherIcon(iconCode: string): string {
  const iconMap: { [key: string]: string } = {
    // Clear sky
    '01d': '☀️', // clear sky day
    '01n': '🌙', // clear sky night
    
    // Few clouds
    '02d': '⛅', // few clouds day
    '02n': '☁️', // few clouds night
    
    // Scattered clouds
    '03d': '☁️', // scattered clouds
    '03n': '☁️', // scattered clouds
    
    // Broken clouds
    '04d': '☁️', // broken clouds
    '04n': '☁️', // broken clouds
    
    // Shower rain
    '09d': '🌦️', // shower rain
    '09n': '🌦️', // shower rain
    
    // Rain
    '10d': '🌧️', // rain day
    '10n': '🌧️', // rain night
    
    // Thunderstorm
    '11d': '⛈️', // thunderstorm
    '11n': '⛈️', // thunderstorm
    
    // Snow
    '13d': '❄️', // snow
    '13n': '❄️', // snow
    
    // Mist
    '50d': '🌫️', // mist
    '50n': '🌫️', // mist
  };

  return iconMap[iconCode] || '🌤️';
}

export function getWeatherGradient(description: string): string {
  const desc = description.toLowerCase();
  
  if (desc.includes('clear') || desc.includes('sunny')) {
    return 'from-yellow-400 via-orange-500 to-red-500';
  }
  
  if (desc.includes('cloud')) {
    return 'from-gray-400 via-gray-500 to-gray-600';
  }
  
  if (desc.includes('rain') || desc.includes('drizzle')) {
    return 'from-blue-400 via-blue-500 to-blue-600';
  }
  
  if (desc.includes('storm') || desc.includes('thunder')) {
    return 'from-purple-600 via-purple-700 to-gray-800';
  }
  
  if (desc.includes('snow') || desc.includes('blizzard')) {
    return 'from-blue-100 via-blue-200 to-blue-300';
  }
  
  if (desc.includes('mist') || desc.includes('fog') || desc.includes('haze')) {
    return 'from-gray-300 via-gray-400 to-gray-500';
  }
  
  // Default gradient
  return 'from-blue-400 via-blue-500 to-blue-600';
}

export function getWeatherDescription(description: string): string {
  return description
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getWindDirection(degrees: number): string {
  const directions = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
  ];
  
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export function getUVIndexDescription(uvIndex: number): { level: string; color: string; description: string } {
  if (uvIndex <= 2) {
    return { level: 'Low', color: 'text-green-600', description: 'Minimal protection required' };
  } else if (uvIndex <= 5) {
    return { level: 'Moderate', color: 'text-yellow-600', description: 'Some protection required' };
  } else if (uvIndex <= 7) {
    return { level: 'High', color: 'text-orange-600', description: 'Protection required' };
  } else if (uvIndex <= 10) {
    return { level: 'Very High', color: 'text-red-600', description: 'Extra protection required' };
  } else {
    return { level: 'Extreme', color: 'text-purple-600', description: 'Avoid sun exposure' };
  }
}

export function getComfortLevel(temperature: number, humidity: number): { level: string; color: string; description: string } {
  // Heat index calculation (simplified)
  const heatIndex = temperature + (humidity / 100) * 10;
  
  if (heatIndex < 20) {
    return { level: 'Cold', color: 'text-blue-600', description: 'Bundle up!' };
  } else if (heatIndex < 25) {
    return { level: 'Cool', color: 'text-blue-500', description: 'Light jacket recommended' };
  } else if (heatIndex < 30) {
    return { level: 'Comfortable', color: 'text-green-600', description: 'Perfect weather!' };
  } else if (heatIndex < 35) {
    return { level: 'Warm', color: 'text-yellow-600', description: 'Light clothing recommended' };
  } else if (heatIndex < 40) {
    return { level: 'Hot', color: 'text-orange-600', description: 'Stay hydrated!' };
  } else {
    return { level: 'Very Hot', color: 'text-red-600', description: 'Avoid outdoor activities' };
  }
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString([], { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}
