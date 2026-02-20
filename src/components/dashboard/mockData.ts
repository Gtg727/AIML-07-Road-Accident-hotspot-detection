// Mock data for NHAI Road Accident Analytics Dashboard

export const kpiData = {
  totalAccidents: 157432,
  highRiskZones: 847,
  predictedHighRisk: 234,
  mostDangerousTime: "10 PM – 2 AM",
  fatalPercentage: 18.4,
};

export const accidentCoordinates = [
  // High risk - Red (major highway corridors)
  { lat: 28.6, lng: 77.2, risk: "high", count: 423, zone: "Delhi NCR" },
  { lat: 19.1, lng: 72.8, risk: "high", count: 387, zone: "Mumbai" },
  { lat: 12.9, lng: 77.6, risk: "high", count: 312, zone: "Bangalore" },
  { lat: 22.6, lng: 88.4, risk: "high", count: 289, zone: "Kolkata" },
  { lat: 17.4, lng: 78.5, risk: "high", count: 265, zone: "Hyderabad" },
  { lat: 26.9, lng: 75.8, risk: "high", count: 234, zone: "Jaipur" },
  { lat: 23.0, lng: 72.6, risk: "high", count: 198, zone: "Ahmedabad" },
  { lat: 21.2, lng: 81.6, risk: "high", count: 187, zone: "Raipur" },
  { lat: 25.4, lng: 81.8, risk: "high", count: 176, zone: "Allahabad" },
  { lat: 27.1, lng: 78.0, risk: "high", count: 165, zone: "Agra" },
  // Medium risk - Orange
  { lat: 30.7, lng: 76.7, risk: "medium", count: 143, zone: "Chandigarh" },
  { lat: 26.8, lng: 80.9, risk: "medium", count: 132, zone: "Lucknow" },
  { lat: 13.1, lng: 80.3, risk: "medium", count: 128, zone: "Chennai" },
  { lat: 15.3, lng: 75.1, risk: "medium", count: 119, zone: "Hubli" },
  { lat: 20.9, lng: 77.8, risk: "medium", count: 112, zone: "Amravati" },
  { lat: 22.3, lng: 73.2, risk: "medium", count: 108, zone: "Vadodara" },
  { lat: 23.2, lng: 77.4, risk: "medium", count: 97, zone: "Bhopal" },
  { lat: 24.6, lng: 73.7, risk: "medium", count: 89, zone: "Udaipur" },
  { lat: 28.0, lng: 73.3, risk: "medium", count: 84, zone: "Bikaner" },
  { lat: 32.1, lng: 74.9, risk: "medium", count: 78, zone: "Amritsar" },
  // Low risk - Green
  { lat: 34.1, lng: 74.8, risk: "low", count: 43, zone: "Srinagar" },
  { lat: 11.0, lng: 77.0, risk: "low", count: 38, zone: "Coimbatore" },
  { lat: 9.9, lng: 76.3, risk: "low", count: 32, zone: "Kochi" },
  { lat: 15.5, lng: 73.8, risk: "low", count: 29, zone: "Goa" },
  { lat: 25.6, lng: 94.1, risk: "low", count: 24, zone: "Kohima" },
  { lat: 27.3, lng: 88.6, risk: "low", count: 21, zone: "Gangtok" },
  { lat: 23.8, lng: 91.3, risk: "low", count: 19, zone: "Agartala" },
];

export const hotspotClusters = [
  { id: 1, zone: "Delhi–Agra Expressway (NH-19)", accidents: 2847, riskScore: 94, trend: "+12%" },
  { id: 2, zone: "Mumbai–Pune Expressway (NH-48)", accidents: 2634, riskScore: 91, trend: "+8%" },
  { id: 3, zone: "Hyderabad–Vijayawada (NH-65)", accidents: 2198, riskScore: 87, trend: "+5%" },
  { id: 4, zone: "Chennai–Bangalore (NH-44)", accidents: 1987, riskScore: 85, trend: "-3%" },
  { id: 5, zone: "Kolkata–Dhanbad (NH-19)", accidents: 1876, riskScore: 82, trend: "+11%" },
  { id: 6, zone: "Jaipur–Ajmer (NH-48)", accidents: 1654, riskScore: 79, trend: "+2%" },
  { id: 7, zone: "Ahmedabad–Surat (NH-48)", accidents: 1543, riskScore: 76, trend: "-7%" },
  { id: 8, zone: "Bhopal–Jabalpur (NH-45)", accidents: 1432, riskScore: 73, trend: "+4%" },
  { id: 9, zone: "Lucknow–Varanasi (NH-27)", accidents: 1321, riskScore: 70, trend: "+6%" },
  { id: 10, zone: "Chandigarh–Ambala (NH-44)", accidents: 1198, riskScore: 67, trend: "-1%" },
];

export const weatherData = [
  { weather: "Clear", accidents: 365865 },
  { weather: "Fog", accidents: 34266 },
  { weather: "Rain", accidents: 37316 },
  { weather: "Hail", accidents: 3378 },
  { weather: "other", accidents: 39758 },
];

export const vehicleTypeData = [
  { name: "Two-Wheelers", value: 44.45, color: "#f97316" },
  { name: "Cars/Jeeps", value: 12.49, color: "#3b82f6" },
  { name: "Trucks", value: 6.28, color: "#ef4444" },
  { name: "Buses", value: 2.38, color: "#a855f7" },
  { name: "Others", value: 8.14, color: "#22c55e" },
  { name : "Auto rickhsaw", value: 3.91, color: "#fdda0D"},
  { name : "Bicycle", value: 2.87, color: "#ffc0cb"},
  { name : "Pedestrian", value: 19.48, color: "#c2b8f5"}
];

export const timeOfDayData = [
  { hour: "12AM", accidents: 23471 },
  { hour: "3AM", accidents: 24152 },
  { hour: "6AM", accidents: 48304 },
  { hour: "9AM", accidents: 65664 },
  { hour: "12PM", accidents: 67979 },
  { hour: "3PM", accidents: 79637 },
  { hour: "6PM", accidents: 94009 },
  { hour: "9PM", accidents: 52915 },
];

export const roadGeometryData = [
  { geometry: "Straight", rate: 42 },
  { geometry: "Curve", rate: 78 },
  { geometry: "Bridge", rate: 56 },
  { geometry: "Junction", rate: 89 },
  { geometry: "Roundabout", rate: 63 },
  { geometry: "Steep", rate: 71 },
];

export const hourlyHeatmapData = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => ({
    day,
    hour,
    value: Math.floor(
      Math.random() * 60 +
        (hour >= 20 || hour <= 4 ? 40 : hour >= 7 && hour <= 9 ? 30 : 10)
    ),
  }))
).flat();

export const modelMetrics = {
  accuracy: 92.4,
  precision: 89.7,
  recall: 91.2,
  f1Score: 90.4,
  auc: 0.947,
};
