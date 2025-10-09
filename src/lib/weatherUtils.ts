// Function to determine if it's day or night based on local time
export function isDayTime(localTime: string, timezone?: string): boolean {
  try {
    const now = new Date();
    let localDateTime: Date;
    
    if (timezone) {
      // Use the timezone to get the local time
      const localTimeString = now.toLocaleString('en-US', { timeZone: timezone });
      localDateTime = new Date(localTimeString);
    } else if (localTime) {
      // Use the provided local time
      localDateTime = new Date(localTime);
    } else {
      // Fallback to current time
      localDateTime = now;
    }
    
    const hour = localDateTime.getHours();
    // Consider day time from 6 AM to 8 PM
    return hour >= 6 && hour < 20;
  } catch (error) {
    // Fallback to current time if parsing fails
    const hour = new Date().getHours();
    return hour >= 6 && hour < 20;
  }
}

export function getWeatherIcon(iconCode: string, localTime?: string, timezone?: string): string {
  // Determine if it's day or night
  const isDay = isDayTime(localTime || '', timezone);
  
  const iconMap: { [key: string]: string } = {
    // Clear sky
    '01d': '☀️', // clear sky day
    '01n': '🌙', // clear sky night
    
    // Few clouds
    '02d': '⛅', // few clouds day
    '02n': '🌙☁️', // few clouds night
    
    // Scattered clouds
    '03d': '⛅', // scattered clouds day
    '03n': '☁️🌙', // scattered clouds night
    
    // Broken clouds
    '04d': '☁️', // broken clouds day
    '04n': '☁️🌙', // broken clouds night
    
    // Shower rain
    '09d': '🌦️', // shower rain
    '09n': '🌧️🌙', // shower rain night
    
    // Rain
    '10d': '🌧️', // rain day
    '10n': '🌧️🌙', // rain night
    
    // Thunderstorm
    '11d': '⛈️', // thunderstorm
    '11n': '⛈️🌙', // thunderstorm night
    
    // Snow
    '13d': '❄️', // snow
    '13n': '❄️🌙', // snow night
    
    // Mist
    '50d': '🌫️', // mist
    '50n': '🌫️🌙', // mist night
  };

  // If we have a specific day/night icon code, use it
  if (iconMap[iconCode]) {
    return iconMap[iconCode];
  }
  
  // If the icon code doesn't specify day/night, determine based on time
  const baseIconCode = iconCode.replace(/[dn]$/, ''); // Remove 'd' or 'n' suffix
  
  // Map base conditions to appropriate day/night icons
  const baseIconMap: { [key: string]: { day: string; night: string } } = {
    '01': { day: '☀️', night: '🌙' }, // clear sky
    '02': { day: '⛅', night: '🌙☁️' }, // few clouds
    '03': { day: '⛅', night: '☁️🌙' }, // scattered clouds
    '04': { day: '☁️', night: '☁️🌙' }, // broken clouds
    '09': { day: '🌦️', night: '🌧️🌙' }, // shower rain
    '10': { day: '🌧️', night: '🌧️🌙' }, // rain
    '11': { day: '⛈️', night: '⛈️🌙' }, // thunderstorm
    '13': { day: '❄️', night: '❄️🌙' }, // snow
    '50': { day: '🌫️', night: '🌫️🌙' }, // mist
  };
  
  const baseIcon = baseIconMap[baseIconCode];
  if (baseIcon) {
    return isDay ? baseIcon.day : baseIcon.night;
  }
  
  // Fallback
  return isDay ? '🌤️' : '🌙';
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
