// Dynamic import for jsPDF to avoid SSR issues

export interface ExportableRecord {
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

export class ExportService {
  // Export to JSON format
  static exportToJSON(records: ExportableRecord[], filename?: string): void {
    const dataStr = JSON.stringify(records, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `weather-records-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Export to CSV format
  static exportToCSV(records: ExportableRecord[], filename?: string): void {
    if (records.length === 0) return;

    // Create comprehensive CSV with all data
    let csvContent = '';
    
    // Main records data
    const mainHeaders = [
      'ID',
      'Location',
      'Latitude',
      'Longitude',
      'Start Date',
      'End Date',
      'Current Temperature (°C)',
      'Min Temperature (°C)',
      'Max Temperature (°C)',
      'Feels Like (°C)',
      'Humidity (%)',
      'Pressure (mb)',
      'Wind Speed (m/s)',
      'Wind Direction (°)',
      'Description',
      'Icon',
      'Is Historical',
      'Created At',
      'Updated At'
    ];

    csvContent += mainHeaders.join(',') + '\n';
    
    records.forEach(record => {
      const mainRow = [
        record._id,
        `"${record.location}"`,
        record.latitude,
        record.longitude,
        record.dateRange.start.split('T')[0],
        record.dateRange.end.split('T')[0],
        record.temperatureData.current,
        record.temperatureData.min,
        record.temperatureData.max,
        record.temperatureData.feelsLike,
        record.temperatureData.humidity,
        record.temperatureData.pressure,
        record.temperatureData.windSpeed,
        record.temperatureData.windDirection,
        `"${record.temperatureData.description}"`,
        `"${record.temperatureData.icon}"`,
        record.isHistorical,
        record.createdAt.split('T')[0],
        record.updatedAt.split('T')[0]
      ].join(',');
      
      csvContent += mainRow + '\n';
    });

    // Add forecast data if available
    const hasForecast = records.some(record => record.forecast && record.forecast.length > 0);
    if (hasForecast) {
      csvContent += '\n\n--- FORECAST DATA ---\n';
      const forecastHeaders = [
        'Record ID',
        'Location',
        'Date',
        'Min Temperature (°C)',
        'Max Temperature (°C)',
        'Description',
        'Icon'
      ];
      csvContent += forecastHeaders.join(',') + '\n';
      
      records.forEach(record => {
        if (record.forecast) {
          record.forecast.forEach(forecast => {
            const forecastRow = [
              record._id,
              `"${record.location}"`,
              new Date(forecast.date).toISOString().split('T')[0],
              forecast.temperature.min,
              forecast.temperature.max,
              `"${forecast.description}"`,
              `"${forecast.icon}"`
            ].join(',');
            csvContent += forecastRow + '\n';
          });
        }
      });
    }

    // Add daily historical data if available
    const hasDailyData = records.some(record => record.dailyData && record.dailyData.length > 0);
    if (hasDailyData) {
      csvContent += '\n\n--- DAILY HISTORICAL DATA ---\n';
      const dailyHeaders = [
        'Record ID',
        'Location',
        'Date',
        'Current Temperature (°C)',
        'Min Temperature (°C)',
        'Max Temperature (°C)',
        'Feels Like (°C)',
        'Humidity (%)',
        'Pressure (mb)',
        'Wind Speed (m/s)',
        'Wind Direction (°)',
        'Description',
        'Icon'
      ];
      csvContent += dailyHeaders.join(',') + '\n';
      
      records.forEach(record => {
        if (record.dailyData) {
          record.dailyData.forEach(daily => {
            const dailyRow = [
              record._id,
              `"${record.location}"`,
              new Date(daily.date).toISOString().split('T')[0],
              daily.temperature.current,
              daily.temperature.min,
              daily.temperature.max,
              daily.temperature.feelsLike,
              daily.humidity,
              daily.pressure,
              daily.windSpeed,
              daily.windDirection,
              `"${daily.description}"`,
              `"${daily.icon}"`
            ].join(',');
            csvContent += dailyRow + '\n';
          });
        }
      });
    }

    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `weather-records-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Export to XML format
  static exportToXML(records: ExportableRecord[], filename?: string): void {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<weather-records>
  <export-info>
    <export-date>${new Date().toISOString()}</export-date>
    <total-records>${records.length}</total-records>
  </export-info>
  ${records.map(record => `
  <record id="${record._id}">
    <location>
      <name>${this.escapeXml(record.location)}</name>
      <latitude>${record.latitude}</latitude>
      <longitude>${record.longitude}</longitude>
    </location>
    <date-range>
      <start>${record.dateRange.start}</start>
      <end>${record.dateRange.end}</end>
    </date-range>
    <temperature-data>
      <current>${record.temperatureData.current}</current>
      <min>${record.temperatureData.min}</min>
      <max>${record.temperatureData.max}</max>
      <feels-like>${record.temperatureData.feelsLike}</feels-like>
      <humidity>${record.temperatureData.humidity}</humidity>
      <pressure>${record.temperatureData.pressure}</pressure>
      <wind-speed>${record.temperatureData.windSpeed}</wind-speed>
      <wind-direction>${record.temperatureData.windDirection}</wind-direction>
      <description>${this.escapeXml(record.temperatureData.description)}</description>
    </temperature-data>
    <is-historical>${record.isHistorical}</is-historical>
    <created-at>${record.createdAt}</created-at>
    <updated-at>${record.updatedAt}</updated-at>
    ${record.forecast ? `
    <forecast>
      ${record.forecast.map(day => `
      <day date="${day.date}">
        <temperature>
          <min>${day.temperature.min}</min>
          <max>${day.temperature.max}</max>
        </temperature>
        <description>${this.escapeXml(day.description)}</description>
      </day>`).join('')}
    </forecast>` : ''}
    ${record.dailyData ? `
    <daily-data>
      ${record.dailyData.map(day => `
      <day date="${day.date}">
        <temperature>
          <current>${day.temperature.current}</current>
          <min>${day.temperature.min}</min>
          <max>${day.temperature.max}</max>
          <feels-like>${day.temperature.feelsLike}</feels-like>
        </temperature>
        <humidity>${day.humidity}</humidity>
        <pressure>${day.pressure}</pressure>
        <wind-speed>${day.windSpeed}</wind-speed>
        <wind-direction>${day.windDirection}</wind-direction>
        <description>${this.escapeXml(day.description)}</description>
      </day>`).join('')}
    </daily-data>` : ''}
  </record>`).join('')}
</weather-records>`;

    const dataBlob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `weather-records-${new Date().toISOString().split('T')[0]}.xml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Export to PDF format (simplified version)
  static async exportToPDF(records: ExportableRecord[], filename?: string): Promise<void> {
    // For now, we'll create a simple text-based PDF alternative
    // This avoids the jsPDF dependency issues
    const content = this.generatePDFContent(records);
    
    const dataBlob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `weather-records-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Generate PDF-like content as text
  private static generatePDFContent(records: ExportableRecord[]): string {
    let content = 'WEATHER RECORDS EXPORT\n';
    content += '='.repeat(50) + '\n\n';
    content += `Export Date: ${new Date().toLocaleDateString()}\n`;
    content += `Total Records: ${records.length}\n\n`;

    records.forEach((record, index) => {
      content += `RECORD ${index + 1}: ${record.location}\n`;
      content += '='.repeat(50) + '\n';
      content += `Location: ${record.location}\n`;
      content += `Coordinates: ${record.latitude}, ${record.longitude}\n`;
      content += `Date Range: ${record.dateRange.start.split('T')[0]} to ${record.dateRange.end.split('T')[0]}\n`;
      content += `Type: ${record.isHistorical ? 'Historical' : 'Current'}\n\n`;
      
      content += 'CURRENT WEATHER DATA:\n';
      content += '-'.repeat(25) + '\n';
      content += `Temperature: ${record.temperatureData.current}°C (feels like ${record.temperatureData.feelsLike}°C)\n`;
      content += `Range: ${record.temperatureData.min}°C - ${record.temperatureData.max}°C\n`;
      content += `Humidity: ${record.temperatureData.humidity}%\n`;
      content += `Pressure: ${record.temperatureData.pressure} mb\n`;
      content += `Wind: ${record.temperatureData.windSpeed} m/s at ${record.temperatureData.windDirection}°\n`;
      content += `Description: ${record.temperatureData.description}\n`;
      content += `Icon: ${record.temperatureData.icon}\n\n`;

      // Add forecast data if available
      if (record.forecast && record.forecast.length > 0) {
        content += '5-DAY FORECAST:\n';
        content += '-'.repeat(20) + '\n';
        record.forecast.forEach((forecast, dayIndex) => {
          const date = new Date(forecast.date).toLocaleDateString();
          content += `Day ${dayIndex + 1} (${date}):\n`;
          content += `  Temperature: ${forecast.temperature.min}°C - ${forecast.temperature.max}°C\n`;
          content += `  Description: ${forecast.description}\n`;
          content += `  Icon: ${forecast.icon}\n`;
        });
        content += '\n';
      }

      // Add daily historical data if available
      if (record.dailyData && record.dailyData.length > 0) {
        content += 'DAILY HISTORICAL DATA:\n';
        content += '-'.repeat(25) + '\n';
        record.dailyData.forEach((daily, dayIndex) => {
          const date = new Date(daily.date).toLocaleDateString();
          content += `Day ${dayIndex + 1} (${date}):\n`;
          content += `  Current: ${daily.temperature.current}°C\n`;
          content += `  Range: ${daily.temperature.min}°C - ${daily.temperature.max}°C\n`;
          content += `  Feels Like: ${daily.temperature.feelsLike}°C\n`;
          content += `  Humidity: ${daily.humidity}%\n`;
          content += `  Pressure: ${daily.pressure} mb\n`;
          content += `  Wind: ${daily.windSpeed} m/s at ${daily.windDirection}°\n`;
          content += `  Description: ${daily.description}\n`;
          content += `  Icon: ${daily.icon}\n`;
        });
        content += '\n';
      }

      content += 'METADATA:\n';
      content += '-'.repeat(10) + '\n';
      content += `Created: ${record.createdAt.split('T')[0]}\n`;
      content += `Updated: ${record.updatedAt.split('T')[0]}\n`;
      content += `Record ID: ${record._id}\n\n`;
      content += '='.repeat(50) + '\n\n';
    });

    return content;
  }

  // Helper method to escape XML special characters
  private static escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Export all formats at once
  static async exportAllFormats(records: ExportableRecord[]): Promise<void> {
    const baseFilename = `weather-records-${new Date().toISOString().split('T')[0]}`;
    
    // Export JSON
    this.exportToJSON(records, `${baseFilename}.json`);
    
    // Small delay to prevent browser blocking
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Export CSV
    this.exportToCSV(records, `${baseFilename}.csv`);
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Export XML
    this.exportToXML(records, `${baseFilename}.xml`);
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Export PDF
    await this.exportToPDF(records, `${baseFilename}.pdf`);
  }
}
