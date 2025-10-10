export interface Landmark {
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  category: 'monument' | 'building' | 'natural' | 'religious' | 'historical' | 'modern';
  description: string;
  aliases?: string[];
}

export const FAMOUS_LANDMARKS: Landmark[] = [
  // Monuments & Historical Sites
  {
    name: "Eiffel Tower",
    city: "Paris",
    country: "France",
    latitude: 48.8584,
    longitude: 2.2945,
    category: "monument",
    description: "Iconic iron lattice tower and symbol of Paris",
    aliases: ["Tour Eiffel", "Eiffel"]
  },
  {
    name: "Statue of Liberty",
    city: "New York",
    country: "United States",
    latitude: 40.6892,
    longitude: -74.0445,
    category: "monument",
    description: "Symbol of freedom and democracy",
    aliases: ["Liberty Island", "Lady Liberty"]
  },
  {
    name: "Big Ben",
    city: "London",
    country: "United Kingdom",
    latitude: 51.4994,
    longitude: -0.1245,
    category: "monument",
    description: "Famous clock tower at the Palace of Westminster",
    aliases: ["Elizabeth Tower", "Westminster Clock"]
  },
  {
    name: "Colosseum",
    city: "Rome",
    country: "Italy",
    latitude: 41.8902,
    longitude: 12.4922,
    category: "historical",
    description: "Ancient Roman amphitheater",
    aliases: ["Flavian Amphitheatre", "Roman Colosseum"]
  },
  {
    name: "Taj Mahal",
    city: "Agra",
    country: "India",
    latitude: 27.1751,
    longitude: 78.0421,
    category: "monument",
    description: "White marble mausoleum and symbol of love",
    aliases: ["Taj"]
  },
  {
    name: "Christ the Redeemer",
    city: "Rio de Janeiro",
    country: "Brazil",
    latitude: -22.9519,
    longitude: -43.2105,
    category: "monument",
    description: "Art Deco statue of Jesus Christ",
    aliases: ["Cristo Redentor", "Christ Redeemer"]
  },
  {
    name: "Machu Picchu",
    city: "Cusco",
    country: "Peru",
    latitude: -13.1631,
    longitude: -72.5450,
    category: "historical",
    description: "Ancient Incan citadel in the Andes",
    aliases: ["Machu Picchu", "Lost City of the Incas"]
  },
  {
    name: "Great Wall of China",
    city: "Beijing",
    country: "China",
    latitude: 40.4319,
    longitude: 116.5704,
    category: "historical",
    description: "Ancient fortification system",
    aliases: ["Great Wall", "Chinese Wall", "万里长城", "Wanli Changcheng"]
  },
  {
    name: "Forbidden City",
    city: "Beijing",
    country: "China",
    latitude: 39.9163,
    longitude: 116.3972,
    category: "historical",
    description: "Imperial palace complex of the Ming and Qing dynasties",
    aliases: ["Palace Museum", "紫禁城", "Zijin Cheng", "Gugong"]
  },
  {
    name: "Temple of Heaven",
    city: "Beijing",
    country: "China",
    latitude: 39.8823,
    longitude: 116.4066,
    category: "religious",
    description: "Imperial complex of religious buildings",
    aliases: ["天坛", "Tiantan", "Heaven Temple"]
  },
  {
    name: "Terracotta Army",
    city: "Xi'an",
    country: "China",
    latitude: 34.3847,
    longitude: 109.2731,
    category: "historical",
    description: "Collection of terracotta sculptures depicting the armies of Qin Shi Huang",
    aliases: ["兵马俑", "Bingmayong", "Terracotta Warriors"]
  },
  {
    name: "Potala Palace",
    city: "Lhasa",
    country: "China",
    latitude: 29.6554,
    longitude: 91.1169,
    category: "religious",
    description: "Former residence of the Dalai Lama and religious center",
    aliases: ["布达拉宫", "Budala Gong", "Lhasa Palace"]
  },
  {
    name: "Li River",
    city: "Guilin",
    country: "China",
    latitude: 25.2342,
    longitude: 110.1994,
    category: "natural",
    description: "Scenic river with karst mountain landscapes",
    aliases: ["漓江", "Lijiang", "Guilin River"]
  },
  {
    name: "Zhangjiajie National Forest Park",
    city: "Zhangjiajie",
    country: "China",
    latitude: 29.1274,
    longitude: 110.4792,
    category: "natural",
    description: "National park known for its pillar-like rock formations",
    aliases: ["张家界", "Zhangjiajie", "Avatar Mountains"]
  },
  {
    name: "West Lake",
    city: "Hangzhou",
    country: "China",
    latitude: 30.2741,
    longitude: 120.1551,
    category: "natural",
    description: "Famous freshwater lake surrounded by gardens and temples",
    aliases: ["西湖", "Xihu", "Hangzhou Lake"]
  },
  {
    name: "Bund",
    city: "Shanghai",
    country: "China",
    latitude: 31.2397,
    longitude: 121.4998,
    category: "modern",
    description: "Historic waterfront area with colonial architecture",
    aliases: ["外滩", "Waitan", "Shanghai Bund"]
  },
  {
    name: "Oriental Pearl Tower",
    city: "Shanghai",
    country: "China",
    latitude: 31.2397,
    longitude: 121.4998,
    category: "modern",
    description: "Distinctive TV tower with futuristic design",
    aliases: ["东方明珠", "Dongfang Mingzhu", "Pearl Tower"]
  },
  {
    name: "Pyramids of Giza",
    city: "Cairo",
    country: "Egypt",
    latitude: 29.9792,
    longitude: 31.1342,
    category: "historical",
    description: "Ancient Egyptian pyramids",
    aliases: ["Giza Pyramids", "Great Pyramid", "Sphinx"]
  },
  {
    name: "Stonehenge",
    city: "Salisbury",
    country: "United Kingdom",
    latitude: 51.1789,
    longitude: -1.8262,
    category: "historical",
    description: "Prehistoric stone circle",
    aliases: ["Stone Circle"]
  },

  // Modern Buildings & Architecture
  {
    name: "Burj Khalifa",
    city: "Dubai",
    country: "United Arab Emirates",
    latitude: 25.1972,
    longitude: 55.2744,
    category: "modern",
    description: "World's tallest building",
    aliases: ["Burj Dubai", "Khalifa Tower"]
  },
  {
    name: "Empire State Building",
    city: "New York",
    country: "United States",
    latitude: 40.7484,
    longitude: -73.9857,
    category: "building",
    description: "Art Deco skyscraper in Manhattan",
    aliases: ["Empire State", "ESB"]
  },
  {
    name: "Sydney Opera House",
    city: "Sydney",
    country: "Australia",
    latitude: -33.8568,
    longitude: 151.2153,
    category: "building",
    description: "Modern expressionist performing arts center",
    aliases: ["Opera House", "Sydney Opera"]
  },
  {
    name: "CN Tower",
    city: "Toronto",
    country: "Canada",
    latitude: 43.6426,
    longitude: -79.3871,
    category: "building",
    description: "Communications and observation tower",
    aliases: ["Canadian National Tower"]
  },
  {
    name: "Petronas Towers",
    city: "Kuala Lumpur",
    country: "Malaysia",
    latitude: 3.1579,
    longitude: 101.7116,
    category: "modern",
    description: "Twin skyscrapers and former world's tallest buildings",
    aliases: ["Petronas Twin Towers", "KLCC Towers"]
  },
  {
    name: "Sagrada Familia",
    city: "Barcelona",
    country: "Spain",
    latitude: 41.4036,
    longitude: 2.1744,
    category: "religious",
    description: "Unfinished basilica designed by Antoni Gaudí",
    aliases: ["Sagrada", "Gaudí's Cathedral"]
  },
  {
    name: "Notre-Dame Cathedral",
    city: "Paris",
    country: "France",
    latitude: 48.8530,
    longitude: 2.3499,
    category: "religious",
    description: "Medieval Catholic cathedral",
    aliases: ["Notre Dame", "Notre Dame de Paris"]
  },
  {
    name: "St. Peter's Basilica",
    city: "Vatican City",
    country: "Vatican",
    latitude: 41.9022,
    longitude: 12.4539,
    category: "religious",
    description: "Renaissance church in Vatican City",
    aliases: ["St. Peter's", "Vatican Basilica"]
  },

  // Natural Landmarks
  {
    name: "Mount Everest",
    city: "Himalayas",
    country: "Nepal/China",
    latitude: 27.9881,
    longitude: 86.9250,
    category: "natural",
    description: "World's highest mountain peak",
    aliases: ["Everest", "Sagarmatha", "Chomolungma"]
  },
  {
    name: "Grand Canyon",
    city: "Arizona",
    country: "United States",
    latitude: 36.1069,
    longitude: -112.1129,
    category: "natural",
    description: "Massive canyon carved by the Colorado River",
    aliases: ["Grand Canyon National Park"]
  },
  {
    name: "Niagara Falls",
    city: "Ontario/New York",
    country: "Canada/United States",
    latitude: 43.0962,
    longitude: -79.0377,
    category: "natural",
    description: "Famous waterfalls on the Niagara River",
    aliases: ["Niagara", "Horseshoe Falls"]
  },
  {
    name: "Mount Fuji",
    city: "Tokyo",
    country: "Japan",
    latitude: 35.3606,
    longitude: 138.7274,
    category: "natural",
    description: "Active volcano and Japan's highest peak",
    aliases: ["Fuji", "Fuji-san", "Mount Fuji-san"]
  },
  {
    name: "Uluru",
    city: "Northern Territory",
    country: "Australia",
    latitude: -25.3444,
    longitude: 131.0369,
    category: "natural",
    description: "Large sandstone rock formation",
    aliases: ["Ayers Rock", "Uluru-Kata Tjuta"]
  },
  {
    name: "Victoria Falls",
    city: "Livingstone",
    country: "Zambia/Zimbabwe",
    latitude: -17.9243,
    longitude: 25.8572,
    category: "natural",
    description: "Waterfall on the Zambezi River",
    aliases: ["Mosi-oa-Tunya", "Victoria Falls"]
  },
  {
    name: "Mount Kilimanjaro",
    city: "Kilimanjaro",
    country: "Tanzania",
    latitude: -3.0674,
    longitude: 37.3556,
    category: "natural",
    description: "Africa's highest mountain",
    aliases: ["Kilimanjaro", "Kili"]
  },

  // Famous Squares & Public Spaces
  {
    name: "Times Square",
    city: "New York",
    country: "United States",
    latitude: 40.7580,
    longitude: -73.9855,
    category: "modern",
    description: "Major commercial intersection and tourist destination",
    aliases: ["Times Sq", "The Crossroads of the World"]
  },
  {
    name: "Trafalgar Square",
    city: "London",
    country: "United Kingdom",
    latitude: 51.5081,
    longitude: -0.1281,
    category: "monument",
    description: "Public square with Nelson's Column",
    aliases: ["Trafalgar"]
  },
  {
    name: "Red Square",
    city: "Moscow",
    country: "Russia",
    latitude: 55.7539,
    longitude: 37.6208,
    category: "historical",
    description: "Historic square in Moscow",
    aliases: ["Krasnaya Ploshchad"]
  },
  {
    name: "Piazza San Marco",
    city: "Venice",
    country: "Italy",
    latitude: 45.4342,
    longitude: 12.3388,
    category: "historical",
    description: "Main public square in Venice",
    aliases: ["St. Mark's Square", "Piazza San Marco"]
  },
  {
    name: "Golden Gate Bridge",
    city: "San Francisco",
    country: "United States",
    latitude: 37.8199,
    longitude: -122.4783,
    category: "modern",
    description: "Suspension bridge spanning the Golden Gate strait",
    aliases: ["Golden Gate", "GGB"]
  },
  {
    name: "Brooklyn Bridge",
    city: "New York",
    country: "United States",
    latitude: 40.7061,
    longitude: -73.9969,
    category: "modern",
    description: "Historic suspension bridge connecting Manhattan and Brooklyn",
    aliases: ["Brooklyn"]
  },
  {
    name: "Tower Bridge",
    city: "London",
    country: "United Kingdom",
    latitude: 51.5055,
    longitude: -0.0754,
    category: "modern",
    description: "Combined bascule and suspension bridge",
    aliases: ["London Tower Bridge"]
  },
  {
    name: "Harbour Bridge",
    city: "Sydney",
    country: "Australia",
    latitude: -33.8523,
    longitude: 151.2108,
    category: "modern",
    description: "Steel arch bridge across Sydney Harbour",
    aliases: ["Sydney Harbour Bridge", "The Coathanger"]
  }
];

