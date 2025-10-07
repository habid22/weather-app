import mongoose, { Document, Schema } from 'mongoose';

export interface IWeatherRecord extends Document {
  location: string;
  latitude: number;
  longitude: number;
  dateRange: {
    start: Date;
    end: Date;
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
    date: Date;
    temperature: {
      min: number;
      max: number;
    };
    description: string;
    icon: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const WeatherRecordSchema = new Schema<IWeatherRecord>({
  location: {
    type: String,
    required: true,
    trim: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  dateRange: {
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
  },
  temperatureData: {
    current: {
      type: Number,
      required: true,
    },
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    feelsLike: {
      type: Number,
      required: true,
    },
    humidity: {
      type: Number,
      required: true,
    },
    pressure: {
      type: Number,
      required: true,
    },
    windSpeed: {
      type: Number,
      required: true,
    },
    windDirection: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
  forecast: [{
    date: {
      type: Date,
      required: true,
    },
    temperature: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  }],
}, {
  timestamps: true,
});

export default mongoose.models.WeatherRecord || mongoose.model<IWeatherRecord>('WeatherRecord', WeatherRecordSchema);
