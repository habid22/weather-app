'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Calendar, 
  MapPin, 
  Thermometer,
  Wind,
  Droplets,
  Eye,
  X,
  History,
  Clock
} from 'lucide-react';
import { useWeatherRecords } from '@/hooks/useWeatherRecords';
import { WeatherRecord } from '@/hooks/useWeatherRecords';
import HistoricalWeatherDetails from './HistoricalWeatherDetails';

interface WeatherRecordsManagerProps {
  onClose?: () => void;
}

export default function WeatherRecordsManager({ onClose }: WeatherRecordsManagerProps) {
  const {
    records,
    loading,
    error,
    pagination,
    filters,
    createRecord,
    updateRecord,
    deleteRecord,
    updateFilters,
    clearError
  } = useWeatherRecords();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingRecord, setEditingRecord] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<WeatherRecord | null>(null);
  const [formData, setFormData] = useState({
    location: '',
    startDate: '',
    endDate: '',
    updateWeatherData: false
  });

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRecord({
        location: formData.location,
        startDate: formData.startDate,
        endDate: formData.endDate
      });
      setFormData({ location: '', startDate: '', endDate: '', updateWeatherData: false });
      setShowCreateForm(false);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleUpdateRecord = async (id: string, data: any) => {
    try {
      await updateRecord(id, data);
      setEditingRecord(null);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (confirm('Are you sure you want to delete this weather record?')) {
      try {
        await deleteRecord(id);
      } catch (error) {
        // Error is handled by the hook
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTemperature = (temp: number) => {
    return `${Math.round(temp)}°C`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-card rounded-xl shadow-2xl border border-subtle w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-subtle">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Weather Records</h2>
            <p className="text-muted">Manage your saved weather data</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-lg bg-background border border-subtle hover:bg-accent transition-colors"
            >
              <Filter className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowCreateForm(true)}
              className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-background border border-subtle hover:bg-accent transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-6 border-b border-subtle bg-background"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                  <input
                    type="text"
                    value={filters.location || ''}
                    onChange={(e) => updateFilters({ ...filters, location: e.target.value })}
                    placeholder="Filter by location..."
                    className="w-full p-2 rounded-lg bg-card border border-subtle text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Start Date</label>
                  <input
                    type="date"
                    value={filters.startDate || ''}
                    onChange={(e) => updateFilters({ ...filters, startDate: e.target.value })}
                    className="w-full p-2 rounded-lg bg-card border border-subtle text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">End Date</label>
                  <input
                    type="date"
                    value={filters.endDate || ''}
                    onChange={(e) => updateFilters({ ...filters, endDate: e.target.value })}
                    className="w-full p-2 rounded-lg bg-card border border-subtle text-foreground"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button onClick={clearError} className="text-destructive hover:text-destructive/80">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted mb-4">No weather records found</div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create First Record
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {records.map((record) => (
                <motion.div
                  key={record._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-background rounded-lg border border-subtle p-4 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="font-medium text-foreground">{record.location}</span>
                      {record.isHistorical ? (
                        <div className="flex items-center space-x-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-full text-xs">
                          <History className="w-3 h-3" />
                          <span>Historical</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                          <Clock className="w-3 h-3" />
                          <span>Current</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setSelectedRecord(record)}
                        className="p-1 rounded hover:bg-accent transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4 text-muted" />
                      </button>
                      <button
                        onClick={() => setEditingRecord(record._id)}
                        className="p-1 rounded hover:bg-accent transition-colors"
                        title="Edit record"
                      >
                        <Edit className="w-4 h-4 text-muted" />
                      </button>
                      <button
                        onClick={() => handleDeleteRecord(record._id)}
                        className="p-1 rounded hover:bg-destructive/10 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted" />
                      <span className="text-muted">
                        {formatDate(record.dateRange.start)} - {formatDate(record.dateRange.end)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Thermometer className="w-4 h-4 text-muted" />
                        <span className="text-foreground font-medium">
                          {formatTemperature(record.temperatureData.current)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Wind className="w-4 h-4 text-muted" />
                        <span className="text-muted">
                          {record.temperatureData.windSpeed} m/s
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Droplets className="w-4 h-4 text-muted" />
                        <span className="text-muted">
                          {record.temperatureData.humidity}%
                        </span>
                      </div>
                    </div>

                    <div className="text-muted text-xs">
                      {record.temperatureData.description}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between p-6 border-t border-subtle">
            <div className="text-sm text-muted">
              Showing {records.length} of {pagination.total} records
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateFilters({ ...filters, page: pagination.page - 1 })}
                disabled={pagination.page <= 1}
                className="px-3 py-1 rounded bg-background border border-subtle disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm">
                {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => updateFilters({ ...filters, page: pagination.page + 1 })}
                disabled={pagination.page >= pagination.pages}
                className="px-3 py-1 rounded bg-background border border-subtle disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Create Form Modal */}
        <AnimatePresence>
          {showCreateForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-60">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-card rounded-xl shadow-2xl border border-subtle w-full max-w-md"
              >
                <div className="p-6 border-b border-subtle">
                  <h3 className="text-xl font-bold text-foreground">Create Weather Record</h3>
                  <p className="text-sm text-muted mt-1">
                    Enter a date range in the past for historical weather data, or future dates for current weather tracking.
                  </p>
                </div>
                <form onSubmit={handleCreateRecord} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Enter city, coordinates, or landmark..."
                      className="w-full p-3 rounded-lg bg-background border border-subtle text-foreground"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Start Date</label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full p-3 rounded-lg bg-background border border-subtle text-foreground"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">End Date</label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full p-3 rounded-lg bg-background border border-subtle text-foreground"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Data Type Indicator */}
                  {formData.startDate && formData.endDate && (
                    <div className="p-3 rounded-lg bg-background border border-subtle">
                      <div className="flex items-center space-x-2">
                        {new Date(formData.endDate) < new Date() ? (
                          <>
                            <History className="w-4 h-4 text-orange-500" />
                            <span className="text-orange-700 dark:text-orange-300 font-medium">
                              Historical weather data will be fetched
                            </span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span className="text-blue-700 dark:text-blue-300 font-medium">
                              Current weather data will be fetched
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="px-4 py-2 rounded-lg bg-background border border-subtle hover:bg-accent transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                      {loading ? 'Creating...' : 'Create Record'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Weather Details Modal */}
        <AnimatePresence>
          {selectedRecord && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-60">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-card rounded-xl shadow-2xl border border-subtle w-full max-w-4xl max-h-[90vh] overflow-hidden"
              >
                <div className="flex items-center justify-between p-6 border-b border-subtle">
                  <h3 className="text-xl font-bold text-foreground">
                    {selectedRecord.isHistorical ? 'Historical Weather Details' : 'Weather Details'}
                  </h3>
                  <button
                    onClick={() => setSelectedRecord(null)}
                    className="p-2 rounded-lg bg-background border border-subtle hover:bg-accent transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[70vh]">
                  {selectedRecord.isHistorical && selectedRecord.dailyData ? (
                    <HistoricalWeatherDetails
                      dailyData={selectedRecord.dailyData}
                      location={selectedRecord.location}
                      dateRange={selectedRecord.dateRange}
                    />
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-background rounded-lg border border-subtle p-4">
                        <h4 className="font-semibold text-foreground mb-2">Weather Summary</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-muted">Temperature</div>
                            <div className="font-medium text-foreground">
                              {selectedRecord.temperatureData.current}°C
                            </div>
                          </div>
                          <div>
                            <div className="text-muted">Humidity</div>
                            <div className="font-medium text-foreground">
                              {selectedRecord.temperatureData.humidity}%
                            </div>
                          </div>
                          <div>
                            <div className="text-muted">Wind Speed</div>
                            <div className="font-medium text-foreground">
                              {selectedRecord.temperatureData.windSpeed} m/s
                            </div>
                          </div>
                          <div>
                            <div className="text-muted">Pressure</div>
                            <div className="font-medium text-foreground">
                              {selectedRecord.temperatureData.pressure} mb
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {selectedRecord.forecast && selectedRecord.forecast.length > 0 && (
                        <div className="bg-background rounded-lg border border-subtle p-4">
                          <h4 className="font-semibold text-foreground mb-4">Forecast</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {selectedRecord.forecast.map((day, index) => (
                              <div key={index} className="text-center p-3 bg-card rounded-lg border border-subtle">
                                <div className="text-sm text-muted mb-1">
                                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                </div>
                                <div className="text-lg font-bold text-foreground">
                                  {day.temperature.max}°C
                                </div>
                                <div className="text-sm text-muted">
                                  {day.temperature.min}°C
                                </div>
                                <div className="text-xs text-muted mt-1">
                                  {day.description}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
