// import { WeatherRecord } from '@/models/WeatherRecord';

export interface WeatherRecordData {
  location: string;
  startDate: string;
  endDate: string;
}

export interface WeatherRecordFilters {
  location?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  page?: number;
}

export class WeatherRecordsService {
  static async createRecord(data: WeatherRecordData) {
    const response = await fetch('/api/weather/records', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to create weather record');
    }

    return result;
  }

  static async getRecords(filters: WeatherRecordFilters = {}) {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`/api/weather/records?${params.toString()}`);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch weather records');
    }

    return result;
  }

  static async getRecord(id: string) {
    const response = await fetch(`/api/weather/records/${id}`);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch weather record');
    }

    return result;
  }

  static async updateRecord(id: string, data: Partial<WeatherRecordData>) {
    const response = await fetch(`/api/weather/records/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to update weather record');
    }

    return result;
  }

  static async deleteRecord(id: string) {
    const response = await fetch(`/api/weather/records/${id}`, {
      method: 'DELETE',
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to delete weather record');
    }

    return result;
  }
}
