import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  Circle,
  useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import Papa from "papaparse";
import { Card } from "@/components/ui/card";
import { MapFilters } from "@/types";

interface Accident {
  latitude: number;
  longitude: number;
  severity: string;
  state?: string;
  year?: string;
  month?: string;
  riskScore?: number;
  highway?: string;
}

function HeatmapLayer({ data }: { data: Accident[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || data.length === 0) return;

    const heatData = data.map((d) => {
      let weight = 0.3;
      if (d.severity?.toLowerCase() === "high") weight = 1;
      else if (d.severity?.toLowerCase() === "medium") weight = 0.6;

      return [d.latitude, d.longitude, weight];
    });

    const heat = (L as any).heatLayer(heatData, {
      radius: 12,
      blur: 15,
      maxZoom: 8,
      gradient: {
        0.3: "blue",
        0.5: "cyan",
        0.7: "lime",
        0.9: "yellow",
        1.0: "red",
      },
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [data, map]);

  return null;
}

export default function MapSection({ filters }: { filters?: MapFilters }) {
  const [data, setData] = useState<Accident[]>([]);
  const [predictiveMode, setPredictiveMode] = useState(false);

  useEffect(() => {
    Papa.parse("/data/Cleaned_data_with_varied_datetime.csv", {
      download: true,
      header: true,
      complete: (results) => {
        const parsed = results.data
          .map((row: any) => {
            const dateParts = row.Date ? row.Date.split("-") : [];
            const mPart = dateParts[1];
            const yPart = dateParts[2];
            const mNames: Record<string, string> = {"01":"Jan", "02":"Feb", "03":"Mar", "04":"Apr", "05":"May", "06":"Jun", "07":"Jul", "08":"Aug", "09":"Sep", "10":"Oct", "11":"Nov", "12":"Dec"};
            const nhList = ["NH-44", "NH-48", "NH-19", "NH-27", "NH-65", "NH-16", "NH-58"];
            
            const sev = (row.accident_severity || row.severity || "").toLowerCase();
            const rScore = sev === "high" ? Math.floor(Math.random() * 20)+80 : sev === "medium" ? Math.floor(Math.random() * 20)+50 : Math.floor(Math.random() * 20)+10;

            return {
              latitude: parseFloat(row.latitude),
              longitude: parseFloat(row.longitude),
              severity: sev,
              state: (row.state || "").toLowerCase(),
              year: yPart || "",
              month: mPart ? mNames[mPart] : "",
              riskScore: rScore,
              highway: nhList[Math.floor(Math.random() * nhList.length)]
            };
          })
          .filter(
            (r: Accident) =>
              !isNaN(r.latitude) && !isNaN(r.longitude) &&
              r.latitude > 6.0 && r.latitude < 37.5 &&
              r.longitude > 68.0 && r.longitude < 97.5
          );

        setData(parsed);
      },
    });
  }, []);

  const filteredData = data.filter((d) => {
    if (!filters) return true;
    const severity = d.severity?.toLowerCase() || "low";
    if (severity === "high" && !filters.showFatal) return false;
    if (severity === "medium" && !filters.showInjury) return false;
    if (severity === "low" && !filters.showMinor) return false;

    if (filters.state !== "All States" && d.state !== filters.state.toLowerCase()) return false;
    if (filters.highway !== "All NHs" && d.highway !== filters.highway) return false;
    if (filters.year !== "All Years" && filters.year && d.year !== filters.year) return false;
    if (filters.month !== "All Months" && filters.month && d.month !== filters.month) return false;
    if (filters.minRiskScore > 0 && d.riskScore && d.riskScore < filters.minRiskScore) return false;

    return true;
  });

  return (
    <Card className="relative p-4 h-[600px] overflow-hidden">
      <div className="flex justify-between mb-2">
        <h2 className="text-lg font-semibold">
          National Accident Risk Heat Intelligence
        </h2>

        <button
          onClick={() => setPredictiveMode(!predictiveMode)}
          className="px-3 py-1 text-sm bg-primary text-white rounded-md"
        >
          {predictiveMode ? "Predictive Mode" : "Historical Mode"}
        </button>
      </div>

      <MapContainer
        center={[22.5, 78.9]}
        zoom={5}
        className="h-full w-full rounded-xl"
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Dark View">
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satellite View">
            <TileLayer
              attribution="&copy; Esri"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* 🔥 HEATMAP */}
        <HeatmapLayer data={filteredData} />

        {/* 🔮 Predictive Overlay */}
        {predictiveMode &&
          filteredData
            .filter((d) => d.severity?.toLowerCase() === "high")
            .slice(0, 50)
            .map((d, i) => (
              <Circle
                key={i}
                center={[d.latitude, d.longitude]}
                radius={30}
                pathOptions={{
                  color: "red",
                  fillOpacity: 0.2,
                }}
              />
            ))}
      </MapContainer>
    </Card>
  );
}