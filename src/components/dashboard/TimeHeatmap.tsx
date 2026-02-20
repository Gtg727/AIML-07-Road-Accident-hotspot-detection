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

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const heatmapData = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => {
    const baseHour = timeOfDayData[hour]?.accidents || 0;
    const weekendFactor = day === 0 || day === 6 ? 1.2 : 1;
    const value = Math.floor((baseHour / 200) * weekendFactor + Math.random() * 8);
    return { day, hour, value };
  })
).flat();

function getHeatColor(v: number) {
  if (v >= 55) return "hsl(0, 72%, 51%)";
  if (v >= 40) return "hsl(15, 90%, 52%)";
  if (v >= 28) return "hsl(38, 92%, 50%)";
  if (v >= 16) return "hsl(48, 96%, 53%)";
  if (v >= 8) return "hsl(142, 71%, 45%, 0.6)";
  return "hsl(215, 40%, 12%)";
}

const tooltipStyle = {
  contentStyle: {
    background: "hsl(220, 40%, 8%)",
    border: "1px solid hsl(215, 35%, 18%)",
    borderRadius: "8px",
    fontSize: "12px",
    color: "hsl(210, 40%, 95%)",
  },
};

function getBarColor(accidents: number) {
  if (accidents >= 9000) return "hsl(0, 72%, 51%)";
  if (accidents >= 7000) return "hsl(25, 95%, 53%)";
  if (accidents >= 5000) return "hsl(38, 92%, 50%)";
  return "hsl(210, 100%, 56%)";
}

export function TimeHeatmap() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* 2D Heatmap */}
      <div className="card-glass rounded-xl p-4">
        <div className="mb-3">
          <h2 className="font-semibold text-foreground">Time-of-Day Risk Heatmap</h2>
          <p className="text-xs text-muted-foreground">Day × Hour accident density grid</p>
        </div>

        <div className="mb-1 flex pl-10">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="flex-1 text-center text-[9px] text-muted-foreground">
              {String(i * 2).padStart(2, "0")}h
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-0.5">
          {days.map((day, d) => (
            <div key={d} className="flex items-center gap-0.5">
              <span className="w-9 shrink-0 text-right text-[9px] text-muted-foreground pr-1">{day}</span>
              {Array.from({ length: 24 }, (_, h) => {
                const cell = heatmapData.find((x) => x.day === d && x.hour === h);
                return (
                  <div
                    key={h}
                    title={`${day} ${h}:00 — intensity ${cell?.value}`}
                    className="h-5 flex-1 rounded-sm transition-all hover:scale-110 cursor-pointer"
                    style={{ background: getHeatColor(cell?.value || 0) }}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2 text-[9px] text-muted-foreground">
          <span>Low</span>
          {[
            "hsl(215,40%,12%)",
            "hsl(142,71%,38%)",
            "hsl(48,96%,53%)",
            "hsl(38,92%,50%)",
            "hsl(15,90%,52%)",
            "hsl(0,72%,51%)",
          ].map((c, i) => (
            <div key={i} className="h-3 w-5 rounded-sm" style={{ background: c }} />
          ))}
          <span>High</span>
        </div>
      </div>

      {/* Hourly frequency bar */}
      <div className="card-glass rounded-xl p-4">
        <div className="mb-3">
          <h2 className="font-semibold text-foreground">Hourly Accident Frequency</h2>
          <p className="text-xs text-muted-foreground">24-hour national aggregated count</p>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={timeOfDayData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 35%, 18%)" />
            <XAxis dataKey="hour" tick={{ fontSize: 9, fill: "hsl(215, 20%, 55%)" }} interval={3} />
            <YAxis tick={{ fontSize: 9, fill: "hsl(215, 20%, 55%)" }} />
            <Tooltip
              {...tooltipStyle}
              formatter={(v: number) => [v.toLocaleString(), "Accidents"]}
            />
            <Bar dataKey="accidents" radius={[3, 3, 0, 0]}>
              {timeOfDayData.map((entry, i) => (
                <Cell key={i} fill={getBarColor(entry.accidents)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
