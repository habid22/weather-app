# A Simple Weather App

A comprehensive weather application built with Next.js, TypeScript, and MongoDB that provides real-time weather data, forecasts, and historical weather information.

## 🌟 Features

### Core Weather Functionality
- **Real-time Weather Data**: Get current weather conditions for any location
- **5-Day Forecast**: Extended weather predictions with detailed information
- **Historical Weather**: Access past weather data for specific date ranges
- **Multiple Location Input**: Support for zip codes, coordinates, cities, and more
- **Current Location**: Automatic weather detection based on GPS coordinates

### Advanced Features
- **Weather History Management**: Save, view, update, and delete weather data
- **Data Export**: Export weather data in multiple formats (JSON, CSV, XML, PDF)
- **Interactive 3D Maps**: Visualize locations with Mapbox 3D maps
- **YouTube Integration**: Find location-related videos
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Technical Features
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Data Validation**: Comprehensive input validation and error handling
- **Real-time Updates**: Live weather data from WeatherAPI
- **Database Persistence**: MongoDB integration for data storage
- **Modern UI**: Beautiful interface with animations and transitions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account (or local MongoDB instance)
- WeatherAPI account (free tier available)
- Mapbox account (for 3D maps)
- YouTube Data API key (optional, for video integration)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd weather-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database (REQUIRED - use MONGODB_URI, NOT NEXT_PUBLIC_MONGODB_URI)
   MONGODB_URI=your_mongodb_connection_string
   
   # Weather API (REQUIRED)
   NEXT_PUBLIC_WEATHER_API_KEY=your_weatherapi_key
   OPENWEATHER_API_KEY=your_openweather_api_key
   
   # Mapbox (for 3D maps)
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
   
   # YouTube API (optional)
   NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key
   
   # HERE Maps (optional)
   HERE_API_KEY=your_here_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: MongoDB with Mongoose ODM
- **APIs**: WeatherAPI, Mapbox GL JS, YouTube Data API
- **Deployment**: Vercel (recommended)

## 📱 Usage

### Getting Weather Data
1. **Enter a location** using any of these formats:
   - Zip code (e.g., "10001")
   - City name (e.g., "New York")
   - Coordinates (e.g., "40.7128, -74.0060")

2. **View current weather** with detailed information including:
   - Temperature, humidity, pressure
   - Wind speed and direction
   - Weather description and icons

3. **Check 5-day forecast** for extended planning

### Managing Weather Data
1. **Save weather data** by clicking the save button
2. **Access My Weather Data** via the database button in the header
3. **Export data** in your preferred format (JSON, CSV, XML, PDF)
4. **Update or delete** saved entries as needed

### Advanced Features
- **3D Maps**: Click the map button to view locations in 3D
- **YouTube Videos**: Find location-related content
- **Data Export**: Select specific entries and export in multiple formats

## 🔧 API Endpoints

- `GET /api/weather` - Get current weather by location
- `GET /api/weather/coordinates` - Get weather by coordinates
- `GET /api/weather/records` - Get saved weather history
- `POST /api/weather/records` - Save new weather data
- `PUT /api/weather/records/[id]` - Update weather record
- `DELETE /api/weather/records/[id]` - Delete weather record
- `GET /api/weather/records/export` - Export weather data
- `GET /api/location/maps` - Get map data
- `GET /api/location/youtube` - Get location videos

## 📊 Data Structure

### Weather Record
```typescript
interface WeatherRecord {
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
  forecast?: ForecastData[];
  dailyData?: DailyWeatherData[];
  isHistorical: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## 🚀 Deployment

### Vercel (Recommended)

**IMPORTANT**: Follow these steps carefully to avoid deployment issues:

1. **Push your code to GitHub**
2. **Connect your repository to Vercel**
3. **Set up environment variables in Vercel dashboard**:
   - Go to your Vercel project → Settings → Environment Variables
   - Add all environment variables from your `.env.local` file
   - **CRITICAL**: Use `MONGODB_URI` (NOT `NEXT_PUBLIC_MONGODB_URI`) for your database connection
   - MongoDB connection strings should be **private** environment variables
4. **Deploy automatically**

### Common Vercel Deployment Issues

- **"Failed to fetch weather records"**: Usually caused by incorrect MongoDB environment variable setup
- **API errors**: Ensure all API keys are properly set in Vercel environment variables  
- **Database connection issues**: Verify MongoDB Atlas IP whitelist includes Vercel's IP ranges
- **Build failures**: Check that all environment variables are set correctly

### Other Platforms
- **Netlify**: Compatible with Next.js
- **Railway**: Easy MongoDB integration
- **DigitalOcean**: Full control deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Hassan Amin**
- Built for PM Accelerator Technical Assessment
- [LinkedIn](https://www.linkedin.com/company/product-manager-accelerator)

## 🙏 Acknowledgments

- WeatherAPI for comprehensive weather data
- Mapbox for beautiful 3D map visualization
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first styling approach

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

---

**Note**: This application was built as part of a technical assessment for PM Accelerator, demonstrating full-stack development skills with modern web technologies.