import { useState } from "react";
import { hotspotClusters } from "./mockData";
import { TrendingUp, TrendingDown, ChevronDown } from "lucide-react";

export function HotspotPanel() {
  const [clusterCount, setClusterCount] = useState(10);

  const displayed = hotspotClusters.slice(0, clusterCount);

  return (
    <div className="card-glass rounded-xl p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-foreground">Hotspot Detection</h2>
          <p className="text-xs text-muted-foreground">KMeans / DBSCAN clustering output</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Clusters:</span>
          <div className="relative">
            <select
              value={clusterCount}
              onChange={(e) => setClusterCount(Number(e.target.value))}
              className="appearance-none rounded-md bg-muted border border-border px-3 py-1.5 text-xs text-foreground pr-7 focus:outline-none focus:ring-1 focus:ring-orange"
            >
              {[5, 7, 10].map((n) => (
                <option key={n} value={n}>{n} clusters</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 pr-3 text-left font-medium text-muted-foreground">#</th>
              <th className="py-2 pr-3 text-left font-medium text-muted-foreground">Zone / Highway</th>
              <th className="py-2 pr-3 text-right font-medium text-muted-foreground">Accidents</th>
              <th className="py-2 pr-3 text-right font-medium text-muted-foreground">Risk Score</th>
              <th className="py-2 text-right font-medium text-muted-foreground">Trend</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((row, i) => {
              const isPositive = row.trend.startsWith("+");
              const score = row.riskScore;
              const scoreColor =
                score >= 85 ? "text-risk-high" : score >= 70 ? "text-risk-medium" : "text-risk-low";
              const barColor =
                score >= 85
                  ? "bg-risk-high"
                  : score >= 70
                  ? "bg-risk-medium"
                  : "bg-risk-low";

              return (
                <tr key={row.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 pr-3 font-mono text-muted-foreground">{String(i + 1).padStart(2, "0")}</td>
                  <td className="py-2.5 pr-3 font-medium text-foreground max-w-[200px] truncate">{row.zone}</td>
                  <td className="py-2.5 pr-3 text-right font-mono text-foreground">{row.accidents.toLocaleString()}</td>
                  <td className="py-2.5 pr-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${score}%` }} />
                      </div>
                      <span className={`font-mono font-semibold ${scoreColor}`}>{score}</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-right">
                    <span className={`flex items-center justify-end gap-0.5 font-medium ${isPositive ? "text-risk-high" : "text-risk-low"}`}>
                      {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {row.trend}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Showing {displayed.length} of {hotspotClusters.length} clusters</span>
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-orange" />
          <span>Algorithm: KMeans (k={clusterCount})</span>
        </div>
      </div>
    </div>
  );
}
