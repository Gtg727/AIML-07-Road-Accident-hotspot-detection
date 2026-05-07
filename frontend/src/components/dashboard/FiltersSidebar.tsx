import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { FilterState } from "@/pages/Index";

interface FiltersSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const states = [
  "All States", "Delhi", "Maharashtra", "Karnataka", "Tamil Nadu",
  "Uttar Pradesh", "Rajasthan", "Gujarat", "West Bengal", "Telangana",
];

const highways = ["All NHs", "NH-44", "NH-48", "NH-19", "NH-27", "NH-65", "NH-16", "NH-58"];
const years = ["2024", "2023", "2022", "2021", "2020"];
const months = ["All Months", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function FiltersSidebar({ isOpen, onClose, filters, onFiltersChange }: FiltersSidebarProps) {
  const [tempFilters, setTempFilters] = useState(filters);

  const handleApplyFilters = () => {
    onFiltersChange(tempFilters);
    onClose();
  };

  const handleResetFilters = () => {
    const defaultFilters: FilterState = {
      state: "All States",
      highway: "All NHs",
      year: "2024",
      month: "All Months",
      minSeverity: 0,
      showFatal: true,
      showInjury: true,
      showMinor: true,
    };
    setTempFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-72 flex-col border-r border-border bg-card transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:translate-x-0 lg:flex ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-orange" />
            <span className="text-sm font-semibold text-foreground">Filters</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-5">
          {/* State */}
          <FilterGroup label="State / UT">
            <select
              value={tempFilters.state}
              onChange={(e) => setTempFilters({ ...tempFilters, state: e.target.value })}
              className="w-full rounded-md bg-muted border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-orange"
            >
              {states.map((s) => <option key={s}>{s}</option>)}
            </select>
          </FilterGroup>

          {/* Highway */}
          <FilterGroup label="National Highway">
            <select
              value={tempFilters.highway}
              onChange={(e) => setTempFilters({ ...tempFilters, highway: e.target.value })}
              className="w-full rounded-md bg-muted border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-orange"
            >
              {highways.map((h) => <option key={h}>{h}</option>)}
            </select>
          </FilterGroup>

          {/* Year / Month */}
          <FilterGroup label="Time Period">
            <div className="grid grid-cols-2 gap-2">
              <select
                value={tempFilters.year}
                onChange={(e) => setTempFilters({ ...tempFilters, year: e.target.value })}
                className="rounded-md bg-muted border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-orange"
              >
                {years.map((y) => <option key={y}>{y}</option>)}
              </select>
              <select
                value={tempFilters.month}
                onChange={(e) => setTempFilters({ ...tempFilters, month: e.target.value })}
                className="rounded-md bg-muted border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-orange"
              >
                {months.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
          </FilterGroup>

          {/* Min severity */}
          <FilterGroup label={`Min Risk Score: ${tempFilters.minSeverity}`}>
            <input
              type="range"
              min={0}
              max={100}
              value={tempFilters.minSeverity}
              onChange={(e) => setTempFilters({ ...tempFilters, minSeverity: Number(e.target.value) })}
              className="w-full accent-orange"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </FilterGroup>

          {/* Accident type */}
          <FilterGroup label="Accident Severity">
            {[
              { label: "Fatal", key: "showFatal", cls: "badge-high" },
              { label: "Injury", key: "showInjury", cls: "badge-medium" },
              { label: "Minor", key: "showMinor", cls: "badge-low" },
            ].map(({ label, key, cls }) => (
              <label key={label} className="flex cursor-pointer items-center gap-3 py-1.5">
                <div
                  onClick={() => setTempFilters({ 
                    ...tempFilters, 
                    [key]: !tempFilters[key as keyof FilterState] 
                  })}
                  className={`h-4 w-4 rounded border-2 transition-colors ${
                    tempFilters[key as keyof FilterState] ? "bg-orange border-orange" : "border-border"
                  }`}
                />
                <span className={`rounded px-2 py-0.5 text-xs ${cls}`}>{label}</span>
              </label>
            ))}
          </FilterGroup>
        </div>

        {/* Apply */}
        <div className="border-t border-border p-4 flex flex-col gap-2">
          <button 
            onClick={handleApplyFilters}
            className="w-full rounded-md bg-orange py-2 text-sm font-semibold text-primary-foreground hover:bg-orange/90 transition-colors orange-glow">
            Apply Filters
          </button>
          <button
            onClick={handleResetFilters}
            className="w-full rounded-md border border-border bg-transparent py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            Reset
          </button>
        </div>
      </aside>
    </>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-foreground mb-2">{label}</label>
      {children}
    </div>
  );
}
