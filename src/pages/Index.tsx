import { useState } from "react";
import { Menu } from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { FiltersSidebar } from "@/components/dashboard/FiltersSidebar";
import { KPICards } from "@/components/dashboard/KPICards";
import MapSection from "@/components/dashboard/MapSection";
import { HotspotPanel } from "@/components/dashboard/HotspotPanel";
import { RiskPredictionPanel } from "@/components/dashboard/RiskPredictionPanel";
import { ContributingFactors } from "@/components/dashboard/ContributingFactors";
import { TimeHeatmap } from "@/components/dashboard/TimeHeatmap";
import { ModelEvaluation } from "@/components/dashboard/ModelEvaluation";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleDownload = () => {
    const blob = new Blob(
      ["NHAI Accident Analytics Report\n\nGenerated: " + new Date().toLocaleString() + "\n\nTotal Accidents: 157,432\nHigh Risk Zones: 847\nFatal Accident Rate: 18.4%"],
      { type: "text/plain" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "NHAI_Accident_Report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onDownload={handleDownload} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <FiltersSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {/* Mobile filter toggle */}
          <div className="flex items-center gap-3 border-b border-border px-4 py-2 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 rounded-md bg-muted px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <Menu className="h-4 w-4" />
              Filters
            </button>
            <span className="text-xs text-muted-foreground">NH-44, All Months · 2024</span>
          </div>

          <div className="space-y-6 p-4 md:p-6">
            {/* Section label */}
            <SectionLabel number="01" title="Overview KPIs" />
            <KPICards />

            <SectionLabel number="02" title="Interactive Accident Map" />
            <MapSection />

            <SectionLabel number="03" title="Hotspot Detection & Risk Prediction" />
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <HotspotPanel />
              <RiskPredictionPanel />
            </div>

            <SectionLabel number="04" title="Contributing Factors Analysis" />
            <ContributingFactors />

            <SectionLabel number="05" title="Temporal Risk Analysis" />
            <TimeHeatmap />

            <SectionLabel number="06" title="Model Evaluation" />
            <ModelEvaluation />

            {/* Footer */}
            <footer className="border-t border-border pt-4 text-center text-xs text-muted-foreground">
              <p>
                <span className="text-orange font-semibold">NHAI</span> · AI Road Accident Hotspot Detection &amp; Risk Prediction System · Ministry of Road Transport &amp; Highways, Government of India
              </p>
              <p className="mt-1">Data: National Highways Authority of India · Model: v2.4.1 · Dashboard: FY 2024–25</p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

function SectionLabel({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs font-bold text-orange">{number}</span>
      <div className="h-px flex-1 bg-border" />
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

export default Index;
