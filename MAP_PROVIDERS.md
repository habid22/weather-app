# Map Providers Guide

## 🗺️ Available Map Providers

### 1. **OpenStreetMap (Default - Free)**
- **Cost**: Completely free
- **API Key**: Not required
- **Features**: Basic maps, directions, street view
- **Best for**: Development, testing, personal projects

### 2. **Mapbox (Recommended for Production)**
- **Cost**: Free tier (50,000 map loads/month)
- **API Key**: Required
- **Features**: Beautiful maps, custom styles, high performance
- **Best for**: Production apps, custom styling

### 3. **Here Maps**
- **Cost**: Free tier (250,000 transactions/month)
- **API Key**: Required
- **Features**: Navigation, routing, traffic data
- **Best for**: Navigation-focused apps

## 🔑 Getting API Keys

### Mapbox
1. Go to [mapbox.com](https://www.mapbox.com/)
2. Sign up for free account
3. Go to Account → Access tokens
4. Copy your default public token

### Here Maps
1. Go to [developer.here.com](https://developer.here.com/)
2. Sign up for free account
3. Create a new project
4. Generate API key

## ⚙️ Setup

Add to your `.env`:

```env
# Mapbox (optional - defaults to OpenStreetMap)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here

# Here Maps (optional)
HERE_API_KEY=your_here_api_key_here
```

## 🚀 Usage

The app automatically uses OpenStreetMap by default (no API key needed). Users can switch between providers using the dropdown in the map tab.

## 💡 Recommendations

- **Development**: Use OpenStreetMap (free, no setup)
- **Production**: Use Mapbox (beautiful, reliable)
- **Navigation**: Use Here Maps (routing features)
