import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import WeatherRecord from '@/models/WeatherRecord';

interface ExportRecord {
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
  isHistorical: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    const location = searchParams.get('location');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '1000');

    // Build filter object
    const filter: Record<string, unknown> = {};
    
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    
    if (startDate || endDate) {
      filter['dateRange.start'] = {};
      if (startDate) {
        (filter['dateRange.start'] as Record<string, unknown>).$gte = new Date(startDate);
      }
      if (endDate) {
        (filter['dateRange.start'] as Record<string, unknown>).$lte = new Date(endDate);
      }
    }

    // Get records
    const records = await WeatherRecord.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean() as unknown as ExportRecord[];

    // Set appropriate headers based on format
    const timestamp = new Date().toISOString().split('T')[0];
    let filename = `weather-history-${timestamp}`;
    let contentType = 'application/json';
    let data: string;

    switch (format.toLowerCase()) {
      case 'csv':
        filename += '.csv';
        contentType = 'text/csv';
        data = convertToCSV(records);
        break;
      case 'xml':
        filename += '.xml';
        contentType = 'application/xml';
        data = convertToXML(records);
        break;
      case 'json':
      default:
        filename += '.json';
        contentType = 'application/json';
        data = JSON.stringify(records, null, 2);
        break;
    }

    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error: any) {
    console.error('Error exporting weather records:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export weather records' },
      { status: 500 }
    );
  }
}

function convertToCSV(records: ExportRecord[]): string {
  if (records.length === 0) return '';

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

  return csvContent;
}

function convertToXML(records: ExportRecord[]): string {
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<weather-records>
  <export-info>
    <export-date>${new Date().toISOString()}</export-date>
    <total-records>${records.length}</total-records>
  </export-info>
  ${records.map(record => `
  <record id="${record._id}">
    <location>
      <name>${escapeXml(record.location)}</name>
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
      <description>${escapeXml(record.temperatureData.description)}</description>
    </temperature-data>
    <is-historical>${record.isHistorical}</is-historical>
    <created-at>${record.createdAt}</created-at>
    <updated-at>${record.updatedAt}</updated-at>
  </record>`).join('')}
</weather-records>`;

  return xmlContent;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
