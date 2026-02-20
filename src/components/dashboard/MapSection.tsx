import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  LayersControl,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card } from "@/components/ui/card";

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Accident {
  id: number;
  lat: number;
  lng: number;
  severity: "Low" | "Medium" | "High";
}

const mockAccidents: Accident[] = [
  { id: 1, lat: 19.076, lng: 72.8777, severity: "High" },
  { id: 2, lat: 28.7041, lng: 77.1025, severity: "Medium" },
  { id: 3, lat: 12.9716, lng: 77.5946, severity: "Low" },
];

export default function MapSection() {
  const [predictiveMode, setPredictiveMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate AI engine loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="relative p-4 h-[600px] overflow-hidden">
      {/* Header */}
      <div className="flex justify-between mb-2">
        <h2 className="text-lg font-semibold">Accident Risk Map</h2>

        <button
          onClick={() => setPredictiveMode(!predictiveMode)}
          className="px-3 py-1 text-sm bg-primary text-white rounded-md"
        >
          {predictiveMode ? "Predictive Mode" : "Historical Mode"}
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-6 right-6 bg-black/70 text-white text-xs p-3 rounded-lg z-[1000]">
        <div>🔴 High Severity</div>
        <div>🟠 Medium Severity</div>
        <div>🟢 Low Severity</div>
        <div>🛰 Satellite Mode Available</div>
        <div>🟦 Intervention Zone</div>
      </div>

      {/* AI Loader Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="text-white animate-pulse text-sm">
            Initializing AI Risk Engine...
          </div>
        </div>
      )}

      {/* Map */}
      <MapContainer
        center={[22.5, 78.9]}
        zoom={5}
        scrollWheelZoom={true}
        className="h-full w-full rounded-xl"
      >
        <LayersControl position="topright">

          {/* 🌑 Dark View (Default) */}
          <LayersControl.BaseLayer checked name="Dark View">
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>

          {/* 🗺 Standard Light View */}
          <LayersControl.BaseLayer name="Standard View">
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          {/* 🛰 Satellite View */}
          <LayersControl.BaseLayer name="Satellite View">
            <TileLayer
              attribution="&copy; Esri"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>

          {/* Accident Cluster Layer */}
          <LayersControl.Overlay checked name="Accident Clusters">
            <MarkerClusterGroup>
              {mockAccidents.map((acc) => (
                <Marker key={acc.id} position={[acc.lat, acc.lng]}>
                  <Popup>
                    <div>
                      <strong>Severity:</strong> {acc.severity}
                      <br />
                      <strong>Risk Score:</strong>{" "}
                      {acc.severity === "High"
                        ? "85%"
                        : acc.severity === "Medium"
                        ? "60%"
                        : "30%"}
                      <br />
                      <strong>Suggested Action:</strong>
                      <br />
                      {acc.severity === "High"
                        ? "Install Speed Camera"
                        : "Increase Patrol"}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </LayersControl.Overlay>

          {/* Predictive High Risk Zones */}
          <LayersControl.Overlay name="High Risk Zones">
            <>
              {predictiveMode &&
                mockAccidents
                  .filter((acc) => acc.severity === "High")
                  .map((acc) => (
                    <Circle
                      key={acc.id}
                      center={[acc.lat, acc.lng]}
                      radius={50000}
                      pathOptions={{
                        color: "red",
                        fillColor: "red",
                        fillOpacity: 0.3,
                      }}
                    />
                  ))}
            </>
          </LayersControl.Overlay>

        </LayersControl>
      </MapContainer>
    </Card>
  );
}