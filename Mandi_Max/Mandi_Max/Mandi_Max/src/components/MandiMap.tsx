import { useEffect, useRef, useState } from 'react';
import { MapPin, Maximize2, Minimize2 } from 'lucide-react';
import type { MandiRecommendation } from '@/data/mandis';
import type { District } from '@/data/indiaGeography';

interface MandiMapProps {
  farmerLocation: District;
  recommendations: MandiRecommendation[];
  selectedMandiId?: string;
  onMandiSelect?: (mandiId: string) => void;
}

export function MandiMap({ farmerLocation, recommendations, selectedMandiId, onMandiSelect }: MandiMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Simple SVG-based map visualization (no external dependencies)
  const getMarkerColor = (rank: 'best' | 'decent' | 'avoid') => {
    switch (rank) {
      case 'best': return '#16A34A';
      case 'decent': return '#F59E0B';
      default: return '#9CA3AF';
    }
  };

  // Calculate bounds
  const allPoints = [
    { lat: farmerLocation.lat, lng: farmerLocation.lng },
    ...recommendations.map(r => ({ lat: r.mandi.lat, lng: r.mandi.lng }))
  ];

  const minLat = Math.min(...allPoints.map(p => p.lat)) - 0.2;
  const maxLat = Math.max(...allPoints.map(p => p.lat)) + 0.2;
  const minLng = Math.min(...allPoints.map(p => p.lng)) - 0.2;
  const maxLng = Math.max(...allPoints.map(p => p.lng)) + 0.2;

  const latRange = maxLat - minLat;
  const lngRange = maxLng - minLng;

  const mapWidth = 100;
  const mapHeight = isExpanded ? 80 : 60;

  const toMapX = (lng: number) => ((lng - minLng) / lngRange) * mapWidth;
  const toMapY = (lat: number) => mapHeight - ((lat - minLat) / latRange) * mapHeight;

  const farmerX = toMapX(farmerLocation.lng);
  const farmerY = toMapY(farmerLocation.lat);

  return (
    <div className="section-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Mandi Map</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          {isExpanded ? (
            <Minimize2 className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Maximize2 className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span className="text-muted-foreground">Your Location</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-success" />
          <span className="text-muted-foreground">Best</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-warning" />
          <span className="text-muted-foreground">Decent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-muted-foreground" />
          <span className="text-muted-foreground">Others</span>
        </div>
      </div>

      {/* Map Container */}
      <div 
        ref={mapRef}
        className={`relative bg-accent rounded-xl overflow-hidden transition-all ${
          isExpanded ? 'h-96' : 'h-64'
        }`}
      >
        <svg
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background Grid */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="hsl(var(--border))" strokeWidth="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Connection Lines */}
          {recommendations.map((rec, index) => {
            const mandiX = toMapX(rec.mandi.lng);
            const mandiY = toMapY(rec.mandi.lat);
            const color = getMarkerColor(rec.rank);
            const strokeWidth = rec.rank === 'best' ? 0.4 : rec.rank === 'decent' ? 0.3 : 0.2;
            const opacity = rec.rank === 'best' ? 0.8 : rec.rank === 'decent' ? 0.6 : 0.3;
            const dashArray = rec.rank === 'best' ? undefined : rec.rank === 'decent' ? '1,1' : '0.5,1';

            return (
              <g key={rec.mandi.mandiId}>
                <line
                  x1={farmerX}
                  y1={farmerY}
                  x2={mandiX}
                  y2={mandiY}
                  stroke={color}
                  strokeWidth={strokeWidth}
                  strokeOpacity={opacity}
                  strokeDasharray={dashArray}
                />
                {/* Distance label */}
                <text
                  x={(farmerX + mandiX) / 2}
                  y={(farmerY + mandiY) / 2 - 1}
                  textAnchor="middle"
                  fontSize="2"
                  fill="hsl(var(--foreground))"
                  className="font-medium"
                >
                  {rec.distance}km
                </text>
              </g>
            );
          })}

          {/* Mandi Markers */}
          {recommendations.map((rec) => {
            const mandiX = toMapX(rec.mandi.lng);
            const mandiY = toMapY(rec.mandi.lat);
            const color = getMarkerColor(rec.rank);
            const size = rec.rank === 'best' ? 3 : rec.rank === 'decent' ? 2.5 : 2;
            const isSelected = selectedMandiId === rec.mandi.mandiId;

            return (
              <g 
                key={rec.mandi.mandiId}
                onClick={() => onMandiSelect?.(rec.mandi.mandiId)}
                className="cursor-pointer"
              >
                {/* Marker Shadow */}
                <circle
                  cx={mandiX}
                  cy={mandiY + 0.5}
                  r={size}
                  fill="black"
                  fillOpacity={0.2}
                />
                {/* Marker */}
                <circle
                  cx={mandiX}
                  cy={mandiY}
                  r={size}
                  fill={color}
                  stroke={isSelected ? 'hsl(var(--foreground))' : 'white'}
                  strokeWidth={isSelected ? 0.5 : 0.3}
                />
                {/* Pulse animation for best */}
                {rec.rank === 'best' && (
                  <circle
                    cx={mandiX}
                    cy={mandiY}
                    r={size}
                    fill="none"
                    stroke={color}
                    strokeWidth={0.3}
                    opacity={0.5}
                  >
                    <animate
                      attributeName="r"
                      from={size}
                      to={size + 2}
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.5"
                      to="0"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
                {/* Label */}
                <text
                  x={mandiX}
                  y={mandiY - size - 1}
                  textAnchor="middle"
                  fontSize="2"
                  fill="hsl(var(--foreground))"
                  className="font-medium pointer-events-none"
                >
                  {rec.mandi.mandi.split(' ')[0]}
                </text>
              </g>
            );
          })}

          {/* Farmer Location Marker */}
          <g>
            <circle
              cx={farmerX}
              cy={farmerY + 0.5}
              r={3}
              fill="black"
              fillOpacity={0.2}
            />
            <circle
              cx={farmerX}
              cy={farmerY}
              r={3}
              fill="hsl(var(--primary))"
              stroke="white"
              strokeWidth={0.4}
            />
            <text
              x={farmerX}
              y={farmerY + 0.7}
              textAnchor="middle"
              fontSize="3"
              fill="white"
              className="font-bold"
            >
              🛻
            </text>
            <text
              x={farmerX}
              y={farmerY - 4}
              textAnchor="middle"
              fontSize="2.5"
              fill="hsl(var(--primary))"
              className="font-semibold"
            >
              You
            </text>
          </g>
        </svg>

        {/* Map Note */}
        <div className="absolute bottom-2 left-2 right-2 text-center">
          <p className="text-xs text-muted-foreground bg-background/80 backdrop-blur rounded px-2 py-1 inline-block">
            📍 Distances are approximated for demo purposes
          </p>
        </div>
      </div>

      {/* Selected Mandi Info */}
      {selectedMandiId && (
        <div className="mt-4 p-3 bg-accent rounded-lg">
          {(() => {
            const selected = recommendations.find(r => r.mandi.mandiId === selectedMandiId);
            if (!selected) return null;
            return (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{selected.mandi.mandi}</p>
                  <p className="text-sm text-muted-foreground">{selected.distance} km • {selected.mandi.district}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-success">₹{selected.netProfit.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Net Profit</p>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
