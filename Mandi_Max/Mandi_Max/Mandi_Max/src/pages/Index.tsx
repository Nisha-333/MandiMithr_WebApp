import { useState, useMemo } from 'react';
import { Search, Loader2, Info } from 'lucide-react';
import { Header } from '@/components/Header';
import { LocationSelector } from '@/components/LocationSelector';
import { CropSelector } from '@/components/CropSelector';
import { QuantityInput } from '@/components/QuantityInput';
import { BestMandiCard } from '@/components/BestMandiCard';
import { MandiCard } from '@/components/MandiCard';
import { MandiMap } from '@/components/MandiMap';
import { PriceTrendChart } from '@/components/PriceTrendChart';
import { ExplainabilityPanel } from '@/components/ExplainabilityPanel';
import { WhatIfAnalysis } from '@/components/WhatIfAnalysis';
import { EducationalCards } from '@/components/EducationalCards';
import { calculateRecommendations, getHistoricalPrices, getPriceTrend } from '@/data/mandis';
import { getDistrictById, defaultLocation } from '@/data/indiaGeography';
import { getCropById } from '@/data/crops';

const Index = () => {
  const [stateId, setStateId] = useState(defaultLocation.stateId);
  const [districtId, setDistrictId] = useState(defaultLocation.districtId);
  const [cropId, setCropId] = useState('WHEAT');
  const [quantity, setQuantity] = useState(20);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedMandiId, setSelectedMandiId] = useState<string | undefined>();

  const recommendations = useMemo(() => {
    if (!showResults) return [];
    return calculateRecommendations(cropId, stateId, districtId, quantity);
  }, [showResults, cropId, stateId, districtId, quantity]);

  const farmerLocation = getDistrictById(stateId, districtId);
  const selectedCrop = getCropById(cropId);
  const best = recommendations[0];
  const secondBest = recommendations[1];
  const historicalPrices = best
  ? getHistoricalPrices(cropId, best.mandi.mandiId, 7)
  : [];

const trend = historicalPrices.length > 0
  ? getPriceTrend(historicalPrices)
  : undefined;


  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 1500));
    setShowResults(true);
    setIsAnalyzing(false);
  };

  const canAnalyze = stateId && districtId && cropId && quantity > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container-app py-6 sm:py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Find Your Best Mandi Today
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compare net profits across mandis in your area. Make data-driven decisions, not guesses.
          </p>
        </div>

        {/* Input Form */}
        <div className="section-card mb-8">
          <div className="space-y-8">
            <LocationSelector
              selectedStateId={stateId}
              selectedDistrictId={districtId}
              onStateChange={setStateId}
              onDistrictChange={setDistrictId}
            />

            <div className="h-px bg-border" />

            <CropSelector selectedCropId={cropId} onCropChange={setCropId} />

            <div className="h-px bg-border" />

            <QuantityInput quantity={quantity} onQuantityChange={setQuantity} />

            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze || isAnalyzing}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyzing {recommendations.length || '...'} mandis...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Find Best Mandi Today
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Info className="h-3.5 w-3.5" />
              <span>Analysis uses cached government mandi price data</span>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {showResults && recommendations.length > 0 && (
          <div className="space-y-8 animate-fade-in">
            {/* Best Mandi Highlight */}
            <BestMandiCard
              recommendation={best}
              quantity={quantity}
              secondBest={secondBest}
              totalMandis={recommendations.length}
            />

            {/* Map and Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Map */}
              <section id="mandi-map" className="scroll-mt-24">
              {farmerLocation && (
                <MandiMap
                  farmerLocation={farmerLocation}
                  recommendations={recommendations.slice(0, 10)}
                  selectedMandiId={selectedMandiId}
                  onMandiSelect={setSelectedMandiId}
                />
              )}
 
              </section>
              {/* Mandi Cards */}
              <div className="section-card">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  All Mandis ({recommendations.length})
                </h3>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {recommendations.slice(0, 10).map((rec) => (
                    <MandiCard
                      key={rec.mandi.mandiId}
                      recommendation={rec}
                      quantity={quantity}
                      isSelected={selectedMandiId === rec.mandi.mandiId}
                      onClick={() => setSelectedMandiId(rec.mandi.mandiId)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Price Trend */}
            <PriceTrendChart
              cropId={cropId}
              mandiId={best.mandi.mandiId}
              mandiName={best.mandi.mandi}
              trend={trend}
            />

            {/* Explainability */}
            <ExplainabilityPanel
              best={best}
              secondBest={secondBest}
              allRecommendations={recommendations}
              quantity={quantity}
            />

            {/* What-If Analysis */}
            <WhatIfAnalysis
              cropId={cropId}
              stateId={stateId}
              districtId={districtId}
              initialQuantity={quantity}
            />

            {/* Educational Content */}
            <EducationalCards trend={trend}/>
          </div>
        )}

        {/* No Results */}
        {showResults && recommendations.length === 0 && (
          <div className="section-card text-center py-12">
            <p className="text-4xl mb-4">🔍</p>
            <h3 className="text-xl font-semibold text-foreground mb-2">No mandis found</h3>
            <p className="text-muted-foreground">
              Try selecting a different location or expanding your search radius.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-8">
        <div className="container-app text-center text-sm text-muted-foreground">
          <p>Rural Market Support Platform • Demo Version</p>
          <p className="mt-1">Data for demonstration purposes only. Always verify prices before selling.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
