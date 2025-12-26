import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { getHistoricalPrices, getPriceTrend, type MandiPrice } from '@/data/mandis';

interface PriceTrendChartProps {
  cropId: string;
  mandiId: string;
  mandiName: string;
  trend: "rising" | "falling" | "stable";
}

export function PriceTrendChart({ cropId, mandiId, mandiName }: PriceTrendChartProps) {
  const historicalPrices = getHistoricalPrices(cropId, mandiId, 7);
  const trend = getPriceTrend(historicalPrices);

  if (historicalPrices.length === 0) {
    return (
      <div className="section-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">📊 Price Trend</h3>
        <p className="text-muted-foreground text-center py-8">
          No historical price data available for this mandi
        </p>
      </div>
    );
  }

  const chartData = historicalPrices.map(p => ({
    date: new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    price: p.modalPrice,
    min: p.minPrice,
    max: p.maxPrice
  }));

  const firstPrice = historicalPrices[0].modalPrice;
  const lastPrice = historicalPrices[historicalPrices.length - 1].modalPrice;
  const priceChange = lastPrice - firstPrice;
  const percentChange = ((priceChange / firstPrice) * 100).toFixed(1);

  const getTrendConfig = () => {
    switch (trend) {
      case 'rising':
        return {
          icon: TrendingUp,
          color: 'text-success',
          bgColor: 'bg-success-soft',
          label: 'Rising',
          message: 'Prices are trending up. Good time to sell!'
        };
      case 'falling':
        return {
          icon: TrendingDown,
          color: 'text-danger',
          bgColor: 'bg-danger-soft',
          label: 'Falling',
          message: 'Prices are declining. Consider selling soon.'
        };
      default:
        return {
          icon: Minus,
          color: 'text-warning',
          bgColor: 'bg-warning-soft',
          label: 'Stable',
          message: 'Prices are stable. Market is balanced.'
        };
    }
  };

  const trendConfig = getTrendConfig();
  const TrendIcon = trendConfig.icon;

  return (
    <section id="price-trends" className="mt-10 scroll-mt-24">
    <div className="section-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">📊 Price Trend (7 Days)</h3>
          <p className="text-sm text-muted-foreground">{mandiName}</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${trendConfig.bgColor}`}>
          <TrendIcon className={`h-4 w-4 ${trendConfig.color}`} />
          <span className={`text-sm font-medium ${trendConfig.color}`}>{trendConfig.label}</span>
        </div>
      </div>
      

      {/* Price Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-accent rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Week Ago</p>
          <p className="text-lg font-bold text-foreground">₹{firstPrice.toLocaleString()}</p>
        </div>
        <div className="text-center p-3 bg-accent rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Today</p>
          <p className="text-lg font-bold text-foreground">₹{lastPrice.toLocaleString()}</p>
        </div>
        <div className={`text-center p-3 rounded-lg ${trendConfig.bgColor}`}>
          <p className="text-xs text-muted-foreground mb-1">Change</p>
          <p className={`text-lg font-bold ${trendConfig.color}`}>
            {priceChange >= 0 ? '+' : ''}₹{priceChange}
            <span className="text-xs ml-1">({percentChange}%)</span>
          </p>
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `₹${value}`}
              domain={['dataMin - 50', 'dataMax + 50']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-lg)'
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Price']}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--success))"
              strokeWidth={2}
              fill="url(#priceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Trend Message */}
      <div className={`mt-4 p-3 rounded-lg ${trendConfig.bgColor}`}>
        <p className={`text-sm font-medium ${trendConfig.color}`}>
          {trend === 'rising' && '📈'} {trend === 'falling' && '📉'} {trend === 'stable' && '➖'} {trendConfig.message}
        </p>
      </div>
    </div>
     </section>
  );
}
