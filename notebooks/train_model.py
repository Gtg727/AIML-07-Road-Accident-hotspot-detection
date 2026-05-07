import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib

def generate_synthetic_data(n_samples=5000):
    np.random.seed(42)
    weather_opts = ["Clear", "Foggy", "Rainy", "Dusty", "Haze"]
    traffic_opts = ["Low", "Moderate", "High", "Very High"]
    time_opts = ["Morning (6–9AM)", "Afternoon (12–3PM)", "Evening (5–8PM)", "Night (9PM–3AM)"]
    road_opts = ["Highway", "Expressway", "State Road", "Rural Road", "Bridge"]

    df = pd.DataFrame({
        "weather": np.random.choice(weather_opts, n_samples),
        "traffic": np.random.choice(traffic_opts, n_samples),
        "time": np.random.choice(time_opts, n_samples),
        "road": np.random.choice(road_opts, n_samples)
    })

    # Basic logic to derive risk score
    # clear/low traffic -> lower score
    def compute_risk(row):
        score = 20
        if row['weather'] in ["Foggy", "Rainy"]: score += 25
        elif row['weather'] in ["Dusty", "Haze"]: score += 15
        
        if row['traffic'] == "High": score += 20
        elif row['traffic'] == "Very High": score += 30
        
        if row['time'] == "Night (9PM–3AM)": score += 20
        elif row['time'] == "Evening (5–8PM)": score += 10
        
        if row['road'] == "Bridge": score += 15
        elif row['road'] == "Expressway": score += 10
        
        return min(9.9, (score + np.random.randint(0, 10)) / 10.0)

    df['risk_score'] = df.apply(compute_risk, axis=1)
    return df

print("Generating synthetic data...")
df = generate_synthetic_data()

X = pd.get_dummies(df[['weather', 'traffic', 'time', 'road']])
y = df['risk_score']

# Get features length
features = X.columns.tolist()
joblib.dump(features, 'model_features.joblib')

print("Training RandomForest model...")
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)

joblib.dump(model, 'model.joblib')
print("Model saved as model.joblib!")
