from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
import time

app = FastAPI(title="Road Safety AI Backend")

# We will relax CORS so it works nicely
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = None
features = None

# A Pydantic model exactly matching the RiskPredictionPanel state
class PredictRequest(BaseModel):
    weather: str
    traffic: str
    time: str
    road: str

@app.on_event("startup")
def load_model():
    global model, features
    try:
        model = joblib.load('model.joblib')
        features = joblib.load('model_features.joblib')
        print("Model and features securely loaded onto API.")
    except Exception as e:
        print("Model not trained yet, run `python train_model.py` first!")

@app.post("/api/predict")
def predict_risk(req: PredictRequest):
    if not model or not features:
        return {"error": "Model offline"}

    # Mock latency for realistic loading simulation
    time.sleep(0.4)

    # Reconstruct exact dummy variables the RandomForest expects
    df = pd.DataFrame([{
        "weather": req.weather,
        "traffic": req.traffic,
        "time": req.time,
        "road": req.road
    }])
    
    # Map to dummies
    X_input = pd.get_dummies(df)
    
    # Ensure it maps to the EXACT columns used during training
    X_predict = pd.DataFrame(columns=features)
    for col in X_predict.columns:
        if col in X_input:
            X_predict[col] = X_input[col]
        else:
            X_predict[col] = False

    # Predict risk score
    raw_score = model.predict(X_predict)[0]
    
    # Confidence is typically tied to model standard deviation or tree variance
    # For RandomForests we calculate variance over the trees as confidence proxy, we'll bound it here.
    preds = np.array([tree.predict(X_predict.values) for tree in model.estimators_])
    # The lower the standard deviation among the 100 trees, the higher the confidence
    std_dev = np.std(preds)
    confidence = max(60, 100 - (std_dev * 2.5))
    confidence = min(99.9, confidence)

    return {
        "score": round(float(raw_score), 1),
        "confidence": round(float(confidence), 1)
    }

