import { MapPin, TrendingUp, Truck, Receipt, ChevronRight } from 'lucide-react';
import type { MandiRecommendation } from '@/data/mandis';

interface MandiCardProps {
  recommendation: MandiRecommendation;
  quantity: number;
  isSelected?: boolean;
  onClick?: () => void;
}

export function MandiCard({ recommendation, quantity, isSelected, onClick }: MandiCardProps) {
  const { mandi, distance, grossRevenue, transportCost, commission, netProfit, rank, rankReason } = recommendation;

  const getRankStyles = () => {
    switch (rank) {
      case 'best':
        return {
          badge: 'badge-best',
          border: 'border-success',
          bg: 'bg-success-soft',
          icon: '🎯'
        };
      case 'decent':
        return {
          badge: 'badge-decent',
          border: 'border-warning',
          bg: 'bg-warning-soft',
          icon: '👍'
        };
      default:
        return {
          badge: 'badge-avoid',
          border: 'border-danger',
          bg: 'bg-danger-soft',
          icon: '⚠️'
        };
    }
  };

  const styles = getRankStyles();

  return (
    <div
      onClick={onClick}
      className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-lg ${
        isSelected ? `${styles.border} ${styles.bg} shadow-lg` : 'border-border bg-card hover:border-primary/50'
      }`}
    >
      {/* Rank Badge */}
      <div className="flex items-start justify-between mb-3">
        <div className={styles.badge}>
          <span>{styles.icon}</span>
          <span className="uppercase">{rank === 'avoid' ? 'Not Recommended' : rank}</span>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Mandi Name & Location */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">{mandi.mandi}</h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
          <MapPin className="h-3.5 w-3.5" />
          <span>{distance} km • {mandi.district}, {mandi.state}</span>
        </div>
      </div>

      {/* Price Info */}
      <div className="p-3 bg-background rounded-lg mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-success" />
            <span className="text-sm text-muted-foreground">Price</span>
          </div>
          <span className="font-bold text-foreground">₹{mandi.modalPrice.toLocaleString()}/quintal</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-muted-foreground">Updated</span>
          <span className="text-xs text-muted-foreground">{mandi.date}</span>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-2 text-sm mb-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Gross Revenue</span>
          <span className="font-medium text-foreground">₹{grossRevenue.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <div className="flex items-center gap-1">
            <Truck className="h-3.5 w-3.5" />
            <span>Transport ({distance} km)</span>
          </div>
          <span>- ₹{transportCost.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <div className="flex items-center gap-1">
            <Receipt className="h-3.5 w-3.5" />
            <span>Commission (2%)</span>
          </div>
          <span>- ₹{Math.round(commission).toLocaleString()}</span>
        </div>
        <div className="h-px bg-border my-2" />
        <div className="flex items-center justify-between">
          <span className="font-semibold text-foreground">Net Profit</span>
          <span className="text-xl font-bold text-success">₹{netProfit.toLocaleString()}</span>
        </div>
      </div>

      {/* Rank Reason */}
      <p className="text-xs text-muted-foreground italic">{rankReason}</p>
    </div>
  );
}
