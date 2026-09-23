import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Filter, ChevronDown, Check } from 'lucide-react';

interface BookingFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

const STATUS_FILTERS = [
  { label: 'All Bookings', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export const BookingFilters: React.FC<BookingFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentFilter =
    STATUS_FILTERS.find((f) => f.value === selectedStatus) || STATUS_FILTERS[0];
  const isFiltered = selectedStatus !== 'all';

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      {/* Search Input Box */}
      <div className="relative flex-1 sm:max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by ID, customer, provider, service..."
          className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#006E1C]/20 dark:focus:ring-emerald-500/30 focus:border-[#006E1C] dark:focus:border-emerald-500 transition-all shadow-2xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Dropdown Button */}
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className={`inline-flex items-center justify-between space-x-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all shadow-2xs cursor-pointer ${
            isFiltered
              ? 'bg-[#EAF7EC] dark:bg-emerald-950/40 text-[#006E1C] dark:text-emerald-400 border-[#006E1C]/40 dark:border-emerald-700/60 hover:bg-[#EAF7EC]/80 dark:hover:bg-emerald-950/60'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
          }`}
          title="Filter bookings by status"
          aria-expanded={isDropdownOpen}
        >
          <div className="flex items-center space-x-2">
            <Filter className={`w-4 h-4 ${isFiltered ? 'text-[#006E1C] dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`} />
            <span>
              {isFiltered ? `Status: ${currentFilter.label}` : 'Filter'}
            </span>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="origin-top-right absolute right-0 mt-1.5 w-52 rounded-xl bg-white dark:bg-slate-900 shadow-xl ring-1 ring-slate-900/10 dark:ring-slate-700/80 z-30 py-1.5 focus:outline-none divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Filter by Status
            </div>
            <div className="py-1">
              {STATUS_FILTERS.map((filter) => {
                const isSelected = selectedStatus === filter.value;
                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => {
                      onStatusChange(filter.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#EAF7EC] dark:bg-emerald-950/40 text-[#006E1C] dark:text-emerald-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{filter.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#006E1C] dark:text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
            {isFiltered && (
              <div className="p-1">
                <button
                  type="button"
                  onClick={() => {
                    onStatusChange('all');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-center py-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

