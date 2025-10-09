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

    const headers = [
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
      'Is Historical',
      'Created At',
      'Updated At'
    ];

    const csvContent = [
      headers.join(','),
      ...records.map(record => [
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
        record.isHistorical,
        record.createdAt.split('T')[0],
        record.updatedAt.split('T')[0]
      ].join(','))
    ].join('\n');

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
      content += '-'.repeat(30) + '\n';
      content += `Date Range: ${record.dateRange.start.split('T')[0]} to ${record.dateRange.end.split('T')[0]}\n`;
      content += `Temperature: ${record.temperatureData.current}°C (feels like ${record.temperatureData.feelsLike}°C)\n`;
      content += `Range: ${record.temperatureData.min}°C - ${record.temperatureData.max}°C\n`;
      content += `Humidity: ${record.temperatureData.humidity}%\n`;
      content += `Pressure: ${record.temperatureData.pressure} mb\n`;
      content += `Wind: ${record.temperatureData.windSpeed} m/s at ${record.temperatureData.windDirection}°\n`;
      content += `Description: ${record.temperatureData.description}\n`;
      content += `Type: ${record.isHistorical ? 'Historical' : 'Current'}\n`;
      content += `Created: ${record.createdAt.split('T')[0]}\n`;
      content += `Updated: ${record.updatedAt.split('T')[0]}\n\n`;
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
