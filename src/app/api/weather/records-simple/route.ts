import { NextRequest, NextResponse } from 'next/server';

// Simple test endpoint without database connection
export async function GET(request: NextRequest) {
  try {
    console.log('Simple records endpoint called');
    
    return NextResponse.json({
      success: true,
      data: [],
      message: 'Simple endpoint working',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Simple records endpoint error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}
