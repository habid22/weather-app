import { useState, useEffect, useCallback } from 'react';
import { WeatherRecordsService, WeatherRecordFilters } from '@/lib/weatherRecordsService';

export interface WeatherRecord {
  _id: string;
  location: string;
  latitude: number;
  longitude: number;
  dateRange: {
    start: string;
    end: string;
  };
  temperatureData: {
    current: number;
    min: number;
    max: number;
    feelsLike: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDirection: number;
    description: string;
    icon: string;
  };
  forecast?: Array<{
    date: string;
    temperature: {
      min: number;
      max: number;
    };
    description: string;
    icon: string;
  }>;
  dailyData?: Array<{
    date: string;
    temperature: {
      current: number;
      min: number;
      max: number;
      feelsLike: number;
    };
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDirection: number;
    description: string;
    icon: string;
  }>;
  isHistorical: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WeatherRecordsResponse {
  success: boolean;
  data: WeatherRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function useWeatherRecords(initialFilters: WeatherRecordFilters = {}) {
  const [records, setRecords] = useState<WeatherRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0
  });
  const [filters, setFilters] = useState<WeatherRecordFilters>(initialFilters);

  const fetchRecords = useCallback(async (newFilters?: WeatherRecordFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const currentFilters = newFilters || filters;
      const response: WeatherRecordsResponse = await WeatherRecordsService.getRecords(currentFilters);
      
      setRecords(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createRecord = useCallback(async (data: {
    location: string;
    startDate: string;
    endDate: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      await WeatherRecordsService.createRecord(data);
      await fetchRecords(); // Refresh the list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchRecords]);

  const updateRecord = useCallback(async (id: string, data: {
    location?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      await WeatherRecordsService.updateRecord(id, data);
      await fetchRecords(); // Refresh the list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchRecords]);

  const deleteRecord = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await WeatherRecordsService.deleteRecord(id);
      await fetchRecords(); // Refresh the list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchRecords]);

  const updateFilters = useCallback((newFilters: WeatherRecordFilters) => {
    setFilters(newFilters);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch records when filters change
  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return {
    records,
    loading,
    error,
    pagination,
    filters,
    fetchRecords,
    createRecord,
    updateRecord,
    deleteRecord,
    updateFilters,
    clearError
  };
}
