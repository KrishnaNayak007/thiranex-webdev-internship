# Live Meteorology Dashboard (Task 4) - Async REST API Integration

## Developer Profile
*   **Name:** Krishna Nayak
*   **Qualifications:** B.Tech Computer Science Engineering, ITER (SOA University)
*   **Key Competencies:** Async/Await Promises, API Chaining, UI Loading Locks, Persistent Cache Lists

## Architectural Overview

### 1. Security-Conscious Keyless Design
Instead of exposing paid private developer API keys inside static client-side browser bundles (which is an architectural security vulnerability), this system utilizes the open-source **Open-Meteo REST Suite**. It provides a fully performant weather dashboard with zero deployment-stage credential complexity.

### 2. Multi-Tiered Asynchronous Chained Fetching
Due to coordinates demands, the request pipeline resolves two sequential fetch states:
1.  **Geocoding REST Call:** Resolves location queries into coordinate vectors (`latitude`, `longitude`) alongside standardized naming metrics (`name`, `country`).
2.  **Meteorology REST Call:** Coordinates are dispatched to forecast endpoints to retrieve exact diagnostic variables (humidity, temp, windspeed).

### 3. Race-Condition Control & UI State Locks
To prevent network race conditions (where multiple unresolved promise threads conflict on output wrappers), search actions are locked immediately upon form submission. Form parameters are locked, and button states translate into dynamic CSS spin layouts.

---

## Folder Architecture
```text
task-4-weather-dashboard/
├── index.html                  # Main panels, loading metrics cards
├── assets/
│   ├── css/
│   │   └── style.css           # Loading spin parameters, grid dashboard rules
│   └── js/
│       └── weather.js          # API chaining structures, WMO interpretation rules
└── README.md                   # Operational setups and API guides (Current File)