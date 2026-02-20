import { useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from "recharts";
import { accidentCoordinates } from "./mockData";
import { Toggle } from "@/components/ui/toggle";
import { MapPin } from "lucide-react";

type MapMode = "clusters" | "predictions";

const riskColors: Record<string, string> = {
  high: "hsl(0 72% 51%)",
  medium: "hsl(38 92% 50%)",
  low: "hsl(142 71% 45%)",
};

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  const color = riskColors[payload.risk] || "#fff";
  const size = payload.risk === "high" ? 10 : payload.risk === "medium" ? 7 : 5;
  return (
    <g>
      <circle cx={cx} cy={cy} r={size + 4} fill={color} opacity={0.15} />
      <circle cx={cx} cy={cy} r={size} fill={color} opacity={0.85} stroke={color} strokeWidth={1} />
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0]?.payload;
    if (!d) return null;
    const badgeClass = d.risk === "high" ? "badge-high" : d.risk === "medium" ? "badge-medium" : "badge-low";
    return (
      <div className="card-glass rounded-lg border p-3 text-xs shadow-xl">
        <div className="font-semibold text-foreground">{d.zone}</div>
        <div className="mt-1 flex items-center gap-2">
          <span className={`rounded px-1.5 py-0.5 font-medium uppercase ${badgeClass}`}>{d.risk}</span>
          <span className="text-muted-foreground">{d.count} accidents</span>
        </div>
        <div className="mt-1 text-muted-foreground">
          Lat: {d.lat.toFixed(1)}° · Lng: {d.lng.toFixed(1)}°
        </div>
      </div>
    );
  }
  return null;
};

export function MapSection() {
  const [mode, setMode] = useState<MapMode>("clusters");

  const highRisk = accidentCoordinates.filter((d) => d.risk === "high");
  const medRisk = accidentCoordinates.filter((d) => d.risk === "medium");
  const lowRisk = accidentCoordinates.filter((d) => d.risk === "low");

  return (
    <div className="card-glass rounded-xl p-4">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-foreground">Accident Hotspot Map — India</h2>
          <p className="text-xs text-muted-foreground">Lat/Lng coordinate plot · NH network coverage</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode("clusters")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              mode === "clusters"
                ? "bg-orange text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Show Clusters
          </button>
          <button
            onClick={() => setMode("predictions")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              mode === "predictions"
                ? "bg-orange text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Show Predictions
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-3 flex flex-wrap gap-4 text-xs">
        {[
          { label: "High Risk", cls: "badge-high" },
          { label: "Medium Risk", cls: "badge-medium" },
          { label: "Low Risk", cls: "badge-low" },
        ].map(({ label, cls }) => (
          <span key={label} className={`flex items-center gap-1.5 rounded px-2 py-0.5 ${cls}`}>
            <span className="h-2 w-2 rounded-full bg-current" />
            {label}
          </span>
        ))}
        {mode === "predictions" && (
          <span className="flex items-center gap-1.5 rounded px-2 py-0.5 bg-chart-purple/10 text-chart-purple border border-chart-purple/20">
            <span className="h-2 w-2 rounded-full bg-current" />
            Predicted Zone
          </span>
        )}
      </div>

      {/* Map */}
      <div className="relative rounded-lg bg-muted/30 border border-border overflow-hidden" style={{ height: 380 }}>
        {/* India outline hint */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <MapPin className="h-40 w-40 text-border/20" />
        </div>
        <div className="absolute top-2 left-2 rounded bg-muted/60 px-2 py-1 text-xs text-muted-foreground backdrop-blur-sm">
          India · Lng 68°–97°E · Lat 8°–37°N
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <XAxis
              type="number"
              dataKey="lng"
              domain={[68, 97]}
              tick={{ fontSize: 10, fill: "hsl(215 20% 55%)" }}
              label={{ value: "Longitude (°E)", position: "insideBottom", offset: -10, fontSize: 10, fill: "hsl(215 20% 55%)" }}
            />
            <YAxis
              type="number"
              dataKey="lat"
              domain={[8, 37]}
              tick={{ fontSize: 10, fill: "hsl(215 20% 55%)" }}
              label={{ value: "Latitude (°N)", angle: -90, position: "insideLeft", offset: 10, fontSize: 10, fill: "hsl(215 20% 55%)" }}
            />
            <ZAxis range={[60, 400]} />
            <Tooltip content={<CustomTooltip />} />
            <Scatter data={lowRisk} shape={<CustomDot />} />
            <Scatter data={medRisk} shape={<CustomDot />} />
            <Scatter data={highRisk} shape={<CustomDot />} />
            {mode === "predictions" && (
              <Scatter
                data={[
                  { lat: 29.1, lng: 76.3, risk: "predicted", count: 180, zone: "Predicted: Haryana NH" },
                  { lat: 20.0, lng: 74.0, risk: "predicted", count: 145, zone: "Predicted: Nashik Corridor" },
                  { lat: 16.5, lng: 79.5, risk: "predicted", count: 132, zone: "Predicted: Krishna Valley" },
                ]}
                shape={(props: any) => (
                  <g>
                    <circle cx={props.cx} cy={props.cy} r={12} fill="hsl(262 83% 67%)" opacity={0.2} />
                    <circle cx={props.cx} cy={props.cy} r={7} fill="hsl(262 83% 67%)" opacity={0.8} stroke="hsl(262 83% 67%)" strokeWidth={1.5} strokeDasharray="3 2" />
                  </g>
                )}
              />
            )}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
