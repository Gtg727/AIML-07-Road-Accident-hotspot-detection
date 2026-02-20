import { AlertTriangle, MapPin, TrendingUp, Clock, Skull } from "lucide-react";
import { kpiData } from "./mockData";

interface KPICardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accent?: "orange" | "red" | "blue" | "green" | "amber";
  trend?: string;
}

const accentMap = {
  orange: "text-orange border-orange/20 bg-orange/5",
  red: "text-risk-high border-risk-high/20 bg-risk-high/5",
  blue: "text-chart-blue border-chart-blue/20 bg-chart-blue/5",
  green: "text-risk-low border-risk-low/20 bg-risk-low/5",
  amber: "text-risk-medium border-risk-medium/20 bg-risk-medium/5",
};

function KPICard({ label, value, sub, icon, accent = "orange", trend }: KPICardProps) {
  const cls = accentMap[accent];
  return (
    <div className="card-glass rounded-xl p-4 flex flex-col gap-3 hover:border-orange/30 transition-all duration-200">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        <div className={`rounded-lg border p-1.5 ${cls}`}>{icon}</div>
      </div>
      <div>
        <div className={`text-2xl font-bold ${cls.split(" ")[0]}`}>{value}</div>
        {sub && <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>}
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-xs">
          <TrendingUp className="h-3 w-3 text-risk-medium" />
          <span className="text-risk-medium">{trend} vs last month</span>
        </div>
      )}
    </div>
  );
}

export function KPICards() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      <KPICard
        label="Total Accidents"
        value={kpiData.totalAccidents.toLocaleString()}
        sub="National highway network"
        icon={<AlertTriangle className="h-4 w-4" />}
        accent="orange"
        trend="+6.2%"
      />
      <KPICard
        label="High Risk Zones"
        value={kpiData.highRiskZones}
        sub="Active critical zones"
        icon={<MapPin className="h-4 w-4" />}
        accent="red"
        trend="+3.1%"
      />
      <KPICard
        label="Predicted High-Risk"
        value={kpiData.predictedHighRisk}
        sub="Next 30 days (ML model)"
        icon={<TrendingUp className="h-4 w-4" />}
        accent="amber"
      />
      <KPICard
        label="Peak Danger Hour"
        value={kpiData.mostDangerousTime}
        sub="Highest accident frequency"
        icon={<Clock className="h-4 w-4" />}
        accent="blue"
      />
      <KPICard
        label="Fatal Accidents"
        value={`${kpiData.fatalPercentage}%`}
        sub="Of total reported cases"
        icon={<Skull className="h-4 w-4" />}
        accent="red"
        trend="-1.8%"
      />
    </div>
  );
}
