export interface Crop {
  id: string;
  name: string;
  nameHindi: string;
  category: 'cereals' | 'pulses' | 'vegetables' | 'oilseeds';
  icon: string;
  unit: string;
  msp2024: number | null;
  seasonality: ('rabi' | 'kharif' | 'year-round')[];
  storageLife: string;
  commission: number;
  loadingUnloading: number;
  searchKeywords: string[];
}

export const crops: Crop[] = [
  {
    id: "WHEAT",
    name: "Wheat",
    nameHindi: "गेहूं",
    category: "cereals",
    icon: "🌾",
    unit: "quintal",
    msp2024: 2275,
    seasonality: ["rabi"],
    storageLife: "6-12 months",
    commission: 0.02,
    loadingUnloading: 50,
    searchKeywords: ["wheat", "gehun", "gahu", "गेहूं"]
  },
  {
    id: "RICE",
    name: "Rice (Paddy)",
    nameHindi: "धान",
    category: "cereals",
    icon: "🌾",
    unit: "quintal",
    msp2024: 2300,
    seasonality: ["kharif"],
    storageLife: "12 months",
    commission: 0.02,
    loadingUnloading: 50,
    searchKeywords: ["rice", "paddy", "dhan", "धान", "चावल"]
  },
  {
    id: "MAIZE",
    name: "Maize",
    nameHindi: "मक्का",
    category: "cereals",
    icon: "🌽",
    unit: "quintal",
    msp2024: 2225,
    seasonality: ["kharif"],
    storageLife: "6-12 months",
    commission: 0.02,
    loadingUnloading: 50,
    searchKeywords: ["maize", "corn", "makka", "मक्का", "भुट्टा"]
  },
  {
    id: "ONION",
    name: "Onion",
    nameHindi: "प्याज",
    category: "vegetables",
    icon: "🧅",
    unit: "quintal",
    msp2024: null,
    seasonality: ["year-round"],
    storageLife: "2-3 months",
    commission: 0.04,
    loadingUnloading: 60,
    searchKeywords: ["onion", "pyaz", "pyaj", "प्याज", "कांदा"]
  },
  {
    id: "TOMATO",
    name: "Tomato",
    nameHindi: "टमाटर",
    category: "vegetables",
    icon: "🍅",
    unit: "quintal",
    msp2024: null,
    seasonality: ["year-round"],
    storageLife: "1-2 weeks",
    commission: 0.05,
    loadingUnloading: 60,
    searchKeywords: ["tomato", "tamatar", "टमाटर"]
  },
  {
    id: "POTATO",
    name: "Potato",
    nameHindi: "आलू",
    category: "vegetables",
    icon: "🥔",
    unit: "quintal",
    msp2024: null,
    seasonality: ["rabi"],
    storageLife: "3-6 months",
    commission: 0.03,
    loadingUnloading: 50,
    searchKeywords: ["potato", "aloo", "alu", "आलू"]
  },
  {
    id: "GRAM",
    name: "Gram (Chickpea)",
    nameHindi: "चना",
    category: "pulses",
    icon: "🫘",
    unit: "quintal",
    msp2024: 5440,
    seasonality: ["rabi"],
    storageLife: "12 months",
    commission: 0.02,
    loadingUnloading: 50,
    searchKeywords: ["gram", "chickpea", "chana", "चना"]
  },
  {
    id: "TUR",
    name: "Tur / Arhar",
    nameHindi: "अरहर",
    category: "pulses",
    icon: "🫘",
    unit: "quintal",
    msp2024: 7550,
    seasonality: ["kharif"],
    storageLife: "12 months",
    commission: 0.02,
    loadingUnloading: 50,
    searchKeywords: ["tur", "arhar", "pigeon pea", "अरहर", "तूर"]
  },
  {
    id: "MOONG",
    name: "Moong",
    nameHindi: "मूंग",
    category: "pulses",
    icon: "🫘",
    unit: "quintal",
    msp2024: 8558,
    seasonality: ["kharif"],
    storageLife: "12 months",
    commission: 0.02,
    loadingUnloading: 50,
    searchKeywords: ["moong", "green gram", "मूंग", "मूंगदाल"]
  },
  {
    id: "MUSTARD",
    name: "Mustard",
    nameHindi: "सरसों",
    category: "oilseeds",
    icon: "🌻",
    unit: "quintal",
    msp2024: 5650,
    seasonality: ["rabi"],
    storageLife: "6-12 months",
    commission: 0.02,
    loadingUnloading: 50,
    searchKeywords: ["mustard", "sarson", "सरसों", "राई"]
  }
];

export function getCropById(cropId: string): Crop | undefined {
  return crops.find(c => c.id === cropId);
}

export function getCropsByCategory(category: Crop['category']): Crop[] {
  return crops.filter(c => c.category === category);
}

export function searchCrops(query: string): Crop[] {
  const lowerQuery = query.toLowerCase();
  return crops.filter(crop => 
    crop.name.toLowerCase().includes(lowerQuery) ||
    crop.nameHindi.includes(query) ||
    crop.searchKeywords.some(k => k.toLowerCase().includes(lowerQuery))
  );
}

export const cropCategories = [
  { id: 'cereals', name: 'Cereals', icon: '🌾' },
  { id: 'pulses', name: 'Pulses', icon: '🫘' },
  { id: 'vegetables', name: 'Vegetables', icon: '🥬' },
  { id: 'oilseeds', name: 'Oilseeds', icon: '🌻' }
] as const;
