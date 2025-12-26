import { Wheat, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container-app">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Wheat className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground leading-tight">
                MandiMithr
              </span>
              <span className="text-xs text-muted-foreground leading-tight">
                Farmer Support Platform
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Find Mandi
            </a>
            <button
  onClick={() => {
    const el = document.getElementById("price-trends");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }}
  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
>
  Price Trends
</button>

            <button
  onClick={() => {
    const el = document.getElementById("learn");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }}
  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
>
  Learn
</button>

            <div className="relative">
  <button
    onClick={() => setShowHelp(!showHelp)}
    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
  >
    Help
  </button>

  {showHelp && (
    <div className="absolute right-0 mt-2 w-72 rounded-lg border bg-background p-4 shadow-lg z-50">
      <h3 className="text-sm font-semibold mb-2">
        Farmer Support & Helplines
      </h3>

      <div className="space-y-2 text-sm">
        <p>
          📞 <strong>Kisan Call Centre:</strong>{" "}
          <a href="tel:18001801551" className="text-blue-600 underline">
            1800-180-1551
          </a>
        </p>

        <p>
          📞 <strong>PM-KISAN Helpline:</strong>{" "}
          <a href="tel:1800115526" className="text-blue-600 underline">
            1800-115-526
          </a>
        </p>

        <p>
          📞 <strong>eNAM Support:</strong>{" "}
          <a href="tel:18002700224" className="text-blue-600 underline">
            1800-270-0224
          </a>
        </p>
      </div>
    </div>
  )}
</div>

          </nav>

          {/* Language Toggle & Mobile Menu */}
          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors">
              <span>🇮🇳</span>
              <span>EN</span>
            </button>
            
            

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-3">
              <a href="#" className="px-2 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-lg transition-colors">
                Find Mandi
              </a>
              <a href="#" className="px-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
                Price Trends
              </a>
              <a href="#" className="px-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
                Learn
              </a>
              <a href="#" className="px-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
                Help
              </a>
            </div>
          </nav>
        )}
    

      </div>
    </header>
  );
}
