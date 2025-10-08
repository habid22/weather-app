import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import WeatherRecord from '@/models/WeatherRecord';
import { WeatherService } from '@/lib/weatherService';

// GET - Read specific weather record
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const record = await WeatherRecord.findById(id);
    
    if (!record) {
      return NextResponse.json(
        { success: false, error: 'Weather record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: record
    });

  } catch (error: any) {
    console.error('Error fetching weather record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch weather record' },
      { status: 500 }
    );
  }
}

// PUT - Update weather record
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const body = await request.json();
    const { location, startDate, endDate, updateWeatherData = false } = body;

    // Find existing record
    const existingRecord = await WeatherRecord.findById(id);
    if (!existingRecord) {
      return NextResponse.json(
        { success: false, error: 'Weather record not found' },
        { status: 404 }
      );
    }

    // Prepare update object
    const updateData: any = {};

    // Update location if provided
    if (location && location !== existingRecord.location) {
      try {
        const weatherResponse = await WeatherService.getWeatherByLocation(location);
        updateData.location = weatherResponse.location.name;
        updateData.latitude = weatherResponse.location.latitude;
        updateData.longitude = weatherResponse.location.longitude;
        
        if (updateWeatherData) {
          updateData.temperatureData = {
            current: weatherResponse.weather.current.temperature,
            min: Math.min(...weatherResponse.weather.forecast.map(f => f.temperature.min)),
            max: Math.max(...weatherResponse.weather.forecast.map(f => f.temperature.max)),
            feelsLike: weatherResponse.weather.current.feelsLike,
            humidity: weatherResponse.weather.current.humidity,
            pressure: weatherResponse.weather.current.pressure,
            windSpeed: weatherResponse.weather.current.windSpeed,
            windDirection: weatherResponse.weather.current.windDirection,
            description: weatherResponse.weather.current.description,
            icon: weatherResponse.weather.current.icon
          };
          updateData.forecast = weatherResponse.weather.forecast.map(day => ({
            date: new Date(day.date),
            temperature: {
              min: day.temperature.min,
              max: day.temperature.max
            },
            description: day.description,
            icon: day.icon
          }));
        }
      } catch (error: any) {
        return NextResponse.json(
          { success: false, error: `Invalid location: ${error.message}` },
          { status: 400 }
        );
      }
    }

    // Update date range if provided
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate + 'T00:00:00.000Z') : existingRecord.dateRange.start;
      const end = endDate ? new Date(endDate + 'T00:00:00.000Z') : existingRecord.dateRange.end;
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

      updateData.dateRange = { start, end };
      
      // Automatically fetch new weather data when date range changes
      try {
        const weatherResponse = await WeatherService.getWeatherByLocationAndDateRange(
          existingRecord.location,
          startDate || existingRecord.dateRange.start.toISOString().split('T')[0],
          endDate || existingRecord.dateRange.end.toISOString().split('T')[0]
        );

        if (weatherResponse) {
          updateData.temperatureData = {
            current: weatherResponse.weather.current.temperature,
            min: Math.min(...weatherResponse.weather.forecast.map(f => f.temperature.min)),
            max: Math.max(...weatherResponse.weather.forecast.map(f => f.temperature.max)),
            feelsLike: weatherResponse.weather.current.feelsLike,
            humidity: weatherResponse.weather.current.humidity,
            pressure: weatherResponse.weather.current.pressure,
            windSpeed: weatherResponse.weather.current.windSpeed,
            windDirection: weatherResponse.weather.current.windDirection,
            description: weatherResponse.weather.current.description,
            icon: weatherResponse.weather.current.icon
          };
          updateData.forecast = weatherResponse.weather.forecast.map(day => ({
            date: new Date(day.date),
            temperature: {
              min: day.temperature.min,
              max: day.temperature.max
            },
            description: day.description,
            icon: day.icon
          }));
          
          // Update historical data fields if it's historical data
          if (weatherResponse.isHistorical) {
            updateData.isHistorical = true;
            // Store the daily historical data
            updateData.dailyData = weatherResponse.dailyData || [];
          } else {
            updateData.isHistorical = false;
            updateData.dailyData = [];
          }
        }
      } catch (error: any) {
        return NextResponse.json(
          { success: false, error: `Failed to fetch weather data for new date range: ${error.message}` },
          { status: 400 }
        );
      }
    }

    // Update the record
    const updatedRecord = await WeatherRecord.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: updatedRecord,
      message: 'Weather record updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating weather record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update weather record' },
      { status: 500 }
    );
  }
}

// DELETE - Delete weather record
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const record = await WeatherRecord.findById(id);
    
    if (!record) {
      return NextResponse.json(
        { success: false, error: 'Weather record not found' },
        { status: 404 }
      );
    }

    await WeatherRecord.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Weather record deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting weather record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete weather record' },
      { status: 500 }
    );
  }
}
