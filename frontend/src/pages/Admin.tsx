import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Loader, RefreshCw, Plus, Eye } from "lucide-react";
import { toast } from "sonner";

export default function Admin() {
  const [weather, setWeather] = useState("clear");
  const [roadType, setRoadType] = useState("Highway");
  const [timeOfDay, setTimeOfDay] = useState("Morning");
  const [trafficDensity, setTrafficDensity] = useState(5);
  const [severity, setSeverity] = useState("Medium");
  const [vehiclesInvolved, setVehiclesInvolved] = useState(2);
  const [injuries, setInjuries] = useState(0);
  const [fatalities, setFatalities] = useState(0);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [loading, setLoading] = useState(false);
  const [retraining, setRetraining] = useState(false);
  const [recentRecords, setRecentRecords] = useState<any[]>([]);
  const [showRecords, setShowRecords] = useState(false);

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/add-accident", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weather,
          road_type: roadType,
          time_of_day: timeOfDay,
          traffic_density: parseFloat(trafficDensity.toString()),
          severity,
          vehicles_involved: parseInt(vehiclesInvolved.toString()),
          injuries: parseInt(injuries.toString()),
          fatalities: parseInt(fatalities.toString()),
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(`Error: ${result.error || "Failed to add record"}`);
        return;
      }

      toast.success("✅ Accident record added successfully!");

      // Reset form
      setWeather("clear");
      setRoadType("Highway");
      setTimeOfDay("Morning");
      setTrafficDensity(5);
      setSeverity("Medium");
      setVehiclesInvolved(2);
      setInjuries(0);
      setFatalities(0);
      setLatitude("");
      setLongitude("");

      // Fetch updated records
      fetchRecentRecords();
    } catch (error) {
      toast.error("Failed to add record. Ensure Flask server is running.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRetrain = async () => {
    setRetraining(true);
    try {
      const response = await fetch("http://localhost:8080/api/retrain-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(`Error: ${result.error || "Retraining failed"}`);
        return;
      }

      toast.success("✅ Model retrained successfully!");
    } catch (error) {
      toast.error("Failed to retrain model.");
      console.error(error);
    } finally {
      setRetraining(false);
    }
  };

  const fetchRecentRecords = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/recent-accidents");
      const data = await response.json();
      setRecentRecords(data.records || []);
    } catch (error) {
      console.error("Failed to fetch records:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-slate-400">Manage accident datasets and retrain models</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Accident Form */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Plus className="h-5 w-5 text-orange-500" />
                Add New Accident Record
              </h2>

              <form onSubmit={handleAddRecord} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Weather */}
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Weather</label>
                    <select
                      value={weather}
                      onChange={(e) => setWeather(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                    >
                      <option value="clear">Clear</option>
                      <option value="foggy">Foggy</option>
                      <option value="rainy">Rainy</option>
                      <option value="dusty">Dusty</option>
                      <option value="haze">Haze</option>
                    </select>
                  </div>

                  {/* Road Type */}
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Road Type</label>
                    <select
                      value={roadType}
                      onChange={(e) => setRoadType(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                    >
                      <option value="Highway">Highway</option>
                      <option value="Expressway">Expressway</option>
                      <option value="State Road">State Road</option>
                      <option value="Rural Road">Rural Road</option>
                      <option value="Bridge">Bridge</option>
                    </select>
                  </div>

                  {/* Time of Day */}
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Time of Day</label>
                    <select
                      value={timeOfDay}
                      onChange={(e) => setTimeOfDay(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                    >
                      <option value="Morning">Morning (6-9 AM)</option>
                      <option value="Afternoon">Afternoon (12-3 PM)</option>
                      <option value="Evening">Evening (5-8 PM)</option>
                      <option value="Night">Night (9 PM-3 AM)</option>
                    </select>
                  </div>

                  {/* Traffic Density */}
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">
                      Traffic Density: {trafficDensity}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={trafficDensity}
                      onChange={(e) => setTrafficDensity(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Severity */}
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Severity</label>
                    <select
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  {/* Vehicles Involved */}
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Vehicles Involved</label>
                    <input
                      type="number"
                      min="1"
                      value={vehiclesInvolved}
                      onChange={(e) => setVehiclesInvolved(parseInt(e.target.value))}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>

                  {/* Injuries */}
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Injuries</label>
                    <input
                      type="number"
                      min="0"
                      value={injuries}
                      onChange={(e) => setInjuries(parseInt(e.target.value))}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>

                  {/* Fatalities */}
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Fatalities</label>
                    <input
                      type="number"
                      min="0"
                      value={fatalities}
                      onChange={(e) => setFatalities(parseInt(e.target.value))}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>

                  {/* Latitude */}
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Latitude (Optional)</label>
                    <input
                      type="number"
                      step="0.000001"
                      placeholder="28.6139"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>

                  {/* Longitude */}
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Longitude (Optional)</label>
                    <input
                      type="number"
                      step="0.000001"
                      placeholder="77.2090"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Add Accident Record
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-4">
            {/* Retrain Model */}
            <Card className="bg-blue-900/30 border-blue-700 p-4">
              <h3 className="text-sm font-semibold text-blue-300 mb-3 flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Retrain Model
              </h3>
              <Button
                onClick={handleRetrain}
                disabled={retraining}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 text-sm"
              >
                {retraining ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Retraining...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Retrain ML Model
                  </>
                )}
              </Button>
              <p className="text-xs text-slate-400 mt-2">
                Retrain with all accident records for improved accuracy
              </p>
            </Card>

            {/* View Recent Records */}
            <Card className="bg-green-900/30 border-green-700 p-4">
              <h3 className="text-sm font-semibold text-green-300 mb-3 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Recent Records
              </h3>
              <Button
                onClick={() => {
                  setShowRecords(!showRecords);
                  if (!showRecords) fetchRecentRecords();
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white gap-2 text-sm"
              >
                <Eye className="h-4 w-4" />
                {showRecords ? "Hide" : "View"} Recent (Last 10)
              </Button>
            </Card>

            {/* Stats Card */}
            <Card className="bg-slate-700/50 border-slate-600 p-4">
              <h3 className="text-sm font-semibold text-slate-300 mb-2">Dataset Stats</h3>
              <div className="space-y-2 text-xs text-slate-400">
                <p>✓ Total records managed</p>
                <p>✓ Auto-append to CSV</p>
                <p>✓ Optional model retraining</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Records Display */}
        {showRecords && (
          <Card className="bg-slate-800/50 border-slate-700 p-6 mt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Accident Records</h3>
            {recentRecords.length === 0 ? (
              <p className="text-slate-400">No records found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-slate-300">
                  <thead className="border-b border-slate-600">
                    <tr>
                      <th className="text-left py-2 px-2">Weather</th>
                      <th className="text-left py-2 px-2">Road Type</th>
                      <th className="text-left py-2 px-2">Time</th>
                      <th className="text-left py-2 px-2">Traffic</th>
                      <th className="text-left py-2 px-2">Vehicles</th>
                      <th className="text-left py-2 px-2">Injuries</th>
                      <th className="text-left py-2 px-2">Fatalities</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRecords.map((record, idx) => (
                      <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700/30">
                        <td className="py-2 px-2">{record.weather}</td>
                        <td className="py-2 px-2">{record.road_type}</td>
                        <td className="py-2 px-2">{record.time_of_day}</td>
                        <td className="py-2 px-2">{record.traffic_density}</td>
                        <td className="py-2 px-2">{record.vehicles_involved}</td>
                        <td className="py-2 px-2">{record.injuries}</td>
                        <td className="py-2 px-2">{record.fatalities}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
