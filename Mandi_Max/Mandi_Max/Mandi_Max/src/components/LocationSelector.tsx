import { useState, useMemo } from 'react';
import { MapPin, ChevronDown, Search, Check } from 'lucide-react';
import { getAllStates, getDistrictsByState, type StateData, type District } from '@/data/indiaGeography';

interface LocationSelectorProps {
  selectedStateId: string;
  selectedDistrictId: string;
  onStateChange: (stateId: string) => void;
  onDistrictChange: (districtId: string) => void;
}

export function LocationSelector({
  selectedStateId,
  selectedDistrictId,
  onStateChange,
  onDistrictChange
}: LocationSelectorProps) {
  const [stateSearch, setStateSearch] = useState('');
  const [districtSearch, setDistrictSearch] = useState('');
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);

  const states = useMemo(() => getAllStates(), []);
  const districts = useMemo(() => getDistrictsByState(selectedStateId), [selectedStateId]);

  const filteredStates = useMemo(() => {
    if (!stateSearch) return states;
    const search = stateSearch.toLowerCase();
    return states.filter(s => s.name.toLowerCase().includes(search));
  }, [states, stateSearch]);

  const filteredDistricts = useMemo(() => {
    if (!districtSearch) return districts;
    const search = districtSearch.toLowerCase();
    return districts.filter(d => d.name.toLowerCase().includes(search));
  }, [districts, districtSearch]);

  const selectedState = states.find(s => s.id === selectedStateId);
  const selectedDistrict = districts.find(d => d.id === selectedDistrictId);

  const popularStates = ['HR', 'PB', 'UP', 'MH', 'RJ', 'MP', 'GJ', 'KA'];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <MapPin className="h-4 w-4" />
        <span>Select Your Location</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* State Selector */}
        <div className="relative">
          <label className="block text-sm font-medium text-foreground mb-1.5">
            State / UT
          </label>
          <button
            type="button"
            onClick={() => {
              setIsStateOpen(!isStateOpen);
              setIsDistrictOpen(false);
            }}
            className="w-full flex items-center justify-between px-4 py-3 bg-background border border-input rounded-lg text-left hover:border-ring focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          >
            <span className={selectedState ? 'text-foreground' : 'text-muted-foreground'}>
              {selectedState?.name || 'Select state...'}
            </span>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isStateOpen ? 'rotate-180' : ''}`} />
          </button>

          {isStateOpen && (
            <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-80 overflow-hidden">
              {/* Search */}
              <div className="p-2 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search states..."
                    value={stateSearch}
                    onChange={(e) => setStateSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    autoFocus
                  />
                </div>
              </div>

              {/* Popular States */}
              {!stateSearch && (
                <div className="p-2 border-b border-border">
                  <p className="text-xs font-medium text-muted-foreground px-2 mb-2">Popular States</p>
                  <div className="flex flex-wrap gap-1">
                    {popularStates.map(id => {
                      const state = states.find(s => s.id === id);
                      if (!state) return null;
                      return (
                        <button
                          key={id}
                          onClick={() => {
                            onStateChange(id);
                            onDistrictChange('');
                            setIsStateOpen(false);
                            setStateSearch('');
                          }}
                          className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                            selectedStateId === id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-accent text-accent-foreground hover:bg-accent/80'
                          }`}
                        >
                          {state.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* State List */}
              <div className="max-h-48 overflow-y-auto">
                {filteredStates.map(state => (
                  <button
                    key={state.id}
                    onClick={() => {
                      onStateChange(state.id);
                      onDistrictChange('');
                      setIsStateOpen(false);
                      setStateSearch('');
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-accent transition-colors ${
                      selectedStateId === state.id ? 'bg-accent' : ''
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-muted-foreground">{state.type === 'ut' ? '🏛️' : '📍'}</span>
                      {state.name}
                    </span>
                    {selectedStateId === state.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}
                {filteredStates.length === 0 && (
                  <p className="px-4 py-3 text-sm text-muted-foreground text-center">
                    No states found
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* District Selector */}
        <div className="relative">
          <label className="block text-sm font-medium text-foreground mb-1.5">
            District
          </label>
          <button
            type="button"
            onClick={() => {
              if (selectedStateId) {
                setIsDistrictOpen(!isDistrictOpen);
                setIsStateOpen(false);
              }
            }}
            disabled={!selectedStateId}
            className={`w-full flex items-center justify-between px-4 py-3 bg-background border border-input rounded-lg text-left transition-all ${
              selectedStateId
                ? 'hover:border-ring focus:outline-none focus:ring-2 focus:ring-ring'
                : 'opacity-60 cursor-not-allowed'
            }`}
          >
            <span className={selectedDistrict ? 'text-foreground' : 'text-muted-foreground'}>
              {selectedDistrict?.name || (selectedStateId ? 'Select district...' : 'First select state')}
            </span>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isDistrictOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDistrictOpen && (
            <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-80 overflow-hidden">
              {/* Search */}
              <div className="p-2 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search districts..."
                    value={districtSearch}
                    onChange={(e) => setDistrictSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    autoFocus
                  />
                </div>
              </div>

              <div className="px-3 py-2 border-b border-border">
                <p className="text-xs text-muted-foreground">
                  {districts.length} districts in {selectedState?.name}
                </p>
              </div>

              {/* District List */}
              <div className="max-h-48 overflow-y-auto">
                {filteredDistricts.map(district => (
                  <button
                    key={district.id}
                    onClick={() => {
                      onDistrictChange(district.id);
                      setIsDistrictOpen(false);
                      setDistrictSearch('');
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-accent transition-colors ${
                      selectedDistrictId === district.id ? 'bg-accent' : ''
                    }`}
                  >
                    <span>{district.name}</span>
                    {selectedDistrictId === district.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}
                {filteredDistricts.length === 0 && (
                  <p className="px-4 py-3 text-sm text-muted-foreground text-center">
                    No districts found
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
