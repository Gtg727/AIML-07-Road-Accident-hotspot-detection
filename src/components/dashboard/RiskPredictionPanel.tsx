import { useState } from "react";
import { Zap, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

type RiskLevel = "Low" | "Medium" | "High";

const weatherOptions = ["Clear", "Foggy", "Rainy", "Dusty", "Haze"];
const trafficOptions = ["Low", "Moderate", "High", "Very High"];
const timeOptions = ["Morning (6–9AM)", "Afternoon (12–3PM)", "Evening (5–8PM)", "Night (9PM–3AM)"];
const roadOptions = ["Highway", "Expressway", "State Road", "Rural Road", "Bridge"];

function SelectField({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-md bg-muted border border-border px-3 py-2 text-sm text-foreground pr-8 focus:outline-none focus:ring-1 focus:ring-orange"
        >
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}

export function RiskPredictionPanel() {
  const [weather, setWeather] = useState("Foggy");
  const [traffic, setTraffic] = useState("High");
  const [time, setTime] = useState("Night (9PM–3AM)");
  const [road, setRoad] = useState("Highway");
  const [score, setScore] = useState(72);
  const [confidence, setConfidence] = useState(88.3);
  const [computed, setComputed] = useState(true);

  const getRiskLevel = (s: number): RiskLevel =>
    s >= 70 ? "High" : s >= 40 ? "Medium" : "Low";

  const riskLevel = getRiskLevel(score);

  const badgeClass =
    riskLevel === "High" ? "badge-high" : riskLevel === "Medium" ? "badge-medium" : "badge-low";

  const scoreColor =
    riskLevel === "High" ? "#ef4444" : riskLevel === "Medium" ? "#f59e0b" : "#22c55e";

  const handlePredict = () => {
    // Simulated prediction logic
    let base = 20;
    if (weather === "Foggy" || weather === "Rainy") base += 25;
    if (weather === "Dusty" || weather === "Haze") base += 15;
    if (traffic === "High") base += 20;
    if (traffic === "Very High") base += 30;
    if (time === "Night (9PM–3AM)") base += 20;
    if (time === "Evening (5–8PM)") base += 10;
    if (road === "Bridge") base += 15;
    if (road === "Expressway") base += 10;
    base = Math.min(98, base + Math.floor(Math.random() * 10));
    setScore(base);
    setConfidence(Number((82 + Math.random() * 12).toFixed(1)));
    setComputed(true);
  };

  const circumference = 2 * Math.PI * 54;
  const progress = (score / 100) * circumference;

  return (
    <div className="card-glass rounded-xl p-4 flex flex-col gap-4">
      <div>
        <h2 className="font-semibold text-foreground">Risk Prediction Engine</h2>
        <p className="text-xs text-muted-foreground">ML model · Random Forest + Gradient Boosting</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-3">
        <SelectField label="Weather" options={weatherOptions} value={weather} onChange={setWeather} />
        <SelectField label="Traffic Density" options={trafficOptions} value={traffic} onChange={setTraffic} />
        <SelectField label="Time of Day" options={timeOptions} value={time} onChange={setTime} />
        <SelectField label="Road Type" options={roadOptions} value={road} onChange={setRoad} />
      </div>

      <Button
        onClick={handlePredict}
        className="w-full gap-2 bg-orange text-primary-foreground hover:bg-orange/90 orange-glow"
      >
        <Zap className="h-4 w-4" />
        Predict Risk Score
      </Button>

      {computed && (
        <div className="flex items-center gap-6 rounded-lg bg-muted/40 border border-border p-4">
          {/* Circular gauge */}
          <div className="relative flex-shrink-0">
            <svg width={128} height={128} viewBox="0 0 128 128">
              <circle cx={64} cy={64} r={54} fill="none" stroke="hsl(215 40% 12%)" strokeWidth={10} />
              <circle
                cx={64}
                cy={64}
                r={54}
                fill="none"
                stroke={scoreColor}
                strokeWidth={10}
                strokeDasharray={`${progress} ${circumference - progress}`}
                strokeLinecap="round"
                transform="rotate(-90 64 64)"
                style={{ filter: `drop-shadow(0 0 6px ${scoreColor}60)` }}
              />
              <text x={64} y={60} textAnchor="middle" fill={scoreColor} fontSize={28} fontWeight="bold" fontFamily="monospace">
                {score}
              </text>
              <text x={64} y={76} textAnchor="middle" fill="hsl(215 20% 55%)" fontSize={10}>
                / 100
              </text>
            </svg>
          </div>

          <div className="flex flex-col gap-2">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Risk Level</div>
              <span className={`rounded-md px-3 py-1 text-sm font-bold uppercase ${badgeClass}`}>
                {riskLevel}
              </span>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Model Confidence</div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-chart-blue"
                    style={{ width: `${confidence}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-chart-blue">{confidence}%</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              High accident probability in selected conditions
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
