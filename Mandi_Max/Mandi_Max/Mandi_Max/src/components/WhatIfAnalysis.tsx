import { useState, useEffect, useMemo } from 'react';
import { Sliders, TrendingUp, AlertCircle } from 'lucide-react';
import { calculateRecommendations, type MandiRecommendation } from '@/data/mandis';

interface WhatIfAnalysisProps {
  cropId: string;
  stateId: string;
  districtId: string;
  initialQuantity: number;
}

export function WhatIfAnalysis({ cropId, stateId, districtId, initialQuantity }: WhatIfAnalysisProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [debouncedQuantity, setDebouncedQuantity] = useState(quantity);

  // Debounce quantity changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuantity(quantity);
    }, 300);
    return () => clearTimeout(timer);
  }, [quantity]);

  const recommendations = useMemo(() => {
    return calculateRecommendations(cropId, stateId, districtId, debouncedQuantity);
  }, [cropId, stateId, districtId, debouncedQuantity]);

  const top3 = recommendations.slice(0, 3);
  const best = top3[0];

  // Check if best mandi changes at different quantities
  const checkBestMandiStability = useMemo(() => {
    const quantities = [5, 10, 20, 30, 40, 50];
    const bestMandis = quantities.map(q => {
      const recs = calculateRecommendations(cropId, stateId, districtId, q);
      return recs[0]?.mandi.mandiId;
    });
    const uniqueBests = new Set(bestMandis);
    return {
      isStable: uniqueBests.size === 1,
      bestMandiId: best?.mandi.mandiId
    };
  }, [cropId, stateId, districtId, best]);

  if (!best) return null;

  return (
    <div className="section-card">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10">
          <Sliders className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">What-If Analysis: Change Quantity</h3>
          <p className="text-sm text-muted-foreground">See how quantity affects your best mandi choice</p>
        </div>
      </div>

      {/* Quantity Slider */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Adjust quantity:</span>
          <span className="text-lg font-bold text-foreground">{quantity} quintals</span>
        </div>
        <input
          type="range"
          min={5}
          max={50}
          step={1}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          className="w-full h-2 bg-accent rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>5Q</span>
          <span>25Q</span>
          <span>50Q</span>
        </div>
      </div>

      {/* Quick Select Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[5, 10, 20, 30, 40, 50].map(q => (
          <button
            key={q}
            onClick={() => setQuantity(q)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              quantity === q
                ? 'bg-primary text-primary-foreground'
                : 'bg-accent text-accent-foreground hover:bg-accent/80'
            }`}
          >
            {q}Q
          </button>
        ))}
      </div>

      {/* Live Results */}
      <div className="bg-accent rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="font-semibold text-foreground">Live Results at {debouncedQuantity} quintals:</span>
        </div>

        <div className="space-y-3">
          {top3.map((rec, index) => (
            <div
              key={rec.mandi.mandiId}
              className={`flex items-center justify-between p-3 rounded-lg ${
                index === 0 ? 'bg-success-soft border border-success/20' : 'bg-background'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-lg ${index === 0 ? '' : 'opacity-50'}`}>
                  {index === 0 ? '🟢' : index === 1 ? '🟡' : '🔴'}
                </span>
                <div>
                  <p className={`font-medium ${index === 0 ? 'text-success' : 'text-foreground'}`}>
                    {index === 0 ? 'BEST' : index === 1 ? '2nd' : '3rd'}: {rec.mandi.mandi.split(' ')[0]}
                  </p>
                  <p className="text-xs text-muted-foreground">{rec.distance} km away</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${index === 0 ? 'text-success' : 'text-foreground'}`}>
                  ₹{rec.netProfit.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Net Profit</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insight */}
      <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
        <div className="flex items-start gap-2">
          <span className="text-lg">💡</span>
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Insight:</p>
            {checkBestMandiStability.isStable ? (
              <p className="text-sm text-muted-foreground">
                <span className="text-success font-medium">{best.mandi.mandi}</span> remains the best choice 
                across all quantities from 5 to 50 quintals.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                The best mandi may change at different quantities. Try adjusting to see the impact.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
