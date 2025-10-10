export interface LocationValidationResult {
  isValid: boolean;
  type: 'city' | 'zip' | 'coordinates' | 'unknown';
  normalizedInput: string;
  error?: string;
}

export class LocationValidator {
  static validate(input: string): LocationValidationResult {
    const trimmed = input.trim();
    
    if (!trimmed) {
      return {
        isValid: false,
        type: 'unknown',
        normalizedInput: '',
        error: 'Location cannot be empty'
      };
    }

    // Check for coordinates (lat,lon format)
    const coordPattern = /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/;
    if (coordPattern.test(trimmed)) {
      const [lat, lon] = trimmed.split(',').map(coord => parseFloat(coord.trim()));
      
      if (lat < -90 || lat > 90) {
        return {
          isValid: false,
          type: 'coordinates',
          normalizedInput: trimmed,
          error: 'Latitude must be between -90 and 90'
        };
      }
      
      if (lon < -180 || lon > 180) {
        return {
          isValid: false,
          type: 'coordinates',
          normalizedInput: trimmed,
          error: 'Longitude must be between -180 and 180'
        };
      }

      return {
        isValid: true,
        type: 'coordinates',
        normalizedInput: `${lat},${lon}`
      };
    }

    // Check for ZIP code (US format: 5 digits or 5+4 format)
    const zipPattern = /^\d{5}(-\d{4})?$/;
    if (zipPattern.test(trimmed)) {
      return {
        isValid: true,
        type: 'zip',
        normalizedInput: trimmed
      };
    }

    // Check for postal code (Canadian format: A1A 1A1)
    const canadianPostalPattern = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;
    if (canadianPostalPattern.test(trimmed)) {
      return {
        isValid: true,
        type: 'zip',
        normalizedInput: trimmed.toUpperCase()
      };
    }

    // Check for UK postal code
    const ukPostalPattern = /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/i;
    if (ukPostalPattern.test(trimmed)) {
      return {
        isValid: true,
        type: 'zip',
        normalizedInput: trimmed.toUpperCase()
      };
    }


    // Default to city/location
    if (trimmed.length >= 2) {
      return {
        isValid: true,
        type: 'city',
        normalizedInput: trimmed
      };
    }

    return {
      isValid: false,
      type: 'unknown',
      normalizedInput: trimmed,
      error: 'Location must be at least 2 characters long'
    };
  }

  static getInputTypeIcon(type: string): string {
    switch (type) {
      case 'coordinates':
        return '📍';
      case 'zip':
        return '📮';
      case 'city':
        return '🏙️';
      default:
        return '❓';
    }
  }

  static getInputTypeDescription(type: string): string {
    switch (type) {
      case 'coordinates':
        return 'Coordinates (latitude, longitude)';
      case 'zip':
        return 'ZIP/Postal Code';
      case 'city':
        return 'City or Location';
      default:
        return 'Unknown format';
    }
  }
}
