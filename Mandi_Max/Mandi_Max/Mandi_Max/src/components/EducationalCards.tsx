import { BookOpen, DollarSign, TrendingUp, Calendar, AlertTriangle, Lightbulb } from 'lucide-react';

export function EducationalCards({ trend }: { trend: "rising" | "falling" | "stable" }) {
  const cards = [
    {
      icon: DollarSign,
      title: "What is MSP?",
      description: "Minimum Support Price (MSP) is the guaranteed price set by the government for certain crops. If market prices fall below MSP, the government will buy your produce at MSP.",
      color: "text-success",
      bgColor: "bg-success-soft"
    },
    {
      icon: TrendingUp,
      title: "Why Prices Fluctuate",
      description: "Crop prices change based on supply (how much farmers produce), demand (how much buyers need), weather conditions, transportation costs, and government policies.",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Calendar,
      title: "Best Time to Sell",
      description: "Prices are usually lowest right after harvest when supply is high. Consider storage if you can wait 2-3 months for better prices. Watch for festivals and export opportunities.",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      icon: AlertTriangle,
      title: "When NOT to Sell",
      description: "Avoid selling when: prices are at season low, weather forecasts predict supply shortage, or major procurement programs are announced. Storage can help you wait for better rates.",
      color: "text-warning",
      bgColor: "bg-warning-soft"
    },
    {
      icon: BookOpen,
      title: "Understanding Mandi Charges",
      description: "Mandi charges include: Commission (1-2%), Cess (0.5-1%), Loading/Unloading (₹30-60/quintal), Weighing charges, and sometimes hamali. Always ask for receipts.",
      color: "text-danger",
      bgColor: "bg-danger-soft"
    },
    {
      icon: Lightbulb,
      title: "Smart Selling Tips",
      description: "Grade your produce for better prices. Sell in bulk through FPOs. Compare multiple mandis. Keep your produce clean and dry. Build relationships with reliable traders.",
      color: "text-accent-foreground",
      bgColor: "bg-accent"
    }
  ];

  return (
    <section id="learn" className="scroll-mt-24">
<h2 className="text-xl font-semibold mb-4">
  📘 Insights Based on Today’s Market
</h2>

{!trend && (
  <div className="p-4 mb-4 rounded-lg bg-blue-50 border border-blue-200">
    <p className="font-medium">
      ℹ️ Generate results to see insights based on today’s market.
    </p>
  </div>
)}

{trend === "rising" && (
  <div className="p-4 mb-4 rounded-lg bg-green-50 border border-green-200">
    <p className="font-medium">
      📈 Prices are rising in your selected mandi.
    </p>
    <p className="text-sm mt-1">
      Farmers often benefit by selling during rising trends, as demand is currently strong.
    </p>
  </div>
)}

{trend === "falling" && (
  <div className="p-4 mb-4 rounded-lg bg-yellow-50 border border-yellow-200">
    <p className="font-medium">
      📉 Prices are falling this week.
    </p>
    <p className="text-sm mt-1">
      If storage is available, waiting for recovery may help. Otherwise, selling early can reduce losses.
    </p>
  </div>
)}

{trend === "stable" && (
  <div className="p-4 mb-4 rounded-lg bg-gray-50 border border-gray-200">
    <p className="font-medium">
      ➖ Prices are stable in the current market.
    </p>
    <p className="text-sm mt-1">
      When prices are stable, comparing multiple mandis and reducing costs can improve net profit.
    </p>
  </div>
)}



    <div className="section-card">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary/20">
          <BookOpen className="h-5 w-5 text-secondary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Learn About Market Economics</h3>
          <p className="text-sm text-muted-foreground">Understanding the market helps you make better decisions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl ${card.bgColor} border border-border/50 hover:shadow-md transition-shadow`}
          >
            <div className={`h-10 w-10 flex items-center justify-center rounded-lg bg-card mb-3`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <h4 className="font-semibold text-foreground mb-2">{card.title}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
    </section>
  );
}
