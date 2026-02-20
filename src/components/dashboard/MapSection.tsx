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

interface Accident {
  latitude: number;
  longitude: number;
  severity: string;
}

function HeatmapLayer({ data }: { data: Accident[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || data.length === 0) return;

    const heatData = data.map((d) => {
      const weight =
        d.severity === "High"
          ? 1
          : d.severity === "Medium"
          ? 0.6
          : 0.3;

      return [d.latitude, d.longitude, weight];
    });

    const heat = (L as any).heatLayer(heatData, {
      radius: 25,
      blur: 20,
      maxZoom: 10,
      gradient: {
        0.2: "green",
        0.5: "yellow",
        0.8: "orange",
        1.0: "red",
      },
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [data, map]);

  return null;
}

export default function MapSection() {
  const [data, setData] = useState<Accident[]>([]);
  const [predictiveMode, setPredictiveMode] = useState(false);

  useEffect(() => {
    Papa.parse("/data/Cleaned_data_with_varied_datetime.csv", {
      download: true,
      header: true,
      complete: (results) => {
        const parsed = results.data
          .map((row: any) => ({
            latitude: parseFloat(row.latitude),
            longitude: parseFloat(row.longitude),
            severity: row.severity,
          }))
          .filter(
            (r: Accident) =>
              !isNaN(r.latitude) && !isNaN(r.longitude)
          );

        setData(parsed);
      },
    });
  }, []);

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
        <HeatmapLayer data={data} />

        {/* 🔮 Predictive Overlay */}
        {predictiveMode &&
          data
            .filter((d) => d.severity === "High")
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