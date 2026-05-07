# B2B Portal - Setup & Deployment Guide

## Quick Start (5 Minutes)

### 1. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Access at: `http://localhost:5173`

### 2. Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Set environment (Windows PowerShell)
$env:FLASK_APP = "flaskr.py"
$env:SECRET_KEY = "dev-secret-key-change-in-production"

# Or Linux/Mac
export FLASK_APP=flaskr.py
export SECRET_KEY="dev-secret-key-change-in-production"

# Run Flask
flask run
```
Available at: `http://localhost:5000`

## Detailed Setup Instructions

### Prerequisites Required
```
- Node.js 16+ (download from nodejs.org)
- Python 3.8+ (download from python.org)
- Git (for version control)
- VS Code or preferred code editor
```

### Step 1: Clone/Setup Project
```bash
cd path/to/AIML-07-Road-Accident-hotspot-detection
```

### Step 2: Frontend Configuration

#### Install Dependencies
```bash
npm install
```

#### Environment Variables (create `.env.local` if needed)
```
VITE_API_URL=http://localhost:5000
```

#### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm test            # Run tests
npm test:watch      # Watch mode for tests
```

### Step 3: Backend Configuration

#### Create Virtual Environment (Recommended)
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Environment Setup
Create `.env` file in project root:
```
FLASK_APP=flaskr.py
FLASK_ENV=development
SECRET_KEY=your-super-secret-key-change-this
DATABASE=b2b_portal.db
```

#### Initialize Database
```bash
python -c "from flaskr import init_db; init_db()"
```

#### Start Flask Server
```bash
flask run
```

## Port Configuration

| Service | Default Port | How to Change |
|---------|--------------|---------------|
| Vite Dev | 5173 | `npm run dev -- --port 3000` |
| Flask | 5000 | `flask run --port 5001` |

## Database Management

### View Database
```bash
# Using sqlite3 CLI
sqlite3 b2b_portal.db
.tables
SELECT * FROM users;
```

### Reset Database
```bash
# Delete database file
rm b2b_portal.db  # Linux/Mac
del b2b_portal.db # Windows

# Restart Flask to reinitialize
flask run
```

### Backup Database
```bash
# Create backup
cp b2b_portal.db b2b_portal.db.backup

# Restore backup
cp b2b_portal.db.backup b2b_portal.db
```

## Testing the Portal

### 1. Test Registration
1. Navigate to `http://localhost:5173/b2b/register`
2. Fill in all fields:
   - Company: "Tech Solutions Inc"
   - Type: "Analytics"
   - Employees: "51-200"
   - Name: "John Doe"
   - Email: "john@techsolutions.com"
   - Address: "123 Tech Street"
   - City: "San Francisco"
   - State: "CA"
   - Country: "USA"
   - ZIP: "94105"
   - Password: "SecurePass123"
3. Click "Create Account"
4. Should redirect to dashboard

### 2. Test Login
1. Navigate to `http://localhost:5173/b2b/login`
2. Enter registered email and password
3. Click "Sign In"
4. Should redirect to dashboard

### 3. Test Dashboard
1. Verify Overview tab shows statistics
2. Check Team tab (should be empty initially)
3. Browse through Company Info tab
4. Test Settings tab
5. Click "Sign Out" to logout

### 4. Test API Directly
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "test123456",
    "first_name": "Test",
    "last_name": "User",
    "company_name": "Test Company"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "test123456"
  }'

# Get Current User (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

## Production Deployment

### Frontend Deployment (Vercel/Netlify Example)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Environment Variables for Production:**
   ```
   VITE_API_URL=https://your-api-domain.com
   ```

### Backend Deployment (Heroku Example)

1. **Create `Procfile`:**
   ```
   web: gunicorn flaskr:app
   ```

2. **Install Gunicorn:**
   ```bash
   pip install gunicorn
   pip freeze > requirements.txt
   ```

3. **Deploy to Heroku:**
   ```bash
   heroku create your-app-name
   heroku config:set SECRET_KEY="production-secret-key"
   git push heroku main
   ```

### Backend Deployment (Docker)

1. **Create `Dockerfile`:**
   ```dockerfile
   FROM python:3.9-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   ENV FLASK_APP=flaskr.py
   ENV SECRET_KEY=production-secret
   EXPOSE 5000
   CMD ["flask", "run", "--host", "0.0.0.0"]
   ```

2. **Build and run:**
   ```bash
   docker build -t b2b-portal .
   docker run -p 5000:5000 b2b-portal
   ```

## Performance Optimization

### Frontend
```bash
# Build analysis
npm run build -- --report

# Compress assets
# Already handled by Vite
```

### Backend
```python
# Add to flaskr.py
from flask_caching import Cache

cache = Cache(app, config={'CACHE_TYPE': 'simple'})

@app.route('/api/b2b/stats')
@cache.cached(timeout=300)  # Cache for 5 minutes
def get_stats():
    # ...
```

## Monitoring & Logging

### Backend Logging
```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@app.route('/api/auth/login', methods=['POST'])
def login():
    logger.info(f"Login attempt for: {email}")
    # ...
```

### Frontend Error Tracking
```typescript
// Add Sentry for error tracking
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
});
```

## Troubleshooting Checklist

- [ ] Both frontend and backend are running
- [ ] Ports are not blocked by firewall
- [ ] SECRET_KEY is set in environment
- [ ] Database file has proper permissions
- [ ] All dependencies are installed
- [ ] CORS is properly configured
- [ ] Browser console shows no errors
- [ ] Flask server logs show no errors

## Common Commands Cheat Sheet

```bash
# Frontend
npm install                 # Install deps
npm run dev                 # Start dev server
npm run build               # Production build
npm run lint                # Check code style

# Backend
pip install -r requirements.txt  # Install deps
flask run                        # Start server
flask shell                      # Interactive shell
python -m pytest                 # Run tests

# Database
sqlite3 b2b_portal.db           # Open database
.schema users                    # View table schema
.exit                            # Exit database

# Development
git status                  # Check changes
git add .                   # Stage changes
git commit -m "message"    # Commit
```

## Next Steps

1. ✅ Setup both frontend and backend
2. ✅ Test authentication flow
3. ✅ Verify dashboard functionality
4. [ ] Implement email notifications
5. [ ] Add two-factor authentication
6. [ ] Set up automated backups
7. [ ] Configure monitoring/logging
8. [ ] Deploy to production

## Support Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [JWT Documentation](https://jwt.io/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
