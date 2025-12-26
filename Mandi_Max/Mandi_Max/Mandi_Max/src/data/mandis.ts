import { indiaGeography } from './indiaGeography';

export interface MandiPrice {
  date: string;
  crop: string;
  mandi: string;
  mandiId: string;
  district: string;
  districtId: string;
  state: string;
  stateId: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  lat: number;
  lng: number;
}

// Generate mock mandi data for all districts
function generateMandiData(): MandiPrice[] {
  const mandis: MandiPrice[] = [];
  const crops = ['WHEAT', 'RICE', 'MAIZE', 'ONION', 'TOMATO', 'POTATO', 'GRAM', 'TUR', 'MOONG', 'MUSTARD'];
  
  // Base prices for each crop
  const basePrices: Record<string, { min: number; max: number }> = {
    WHEAT: { min: 2100, max: 2400 },
    RICE: { min: 2200, max: 2500 },
    MAIZE: { min: 2000, max: 2350 },
    ONION: { min: 1500, max: 3500 },
    TOMATO: { min: 1000, max: 4000 },
    POTATO: { min: 800, max: 1800 },
    GRAM: { min: 5200, max: 5800 },
    TUR: { min: 7200, max: 8000 },
    MOONG: { min: 8200, max: 9000 },
    MUSTARD: { min: 5400, max: 5900 }
  };

  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  });

  indiaGeography.forEach(state => {
    state.districts.forEach(district => {
      // Each district has 1-3 mandis
      const mandiCount = Math.floor(Math.random() * 3) + 1;
      
      for (let m = 0; m < mandiCount; m++) {
        const mandiSuffix = mandiCount > 1 ? ` Mandi ${m + 1}` : ' APMC';
        const mandiName = `${district.name}${mandiSuffix}`;
        const mandiId = `${district.id}_M${m + 1}`;
        
        // Add slight random offset to mandi location
        const latOffset = (Math.random() - 0.5) * 0.1;
        const lngOffset = (Math.random() - 0.5) * 0.1;
        
        crops.forEach(crop => {
          // Not all mandis have all crops
          if (Math.random() > 0.3) {
            const base = basePrices[crop];
            const priceVariation = (Math.random() - 0.5) * 200;
            
            dates.forEach((date, dateIndex) => {
              // Price changes slightly each day
              const dayVariation = (Math.random() - 0.5) * 100;
              const minPrice = Math.round(base.min + priceVariation + dayVariation);
              const maxPrice = Math.round(base.max + priceVariation + dayVariation);
              const modalPrice = Math.round((minPrice + maxPrice) / 2 + (Math.random() - 0.5) * 50);
              
              mandis.push({
                date,
                crop,
                mandi: mandiName,
                mandiId,
                district: district.name,
                districtId: district.id,
                state: state.name,
                stateId: state.id,
                minPrice,
                maxPrice,
                modalPrice,
                lat: district.lat + latOffset,
                lng: district.lng + lngOffset
              });
            });
          }
        });
      }
    });
  });

  return mandis;
}

export const allMandiPrices = generateMandiData();

export function getMandiPricesForCrop(
  cropId: string,
  stateId: string,
  districtId: string,
  radiusKm: number = 200
): MandiPrice[] {
  const today = new Date().toISOString().split('T')[0];
  
  // Get farmer location
  const state = indiaGeography.find(s => s.id === stateId);
  const district = state?.districts.find(d => d.id === districtId);
  
  if (!district) return [];
  
  const farmerLat = district.lat;
  const farmerLng = district.lng;
  
  // Filter mandis by crop and within radius
  const relevantMandis = allMandiPrices.filter(mandi => {
    if (mandi.crop !== cropId) return false;
    if (mandi.date !== today) return false;
    
    const distance = calculateDistance(farmerLat, farmerLng, mandi.lat, mandi.lng);
    return distance <= radiusKm;
  });
  
  // Get unique mandis (latest price for each)
  const uniqueMandis = new Map<string, MandiPrice>();
  relevantMandis.forEach(mandi => {
    const existing = uniqueMandis.get(mandi.mandiId);
    if (!existing || mandi.date > existing.date) {
      uniqueMandis.set(mandi.mandiId, mandi);
    }
  });
  
  return Array.from(uniqueMandis.values());
}

