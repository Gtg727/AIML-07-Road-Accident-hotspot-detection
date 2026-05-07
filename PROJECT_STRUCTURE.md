# Project Structure Overview

This document explains the organized project structure of Urban Pulse AI.

## Directory Layout

```
AIML-07-Road-Accident-hotspot-detection/
│
├── 📁 frontend/                    React + Vite Frontend Application
│   ├── src/                        Source code
│   │   ├── components/             Reusable React components
│   │   │   ├── dashboard/          Dashboard-specific components
│   │   │   ├── ui/                 UI library components
│   │   │   ├── NavLink.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── pages/                  Page components
│   │   │   ├── Admin.tsx
│   │   │   ├── Index.tsx
│   │   │   └── b2b/
│   │   ├── contexts/               React contexts
│   │   ├── hooks/                  Custom hooks
│   │   ├── lib/                    Utility functions
│   │   ├── test/                   Test files
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/                     Static assets
│   ├── package.json                NPM dependencies
│   ├── vite.config.ts              Vite configuration
│   ├── tailwind.config.ts          Tailwind CSS config
│   ├── tsconfig.json               TypeScript config
│   └── [other config files]
│
├── 📁 backend/                     Flask API Server
│   ├── flaskr.py                   Main Flask application
│   └── requirements.txt             Python package dependencies
│
├── 📁 notebooks/                   Jupyter Notebooks for ML Development
│   ├── data_cleaning.ipynb         Data preprocessing and EDA
│   └── Model.ipynb                 ML model training & evaluation
│
├── 📁 data/                        Dataset Management
│   ├── raw/                        Original unprocessed data
│   │   └── pan_india_synthetic_accidents_20000_messy.csv
│   └── processed/                  Cleaned and processed data
│       └── Cleaned_data_with_varied_datetime.csv
│
├── 📁 docs/                        Documentation & Resources
│   ├── images/                     Screenshots and diagrams
│   │   ├── Screenshot (69).png
│   │   ├── Screenshot (70).png
│   │   ├── Screenshot (71).png
│   │   ├── Screenshot (72).png
│   │   └── Screenshot (73).png
│   ├── GETTING_STARTED.md          Quick start guide
│   ├── SETUP_GUIDE.md              Installation & setup
│   ├── QUICK_REFERENCE.md          Command reference
│   └── Predictive_Road_Safety_AI_Back.pdf
│
├── .env.example                    Environment variables template
├── .gitignore                      Git ignore rules
├── README.md                       Main project README
└── PROJECT_STRUCTURE.md            This file

## Key Files

### Frontend Entry Points
- **frontend/src/main.tsx** - React application entry point
- **frontend/src/App.tsx** - Main App component
- **frontend/src/pages/Index.tsx** - Main dashboard page

### Backend Entry Points
- **backend/flaskr.py** - Flask API server

### Data Processing
- **notebooks/data_cleaning.ipynb** - Data cleaning and preparation
- **notebooks/Model.ipynb** - ML model development

## Development Workflows

### Frontend Development
```bash
cd frontend
npm install        # Install dependencies
npm run dev        # Start dev server
npm run build      # Build for production
npm run lint       # Run linter
npm run test       # Run tests
```

### Backend Development
```bash
cd backend
pip install -r requirements.txt    # Install dependencies
python flaskr.py                   # Run Flask server
```

### Data Processing
```bash
cd notebooks
jupyter notebook                   # Start Jupyter
# Open data_cleaning.ipynb and Model.ipynb
```

## Removed/Cleaned Up Files

The following files were removed or moved during reorganization:
- **B2B_PORTAL_DOCUMENTATION.md** - Removed (unrelated)
- **B2B_PORTAL_IMPLEMENTATION_SUMMARY.md** - Removed (unrelated)
- **bun.lockb** - Removed (npm used instead)
- **cleaning_dataset.ipynb** - Removed (duplicate of Cleaning.ipynb)
- **index.html** - Removed (managed by Vite)
- **.venv** - Should not be committed
- **node_modules/** - Should not be committed

## .gitignore Coverage

The updated `.gitignore` excludes:
- Python cache (`__pycache__`, `.pyc`, `*.egg-info`)
- Virtual environments (`venv/`, `.venv/`)
- Node modules and build files
- IDE files (`.vscode`, `.idea`)
- Environment files (`.env`)
- OS files (`.DS_Store`, `Thumbs.db`)

## Next Steps

1. **Install dependencies:**
   - Frontend: `cd frontend && npm install`
   - Backend: `cd backend && pip install -r requirements.txt`

2. **Start development:**
   - Frontend: `npm run dev` (from frontend/)
   - Backend: `python flaskr.py` (from backend/)

3. **Process data:**
   - Run notebooks in `notebooks/` directory

## Notes

- All configuration files are colocated with their respective packages
- Frontend and backend are in separate directories for modular development
- Documentation is centralized in the `docs/` folder
- Data is organized into raw (original) and processed (cleaned) versions
