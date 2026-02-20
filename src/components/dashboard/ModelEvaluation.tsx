import { modelMetrics } from "./mockData";
import { Brain } from "lucide-react";

interface MetricBarProps {
  label: string;
  value: number;
  color: string;
}

function MetricBar({ label, value, color }: MetricBarProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-semibold" style={{ color }}>{value}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}

export function ModelEvaluation() {
  return (
    <div className="card-glass rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-chart-purple/10 border border-chart-purple/20">
          <Brain className="h-4 w-4 text-chart-purple" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">Model Evaluation</h2>
          <p className="text-xs text-muted-foreground">Random Forest · Test set · 30,000 samples</p>
        </div>
        <div className="ml-auto">
          <span className="rounded-full bg-risk-low/10 border border-risk-low/20 px-2.5 py-1 text-xs font-semibold text-risk-low">
            Production Ready
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Accuracy", value: modelMetrics.accuracy, color: "hsl(142 71% 45%)" },
          { label: "Precision", value: modelMetrics.precision, color: "hsl(210 100% 56%)" },
          { label: "Recall", value: modelMetrics.recall, color: "hsl(25 95% 53%)" },
          { label: "F1 Score", value: modelMetrics.f1Score, color: "hsl(262 83% 67%)" },
        ].map((m) => (
          <div key={m.label} className="flex flex-col items-center justify-center rounded-lg bg-muted/40 border border-border p-3 gap-1">
            <div className="text-2xl font-bold font-mono" style={{ color: m.color }}>
              {m.value}%
            </div>
            <div className="text-xs text-muted-foreground">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <MetricBar label="Accuracy" value={modelMetrics.accuracy} color="hsl(142 71% 45%)" />
        <MetricBar label="Precision" value={modelMetrics.precision} color="hsl(210 100% 56%)" />
        <MetricBar label="Recall" value={modelMetrics.recall} color="hsl(25 95% 53%)" />
        <MetricBar label="F1 Score" value={modelMetrics.f1Score} color="hsl(262 83% 67%)" />
      </div>

      <div className="flex items-center justify-between rounded-lg bg-muted/30 border border-border px-4 py-2.5 text-xs">
        <span className="text-muted-foreground">AUC-ROC Score</span>
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-32 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-chart-purple"
              style={{ width: `${modelMetrics.auc * 100}%` }}
            />
          </div>
          <span className="font-mono font-semibold text-chart-purple">{modelMetrics.auc}</span>
        </div>
      </div>
    </div>
  );
}
