import { useState, useMemo } from 'react';
import { Search, Check, TrendingUp } from 'lucide-react';
import { crops, cropCategories, type Crop } from '@/data/crops';

interface CropSelectorProps {
  selectedCropId: string;
  onCropChange: (cropId: string) => void;
}

export function CropSelector({ selectedCropId, onCropChange }: CropSelectorProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredCrops = useMemo(() => {
    let filtered = crops;
    
    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = crops.filter(crop =>
        crop.name.toLowerCase().includes(lowerSearch) ||
        crop.nameHindi.includes(search) ||
        crop.searchKeywords.some(k => k.toLowerCase().includes(lowerSearch))
      );
    } else if (activeCategory) {
      filtered = crops.filter(crop => crop.category === activeCategory);
    }
    
    return filtered;
  }, [search, activeCategory]);

  const selectedCrop = crops.find(c => c.id === selectedCropId);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span className="text-lg">🌾</span>
        <span>Select Your Crop</span>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search crops (e.g., wheat, गेहूं)..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setActiveCategory(null);
          }}
          className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
        />
      </div>

      {/* Category Tabs */}
      {!search && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              !activeCategory
                ? 'bg-primary text-primary-foreground'
                : 'bg-accent text-accent-foreground hover:bg-accent/80'
            }`}
          >
            All Crops
          </button>
          {cropCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition-colors ${
                activeCategory === cat.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent text-accent-foreground hover:bg-accent/80'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Crop Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filteredCrops.map(crop => (
          <button
            key={crop.id}
            onClick={() => onCropChange(crop.id)}
            className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover:shadow-md ${
              selectedCropId === crop.id
                ? 'border-primary bg-accent shadow-md'
                : 'border-border bg-card hover:border-primary/50'
            }`}
          >
            {/* Selection Check */}
            {selectedCropId === crop.id && (
              <div className="absolute top-2 right-2">
                <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              </div>
            )}

            {/* Crop Icon */}
            <span className="text-3xl">{crop.icon}</span>

            {/* Crop Name */}
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">{crop.name}</p>
              <p className="text-xs text-muted-foreground">{crop.nameHindi}</p>
            </div>

            {/* MSP Badge */}
            {crop.msp2024 && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-success-soft text-success rounded-full text-xs font-medium">
                <TrendingUp className="h-3 w-3" />
                MSP: ₹{crop.msp2024.toLocaleString()}
              </div>
            )}
          </button>
        ))}
      </div>

      {filteredCrops.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-lg mb-2">🔍</p>
          <p>No crops found matching "{search}"</p>
        </div>
      )}

      {/* Selected Crop Summary */}
      {selectedCrop && (
        <div className="mt-4 p-4 bg-accent rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{selectedCrop.icon}</span>
            <div className="flex-1">
              <p className="font-medium text-foreground">
                {selectedCrop.name} <span className="text-muted-foreground">({selectedCrop.nameHindi})</span>
              </p>
              <div className="flex flex-wrap gap-2 mt-2 text-xs">
                <span className="px-2 py-0.5 bg-background rounded-full text-muted-foreground">
                  Season: {selectedCrop.seasonality.join(', ')}
                </span>
                <span className="px-2 py-0.5 bg-background rounded-full text-muted-foreground">
                  Storage: {selectedCrop.storageLife}
                </span>
                {selectedCrop.msp2024 && (
                  <span className="px-2 py-0.5 bg-success-soft text-success rounded-full font-medium">
                    💰 MSP: ₹{selectedCrop.msp2024.toLocaleString()}/quintal
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
