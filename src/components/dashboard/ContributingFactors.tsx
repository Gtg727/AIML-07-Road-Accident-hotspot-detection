import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import { weatherData, vehicleTypeData, timeOfDayData, roadGeometryData } from "./mockData";

const tooltipStyle = {
  contentStyle: {
    background: "hsl(220 40% 8%)",
    border: "1px solid hsl(215 35% 18%)",
    borderRadius: "8px",
    fontSize: "12px",
    color: "hsl(210 40% 95%)",
  },
};

const TICK_STYLE = { fontSize: 10, fill: "hsl(215 20% 55%)" };

function ChartCard({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="card-glass rounded-xl p-4 flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

export function ContributingFactors() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {/* Bar: Weather */}
      <ChartCard title="Accidents by Weather" sub="Condition-wise distribution">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weatherData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 35% 18%)" />
            <XAxis dataKey="weather" tick={TICK_STYLE} />
            <YAxis tick={TICK_STYLE} />
            <Tooltip {...tooltipStyle} formatter={(v: number) => [v.toLocaleString(), "Accidents"]} />
            <Bar dataKey="accidents" fill="hsl(25 95% 53%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Pie: Vehicle Type */}
      <ChartCard title="Accidents by Vehicle Type" sub="Proportional breakdown">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={vehicleTypeData}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={72}
              paddingAngle={3}
              dataKey="value"
            >
              {vehicleTypeData.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              {...tooltipStyle}
              formatter={(v: number) => [`${v}%`, "Share"]}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "10px", color: "hsl(0, 0%, 100%)" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Line: Time of Day */}
      <ChartCard title="Time-of-Day Trend" sub="Hourly accident count">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={timeOfDayData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 35% 18%)" />
            <XAxis dataKey="hour" tick={TICK_STYLE} interval={1} />
            <YAxis tick={TICK_STYLE} />
            <Tooltip {...tooltipStyle} formatter={(v: number) => [v.toLocaleString(), "Accidents"]} />
            <Line
              type="monotone"
              dataKey="accidents"
              stroke="hsl(210 100% 56%)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "hsl(210 100% 56%)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Bar: Road Geometry */}
      <ChartCard title="Road Geometry vs Rate" sub="Accident rate per geometry type">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={roadGeometryData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 35% 18%)" />
            <XAxis dataKey="geometry" tick={TICK_STYLE} />
            <YAxis tick={TICK_STYLE} />
            <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v}`, "Rate"]} />
            <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
              {roadGeometryData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.rate >= 80 ? "hsl(0 72% 51%)" : entry.rate >= 60 ? "hsl(38 92% 50%)" : "hsl(142 71% 45%)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