export function getHistoricalPrices(
  cropId: string,
  mandiId: string,
  days: number = 7
): MandiPrice[] {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - days);
  
  return allMandiPrices
    .filter(m => 
      m.crop === cropId && 
      m.mandiId === mandiId &&
      new Date(m.date) >= startDate
    )
    .sort((a, b) => a.date.localeCompare(b.date));
}

// Haversine formula for distance calculation
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  // Apply road distance multiplier (roads are ~1.3x longer than straight line)
  return Math.round(distance * 1.3);
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export interface MandiRecommendation {
  mandi: MandiPrice;
  distance: number;
  grossRevenue: number;
  transportCost: number;
  commission: number;
  loadingUnloading: number;
  totalDeductions: number;
  netProfit: number;
  pricePerQuintalNet: number;
  rank: 'best' | 'decent' | 'avoid';
  rankReason: string;
}

export function calculateRecommendations(
  cropId: string,
  stateId: string,
  districtId: string,
  quantity: number,
  transportRatePerKm: number = 10,
  commissionRate: number = 0.02,
  loadingPerQuintal: number = 50
): MandiRecommendation[] {
  const state = indiaGeography.find(s => s.id === stateId);
  const district = state?.districts.find(d => d.id === districtId);
  
  if (!district) return [];
  
  const mandis = getMandiPricesForCrop(cropId, stateId, districtId, 200);
  
  const recommendations: MandiRecommendation[] = mandis.map(mandi => {
    const distance = calculateDistance(district.lat, district.lng, mandi.lat, mandi.lng);
    const grossRevenue = mandi.modalPrice * quantity;
    const transportCost = distance * transportRatePerKm;
    const commission = grossRevenue * commissionRate;
    const loadingUnloading = loadingPerQuintal * quantity;
    const totalDeductions = transportCost + commission + loadingUnloading;
    const netProfit = grossRevenue - totalDeductions;
    const pricePerQuintalNet = netProfit / quantity;
    
    return {
      mandi,
      distance,
      grossRevenue,
      transportCost,
      commission,
      loadingUnloading,
      totalDeductions,
      netProfit,
      pricePerQuintalNet,
      rank: 'avoid' as const,
      rankReason: ''
    };
  });
  
  // Sort by net profit
  recommendations.sort((a, b) => b.netProfit - a.netProfit);
  
  // Assign ranks
  if (recommendations.length > 0) {
    const bestProfit = recommendations[0].netProfit;
    
    recommendations.forEach((rec, index) => {
      const profitDiff = ((bestProfit - rec.netProfit) / bestProfit) * 100;
      
      if (index === 0) {
        rec.rank = 'best';
        rec.rankReason = 'Highest net profit among all mandis';
      } else if (profitDiff <= 10) {
        rec.rank = 'decent';
        rec.rankReason = `${profitDiff.toFixed(1)}% less than best option`;
      } else {
        rec.rank = 'avoid';
        rec.rankReason = `${profitDiff.toFixed(1)}% less profit - not recommended`;
      }
    });
  }
  
  return recommendations;
}

export function getPriceTrend(prices: MandiPrice[]): 'rising' | 'falling' | 'stable' {
  if (prices.length < 2) return 'stable';
  
  const firstPrice = prices[0].modalPrice;
  const lastPrice = prices[prices.length - 1].modalPrice;
  const change = ((lastPrice - firstPrice) / firstPrice) * 100;
  
  if (change > 3) return 'rising';
  if (change < -3) return 'falling';
  return 'stable';
}
