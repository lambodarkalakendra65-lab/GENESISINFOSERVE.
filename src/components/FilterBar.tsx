import React from 'react';
import { LeadCategory } from '../types/crm';
import { ALL_PRODUCTS, PRODUCT_GROUPS, PRODUCT_GROUP_LABELS } from '../data/products';
import { Search, MapPin, Package, X } from 'lucide-react';

interface FilterBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedProduct: string;
  setSelectedProduct: (prod: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  cities: string[];
  totalFilteredCount: number;
  unverifiedOnly: boolean;
  setUnverifiedOnly: (v: boolean) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  selectedCity,
  setSelectedCity,
  selectedProduct,
  setSelectedProduct,
  searchQuery,
  setSearchQuery,
  cities,
  totalFilteredCount,
  unverifiedOnly,
  setUnverifiedOnly,
}) => {
  const categories: Array<'Sab' | LeadCategory> = [
    'Sab',
    'IT Hardware',
    'Networking & CCTV',
    'Design software',
    'Security',
  ];

  const tabs = [
    { id: 'aaj', label: 'Aaj ki Calling List' },
    { id: 'fu', label: 'Follow-ups' },
    { id: 'my_locks', label: 'My Locked Leads' },
    { id: 'sab', label: 'All Leads' },
    { id: 'indiamart', label: 'IndiaMART RFQs' },
    { id: 'linkedin', label: 'LinkedIn Leads' },
    { id: 'google_maps', label: 'Google Maps' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
      {/* Top Primary Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-[#1b2b28]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#35d4b8] to-[#2cbfa6] text-[#05251e] shadow-md shadow-[#35d4b8]/20'
                  : 'bg-[#101b1a] text-[#8ba39d] hover:bg-[#142320] hover:text-white border border-[#1b2b28]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="mt-3.5 flex flex-col gap-3">
        {/* Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {categories.map((cat) => {
            const isCatActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  isCatActive
                    ? 'bg-[#35d4b8] text-[#06231d] font-bold shadow'
                    : 'bg-[#0f1a18] text-[#8ba39d] border border-[#1f322f] hover:text-white hover:border-[#35d4b8]/40'
                }`}
              >
                {cat}
              </button>
            );
          })}

          {/* Quick Toggle: Unverified check */}
          <button
            onClick={() => setUnverifiedOnly(!unverifiedOnly)}
            className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold transition-all border ${
              unverifiedOnly
                ? 'border-amber-400 bg-amber-950/40 text-amber-300'
                : 'border-[#1f322f] bg-[#0f1a18] text-[#8ba39d] hover:text-white'
            }`}
          >
            {unverifiedOnly ? '✓ Needs Verification' : 'Show Unverified'}
          </button>
        </div>

        {/* Dropdowns & Search */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8ba39d]" />
            <input
              type="text"
              placeholder="Search company, phone, decision maker, requirement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[#1f322f] bg-[#0c1615] pl-9 pr-8 py-2 text-xs sm:text-sm text-white placeholder-[#5d7772] transition-colors focus:border-[#35d4b8] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8ba39d] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* City Dropdown */}
          <div className="relative min-w-[140px]">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full appearance-none rounded-xl border border-[#1f322f] bg-[#0c1615] px-3 py-2 text-xs sm:text-sm text-white focus:border-[#35d4b8] focus:outline-none pr-8 cursor-pointer"
            >
              <option value="Sab shehar">📍 Sab shehar</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <MapPin className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8ba39d]" />
          </div>

          {/* Products Dropdown */}
          <div className="relative min-w-[160px]">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full appearance-none rounded-xl border border-[#1f322f] bg-[#0c1615] px-3 py-2 text-xs sm:text-sm text-white focus:border-[#35d4b8] focus:outline-none pr-8 cursor-pointer"
            >
              <option value="Sab products">📦 Sab products</option>
              {PRODUCT_GROUPS.map((g) => (
                <optgroup key={g} label={PRODUCT_GROUP_LABELS[g]}>
                  {ALL_PRODUCTS.filter((p) => p.group === g).map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <Package className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8ba39d]" />
          </div>

          {/* Result Count Indicator */}
          <div className="text-xs text-[#8ba39d] px-1 font-mono">
            Showing <strong className="text-white">{totalFilteredCount}</strong> leads
          </div>
        </div>
      </div>
    </div>
  );
};
