import { Lightbulb, TrendingUp, Truck, DollarSign, Clock } from 'lucide-react';
import type { MandiRecommendation } from '@/data/mandis';

interface ExplainabilityPanelProps {
  best: MandiRecommendation;
  secondBest?: MandiRecommendation;
  allRecommendations: MandiRecommendation[];
  quantity: number;
}

export function ExplainabilityPanel({ best, secondBest, allRecommendations, quantity }: ExplainabilityPanelProps) {
  const profitDiff = secondBest ? best.netProfit - secondBest.netProfit : 0;
  const profitPercent = secondBest ? ((profitDiff / secondBest.netProfit) * 100).toFixed(1) : 0;
  
  const avgPrice = allRecommendations.reduce((sum, r) => sum + r.mandi.modalPrice, 0) / allRecommendations.length;
  const priceRank = allRecommendations.filter(r => r.mandi.modalPrice < best.mandi.modalPrice).length;
  const pricePercentile = Math.round((priceRank / allRecommendations.length) * 100);

  const transportSavings = secondBest ? secondBest.transportCost - best.transportCost : 0;

  // Generate bottom line explanation
  const getBottomLine = () => {
    if (secondBest && best.mandi.modalPrice < secondBest.mandi.modalPrice && best.distance < secondBest.distance) {
      const priceDiff = secondBest.mandi.modalPrice - best.mandi.modalPrice;
      return `Even though ${secondBest.mandi.mandi} offers ₹${secondBest.mandi.modalPrice}/quintal (₹${priceDiff} more), the transport savings make ${best.mandi.mandi} more profitable overall.`;
    }
    
    if (secondBest && best.mandi.modalPrice > secondBest.mandi.modalPrice && best.distance < secondBest.distance) {
      return `${best.mandi.mandi} offers the best of both worlds: higher price (₹${best.mandi.modalPrice}) and lower transport cost.`;
    }
    
    if (secondBest && best.mandi.modalPrice > secondBest.mandi.modalPrice && best.distance > secondBest.distance) {
      const priceAdvantage = (best.mandi.modalPrice - secondBest.mandi.modalPrice) * quantity;
      return `The ₹${priceAdvantage.toLocaleString()} price advantage at ${best.mandi.mandi} more than compensates for the extra travel distance.`;
    }
    
    return `${best.mandi.mandi} offers the best overall value when considering price, distance, and all costs.`;
  };

  return (
    <div className="section-card">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary/20">
          <Lightbulb className="h-5 w-5 text-secondary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Why is {best.mandi.mandi} best for you today?</h3>
          <p className="text-sm text-muted-foreground">Our recommendation is based on these factors</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Factor 1: Highest Net Profit */}
        <div className="border-l-4 border-success pl-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-success text-success-foreground text-xs font-bold">1</span>
            <h4 className="font-semibold text-foreground">HIGHEST NET PROFIT</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            You'll earn <span className="font-semibold text-success">₹{best.netProfit.toLocaleString()}</span> after all costs.
            {secondBest && (
              <>
                {' '}This is <span className="font-semibold text-success">₹{profitDiff.toLocaleString()} ({profitPercent}%)</span> more than 
                the second-best option ({secondBest.mandi.mandi}).
              </>
            )}
          </p>
        </div>

        {/* Factor 2: Low Transport Cost */}
        {transportSavings > 0 && (
          <div className="border-l-4 border-primary pl-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
              <h4 className="font-semibold text-foreground">LOW TRANSPORT COST</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Only <span className="font-semibold">{best.distance} km</span> away = ₹{best.transportCost.toLocaleString()} transport.
              {secondBest && (
                <>
                  {' '}Compared to {secondBest.mandi.mandi} ({secondBest.distance} km = ₹{secondBest.transportCost.toLocaleString()}), 
                  you save <span className="font-semibold text-success">₹{transportSavings.toLocaleString()}</span> in transport alone.
                </>
              )}
            </p>
          </div>
        )}

        {/* Factor 3: Competitive Price */}
        <div className="border-l-4 border-secondary pl-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-secondary text-secondary-foreground text-xs font-bold">{transportSavings > 0 ? '3' : '2'}</span>
            <h4 className="font-semibold text-foreground">COMPETITIVE PRICE</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">₹{best.mandi.modalPrice.toLocaleString()}/quintal</span> (vs market avg ₹{Math.round(avgPrice).toLocaleString()}).
            Higher than <span className="font-semibold">{pricePercentile}%</span> of nearby mandis.
          </p>
        </div>

        {/* Factor 4: Recent Price Update */}
        <div className="border-l-4 border-accent-foreground/30 pl-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-accent text-accent-foreground text-xs font-bold">{transportSavings > 0 ? '4' : '3'}</span>
            <h4 className="font-semibold text-foreground">RECENT PRICE UPDATE</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Price updated on <span className="font-semibold">{best.mandi.date}</span>.
            Fresh data = confident decision.
          </p>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mt-6 p-4 bg-success-soft rounded-lg border border-success/20">
        <div className="flex items-start gap-2">
          <span className="text-lg">💡</span>
          <div>
            <p className="font-semibold text-foreground mb-1">BOTTOM LINE:</p>
            <p className="text-sm text-muted-foreground">{getBottomLine()}</p>
          </div>
        </div>
      </div>

      {/* Quick Comparison Table */}
      {secondBest && allRecommendations.length >= 3 && (
        <div className="mt-6">
          <h4 className="font-semibold text-foreground mb-3">📊 Quick Comparison: Top 3 Mandis</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium"></th>
                  {allRecommendations.slice(0, 3).map((rec, i) => (
                    <th key={rec.mandi.mandiId} className="text-right py-2 px-3">
                      <div className="font-medium text-foreground">{rec.mandi.mandi.split(' ')[0]}</div>
                      <div className="text-xs text-muted-foreground">{i === 0 ? '(BEST)' : `(${i + 1}${i === 1 ? 'nd' : 'rd'})`}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-2 text-muted-foreground">Price</td>
                  {allRecommendations.slice(0, 3).map((rec) => (
                    <td key={rec.mandi.mandiId} className="text-right py-2 px-3 font-medium">₹{rec.mandi.modalPrice.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 text-muted-foreground">Distance</td>
                  {allRecommendations.slice(0, 3).map((rec) => (
                    <td key={rec.mandi.mandiId} className="text-right py-2 px-3">{rec.distance} km</td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 text-muted-foreground">Transport</td>
                  {allRecommendations.slice(0, 3).map((rec) => (
                    <td key={rec.mandi.mandiId} className="text-right py-2 px-3">₹{rec.transportCost.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 text-muted-foreground">Commission</td>
                  {allRecommendations.slice(0, 3).map((rec) => (
                    <td key={rec.mandi.mandiId} className="text-right py-2 px-3">₹{Math.round(rec.commission).toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="bg-accent">
                  <td className="py-2 font-semibold text-foreground">Net Profit</td>
                  {allRecommendations.slice(0, 3).map((rec, i) => (
                    <td key={rec.mandi.mandiId} className={`text-right py-2 px-3 font-bold ${i === 0 ? 'text-success' : 'text-foreground'}`}>
                      ₹{rec.netProfit.toLocaleString()}
                      {i === 0 && <span className="ml-1">✅</span>}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
