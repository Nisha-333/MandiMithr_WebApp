import { Target, MapPin, TrendingUp, ExternalLink, Navigation } from 'lucide-react';
import type { MandiRecommendation } from '@/data/mandis';
import { useState } from "react";

interface BestMandiCardProps {
  recommendation: MandiRecommendation;
  quantity: number;
  secondBest?: MandiRecommendation;
  totalMandis: number;
}

export function BestMandiCard({ recommendation, quantity, secondBest, totalMandis }: BestMandiCardProps) {
  const { mandi, distance, netProfit, grossRevenue, transportCost, commission, pricePerQuintalNet } = recommendation;
  
  const profitDiff = secondBest ? netProfit - secondBest.netProfit : 0;
const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-success bg-gradient-to-br from-success-soft via-success-soft/50 to-background shadow-xl animate-scale-in">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23166534' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-success text-success-foreground rounded-full">
            <Target className="h-5 w-5" />
            <span className="font-bold uppercase tracking-wide">Best Mandi For You Today</span>
          </div>
        </div>

        {/* Mandi Name */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {mandi.mandi}
          </h2>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{mandi.district}, {mandi.state} • {distance} km from your location</span>
          </div>
        </div>

        {/* Net Profit Highlight */}
        <div className="bg-card/80 backdrop-blur rounded-xl p-6 mb-6 border border-success/20">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <TrendingUp className="h-4 w-4" />
            <span>NET PROFIT</span>
          </div>
          <div className="profit-highlight mb-2">
            ₹{netProfit.toLocaleString()}
          </div>
          <p className="text-muted-foreground">
            For {quantity} quintals of your crop
          </p>
          <div className="text-sm text-muted-foreground mt-2">
            ≈ ₹{Math.round(pricePerQuintalNet).toLocaleString()} per quintal after all costs
          </div>
        </div>

        {/* Why This Is Best */}
        <div className="space-y-3 mb-6">
          <h3 className="font-semibold text-foreground">Why this is best:</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-success">✅</span>
              <span className="text-sm text-foreground">Highest net profit among {totalMandis} mandis analyzed</span>
            </div>
            {secondBest && profitDiff > 0 && (
              <div className="flex items-start gap-2">
                <span className="text-success">✅</span>
                <span className="text-sm text-foreground">
                  ₹{profitDiff.toLocaleString()} more than 2nd best option ({secondBest.mandi.mandi})
                </span>
              </div>
            )}
            <div className="flex items-start gap-2">
              <span className="text-success">✅</span>
              <span className="text-sm text-foreground">
                Only {distance} km away - low transport cost of ₹{transportCost.toLocaleString()}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-success">✅</span>
              <span className="text-sm text-foreground">Price updated on {mandi.date}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
  onClick={() => setShowBreakdown(!showBreakdown)}
  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-all"
>
  <ExternalLink className="h-4 w-4" />
  {showBreakdown ? "Hide Breakdown" : "View Breakdown"}
</button>
{showBreakdown && (
  <div className="mt-4 rounded-xl border border-border bg-card p-4 text-sm animate-fade-in">
    <div className="flex justify-between mb-2">
      <span className="text-muted-foreground">Gross Revenue</span>
      <span className="font-medium">
        ₹{grossRevenue.toLocaleString()}
      </span>
    </div>

    <div className="flex justify-between mb-2 text-muted-foreground">
      <span>Transport Cost</span>
      <span>- ₹{transportCost.toLocaleString()}</span>
    </div>

    <div className="flex justify-between mb-2 text-muted-foreground">
      <span>Commission</span>
      <span>- ₹{commission.toLocaleString()}</span>
    </div>

    <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
      <span>Net Profit</span>
      <span className="text-success">
        ₹{netProfit.toLocaleString()}
      </span>
    </div>
  </div>
)}

          <button
  onClick={() => {
    const mapSection = document.getElementById("mandi-map");
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }}
  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-card border-2 border-border text-foreground rounded-lg font-semibold hover:bg-accent transition-all"
>
  <Navigation className="h-4 w-4" />
  Get Directions
</button>

        </div>
      </div>
    </div>
    
  );
}
