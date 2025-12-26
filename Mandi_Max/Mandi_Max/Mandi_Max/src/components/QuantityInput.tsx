import { Minus, Plus, Scale } from 'lucide-react';

interface QuantityInputProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

const quickSelectValues = [5, 10, 20, 30, 50, 100];

export function QuantityInput({ quantity, onQuantityChange }: QuantityInputProps) {
  const handleIncrement = () => {
    onQuantityChange(Math.min(quantity + 0.5, 1000));
  };

  const handleDecrement = () => {
    onQuantityChange(Math.max(quantity - 0.5, 0.5));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0.5 && value <= 1000) {
      onQuantityChange(value);
    }
  };

  const weightInKg = quantity * 100;
  const bags = Math.round(quantity);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Scale className="h-4 w-4" />
        <span>How much are you selling?</span>
      </div>

      {/* Main Input */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handleDecrement}
          disabled={quantity <= 0.5}
          className="h-12 w-12 flex items-center justify-center rounded-full border-2 border-border bg-card hover:bg-accent hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Minus className="h-5 w-5 text-foreground" />
        </button>

        <div className="flex items-baseline gap-2">
          <input
            type="number"
            value={quantity}
            onChange={handleInputChange}
            min={0.5}
            max={1000}
            step={0.5}
            className="w-24 text-center text-4xl font-bold text-foreground bg-transparent border-none focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-lg text-muted-foreground font-medium">Quintals</span>
        </div>

        <button
          onClick={handleIncrement}
          disabled={quantity >= 1000}
          className="h-12 w-12 flex items-center justify-center rounded-full border-2 border-border bg-card hover:bg-accent hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Plus className="h-5 w-5 text-foreground" />
        </button>
      </div>

      {/* Conversion Display */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span>💡</span>
        <span>1 quintal = 100 kg</span>
      </div>

      {/* Weight Equivalents */}
      <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-center">
        <div className="p-3 bg-accent rounded-lg">
          <p className="text-lg font-bold text-foreground">{weightInKg.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">kg</p>
        </div>
        <div className="p-3 bg-accent rounded-lg">
          <p className="text-lg font-bold text-foreground">{bags}</p>
          <p className="text-xs text-muted-foreground">bags (100kg)</p>
        </div>
        <div className="p-3 bg-accent rounded-lg">
          <p className="text-lg font-bold text-foreground">~{Math.ceil(quantity / 20)}</p>
          <p className="text-xs text-muted-foreground">tractor loads</p>
        </div>
      </div>

      {/* Quick Select */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground text-center">Quick Select:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {quickSelectValues.map(value => (
            <button
              key={value}
              onClick={() => onQuantityChange(value)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                quantity === value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-foreground hover:bg-accent hover:border-primary'
              }`}
            >
              {value}Q
            </button>
          ))}
        </div>
      </div>

      {/* Quantity Tips */}
      <div className="text-center text-sm text-muted-foreground">
        {quantity < 5 && <p>💡 Small quantity - good for testing market prices</p>}
        {quantity >= 5 && quantity <= 50 && <p>💡 Typical quantity for small-medium farmers</p>}
        {quantity > 50 && <p>💡 Large quantity - consider FPO aggregation for better rates</p>}
      </div>
    </div>
  );
}