export class LandmarkService {
  static searchLandmarks(query: string): Landmark[] {
    if (!query || query.length < 2) return [];
    
    const searchTerm = query.toLowerCase().trim();
    
    return FAMOUS_LANDMARKS.filter(landmark => {
      const nameMatch = landmark.name.toLowerCase().includes(searchTerm);
      const cityMatch = landmark.city.toLowerCase().includes(searchTerm);
      const countryMatch = landmark.country.toLowerCase().includes(searchTerm);
      const aliasMatch = landmark.aliases?.some(alias => 
        alias.toLowerCase().includes(searchTerm)
      ) || false;
      
      return nameMatch || cityMatch || countryMatch || aliasMatch;
    }).slice(0, 10); // Limit to 10 results
  }
  
  static getLandmarkByName(name: string): Landmark | undefined {
    return FAMOUS_LANDMARKS.find(landmark => 
      landmark.name.toLowerCase() === name.toLowerCase() ||
      landmark.aliases?.some(alias => alias.toLowerCase() === name.toLowerCase())
    );
  }
  
  static getLandmarksByCategory(category: Landmark['category']): Landmark[] {
    return FAMOUS_LANDMARKS.filter(landmark => landmark.category === category);
  }
  
  static getRandomLandmarks(count: number = 5): Landmark[] {
    const shuffled = [...FAMOUS_LANDMARKS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}
