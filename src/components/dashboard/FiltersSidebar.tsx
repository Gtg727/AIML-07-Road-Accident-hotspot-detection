import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

interface FiltersSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const states = [
  "All States", "Delhi", "Maharashtra", "Karnataka", "Tamil Nadu",
  "Uttar Pradesh", "Rajasthan", "Gujarat", "West Bengal", "Telangana",
];

const highways = ["All NHs", "NH-44", "NH-48", "NH-19", "NH-27", "NH-65", "NH-16", "NH-58"];
const years = ["2024", "2023", "2022", "2021", "2020"];
const months = ["All Months", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function FiltersSidebar({ isOpen, onClose }: FiltersSidebarProps) {
  const [state, setState] = useState("All States");
  const [highway, setHighway] = useState("All NHs");
  const [year, setYear] = useState("2024");
  const [month, setMonth] = useState("All Months");
  const [minSeverity, setMinSeverity] = useState(0);
  const [showFatal, setShowFatal] = useState(true);
  const [showInjury, setShowInjury] = useState(true);
  const [showMinor, setShowMinor] = useState(true);

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
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full rounded-md bg-muted border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-orange"
            >
              {states.map((s) => <option key={s}>{s}</option>)}
            </select>
          </FilterGroup>

          {/* Highway */}
          <FilterGroup label="National Highway">
            <select
              value={highway}
              onChange={(e) => setHighway(e.target.value)}
              className="w-full rounded-md bg-muted border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-orange"
            >
              {highways.map((h) => <option key={h}>{h}</option>)}
            </select>
          </FilterGroup>

          {/* Year / Month */}
          <FilterGroup label="Time Period">
            <div className="grid grid-cols-2 gap-2">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="rounded-md bg-muted border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-orange"
              >
                {years.map((y) => <option key={y}>{y}</option>)}
              </select>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="rounded-md bg-muted border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-orange"
              >
                {months.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
          </FilterGroup>

          {/* Min severity */}
          <FilterGroup label={`Min Risk Score: ${minSeverity}`}>
            <input
              type="range"
              min={0}
              max={100}
              value={minSeverity}
              onChange={(e) => setMinSeverity(Number(e.target.value))}
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
              { label: "Fatal", state: showFatal, set: setShowFatal, cls: "badge-high" },
              { label: "Injury", state: showInjury, set: setShowInjury, cls: "badge-medium" },
              { label: "Minor", state: showMinor, set: setShowMinor, cls: "badge-low" },
            ].map(({ label, state, set, cls }) => (
              <label key={label} className="flex cursor-pointer items-center gap-3 py-1.5">
                <div
                  onClick={() => set(!state)}
                  className={`h-4 w-4 rounded border-2 transition-colors ${
                    state ? "bg-orange border-orange" : "border-border"
                  }`}
                />
                <span className={`rounded px-2 py-0.5 text-xs ${cls}`}>{label}</span>
              </label>
            ))}
          </FilterGroup>
        </div>

        {/* Apply */}
        <div className="border-t border-border p-4 flex flex-col gap-2">
          <button className="w-full rounded-md bg-orange py-2 text-sm font-semibold text-primary-foreground hover:bg-orange/90 transition-colors orange-glow">
            Apply Filters
          </button>
          <button
            onClick={() => {
              setState("All States");
              setHighway("All NHs");
              setYear("2024");
              setMonth("All Months");
              setMinSeverity(0);
              setShowFatal(true);
              setShowInjury(true);
              setShowMinor(true);
            }}
            className="w-full rounded-md bg-muted py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
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
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
