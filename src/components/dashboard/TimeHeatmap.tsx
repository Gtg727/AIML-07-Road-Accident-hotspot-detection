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
  Array.from({ length: 8 }, (_, hour) => {
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
    <div>
      <div className="card-glass rounded-xl p-4">
        <div className="mb-3">
          <h2 className="font-semibold text-foreground">
            Hourly Accident Frequency
          </h2>
          <p className="text-xs text-muted-foreground">
            24-hour national aggregated count
          </p>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={timeOfDayData}
            margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
            barCategoryGap={0}  // makes it look like a histogram
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
              {timeOfDayData.map((entry, i) => (
                <Cell
                  key={i}
                  fill="hsl(210, 90%, 60%)"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}