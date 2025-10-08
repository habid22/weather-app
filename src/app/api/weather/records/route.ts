import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import WeatherRecord from '@/models/WeatherRecord';
import { WeatherService } from '@/lib/weatherService';

// GET - Read all weather records with optional filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    // Build filter object
    const filter: any = {};
    
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    
    if (startDate || endDate) {
      filter['dateRange.start'] = {};
      if (startDate) {
        filter['dateRange.start'].$gte = new Date(startDate);
      }
      if (endDate) {
        filter['dateRange.start'].$lte = new Date(endDate);
      }
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const records = await WeatherRecord.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const totalRecords = await WeatherRecord.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: records,
      pagination: {
        page,
        limit,
        total: totalRecords,
        pages: Math.ceil(totalRecords / limit)
      }
    });

  } catch (error: any) {
    console.error('Error fetching weather records:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch weather records' },
      { status: 500 }
    );
  }
}

// POST - Create new weather record
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { location, startDate, endDate } = body;

    // Validate required fields
    if (!location || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'Location, start date, and end date are required' },
        { status: 400 }
      );
    }

    // Validate date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start >= end) {
      return NextResponse.json(
        { success: false, error: 'Start date must be before end date' },
        { status: 400 }
      );
    }

    if (start > now) {
      return NextResponse.json(
        { success: false, error: 'Start date cannot be in the future' },
        { status: 400 }
      );
    }

    // Validate location by fetching weather data (current or historical)
    let weatherData;
    let isHistorical = false;
    try {
      const weatherResponse = await WeatherService.getWeatherByLocationAndDateRange(location, startDate, endDate);
      weatherData = weatherResponse;
      isHistorical = weatherResponse.isHistorical;
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: `Invalid location: ${error.message}` },
        { status: 400 }
      );
    }

    // Create weather record
    const weatherRecord = new WeatherRecord({
      location: weatherData.location.name,
      latitude: weatherData.location.latitude,
      longitude: weatherData.location.longitude,
      dateRange: {
        start: new Date(startDate + 'T00:00:00.000Z'),
        end: new Date(endDate + 'T00:00:00.000Z')
      },
      temperatureData: {
        current: weatherData.weather.current.temperature,
        min: Math.min(...weatherData.weather.forecast.map(f => f.temperature.min)),
        max: Math.max(...weatherData.weather.forecast.map(f => f.temperature.max)),
        feelsLike: weatherData.weather.current.feelsLike,
        humidity: weatherData.weather.current.humidity,
        pressure: weatherData.weather.current.pressure,
        windSpeed: weatherData.weather.current.windSpeed,
        windDirection: weatherData.weather.current.windDirection,
        description: weatherData.weather.current.description,
        icon: weatherData.weather.current.icon
      },
      forecast: weatherData.weather.forecast.map(day => ({
        date: new Date(day.date),
        temperature: {
          min: day.temperature.min,
          max: day.temperature.max
        },
        description: day.description,
        icon: day.icon
      })),
      dailyData: isHistorical && (weatherData as any).dailyHistoricalData ? (weatherData as any).dailyHistoricalData.map((day: any) => ({
        date: new Date(day.date),
        temperature: {
          current: day.temperature.current,
          min: day.temperature.min,
          max: day.temperature.max,
          feelsLike: day.temperature.feelsLike
        },
        humidity: day.humidity,
        pressure: day.pressure,
        windSpeed: day.windSpeed,
        windDirection: day.windDirection,
        description: day.description,
        icon: day.icon
      })) : undefined,
      isHistorical: isHistorical
    });

    await weatherRecord.save();

    return NextResponse.json({
      success: true,
      data: weatherRecord,
      message: 'Weather record created successfully'
    });

  } catch (error: any) {
    console.error('Error creating weather record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create weather record' },
      { status: 500 }
    );
  }
}
