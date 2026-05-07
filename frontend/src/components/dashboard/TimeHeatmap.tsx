import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { timeOfDayData } from "./mockData";
import { FilterState } from "@/pages/Index";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface TimeHeatmapProps {
  filters: FilterState;
}

export function TimeHeatmap({ filters }: TimeHeatmapProps) {
  // Calculate filtered data based on filter state
  const filteredData = useMemo(() => {
    return timeOfDayData.map((item, index) => {
      // Apply min severity filter
      let value = item.accidents;
      
      if (item.accidents < filters.minSeverity) {
        value = 0;
      }

      // Apply severity type filters
      if (item.accidents > 7000 && !filters.showFatal) {
        value = 0;
      }
      if (item.accidents >= 5000 && item.accidents <= 7000 && !filters.showInjury) {
        value = 0;
      }
      if (item.accidents < 5000 && !filters.showMinor) {
        value = 0;
      }

      // Apply time period filter (year/month)
      // This would normally filter by actual date, using mock logic here
      let multiplier = 1;
      if (filters.year === "2023") multiplier = 0.95;
      if (filters.year === "2022") multiplier = 0.85;
      if (filters.year === "2021") multiplier = 0.75;
      if (filters.year === "2020") multiplier = 0.65;

      if (filters.month !== "All Months") {
        const monthIndex = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(filters.month);
        if (monthIndex !== -1) {
          multiplier *= 0.9 + (monthIndex * 0.01); // Vary slightly by month
        }
      }

      return {
        ...item,
        accidents: Math.floor(value * multiplier),
      };
    });
  }, [filters]);

  function getBarColor(accidents: number) {
    if (accidents === 0) return "hsl(215, 40%, 12%)";
    if (accidents >= 9000) return "hsl(0, 72%, 51%)";
    if (accidents >= 7000) return "hsl(25, 95%, 53%)";
    if (accidents >= 5000) return "hsl(38, 92%, 50%)";
    return "hsl(210, 100%, 56%)";
  }

  return (
    <div>
      <div className="card-glass rounded-xl p-4">
        <div className="mb-3">
          <h2 className="font-semibold text-foreground">
            Hourly Accident Frequency
          </h2>
          <p className="text-xs text-muted-foreground">
            24-hour aggregated count · {filters.month} {filters.year} {filters.state !== "All States" && `· ${filters.state}`}
          </p>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={filteredData}
            margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
            barCategoryGap={0}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(215, 35%, 18%)"
            />
            <XAxis
              dataKey="hour"
              tick={{ fontSize: 9, fill: "hsl(215, 20%, 55%)" }}
            />
            <YAxis
              tick={{ fontSize: 9, fill: "hsl(215, 20%, 55%)" }}
            />
            <Tooltip
              formatter={(v: number) => [
                v.toLocaleString(),
                "Accidents"
              ]}
            />
            <Bar
              dataKey="accidents"
              radius={[4, 4, 0, 0]}
            >
              {filteredData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={getBarColor(entry.accidents)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Filter tags */}
        <div className="mt-3 flex flex-wrap gap-2">
          {filters.minSeverity > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange/10 px-2 py-1 text-xs text-orange border border-orange/30">
              Risk ≥ {filters.minSeverity}
            </span>
          )}
          {!filters.showFatal && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-900/20 px-2 py-1 text-xs text-red-400 border border-red-900/50">
              Fatal hidden
            </span>
          )}
          {!filters.showInjury && (
            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-900/20 px-2 py-1 text-xs text-yellow-400 border border-yellow-900/50">
              Injury hidden
            </span>
          )}
          {!filters.showMinor && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-900/20 px-2 py-1 text-xs text-green-400 border border-green-900/50">
              Minor hidden
            </span>
          )}
        </div>
      </div>
    </div>
  );
}