from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import os
from datetime import datetime, timedelta
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
import sqlite3
from functools import wraps
import jwt
import hashlib
import secrets
from typing import Tuple, Optional, Dict, Any

app = Flask(__name__)
CORS(app)

# Configuration
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
DATABASE = 'b2b_portal.db'

# Paths
MODEL_PATH = "C:/Users/skhar/OneDrive/Desktop/risk_prediction_model.pkl"
DATA_PATH = "C:/Users/skhar/OneDrive/Desktop/Cleaned_data_with_varied_datetime.csv"
ACCIDENTS_DATA_PATH = "C:/Users/skhar/OneDrive/Desktop/accident_records.csv"

# Load the trained model
try:
    model = joblib.load(MODEL_PATH)
    print(f"✅ Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

# Initialize accidents CSV if it doesn't exist
if not os.path.exists(ACCIDENTS_DATA_PATH):
    accidents_df = pd.DataFrame(columns=[
        'weather', 'road_type', 'time_of_day', 'traffic_density',
        'severity', 'vehicles_involved', 'injuries', 'fatalities',
        'latitude', 'longitude', 'timestamp'
    ])
    accidents_df.to_csv(ACCIDENTS_DATA_PATH, index=False)


# Database initialization
def init_db():
    """Initialize the database with required tables"""
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    
    # Users table
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            company_name TEXT NOT NULL,
            company_type TEXT,
            employees_count TEXT,
            phone TEXT,
            address TEXT,
            city TEXT,
            state TEXT,
            country TEXT,
            postal_code TEXT,
            role TEXT DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Sessions table
    c.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            token TEXT UNIQUE NOT NULL,
            expires_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')
    
    # Team members table
    c.execute('''
        CREATE TABLE IF NOT EXISTS team_members (
            id TEXT PRIMARY KEY,
            company_id TEXT NOT NULL,
            user_id TEXT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT NOT NULL,
            role TEXT DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (company_id) REFERENCES users(id)
        )
    ''')
    
    # Analytics table
    c.execute('''
        CREATE TABLE IF NOT EXISTS analytics (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            event_type TEXT,
            event_data TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')
    
    conn.commit()
    conn.close()


# Initialize database on startup
init_db()


def hash_password(password: str) -> str:
    """Hash a password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()


def generate_token(user_id: str) -> str:
    """Generate a JWT token"""
    payload = {
        'user_id': user_id,
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(days=30)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token


def verify_token(token: str) -> Optional[str]:
    """Verify a JWT token and return user_id"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload['user_id']
    except:
        return None


def require_auth(f):
    """Decorator to require authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Missing or invalid authorization header'}), 401
        
        token = auth_header.split(' ')[1]
        user_id = verify_token(token)
        if not user_id:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        request.user_id = user_id
        return f(*args, **kwargs)
    
    return decorated_function


def get_user(user_id: str) -> Optional[Dict[str, Any]]:
    """Get user from database"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    c.execute('''
        SELECT id, email, first_name, last_name, company_name, company_type,
               employees_count, phone, address, city, state, country, postal_code,
               role, created_at
        FROM users
        WHERE id = ?
    ''', (user_id,))
    
    row = c.fetchone()
    conn.close()
    
    if row:
        return dict(row)
    return None


# ==================== Auth Routes ====================

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user/company"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'first_name', 'last_name', 'company_name']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Check if user already exists
        conn = sqlite3.connect(DATABASE)
        c = conn.cursor()
        c.execute('SELECT id FROM users WHERE email = ?', (data['email'],))
        if c.fetchone():
            conn.close()
            return jsonify({'error': 'Email already registered'}), 400
        
        # Create user
        user_id = secrets.token_hex(16)
        password_hash = hash_password(data['password'])
        
        c.execute('''
            INSERT INTO users (id, email, password_hash, first_name, last_name,
                             company_name, company_type, employees_count, phone,
                             address, city, state, country, postal_code, role)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            user_id,
            data['email'],
            password_hash,
            data['first_name'],
            data['last_name'],
            data['company_name'],
            data.get('company_type', 'Other'),
            data.get('employees_count', 'Not specified'),
            data.get('phone', ''),
            data.get('address', ''),
            data.get('city', ''),
            data.get('state', ''),
            data.get('country', ''),
            data.get('postal_code', ''),
            data.get('role', 'user')
        ))
        conn.commit()
        conn.close()
        
        # Generate token
        token = generate_token(user_id)
        user = get_user(user_id)
        
        return jsonify({
            'token': token,
            'user': user
        }), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login a user"""
    try:
        data = request.get_json()
        
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({'error': 'Missing email or password'}), 400
        
        conn = sqlite3.connect(DATABASE)
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        
        # Get user
        c.execute('SELECT * FROM users WHERE email = ?', (data['email'],))
        user_row = c.fetchone()
        
        if not user_row:
            conn.close()
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Verify password
        password_hash = hash_password(data['password'])
        if user_row['password_hash'] != password_hash:
            conn.close()
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Generate token
        token = generate_token(user_row['id'])
        
        # Store session
        session_id = secrets.token_hex(16)
        c.execute('''
            INSERT INTO sessions (id, user_id, token, expires_at)
            VALUES (?, ?, ?, ?)
        ''', (
            session_id,
            user_row['id'],
            token,
            datetime.utcnow() + timedelta(days=30)
        ))
        conn.commit()
        conn.close()
        
        user = dict(user_row)
        del user['password_hash']
        
        return jsonify({
            'token': token,
            'user': user
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/auth/me', methods=['GET'])
@require_auth
def get_current_user():
    """Get current authenticated user"""
    user = get_user(request.user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user), 200


@app.route('/api/auth/profile', methods=['PUT'])
@require_auth
def update_profile():
    """Update user profile"""
    try:
        data = request.get_json()
        
        conn = sqlite3.connect(DATABASE)
        c = conn.cursor()
        
        # Build update query
        update_fields = []
        values = []
        
        allowed_fields = ['first_name', 'last_name', 'phone', 'address', 'city', 'state', 'country', 'postal_code']
        
        for field in allowed_fields:
            if field in data:
                update_fields.append(f'{field} = ?')
                values.append(data[field])
        
        if not update_fields:
            conn.close()
            return jsonify({'error': 'No fields to update'}), 400
        
        values.append(request.user_id)
        
        c.execute(f'''
            UPDATE users
            SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', values)
        conn.commit()
        conn.close()
        
        user = get_user(request.user_id)
        return jsonify(user), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/auth/forgot-password', methods=['POST'])
def forgot_password():
    """Request password reset"""
    try:
        data = request.get_json()
        
        if not data or 'email' not in data:
            return jsonify({'error': 'Email is required'}), 400
        
        conn = sqlite3.connect(DATABASE)
        c = conn.cursor()
        
        c.execute('SELECT id FROM users WHERE email = ?', (data['email'],))
        user = c.fetchone()
        conn.close()
        
        if user:
            # In production, send actual email with reset code
            # For now, just return success
            print(f"Password reset requested for: {data['email']}")
        
        return jsonify({'message': 'If email exists, reset link will be sent'}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    """Reset password with code"""
    try:
        data = request.get_json()
        
        if not all(k in data for k in ['email', 'code', 'password']):
            return jsonify({'error': 'Missing required fields'}), 400
        
        conn = sqlite3.connect(DATABASE)
        c = conn.cursor()
        
        c.execute('SELECT id FROM users WHERE email = ?', (data['email'],))
        user = c.fetchone()
        
        if not user:
            conn.close()
            return jsonify({'error': 'User not found'}), 404
        
        # In production, verify the code
        password_hash = hash_password(data['password'])
        c.execute('UPDATE users SET password_hash = ? WHERE id = ?', (password_hash, user[0]))
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Password reset successful'}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ==================== B2B Routes ====================

@app.route('/api/b2b/team', methods=['GET'])
@require_auth
def get_team():
    """Get team members"""
    try:
        conn = sqlite3.connect(DATABASE)
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        
        c.execute('''
            SELECT id, first_name, last_name, email, role
            FROM team_members
            WHERE company_id = ?
        ''', (request.user_id,))
        
        members = [dict(row) for row in c.fetchall()]
        conn.close()
        
        return jsonify(members), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/b2b/stats', methods=['GET'])
@require_auth
def get_stats():
    """Get B2B dashboard statistics"""
    try:
        stats = {
            'total_analyses': 0,
            'total_alerts': 0,
            'active_reports': 0,
            'api_calls': 0
        }
        
        # In production, fetch real data from database
        conn = sqlite3.connect(DATABASE)
        c = conn.cursor()
        
        c.execute('SELECT COUNT(*) FROM analytics WHERE user_id = ?', (request.user_id,))
        stats['total_analyses'] = c.fetchone()[0]
        
        conn.close()
        
        return jsonify(stats), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ==================== Existing Routes ====================

@app.route('/')
def hello():
    return 'Risk Prediction API - Model Connected ✅'

@app.route('/api/predict', methods=['POST'])
def predict_risk():
    """
    Predict accident risk level based on input features
    Expected JSON payload:
    {
        "weather": "rain",
        "traffic": "High",
        "time": "Night",
        "road": "Highway"
    }
    """
    try:
        if model is None:
            return jsonify({"error": "Model not loaded"}), 500
        
        data = request.json
        
        # Extract inputs
        weather = data.get('weather', 'clear').lower()
        traffic = float(data.get('traffic', 5))
        time_of_day = data.get('time', 'Morning')
        road_type = data.get('road', 'Highway')
        
        # Create feature vector
        weather_features = {f"weather_{w}": False for w in ['dust', 'fog', 'hail', 'overcast', 'rain']}
        
        # Map weather
        weather_key = weather.lower()
        if weather_key == 'foggy':
            weather_features['weather_fog'] = True
        elif weather_key == 'rainy':
            weather_features['weather_rain'] = True
        elif weather_key == 'dusty':
            weather_features['weather_dust'] = True
        elif weather_key == 'haze':
            weather_features['weather_hail'] = True
        
        # Extract time period
        if "morning" in time_of_day.lower():
            time_of_day = "Morning"
        elif "afternoon" in time_of_day.lower():
            time_of_day = "Afternoon"
        elif "evening" in time_of_day.lower():
            time_of_day = "Evening"
        else:
            time_of_day = "Night"
        
        # Prepare input dataframe
        input_dict = {
            **weather_features,
            "Road_Type": road_type,
            "Time_of_Day": time_of_day,
            "Traffic_Density_Index": traffic
        }
        
        input_df = pd.DataFrame([input_dict])
        
        # Make prediction
        prediction = model.predict(input_df)[0]
        probabilities = model.predict_proba(input_df)[0]
        
        # Get confidence
        confidence = float(max(probabilities) * 100)
        
        # Map risk level to score
        risk_scores = {
            "Low": 25,
            "Medium": 50,
            "High": 75,
            "Critical": 95
        }
        
        score = risk_scores.get(prediction, 50)
        
        return jsonify({
            "riskLevel": prediction,
            "score": score,
            "confidence": round(confidence, 1),
            "probabilities": {
                label: round(float(prob) * 100, 1)
                for label, prob in zip(model.classes_, probabilities)
            }
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/model-info', methods=['GET'])
def model_info():
    """Get model information"""
    return jsonify({
        "model_type": "RandomForestClassifier",
        "n_estimators": 300,
        "max_depth": 12,
        "status": "loaded" if model is not None else "not_loaded"
    })

@app.route('/api/add-accident', methods=['POST'])
def add_accident():
    """Add a new accident record to the dataset"""
    try:
        data = request.json
        
        new_record = {
            'weather': data.get('weather', 'clear'),
            'road_type': data.get('road_type', 'Highway'),
            'time_of_day': data.get('time_of_day', 'Morning'),
            'traffic_density': float(data.get('traffic_density', 5)),
            'severity': data.get('severity', 'Medium'),
            'vehicles_involved': int(data.get('vehicles_involved', 1)),
            'injuries': int(data.get('injuries', 0)),
            'fatalities': int(data.get('fatalities', 0)),
            'latitude': data.get('latitude'),
            'longitude': data.get('longitude'),
            'timestamp': datetime.now().isoformat()
        }
        
        # Append to CSV
        try:
            existing_df = pd.read_csv(ACCIDENTS_DATA_PATH)
        except:
            existing_df = pd.DataFrame()
        
        new_df = pd.concat([existing_df, pd.DataFrame([new_record])], ignore_index=True)
        new_df.to_csv(ACCIDENTS_DATA_PATH, index=False)
        
        return jsonify({
            "success": True,
            "message": "Accident record added successfully",
            "record": new_record
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/recent-accidents', methods=['GET'])
def recent_accidents():
    """Get recent accident records"""
    try:
        df = pd.read_csv(ACCIDENTS_DATA_PATH)
        recent = df.tail(10).to_dict('records')
        return jsonify({"records": recent})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/retrain-model', methods=['POST'])
def retrain_model():
    """Retrain the model with updated accident data"""
    global model
    
    try:
        # Load both original data and new accident records
        try:
            original_df = pd.read_csv(DATA_PATH)
        except:
            return jsonify({"error": "Original dataset not found"}), 400
        
        try:
            accidents_df = pd.read_csv(ACCIDENTS_DATA_PATH)
            # Rename columns to match original data
            accidents_df = accidents_df.rename(columns={
                'weather': 'weather_dust',  # Placeholder, will be one-hot encoded
                'road_type': 'Road_Type',
                'time_of_day': 'Time_of_Day',
                'traffic_density': 'Traffic_Density_Index'
            })
        except:
            accidents_df = pd.DataFrame()
        
        # Combine datasets
        combined_df = pd.concat([original_df, accidents_df], ignore_index=True)
        
        # Prepare features
        selected_features = [
            'weather_dust', 'weather_fog', 'weather_hail', 'weather_overcast', 'weather_rain',
            'Road_Type', 'Time_of_Day', 'Traffic_Density_Index'
        ]
        
        # Fill missing values
        for col in selected_features:
            if col not in combined_df.columns:
                combined_df[col] = False
        
        X = combined_df[selected_features].fillna(0)
        
        # Create target (Risk_Level)
        if 'Risk_Level' in combined_df.columns:
            y = combined_df['Risk_Level']
        else:
            return jsonify({"error": "Risk_Level column not found"}), 400
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, stratify=y, random_state=42
        )
        
        # Train new model
        categorical_cols = ['Road_Type', 'Time_of_Day']
        numerical_cols = ['Traffic_Density_Index']
        boolean_cols = ['weather_dust', 'weather_fog', 'weather_hail', 'weather_overcast', 'weather_rain']
        
        preprocessor = ColumnTransformer(
            transformers=[
                ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols),
                ('num', 'passthrough', numerical_cols + boolean_cols)
            ]
        )
        
        new_model = Pipeline(steps=[
            ('preprocessor', preprocessor),
            ('classifier', RandomForestClassifier(
                n_estimators=300,
                max_depth=12,
                class_weight='balanced',
                random_state=42
            ))
        ])
        
        new_model.fit(X_train, y_train)
        
        # Save new model
        joblib.dump(new_model, MODEL_PATH)
        model = new_model
        
        # Calculate accuracy
        accuracy = new_model.score(X_test, y_test)
        
        return jsonify({
            "success": True,
            "message": "Model retrained successfully",
            "accuracy": round(accuracy, 4),
            "training_samples": len(X_train),
            "test_samples": len(X_test)
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=8080)