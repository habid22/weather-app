import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    console.log('Test DB endpoint called');
    console.log('Environment variables check:', {
      NODE_ENV: process.env.NODE_ENV,
      MONGODB_URI_EXISTS: !!process.env.MONGODB_URI,
      MONGODB_URI_PREFIX: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'undefined',
      ALL_ENV_KEYS: Object.keys(process.env).filter(key => key.includes('MONGO') || key.includes('DB'))
    });

    await connectDB();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Test DB endpoint error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        environment: process.env.NODE_ENV
      },
      { status: 500 }
    );
  }
}
